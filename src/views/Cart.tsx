import { FC, useState } from "react";
import useCart from "../hooks/useCart";
import { Button, Chip, Divider, Card } from "@nextui-org/react";
import { calculateDiscount, formatPrice, ParseError } from "../utils/helper";
import { FaMinus, FaPlus, FaRegTrashCan } from "react-icons/fa6";
import { MdOutlineShoppingCartCheckout } from "react-icons/md";
import Skeletons from "../components/Skeletons";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import client from "../api/client";
import useAuth from "../hooks/useAuth";

interface Props {}

const Cart: FC<Props> = () => {
  const [busy, setBusy] = useState(false);
  const { profile } = useAuth();
  const {
    id,
    pending,
    items,
    totalCount,
    fetching,
    subTotal,
    totalPrice,
    updateCart,
    clearCart,
  } = useCart();

  const handleCheckout = async () => {
    try {
      if (!profile) return;
      setBusy(true);
      const { data } = await client.post("/checkout", { cartId: id });
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (error) {
      ParseError(error);
    } finally {
      setBusy(false);
    }
  };

  if (fetching) return <Skeletons.Cart />;

  if (!totalCount)
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-6">
            Add some items to start shopping!
          </p>
          <Button
            as={Link}
            to="/"
            color="primary"
            size="lg"
            isLoading={pending || busy}
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 py-8"
    >
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items Section */}
        <div className="lg:w-3/5">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">
              Shopping Cart ({totalCount} items)
            </h1>
            <Button
              color="danger"
              variant="light"
              startContent={<FaRegTrashCan />}
              onClick={clearCart}
              isLoading={pending || busy}
            >
              Clear Cart
            </Button>
          </div>

          <div className="space-y-6">
            {items.map(({ product, quantity }) => (
              <Card key={product.id} className="p-4">
                <div className="flex gap-4">
                  <img
                    src={product.cover}
                    alt={product.title}
                    className="w-24 h-32 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{product.title}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="text-lg font-semibold">
                        <span className="mr-2">
                          {formatPrice(Number(product.price.sale))}
                        </span>
                        {calculateDiscount(product.price) > 0 && (
                          <Chip
                            color="success"
                            size="sm"
                            style={{
                              fontSize: "10px",
                              height: "18px",
                              padding: "0px 4px",
                              borderRadius: "8px",
                            }}
                          >
                            {calculateDiscount(product.price)}% OFF
                          </Chip>
                        )}
                      </div>
                      <span className="text-sm font-medium line-through">
                        {formatPrice(Number(product.price.mrp))}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 mt-4">
                      <Button
                        isIconOnly
                        size="sm"
                        isLoading={pending || busy}
                        variant="bordered"
                        onClick={() => updateCart({ product, quantity: -1 })}
                      >
                        <FaMinus />
                      </Button>
                      <span className="font-semibold">{quantity}</span>
                      <Button
                        isIconOnly
                        isLoading={pending || busy}
                        size="sm"
                        variant="bordered"
                        onClick={() => updateCart({ product, quantity: 1 })}
                      >
                        <FaPlus />
                      </Button>
                      <Button
                        isIconOnly
                        size="sm"
                        isLoading={pending || busy}
                        variant="bordered"
                        onClick={() =>
                          updateCart({ product, quantity: -quantity })
                        }
                      >
                        <FaRegTrashCan />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Order Summary Section */}
        <div className="lg:w-2/5">
          <Card className="p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>{formatPrice(subTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Discount</span>
                <span>-{formatPrice(subTotal - totalPrice)}</span>
              </div>
              <Divider />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="mt-3">
                <Chip size="sm">
                  <p>
                    You are saving total{" "}
                    {calculateDiscount({
                      mrp: subTotal.toFixed(2),
                      sale: totalPrice.toFixed(2),
                    })}
                    %
                  </p>
                </Chip>
              </div>
              <Button
                color="primary"
                className="w-full mt-4"
                size="lg"
                isLoading={pending || busy}
                startContent={<MdOutlineShoppingCartCheckout />}
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default Cart;
