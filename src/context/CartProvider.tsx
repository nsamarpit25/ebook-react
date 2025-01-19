import { createContext, FC, ReactNode } from "react";
import { CartItem, updateCartItems } from "../store/cart";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";

interface Props {
  children: ReactNode;
}

interface ICartContext {
  id?: string;
  items: CartItem[];
  updateCart(item: CartItem): void;
}

export const CartContext = createContext<ICartContext>({
  items: [],
  updateCart() {},
});

const CartProvider: FC<Props> = ({ children }) => {
  const cart = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();

  const updateCart = (item: CartItem) => {
    dispatch(updateCartItems(item));
  };

  return (
    <CartContext.Provider value={{ items: cart.items, updateCart }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
