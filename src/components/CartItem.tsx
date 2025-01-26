import { FC } from "react";
import { CartItem as CartItemType } from "../store/cart";
import { Button, Chip, Image } from "@nextui-org/react";
import useCart from "../hooks/useCart";
import { FaMinus, FaPlus } from "react-icons/fa6";

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
    <div className="flex gap-4 p-4 bg-content1/50 backdrop-blur-lg rounded-2xl group/card hover:shadow-lg transition-all duration-300">
      <div className="relative group/image">
        <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-danger/20 rounded-xl opacity-0 group-hover/image:opacity-100 blur-lg transition-opacity duration-300" />
        <Image
          src={item.product.cover}
          alt={item.product.title}
          className="w-24 h-32 object-cover rounded-xl relative transform transition-transform duration-300 group-hover/image:scale-105"
        />
        {/* Price Badge */}
        <Chip
          color="danger"
          size="sm"
          className="absolute -top-2 -right-2 shadow-lg border border-white/20
            transform transition-all duration-300 group-hover/image:scale-110 z-10"
          variant="shadow"
        >
          ${item.product.price.sale}
        </Chip>
      </div>

      <div className="flex-1">
        <h3 className="font-semibold bg-gradient-to-r from-primary to-danger bg-clip-text text-transparent">
          {item.product.title}
        </h3>

        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              isIconOnly
              size="sm"
              variant="bordered"
              className="hover:border-primary transition-colors duration-300"
              onClick={() => updateQuantity(-1)}
            >
              <FaMinus size={12} />
            </Button>
            <span className="font-medium">{item.quantity}</span>
            <Button
              isIconOnly
              size="sm"
              variant="bordered"
              className="hover:border-primary transition-colors duration-300"
              onClick={() => updateQuantity(1)}
            >
              <FaPlus size={12} />
            </Button>
          </div>

          <Button
            className="text-danger hover:bg-danger/10 transition-colors"
            variant="light"
            size="sm"
            onClick={() => updateQuantity(-item.quantity)}
          >
            Remove
          </Button>
        </div>
      </div>

      <div className="text-right">
        <p className="font-semibold bg-gradient-to-r from-primary to-danger bg-clip-text text-transparent">
          ${item.product.price.sale}
        </p>
        <p className="text-sm text-foreground-500 line-through">
          ${item.product.price.mrp}
        </p>
      </div>
    </div>
  );
};

export default CartItem;
