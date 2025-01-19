import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Book } from "../components/BookDetail";
import { RootState } from ".";

export interface CartItemAPI {
  quantity: number;
  product: {
    id: string;
    title: string;
    slug: string;
    cover?: string;
    price: {
      mrp: string;
      sale: string;
    };
  };
}

export type CartItem =
  | {
      product: Book;
      quantity: number;
    }
  | CartItemAPI;

export interface CartState {
  id?: string;
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const slice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    updateCartId(state, { payload }: PayloadAction<string>) {
      state.id = payload;
    },
    updateCartState(state, { payload }: PayloadAction<CartState>) {
      state.id = payload.id;
      state.items = payload.items;
    },
    updateCartItems(state, { payload }: PayloadAction<CartItem>) {
      // find if the user is creating cart for the first time
      // then find the product from the existing list
      // if no product found update*updateCartItems
      // if product is found update the qty

      // check if book is present
      const index = state.items.findIndex(
        (a) => a.product.id === payload.product.id
      );

      if (index === -1) {
        // if book is not in cart add book
        state.items.push(payload);
      } else {
        // if book is already in cart update quantity
        state.items[index].quantity += payload.quantity;
        if (state.items[index].quantity <= 0) {
          //   state.items.filter((item) => item.product !== payload.product);
          state.items.splice(index, 1);
        }
      }
    },
  },
});

export const { updateCartState, updateCartItems, updateCartId } = slice.actions;

export const getCartState = createSelector(
  (state: RootState) => state,
  ({ cart }) => {
    return {
      totalCount: cart.items.reduce((total, cartItem) => {
        total += cartItem.quantity;
        return total;
      }, 0),
      subTotal: cart.items.reduce((total, cartItem) => {
        total += Number(cartItem.product.price.mrp) * cartItem.quantity;
        return total;
      }, 0),
      totalPrice: cart.items.reduce((total, cartItem) => {
        total += Number(cartItem.product.price.sale) * cartItem.quantity;
        return total;
      }, 0),
      ...cart,
    };
  }
);

export default slice.reducer;
