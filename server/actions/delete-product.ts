"use server";

import { actionClient } from "@/lib/safe-action";
import * as z from "zod";
import { db } from "..";
import { products } from "../schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const deleteProduct = actionClient
  .schema(z.object({ id: z.number() }))
  .action(async ({ parsedInput: { id } }) => {
    try {
      const data = await db
        .delete(products)
        .where(eq(products.id, id))
        .returning();

      revalidatePath("/dashboard/products");

      return { success: `Product ${data[0].title} has been deleted` };
    } catch (error) {
      return { error: "Failed to delete a product" };
    }
  });
