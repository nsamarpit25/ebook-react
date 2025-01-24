import { AxiosError } from "axios";
import { FC, ReactNode, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import client from "../api/client";
import { CartContext } from "../hooks/uesCartContext";
import useAuth from "../hooks/useAuth";
import {
  CartItem,
  CartItemAPI,
  getCartState,
  updateCartId,
  updateCartItems,
  updateCartState,
} from "../store/cart";
import { ParseError } from "../utils/helper";

interface CartApiResponse {
  cart: {
    id: string;
    items: CartItemAPI[];
  };
}

interface Props {
  children: ReactNode;
}

export interface ICartContext {
  id?: string;
  items: CartItem[];
  pending: boolean;
  fetching: boolean;
  totalCount: number;
  totalPrice: number;
  subTotal: number;
  updateCart(item: CartItem): void;
  clearCart(): void;
}

const CART_KEY = "cartItems";
const updateCartInLS = (cartItems: CartItem[]) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
};

let startLSUpdate = false;

const CartProvider: FC<Props> = ({ children }) => {
  const cart = useSelector(getCartState);
  const dispatch = useDispatch();
  const { profile } = useAuth();
  const [pending, setPending] = useState(false);
  const [fetching, setFetching] = useState(true);
  const { dbConnectionStatus } = useAuth();

  const clearCart = () => {
    // update the UI
    dispatch(updateCartState({ items: [], id: "" }));

    if (profile) {
      // update the server/database
      // if user is authenticated sending api request
      if (!dbConnectionStatus) {
        toast.error("Connection to database failed. Please try again later.");
      }
      setPending(true);
      client
        .post("/cart/clear")
        .then(() => {
          toast.success("Cart cleared successfully.");
        })
        .catch(ParseError)
        .finally(() => {
          setPending(false);
        });
    }
  };

  const updateCart = (item: CartItem) => {
    startLSUpdate = true;
    // update the UI
    dispatch(updateCartItems(item));

    if (profile) {
      // update the server/database
      // if user is authenticated sending api request
      setPending(true);
      client
        .post("/cart", {
          items: [{ product: item.product.id, quantity: item.quantity }],
        })
        .then(({ data }) => {
          toast.success("Product added to cart.");
          dispatch(updateCartId(data.cart));
        })
        .catch(ParseError)
        .finally(() => {
          setPending(false);
        });
    }
  };

  useEffect(() => {
    if (startLSUpdate && !profile) {
      updateCartInLS(cart.items);
    }
  }, [cart.items, profile]);

  useEffect(() => {
    const fetchCartInfo = async () => {
      if (!profile) {
        const result = localStorage.getItem(CART_KEY);
        if (result) {
          dispatch(updateCartState({ items: JSON.parse(result) }));
        }

        return setFetching(false);
      }

      try {
        // if (!profile) return;
        // console.log(profile);
        const { data } = await client.get<CartApiResponse>("/cart");
        dispatch(updateCartState({ id: data.cart.id, items: data.cart.items }));
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 404) {
            return;
          }
          ParseError(error);
        }
      } finally {
        setFetching(false);
      }
    };

    fetchCartInfo();
  }, [dispatch, profile]);

  return (
    <CartContext.Provider
      value={{
        id: cart.id,
        items: cart.items,
        totalCount: cart.totalCount,
        subTotal: cart.subTotal,
        totalPrice: cart.totalPrice,
        pending,
        fetching,
        updateCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
