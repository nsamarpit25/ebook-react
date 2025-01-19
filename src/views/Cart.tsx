import { FC } from "react";
import useCart from "../hooks/useCart";
import { Button } from "@nextui-org/react";
import { FaShoppingCart } from "react-icons/fa";
import CartItem from "../components/CartItem";

const Cart: FC = () => {
  const { items, totalCount } = useCart();

  if (!items.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <FaShoppingCart size={50} className="text-gray-400" />
        <p className="text-xl text-gray-500">Your cart is empty</p>
        <Button color="primary" href="/" as="a">
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart ({totalCount} items)</h1>
      
      <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          {items.map((item) => (
            <CartItem key={item.product.id} item={item} />
          ))}
        </div>

        <div className="bg-content2 p-4 rounded-lg h-fit space-y-4">
          <h2 className="text-xl font-semibold">Order Summary</h2>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${items.reduce((acc, item) => acc + (Number(item.product.price.mrp) * item.quantity), 0)}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount</span>
              <span className="text-success">
                -${items.reduce((acc, item) => {
                  const discount = Number(item.product.price.mrp) - Number(item.product.price.sale);
                  return acc + (discount * item.quantity);
                }, 0)}
              </span>
            </div>
            <div className="flex justify-between font-bold pt-2 border-t">
              <span>Total</span>
              <span>${items.reduce((acc, item) => acc + (Number(item.product.price.sale) * item.quantity), 0)}</span>
            </div>
          </div>

          <Button color="primary" className="w-full">
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Cart;