import { createContext, FC, ReactNode, useState } from "react";
import {
  CartItem,
  getCartState,
  updateCartId,
  updateCartItems,
} from "../store/cart";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import client from "../api/client";
import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";
import { ParseError } from "../utils/helper";

interface Props {
  children: ReactNode;
}

interface ICartContext {
  id?: string;
  items: CartItem[];
  updateCart(item: CartItem): void;
  pending: boolean;
  totalCount: number;
}

export const CartContext = createContext<ICartContext>({
  items: [],
  updateCart() {},
  pending: false,
  totalCount: 0,
});

const CartProvider: FC<Props> = ({ children }) => {
  const cart = useSelector(getCartState);
  const dispatch = useDispatch();
  const { profile } = useAuth();
  const [pending, setPending] = useState(false);

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
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
