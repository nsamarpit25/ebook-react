import dateFormat from "dateformat";
import { FC, useEffect, useState } from "react";

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
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-danger bg-clip-text text-transparent mb-8">
          Your Orders
        </h1>
        <Card className="py-16 bg-background/60 backdrop-blur-sm">
          <div className="text-center font-bold text-3xl text-foreground/40">
            <p>{"You don't have any orders!"}</p>
          </div>
        </Card>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-danger bg-clip-text text-transparent mb-8">
        Your Orders
      </h1>
      {orders?.map((order) => {
        return (
          <Card
            key={order.id}
            className="mb-6 bg-background/60 backdrop-blur-sm border-none shadow-sm"
          >
            <div className="border-b border-divider py-4 px-6">
              <p className="text-sm text-foreground/70 font-medium">
                Order Date: {dateFormat(order.date, "mmmm d yyyy")}
              </p>
            </div>

            <div className="divide-y divide-divider">
              {order.orderItem.map((product) => {
                return (
                  <div key={product.id} className="group">
                    <div className="flex p-6 items-start hover:bg-default-100/50 transition-colors">
                      <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-danger/20 rounded-lg opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300" />
                        <img
                          onClick={() => navigate(`/book/${product.slug}`)}
                          src={product.cover}
                          alt={product.title}
                          className="relative w-20 h-28 object-cover rounded-md shadow-sm
                            transform transition-all duration-300
                            hover:scale-105 hover:shadow-lg cursor-pointer"
                        />
                      </div>

                      <div className="ml-6 flex-1">
                        <Link
                          to={`/book/${product.slug}`}
                          className="text-lg font-semibold text-foreground hover:text-primary transition-colors"
                        >
                          {product.title}
                        </Link>

                        <div className="mt-2 flex items-center gap-4 text-sm text-foreground/70">
                          <span>{formatPrice(Number(product.price))}</span>
                          <span>·</span>
                          <span>{product.qty} items</span>
                          <Chip
                            className="ml-auto font-medium"
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
                );
              })}
            </div>

            <div className="bg-default-100/50 px-6 py-4 rounded-b-lg flex justify-between items-center">
              <div className="text-sm text-foreground/70">
                Status:{" "}
                <Chip
                  size="sm"
                  color={
                    order.paymentStatus?.toLowerCase() === "paid"
                      ? "success"
                      : "danger"
                  }
                  variant="flat"
                  className="ml-2"
                >
                  {order.paymentStatus?.toUpperCase()}
                </Chip>
              </div>
              <p className="font-semibold text-lg bg-gradient-to-r from-primary to-danger bg-clip-text text-transparent">
                Total: {formatPrice(Number(order.totalAmount))}
              </p>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default Orders;
