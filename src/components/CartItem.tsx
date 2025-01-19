import { FC } from "react";
import { CartItem as CartItemType } from "../store/cart";
import { Button, Image } from "@nextui-org/react";
import useCart from "../hooks/useCart";

interface Props {
  item: CartItemType;
}

const CartItem: FC<Props> = ({ item }) => {
  const { updateCart } = useCart();

  const updateQuantity = (amount: number) => {
    updateCart({
      product: item.product,
      quantity: amount,
    });
  };

  return (
    <div className="flex gap-4 p-4 bg-content2 rounded-lg">
      <Image
        src={item.product.cover}
        alt={item.product.title}
        className="w-24 h-32 object-cover rounded"
      />

      <div className="flex-1">
        <h3 className="font-semibold">{item.product.title}</h3>

        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              isIconOnly
              size="sm"
              variant="flat"
              onClick={() => updateQuantity(-1)}
            >
              -
            </Button>
            <span>{item.quantity}</span>
            <Button
              isIconOnly
              size="sm"
              variant="flat"
              onClick={() => updateQuantity(1)}
            >
              +
            </Button>
          </div>

          <Button
            color="danger"
            variant="light"
            size="sm"
            onClick={() => updateQuantity(-item.quantity)}
          >
            Remove
          </Button>
        </div>
      </div>

      <div className="text-right">
        <p className="font-semibold">${item.product.price.sale}</p>
        <p className="text-sm text-default-500 line-through">
          ${item.product.price.mrp}
        </p>
      </div>
    </div>
  );
};

export default CartItem;
