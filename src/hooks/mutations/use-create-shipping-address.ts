import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { createShippingAddress } from "@/actions/create-shipping-address";

export const getCreateShippingAddressMutationKey = () =>
  ["create-shipping-address"] as const;

export const useCreateShippingAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: getCreateShippingAddressMutationKey(),
    mutationFn: createShippingAddress,
    onSuccess: () => {
      toast.success("Endereço criado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["shipping-addresses"] });
    },
    onError: (error) => {
      toast.error("Erro ao criar endereço. Tente novamente.");
      console.error(error);
    },
  });
};
