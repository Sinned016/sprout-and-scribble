"use server";

import { actionClient } from "@/lib/safe-action";
import { db } from "..";
import { and, eq } from "drizzle-orm";
import { reviews } from "../schema";
import { revalidatePath } from "next/cache";
import { reviewSchema } from "@/types/reviews-schema";
import { auth } from "../auth";
import { deleteReviewSchema } from "@/types/delete-review-schema";

export const deleteReview = actionClient
  .schema(deleteReviewSchema)
  .action(async ({ parsedInput: { userID, reviewID } }) => {
    try {
      const user = await auth();

      if (!user) {
        return { error: "User not found" };
      }

      if (user.user.id !== userID) {
        return { error: "You can't delete a review that isn't yours" };
      }

      const deletedReview = await db
        .delete(reviews)
        .where(eq(reviews.id, reviewID))
        .returning();

      return {
        success: `Deleted Review`,
      };
    } catch (error) {
      return { error: JSON.stringify(error) };
    }
  });
