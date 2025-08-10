"use server";

import { auth } from "@/lib/auth";

import { db } from "@/db";
import { cartItemTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import z from "zod";
import { DecreaseCartProductQuantitySchema, decreaseCartProductQuantitySchema } from "./schema";

export const decreaseCartProductQuantity = async (data: DecreaseCartProductQuantitySchema) => {
  decreaseCartProductQuantitySchema.parse(data);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("User not authenticated");
  }
  
  const cartItem = await db.query.cartItemTable.findFirst({
    where: (cartItem, { eq }) =>
      eq(cartItem.id, data.cartItemId),
    with: {
        cart: true,
    },
  });

  if (!cartItem) {
    throw new Error("Product variant not found in cart");
  }

  const cartDoesNotBelongToUser = cartItem.cart.userId !== session.user.id;

  if (cartDoesNotBelongToUser) {
    throw new Error("User not authorized to remove this item");
  }

  if(cartItem.quantity == 1){
    await db.delete(cartItemTable).where(eq(cartItemTable.id, cartItem.id));
    return;
  }

  await db.update(cartItemTable).set({ quantity: cartItem.quantity - 1 }).where(eq(cartItemTable.id, cartItem.id));
};
