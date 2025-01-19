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

interface ICartContext {
  id?: string;
  items: CartItem[];
  updateCart(item: CartItem): void;
  pending: boolean;
  totalCount: number;
  fetching: boolean;
}

export const CartContext = createContext<ICartContext>({
  items: [],
  updateCart() {},
  pending: false,
  totalCount: 0,
  fetching: true,
});

const CartProvider: FC<Props> = ({ children }) => {
  const cart = useSelector(getCartState);
  const dispatch = useDispatch();
  const { profile } = useAuth();
  const [pending, setPending] = useState(false);
  const [fetching, setFetching] = useState(true);

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
          toast.success("Book added to cart.");
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
        updateCart,
        pending,
        fetching,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
