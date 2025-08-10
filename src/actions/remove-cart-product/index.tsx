"use server";

import { auth } from "@/lib/auth";

import { headers } from "next/headers";
import { db } from "@/db";
import { cartItemTable, cartTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { removeProductFromCartSchema } from "./schema";
import z from "zod";

export const removeProductFromCart = async (data: z.infer<typeof removeProductFromCartSchema>) => {
  removeProductFromCartSchema.safeParse(data);

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

  await db.delete(cartItemTable).where(eq(cartItemTable.id, cartItem.id));
};
