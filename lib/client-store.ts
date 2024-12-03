import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Variant = {
  variantID: number;
  quantity: number;
};

export type cartItem = {
  name: string;
  image: string;
  id: number;
  variant: Variant;
  price: number;
};

export type cartState = {
  cart: cartItem[];
  checkoutProgress: "cart-page" | "payment-page" | "confirmation-page";
  setCheckoutProgress: (
    val: "cart-page" | "payment-page" | "confirmation-page"
  ) => void;
  addToCart: (item: cartItem) => void;
  removeFromCart: (item: cartItem) => void;
  clearCart: () => void;
  cartOpen: boolean;
  setCartOpen: (val: boolean) => void;
};

export const useCartStore = create<cartState>()(
  persist(
    (set) => ({
      cart: [],
      cartOpen: false,
      setCartOpen: (val) => set({ cartOpen: val }),
      clearCart: () => set({ cart: [] }),
      checkoutProgress: "cart-page",
      setCheckoutProgress: (val) => set({ checkoutProgress: val }),
      addToCart: (item) =>
        set((state) => {
          const existingItem = state.cart.find(
            (cartItem) => cartItem.variant.variantID === item.variant.variantID
          );
          if (existingItem) {
            const updatedCart = state.cart.map((cartItem) => {
              if (cartItem.variant.variantID === item.variant.variantID) {
                return {
                  ...cartItem,
                  variant: {
                    ...cartItem.variant,
                    quantity: cartItem.variant.quantity + item.variant.quantity,
                  },
                };
              }
              return cartItem;
            });
            return { cart: updatedCart };
          } else {
            return {
              cart: [
                ...state.cart,
                {
                  ...item,
                  variant: {
                    variantID: item.variant.variantID,
                    quantity: item.variant.quantity,
                  },
                },
              ],
            };
          }
        }),
      removeFromCart: (item) =>
        set((state) => {
          const updatedCart = state.cart.map((cartItem) => {
            if (cartItem.variant.variantID === item.variant.variantID) {
              return {
                ...cartItem,
                variant: {
                  ...cartItem.variant,
                  quantity: cartItem.variant.quantity - 1,
                },
              };
            }
            return cartItem;
          });
          return {
            cart: updatedCart.filter((item) => item.variant.quantity > 0),
          };
        }),
    }),
    { name: "cart-store" }
  )
);
