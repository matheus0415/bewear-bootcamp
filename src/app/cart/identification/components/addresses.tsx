"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { PatternFormat } from "react-number-format";
import z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useCreateShippingAddress } from "@/hooks/mutations/use-create-shipping-address";
import { useShippingAddresses } from "@/hooks/queries/use-shipping-addresses";

const addressFormSchema = z.object({
  email: z.email("Email inválido"),
  firstName: z.string().min(1, "Nome é obrigatório"),
  lastName: z.string().min(1, "Sobrenome é obrigatório"),
  cpfCnpj: z.string().refine((value) => {
    const cleanValue = value.replace(/\D/g, "");
    return cleanValue.length === 11 || cleanValue.length === 14;
  }, "CPF deve ter 11 dígitos ou CNPJ deve ter 14 dígitos"),
  phone: z.string().refine((value) => {
    const cleanValue = value.replace(/\D/g, "");
    return cleanValue.length >= 10 && cleanValue.length <= 11;
  }, "Celular deve ter 10 ou 11 dígitos"),
  cep: z.string().refine((value) => {
    const cleanValue = value.replace(/\D/g, "");
    return cleanValue.length === 8;
  }, "CEP deve ter 8 dígitos"),
  address: z.string().min(1, "Endereço é obrigatório"),
  number: z.string().min(1, "Número é obrigatório"),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, "Bairro é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().min(2, "Estado é obrigatório"),
});

type AddressFormValues = z.infer<typeof addressFormSchema>;

const Addresses = () => {
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const createShippingAddressMutation = useCreateShippingAddress();
  const { data: addressesData, isLoading } = useShippingAddresses();

  useEffect(() => {
    if (
      addressesData?.data &&
      addressesData.data.length > 0 &&
      !selectedAddress
    ) {
      setSelectedAddress(addressesData.data[0].id);
    }
  }, [addressesData?.data, selectedAddress]);

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      cpfCnpj: "",
      phone: "",
      cep: "",
      address: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
    },
  });

  const onSubmit = async (values: AddressFormValues) => {
    try {
      await createShippingAddressMutation.mutateAsync(values);
      form.reset();
      setSelectedAddress("add-new");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2>Endereços</h2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedAddress}
          onValueChange={(value) => setSelectedAddress(value)}
        >
          {isLoading ? (
            <div className="py-4 text-center">Carregando endereços...</div>
          ) : (
            <>
              {addressesData?.data &&
                addressesData.data.length > 0 &&
                addressesData.data.map((address) => (
                  <Card key={address.id} className="mb-3">
                    <CardContent className="pt-6">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={address.id} id={address.id} />
                        <Label
                          htmlFor={address.id}
                          className="flex-1 cursor-pointer"
                        >
                          <div className="text-sm">
                            {address.firstName} {address.lastName} -{" "}
                            {address.address}, {address.number}
                            {address.complement &&
                              `, ${address.complement}`} -{" "}
                            {address.neighborhood}, {address.city} -{" "}
                            {address.state} - CEP: {address.cep}
                          </div>
                        </Label>
                      </div>
                    </CardContent>
                  </Card>
                ))}

              <Card>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="add-new" id="add-new" />
                    <Label htmlFor="add-new" className="cursor-pointer">
                      Adicionar novo endereço
                    </Label>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </RadioGroup>
        {selectedAddress === "add-new" && (
          <div className="mt-4">
            <Separator className="my-4" />
            <div className="pb-5">
              <CardTitle>Adicionar novo</CardTitle>
            </div>
            <div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Primeiro Nome" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Sobrenome" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="cpfCnpj"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <PatternFormat
                              customInput={Input}
                              placeholder="CPF/CNPJ"
                              value={field.value}
                              onValueChange={(values) => {
                                field.onChange(values.value);
                              }}
                              format="###.###.###-##"
                              mask="_"
                              allowEmptyFormatting={false}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <PatternFormat
                              customInput={Input}
                              placeholder="Celular"
                              value={field.value}
                              onValueChange={(values) => {
                                field.onChange(values.value);
                              }}
                              format="(##) #####-####"
                              mask="_"
                              allowEmptyFormatting={false}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="cep"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <PatternFormat
                            customInput={Input}
                            placeholder="CEP"
                            value={field.value}
                            onValueChange={(values) => {
                              field.onChange(values.value);
                            }}
                            format="#####-###"
                            mask="_"
                            allowEmptyFormatting={false}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Endereço" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="number"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Número" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="complement"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Complemento" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="neighborhood"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Bairro" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Cidade" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Estado" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Adicionar novo endereço
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Addresses;
