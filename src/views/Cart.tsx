import { FC, useEffect, useState } from "react";
import useCart from "../hooks/useCart";
import { Button, Chip, Divider, Card } from "@nextui-org/react";
import { calculateDiscount, formatPrice, ParseError } from "../utils/helper";
import { FaMinus, FaPlus, FaRegTrashCan } from "react-icons/fa6";
import { MdOutlineShoppingCartCheckout } from "react-icons/md";
import Skeletons from "../components/Skeletons";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
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

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const handleCheckout = async () => {
    try {
      setBusy(true);
      if (!profile) return;
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

  if (!totalCount && !busy)
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-danger bg-clip-text text-transparent">
            Your Cart is Empty
          </h1>
          <p className="text-foreground-500 mb-6">
            Add some items to start shopping!
          </p>
          <Button
            as={Link}
            to="/"
            className="bg-gradient-to-r from-primary to-danger text-white shadow-lg
              hover:shadow-primary/25 hover:opacity-90 transition-all duration-300"
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
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-danger bg-clip-text text-transparent">
              Shopping Cart ({totalCount} items)
            </h1>
            <Button
              className="text-danger hover:bg-danger/10 transition-colors"
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
              <Card
                key={product.id}
                className="bg-content1/50 backdrop-blur-lg border-none shadow-sm group/card hover:shadow-lg transition-all duration-300"
              >
                <div className="flex gap-4 p-4">
                  <div className="relative group/image">
                    <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-danger/20 rounded-xl opacity-0 group-hover/image:opacity-100 blur-lg transition-opacity duration-300" />
                    <img
                      src={product.cover}
                      alt={product.title}
                      className="w-24 h-32 object-cover rounded-xl relative transform transition-all duration-300 group-hover/image:scale-105"
                    />
                    {/* Discount Badge */}
                    {calculateDiscount(product.price) > 0 && (
                      <Chip
                        color="danger"
                        size="sm"
                        className="absolute -top-2 -right-2 shadow-lg border border-white/20
                          transform transition-all duration-300 group-hover/image:scale-110 z-10"
                        variant="shadow"
                      >
                        {calculateDiscount(product.price)}% OFF
                      </Chip>
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-lg hover:text-primary transition-colors">
                      {product.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-lg font-semibold bg-gradient-to-r from-primary to-danger bg-clip-text text-transparent">
                        {formatPrice(Number(product.price.sale))}
                      </span>
                      <span className="text-sm font-medium text-foreground/50 line-through">
                        {formatPrice(Number(product.price.mrp))}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 mt-4">
                      <Button
                        isIconOnly
                        size="sm"
                        isLoading={pending || busy}
                        variant="bordered"
                        className="hover:border-primary hover:bg-primary/10 transition-all duration-300"
                        onClick={() => updateCart({ product, quantity: -1 })}
                      >
                        <FaMinus className="text-xs" />
                      </Button>
                      <span className="font-semibold min-w-[2rem] text-center">
                        {quantity}
                      </span>
                      <Button
                        isIconOnly
                        isLoading={pending || busy}
                        size="sm"
                        variant="bordered"
                        className="hover:border-primary hover:bg-primary/10 transition-all duration-300"
                        onClick={() => updateCart({ product, quantity: 1 })}
                      >
                        <FaPlus className="text-xs" />
                      </Button>
                      <Button
                        isIconOnly
                        size="sm"
                        isLoading={pending || busy}
                        variant="bordered"
                        className="hover:border-danger hover:bg-danger/10 transition-all duration-300"
                        onClick={() =>
                          updateCart({ product, quantity: -quantity })
                        }
                      >
                        <FaRegTrashCan className="text-danger" />
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
          <Card className="bg-content1/50 backdrop-blur-lg border-none p-6 sticky top-4 hover:shadow-lg transition-all duration-300">
            <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-primary to-danger bg-clip-text text-transparent">
              Order Summary
            </h2>
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
                className="w-full mt-4 bg-gradient-to-r from-primary to-danger text-white shadow-lg
                hover:shadow-primary/25 hover:opacity-90 transition-all duration-300"
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
