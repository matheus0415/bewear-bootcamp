"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { shippingAddressTable } from "@/db/schema";
import { auth } from "@/lib/auth";

export const getShippingAddresses = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      throw new Error("Usuário não autenticado");
    }

    const addresses = await db
      .select()
      .from(shippingAddressTable)
      .where(eq(shippingAddressTable.userId, session.user.id))
      .orderBy(shippingAddressTable.createdAt);

    const mappedAddresses = addresses.map((address) => ({
      id: address.id,
      firstName: address.recipientName.split(" ")[0] || "",
      lastName: address.recipientName.split(" ").slice(1).join(" ") || "",
      cpfCnpj: address.cpfOrCnpj,
      phone: address.phone,
      cep: address.zipCode,
      address: address.street,
      number: address.number,
      complement: address.complement || "",
      neighborhood: address.neighborhood,
      city: address.city,
      state: address.state,
      email: address.email,
    }));

    return { success: true, data: mappedAddresses };
  } catch (error) {
    console.error("Erro ao buscar endereços:", error);
    return { success: false, error: "Erro ao buscar endereços" };
  }
};
