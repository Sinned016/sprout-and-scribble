import * as z from "zod";

export const reviewSchema = z.object({
  productID: z.number(),
  rating: z
    .number()
    .min(1, { message: "please add atleast one star" })
    .max(5, { message: "please add atmost 5 stars" }), //
  comment: z
    .string()
    .min(10, { message: "please add atleast 10 characters for this review" }),
});
