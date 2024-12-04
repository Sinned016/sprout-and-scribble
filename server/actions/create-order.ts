"use server";

import { actionClient } from "@/lib/safe-action";
import { createOrderSchema } from "@/types/order-schema";
import { auth } from "../auth";
import { orderProduct, orders } from "../schema";
import { db } from "..";

export const createOrder = actionClient
  .schema(createOrderSchema)
  .action(
    async ({ parsedInput: { products, total, status, paymentIntentID } }) => {
      try {
        const user = await auth();

        if (!user) {
          return { error: "User not found" };
        }

        const order = await db
          .insert(orders)
          .values({
            status,
            paymentIntentID,
            total,
            userID: user.user.id,
          })
          .returning();

        const orderProducts = products.map(
          async ({ productID, quantity, variantID }) => {
            const newOrderProduct = await db.insert(orderProduct).values({
              quantity,
              orderID: order[0].id,
              productID: productID,
              productVariantID: variantID,
            });
          }
        );

        return { success: "Order has been added" };
      } catch {
        return { error: "Error creating order" };
      }
    }
  );
