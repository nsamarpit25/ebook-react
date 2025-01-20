import { FC, useEffect, useState } from "react";
import dateFormat from "dateformat";

import client from "../api/client";
import { formatPrice, ParseError } from "../utils/helper";

import DividerWithTitle from "../components/common/DividerWithTitle";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { IoCloseOutline } from "react-icons/io5";
import { Chip, Divider } from "@nextui-org/react";
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
      <div className="p-5 lg:p-0">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
          Your Orders
        </h1>
        <div className="text-center pt-10 font-bold text-3xl text-gray-400 dark:text-gray-500">
          <p>{"You don't have any orders!"}</p>
        </div>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-8">
        Your Orders
      </h1>
      {orders?.map((order) => {
        return (
          <div
            key={order.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="border-b border-gray-200 dark:border-gray-700 py-4 px-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                Order Date: {dateFormat(order.date, "mmmm d yyyy")}
              </p>
            </div>

            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {order.orderItem.map((product) => {
                return (
                  <div key={product.id} className="group">
                    <div className="flex p-6 items-start hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <img
                        onClick={() => navigate(`/book/${product.slug}`)}
                        src={product.cover}
                        alt={product.title}
                        className="w-20 h-28 object-cover rounded-md shadow-sm transition-transform duration-200 hover:scale-110 cursor-pointer"
                      />

                      <div className="ml-6 flex-1">
                        <Link
                          to={`/book/${product.slug}`}
                          className="text-lg font-semibold text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400"
                        >
                          {product.title}
                        </Link>

                        <div className="mt-2 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <span>{formatPrice(Number(product.price))}</span>
                          <span>·</span>
                          <span>{product.qty} items</span>
                          <Chip color="danger" size="sm" className="ml-auto">
                            {formatPrice(Number(product.totalPrice))}
                          </Chip>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 flex justify-between items-center">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Status:{" "}
                <span
                  className={`font-medium ${
                    order.paymentStatus?.toLowerCase() === "paid"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {order.paymentStatus?.toUpperCase()}
                </span>
              </div>
              <p className="font-semibold text-lg">
                Total: {formatPrice(Number(order.totalAmount))}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Orders;
