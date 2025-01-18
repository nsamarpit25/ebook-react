import { createContext, FC, ReactNode } from "react";
import { CartItem } from "../store/cart";
import { useSelector } from "react-redux";
import { RootState } from "../store";

interface Props {
  children: ReactNode;
}

interface ICartContext {
  id?: string;
  items: CartItem[];
}

export const CartContext = createContext<ICartContext>({
  items: [],
});

const CartProvider: FC<Props> = ({children}) => {
    const cart = useSelector((state: RootState)=> state.cart)
  return <CartContext.Provider value={{items: cart.items}}>{children}</CartContext.Provider>;
};

export default CartProvider;
