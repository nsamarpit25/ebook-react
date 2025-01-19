import { createContext, FC, ReactNode, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import client from "../api/client";
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

interface Props {
  children: ReactNode;
}

interface CartApiResponse {
  cart: {
    id: string;
    items: CartItemAPI[];
  };
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

export const CartContext = createContext<ICartContext>({
  items: [],
  pending: false,
  fetching: true,
  totalCount: 0,
  totalPrice: 0,
  subTotal: 0,
  updateCart() {},
  clearCart() {},
});

const CartProvider: FC<Props> = ({ children }) => {
  const cart = useSelector(getCartState);
  const dispatch = useDispatch();
  const { profile } = useAuth();
  const [pending, setPending] = useState(false);
  const [fetching, setFetching] = useState(true);

  const clearCart = () => {
    // update the UI
    dispatch(updateCartState({ items: [], id: "" }));

    if (profile) {
      // update the server/database
      // if user is authenticated sending api request
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

  useEffect(() => {
    const fetchCartInfo = async () => {
      // if (!profile) {
      //   const result = localStorage.getItem(CART_KEY);
      //   if (result) {
      //     dispatch(updateCartState({ items: JSON.parse(result) }));
      //   }

      //   return setFetching(false);
      // }

      try {
        const { data } = await client.get<CartApiResponse>("/cart");
        dispatch(updateCartState({ id: data.cart.id, items: data.cart.items }));
      } catch (error) {
        ParseError(error);
      } finally {
        setFetching(false);
      }
    };

    fetchCartInfo();
  }, [dispatch]);

  const updateCart = async (item: CartItem) => {
    dispatch(updateCartItems(item));

    if (profile) {
      setPending(true);
      client
        .post("/cart", {
          items: [
            {
              product: item.product.id,
              quantity: item.quantity,
            },
          ],
        })
        .then(({ data }) => {
          // toast.success("Book added to cart.");
          if (item.quantity === -1) {
            toast.success("Book successfully removed from cart.");
          }
          if (item.quantity === 1) {
            toast.success("Book successfully added to cart.");
          }
          dispatch(updateCartId(data.cart));
        })
        .catch((error) => {
          ParseError(error);
        })
        .finally(() => {
          setPending(false);
        });
    }
  };

  return (
    <CartContext.Provider
      value={{
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
