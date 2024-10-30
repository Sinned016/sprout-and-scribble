"use server";

import { actionClient } from "@/lib/safe-action";
import { VariantSchema } from "@/types/variant-schema";
import * as z from "zod";
import { db } from "..";
import {
  products,
  productVariants,
  variantImages,
  variantTags,
} from "../schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { algoliasearch } from "algoliasearch";

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_ID!,
  process.env.ALGOLIA_ADMIN!
);

export const createVariant = actionClient
  .schema(VariantSchema)
  .action(
    async ({
      parsedInput: {
        color,
        id,
        productID,
        editMode,
        productType,
        tags,
        variantImages: newImages,
      },
    }) => {
      try {
        if (editMode && id) {
          const editVariant = await db
            .update(productVariants)
            .set({ productType, color, updated: new Date() })
            .where(eq(productVariants.id, id))
            .returning();

          await db
            .delete(variantTags)
            .where(eq(variantTags.variantID, editVariant[0].id));

          await db.insert(variantTags).values(
            tags.map((tag) => ({
              tag,
              variantID: editVariant[0].id,
            }))
          );

          await db
            .delete(variantImages)
            .where(eq(variantImages.variantID, editVariant[0].id));

          await db.insert(variantImages).values(
            newImages.map((img, idx) => ({
              name: img.name,
              size: img.size,
              url: img.url,
              variantID: editVariant[0].id,
              order: idx,
            }))
          );

          await client.partialUpdateObject({
            indexName: "products",
            objectID: editVariant[0].id.toString(),
            attributesToUpdate: {
              productType,
              color,
              tags,
              variantImages: newImages[0].url,
            },
          });

          revalidatePath("/dashboard/products");
          return { success: `Edited ${productType}` };
        }

        if (!editMode) {
          const newVariant = await db
            .insert(productVariants)
            .values({
              productType,
              color,
              productID,
            })
            .returning();

          const product = await db.query.products.findFirst({
            where: eq(products.id, productID),
          });

          await db.insert(variantTags).values(
            tags.map((tag) => ({
              tag,
              variantID: newVariant[0].id,
            }))
          );

          await db.insert(variantImages).values(
            newImages.map((img, idx) => ({
              name: img.name,
              size: img.size,
              url: img.url,
              variantID: newVariant[0].id,
              order: idx,
            }))
          );

          if (product) {
            await client.saveObject({
              indexName: "products",
              body: {
                objectID: newVariant[0].id.toString(),
                id: productID,
                title: product.title,
                price: product.price,
                productType,
                color,
                tags,
                variantImages: newImages[0].url,
              },
            });
          }

          revalidatePath("/dashboard/products");
          return { success: `Added ${productType}` };
        }
      } catch (error) {
        return { error: "Failed to create a variant" };
      }
    }
  );
