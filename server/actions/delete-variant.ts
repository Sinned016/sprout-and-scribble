"use server";

import { actionClient } from "@/lib/safe-action";
import * as z from "zod";
import { db } from "..";
import { productVariants } from "../schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { algoliasearch } from "algoliasearch";

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_ID!,
  process.env.ALGOLIA_ADMIN!
);

export const deleteVariant = actionClient
  .schema(z.object({ id: z.number() }))
  .action(async ({ parsedInput: { id } }) => {
    try {
      const deletedVariant = await db
        .delete(productVariants)
        .where(eq(productVariants.id, id))
        .returning();

      await client.deleteObject({
        indexName: "products",
        objectID: deletedVariant[0].id.toString(),
      });

      revalidatePath("/dashboard/products");

      return {
        success: `Deleted ${deletedVariant[0].productType}`,
      };
    } catch (error) {
      return { error: "Failed to delete variant" };
    }
  });
