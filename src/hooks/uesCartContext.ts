import { createContext } from "react";
import type { ICartContext } from "../context/CartProvider";

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
