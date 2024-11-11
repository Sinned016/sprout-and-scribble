"use server";

import { actionClient } from "@/lib/safe-action";
import { db } from "..";
import { and, eq } from "drizzle-orm";
import { products, reviews } from "../schema";
import { revalidatePath } from "next/cache";
import { reviewSchema } from "@/types/reviews-schema";
import { auth } from "../auth";

export const addReview = actionClient
  .schema(reviewSchema)
  .action(async ({ parsedInput: { productID, comment, rating } }) => {
    try {
      const session = await auth();
      if (!session) return { error: "Please sign in" };

      const existingReview = await db.query.reviews.findFirst({
        where: and(
          eq(reviews.productID, productID),
          eq(reviews.userID, session.user.id)
        ),
      });

      if (existingReview) {
        return { error: "You have already reviewed this product" };
      }

      const newReview = await db
        .insert(reviews)
        .values({
          productID,
          comment,
          rating,
          userID: session.user.id,
        })
        .returning();

      revalidatePath(`/products/${productID}`);
      return { success: newReview[0] };
    } catch (error) {
      return { error: JSON.stringify(error) };
    }
  });
