import dateFormat from "dateformat";
import { FC, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@nextui-org/react";

import client from "../api/client";
import { formatPrice, ParseError } from "../utils/helper";

import { Card, Chip } from "@nextui-org/react";
import { Link, useNavigate } from "react-router-dom";
import Skeletons from "../components/Skeletons";

interface Props {}

interface OrderItem {
  id: string;
  title: string;
  slug: string;
  cover?: string;
  qty: number;
  price: string;
  totalPrice: string;
  description?: string;
  publicationDate?: string;
}

interface OrderList {
  id: string;
  stripeCustomerId?: string;
  paymentId?: string;
  totalAmount: string;
  paymentStatus?: string;
  date: string;
  orderItem: OrderItem[];
}

const Orders: FC<Props> = () => {
  const [pending, setPending] = useState(true);
  const [orders, setOrders] = useState<OrderList[]>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await client.get("/order");
        setOrders(data.orders);
      } catch (error) {
        ParseError(error);
      } finally {
        setPending(false);
      }
    };
    fetchOrders();
  }, []);

  if (pending) return <Skeletons.Orders />;

  if (!orders?.length)
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="container mx-auto px-4 py-8 max-w-5xl"
      >
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-danger bg-clip-text text-transparent mb-8">
          Your Orders
        </h1>
        <Card className="py-16 bg-content1/50 backdrop-blur-lg border-none">
          <div className="text-center space-y-6">
            <p className="text-3xl font-semibold text-foreground/40">
              {"You don't have any orders!"}
            </p>
            <Button
              as={Link}
              to="/"
              size="lg"
              className="bg-gradient-to-r from-primary to-danger text-white shadow-lg
                hover:shadow-primary/25 hover:opacity-90 transition-all duration-300"
            >
              Browse Books
            </Button>
          </div>
        </Card>
      </motion.div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-4 py-8 max-w-5xl"
    >
      <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-danger bg-clip-text text-transparent mb-8">
        Your Orders
      </h1>

      <div className="space-y-6">
        {orders?.map((order, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            key={order.id}
          >
            <Card className="bg-content1/50 backdrop-blur-lg border-none shadow-sm group hover:shadow-lg transition-all duration-300">
              {/* Date Header */}
              <div className="border-b border-divider/50 py-4 px-6">
                <p className="text-sm font-medium bg-gradient-to-r from-primary/70 to-danger/70 bg-clip-text text-transparent">
                  Order Date: {dateFormat(order.date, "mmmm d yyyy")}
                </p>
              </div>

              {/* Order Items */}
              <div className="divide-y divide-divider/50">
                {order.orderItem.map((product) => (
                  <div key={product.id} className="group/item">
                    <div className="flex p-6 items-start hover:bg-default-100/50 transition-all duration-300">
                      {/* Product Image with Hover Effect */}
                      <div className="relative group/image">
                        <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-danger/20 rounded-xl opacity-0 group-hover/image:opacity-100 blur-lg transition-opacity duration-300" />
                        <img
                          onClick={() => navigate(`/book/${product.slug}`)}
                          src={product.cover}
                          alt={product.title}
                          className="relative w-20 h-28 object-cover rounded-xl shadow-sm
                            transform transition-all duration-300 group-hover/image:scale-105 cursor-pointer"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="ml-6 flex-1">
                        <Link
                          to={`/book/${product.slug}`}
                          className="text-lg font-semibold hover:text-primary transition-colors"
                        >
                          {product.title}
                        </Link>

                        <div className="mt-2 flex items-center gap-4 text-sm text-foreground/70">
                          <span className="font-medium bg-gradient-to-r from-primary/90 to-danger/90 bg-clip-text text-transparent">
                            {formatPrice(Number(product.price))}
                          </span>
                          <span>·</span>
                          <span>{product.qty} items</span>
                          <Chip
                            className="ml-auto font-medium bg-gradient-to-r from-primary/10 to-danger/10"
                            color="danger"
                            size="sm"
                            variant="flat"
                          >
                            {formatPrice(Number(product.totalPrice))}
                          </Chip>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="bg-default-100/50 backdrop-blur-sm px-6 py-4 rounded-b-lg flex justify-between items-center">
                <div className="text-sm flex items-center gap-2">
                  <span className="text-foreground/70">Status:</span>
                  <Chip
                    size="sm"
                    color={
                      order.paymentStatus?.toLowerCase() === "paid"
                        ? "success"
                        : "danger"
                    }
                    variant="flat"
                    className="font-medium bg-gradient-to-r from-success/10 to-success/20"
                  >
                    {order.paymentStatus?.toUpperCase()}
                  </Chip>
                </div>
                <p className="font-semibold text-lg bg-gradient-to-r from-primary to-danger bg-clip-text text-transparent">
                  Total: {formatPrice(Number(order.totalAmount))}
                </p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Orders;
