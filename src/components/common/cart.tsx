import { Sheet, ShoppingBasketIcon } from "lucide-react";
import { SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";

const Cart = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"outline"} size="icon">
          <ShoppingBasketIcon />
        </Button>
      </SheetTrigger>
    </Sheet>
  );
};

export default Cart;
