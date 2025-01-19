import { Button, Card } from "@nextui-org/react";
import { FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import { FC, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import client from "../api/client";
import { formatPrice, ParseError } from "../utils/helper";
import Skeletons from "../components/Skeletons";
import { Divider } from "@nextui-org/react";

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
      className="min-h-screen   py-12 px-4"
    >
      <Card className="max-w-4xl mx-auto overflow-visible">
        <div className="relative">
          {/* Success Badge */}
          <motion.div 
            initial={{ y: -50, scale: 0 }}
            animate={{ y: 0, scale: 1 }}
            className="absolute -top-12 left-1/2 -translate-x-1/2"
          >
            <div className="bg-success rounded-full p-4 shadow-xl">
              <FaCheckCircle className="text-white text-4xl" />
            </div>
          </motion.div>

          {/* Header */}
          <div className="text-center pt-16 pb-8 px-6 bg-success/5">
            <h1 className="text-4xl font-bold text-success mb-2">Order Confirmed!</h1>
            <p className="text-gray-600">Your purchase has been successfully processed</p>
          </div>

          {/* Order Summary */}
          <div className="p-6">
            <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
              {/* Items List */}
              <div className="space-y-4">
                <h2 className="font-semibold text-xl mb-4">Items Purchased</h2>
                {order?.orders.map((item) => (
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    key={item.id}
                    className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <img src={item.cover} alt={item.title} 
                      className="w-20 h-28 object-cover rounded-md shadow-sm" 
                    />
                    <div className="flex-1">
                      <Link to={`/book/${item.slug}`} 
                        className="font-medium hover:text-primary transition-colors">
                        {item.title}
                      </Link>
                      <div className="mt-2 text-sm text-gray-600 space-y-1">
                        <p>Unit Price: {formatPrice(Number(item.price))}</p>
                        <p>Quantity: {item.qty}</p>
                        <p className="font-medium text-black">
                          Subtotal: {formatPrice(Number(item.totalPrice))}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Order Details */}
              <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                <h2 className="font-semibold text-xl">Order Summary</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Order Date</span>
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Total Items</span>
                    <span>{order?.orders.length}</span>
                  </div>
                  <div className="flex justify-between py-2 text-lg font-semibold">
                    <span>Total Amount</span>
                    <span>{order?.totalAmount}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button
                as={Link}
                to="/orders"
                color="primary"
                variant="flat"
                className="flex-1 py-6"
              >
                View All Orders
              </Button>
              <Button
                as={Link}
                to="/"
                color="primary"
                className="flex-1 py-6"
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
