import { Button, Card, Chip } from "@nextui-org/react";
import { motion } from "framer-motion";
import { FC, useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { Link, useSearchParams } from "react-router-dom";
import client from "../api/client";
import Skeletons from "../components/Skeletons";
import { formatPrice, ParseError } from "../utils/helper";

interface Props {}

interface OrderItem {
  id: string;
  cover?: string;
  price: string;
  qty: number;
  slug: string;
  title: string;
  totalPrice: string;
}

interface Order {
  orders: OrderItem[];
  totalAmount: string;
}

const PaymentSuccess: FC<Props> = () => {
  const [busy, setBusy] = useState(true);
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState<Order>();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!sessionId) return;

    const fetchOrderDetail = async () => {
      try {
        const { data } = await client.post("/order/success", { sessionId });
        setOrder(data);
      } catch (error) {
        ParseError(error);
      } finally {
        setBusy(false);
      }
    };
    fetchOrderDetail();
  }, [sessionId]);

  if (busy) return <Skeletons.Payment />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-[60vh] py-12 px-4 flex items-center justify-center"
    >
      <Card className="max-w-4xl w-full mx-auto overflow-visible bg-content1/50 backdrop-blur-lg border-none shadow-lg relative">
        {/* Success Badge - Moved higher and enhanced animation */}
        <motion.div
          initial={{ scale: 0, y: 40 }}
          animate={{ scale: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.2,
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
          className="absolute left-1/2 -translate-x-1/2 -top-16 z-50"
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-danger rounded-full opacity-0 group-hover:opacity-25 blur-xl transition-all duration-300" />
            <div
              className="bg-gradient-to-r from-primary to-danger p-4 rounded-full shadow-xl relative
              transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-primary/25"
            >
              <FaCheckCircle className="text-white text-4xl" />
            </div>
          </div>
        </motion.div>

        <div className="relative">
          {/* Header with enhanced gradient */}
          <div
            className="text-center pt-16 pb-8 px-6 bg-content2/50 backdrop-blur-sm rounded-t-xl
            relative overflow-hidden group"
          >
            <div
              className="absolute inset-0 bg-gradient-to-r from-primary/5 to-danger/5
              opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold bg-gradient-to-r from-primary to-danger bg-clip-text text-transparent mb-2"
            >
              Order Confirmed!
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-foreground/60"
            >
              Your purchase has been successfully processed
            </motion.p>
          </div>

          {/* Order Summary with enhanced items */}
          <div className="p-6">
            <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
              <div className="space-y-4">
                <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-danger bg-clip-text text-transparent">
                  Items Purchased
                </h2>
                {order?.orders.map((item, index) => (
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    key={item.id}
                    className="group/item"
                  >
                    <div
                      className="flex gap-4 p-4 bg-content2/50 backdrop-blur-sm rounded-xl
                      transition-all duration-300 hover:shadow-lg relative overflow-hidden"
                    >
                      {/* Background gradient effect */}
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-primary/5 to-danger/5
                        opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"
                      />

                      {/* Image with hover effect */}
                      <div className="relative group/image">
                        <div
                          className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-danger/20
                          rounded-xl opacity-0 group-hover/image:opacity-100 blur-lg transition-opacity duration-300"
                        />
                        <img
                          src={item.cover}
                          alt={item.title}
                          className="w-20 h-28 object-cover rounded-xl shadow-sm relative
                            transform transition-all duration-300 group-hover/image:scale-105"
                        />
                        {/* Price Badge */}
                        <Chip
                          className="absolute -top-2 -right-2 shadow-lg border border-white/20
                            transform transition-all duration-300 group-hover/image:scale-110"
                          color="danger"
                          size="sm"
                          variant="shadow"
                        >
                          {formatPrice(Number(item.price))}
                        </Chip>
                      </div>

                      <div className="flex-1">
                        <Link
                          to={`/book/${item.slug}`}
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {item.title}
                        </Link>
                        <div className="mt-2 text-sm space-y-1 text-foreground/60">
                          <p>Unit Price: {formatPrice(Number(item.price))}</p>
                          <p>Quantity: {item.qty}</p>
                          <p className="font-medium bg-gradient-to-r from-primary to-danger bg-clip-text text-transparent">
                            Subtotal: {formatPrice(Number(item.totalPrice))}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Order Details Card with hover effect */}
              <div
                className="bg-content2/50 backdrop-blur-sm p-6 rounded-xl space-y-4
                hover:shadow-lg transition-all duration-300 relative group/summary overflow-hidden"
              >
                <div
                  className="absolute inset-0 bg-gradient-to-r from-primary/5 to-danger/5
                  opacity-0 group-hover/summary:opacity-100 transition-opacity duration-300"
                />
                <h2 className="font-semibold text-xl">Order Summary</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-600">
                    <span className="text-gray-600 dark:text-gray-400">
                      Order Date
                    </span>
                    <span className="dark:text-gray-100">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-600">
                    <span className="text-gray-600 dark:text-gray-400">
                      Total Items
                    </span>
                    <span className="dark:text-gray-100">
                      {order?.orders.length}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 text-lg font-semibold">
                    <span className="dark:text-gray-100">Total Amount</span>
                    <span className="dark:text-gray-100">
                      {order?.totalAmount}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions with enhanced buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button
                as={Link}
                to="/orders"
                className="flex-1 py-6 bg-content2/50 backdrop-blur-sm hover:bg-content3/50 transition-all duration-300"
              >
                View All Orders
              </Button>
              <Button
                as={Link}
                to="/"
                className="flex-1 py-6 bg-gradient-to-r from-primary to-danger text-white shadow-lg
                  hover:shadow-primary/25 hover:opacity-90 transition-all duration-300"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default PaymentSuccess;
