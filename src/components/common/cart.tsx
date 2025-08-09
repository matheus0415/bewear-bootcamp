import { getCart } from "@/actions/get-cart";
import { useQuery } from "@tanstack/react-query";
import { ShoppingBasketIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import Image from "next/image";

const Cart = () => {
  const { data: cart, isPending: cartIsLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: () => getCart(),
  });

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"outline"} size="icon">
          <ShoppingBasketIcon />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Carrinho</SheetTitle>
        </SheetHeader>
        <div>
          {cartIsLoading && <p>Carregando...</p>}
          {cart?.items.map((item) => (
            <div key={item.id}>
              <Image
                src={item.productVariant.imageUrl}
                alt={item.productVariant.product.name}
                width={100}
                height={100}
              />
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
