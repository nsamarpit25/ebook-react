import { Button, Card } from "@nextui-org/react";
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen  py-12 px-4 flex items-center justify-center"
    >
      <Card className="max-w-4xl w-full mx-auto overflow-visible bg-white dark:bg-gray-800">
        <div className="relative">
          {/* Centered Success Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute left-1/2 -translate-x-1/2 -top-12"
          >
            <div className="bg-gradient-to-br from-green-400 to-green-500 rounded-full p-4 shadow-xl">
              <FaCheckCircle className="text-white text-4xl" />
            </div>
          </motion.div>

          {/* Header */}
          <div className="text-center pt-16 pb-8 px-6 bg-green-50/50 dark:bg-green-900/10 rounded-t-xl">
            <h1 className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
              Order Confirmed!
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Your purchase has been successfully processed
            </p>
          </div>

          {/* Order Summary */}
          <div className="p-6">
            <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
              {/* Items List */}
              <div className="space-y-4">
                <h2 className="font-semibold text-xl mb-4 dark:text-gray-100">
                  Items Purchased
                </h2>
                {order?.orders.map((item) => (
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    key={item.id}
                    className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <img
                      src={item.cover}
                      alt={item.title}
                      className="w-20 h-28 object-cover rounded-md shadow-sm"
                    />
                    <div className="flex-1">
                      <Link
                        to={`/book/${item.slug}`}
                        className="font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {item.title}
                      </Link>
                      <div className="mt-2 text-sm space-y-1">
                        <p className="text-gray-600 dark:text-gray-400">
                          Unit Price: {formatPrice(Number(item.price))}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          Quantity: {item.qty}
                        </p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          Subtotal: {formatPrice(Number(item.totalPrice))}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Order Details */}
              <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg space-y-4">
                <h2 className="font-semibold text-xl dark:text-gray-100">
                  Order Summary
                </h2>
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

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button
                as={Link}
                to="/orders"
                className="flex-1 py-6 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                View All Orders
              </Button>
              <Button
                as={Link}
                to="/"
                className="flex-1 py-6 bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600"
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
