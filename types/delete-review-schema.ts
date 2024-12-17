import * as z from "zod";

export const deleteReviewSchema = z.object({
  reviewID: z.number(),
  userID: z.string(),
});
