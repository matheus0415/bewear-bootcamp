import { z } from "zod";

export const getShippingAddressesSchema = z.object({});

export type GetShippingAddressesInput = z.infer<
  typeof getShippingAddressesSchema
>;
