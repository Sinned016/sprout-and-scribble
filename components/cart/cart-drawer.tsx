"use client";

import { useCartStore } from "@/lib/client-store";
import { ShoppingBag } from "lucide-react";
import React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "../ui/drawer";
import { AnimatePresence, motion } from "framer-motion";
import CartItems from "./cart-items";
import CartMessage from "./cart-message";
import Payment from "./payment";
import OrderConfirmed from "./order-confirmed";

export default function CartDrawer() {
  const { cart, checkoutProgress, setCheckoutProgress, cartOpen, setCartOpen } =
    useCartStore();
  console.log(cart);
  return (
    <Drawer open={cartOpen} onOpenChange={setCartOpen}>
      <DrawerTrigger>
        <div className="relative px-2">
          <AnimatePresence>
            {cart.length > 0 && (
              <motion.span
                className="absolute flex items-center justify-center -top-0.5 -right-0.5 w-4 h-4 dark:bg-primary bg-primary text-white text-xs font-bold rounded-full"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0 }}
              >
                {cart.length}
              </motion.span>
            )}
          </AnimatePresence>
          <ShoppingBag />
        </div>
      </DrawerTrigger>
      <DrawerContent className="min-h-50vh">
        <DrawerHeader className="flex justify-center items-center">
          <CartMessage />
        </DrawerHeader>
        <div className="overflow-auto p-4">
          {checkoutProgress === "cart-page" && <CartItems />}
          {checkoutProgress === "payment-page" && <Payment />}
          {checkoutProgress === "confirmation-page" && <OrderConfirmed />}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
