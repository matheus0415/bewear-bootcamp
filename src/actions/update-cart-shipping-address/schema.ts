import z from "zod";

export const updateCartShippingAddressSchema = z.object({
  shippingAddressId: z.string().min(1, "ID do endereço é obrigatório"),
});

export type UpdateCartShippingAddressSchema = z.infer<
  typeof updateCartShippingAddressSchema
>;
