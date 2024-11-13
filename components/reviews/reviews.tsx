import React from "react";
import ReviewsForm from "./reviews-form";
import Review from "./review";
import { db } from "@/server";
import { desc, eq } from "drizzle-orm";
import { reviews } from "@/server/schema";
import ReviewChart from "./review-chart";

export default async function Reviews({ productID }: { productID: number }) {
  const data = await db.query.reviews.findMany({
    where: eq(reviews.productID, productID),
    with: {
      user: true,
    },
    orderBy: [desc(reviews.created)],
  });
  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold mb-4">Product Reviews</h2>
      <div className="flex gap-2 justify-stretch flex-col lg:gap-12 lg:flex-row ">
        <div className="flex-1">
          <Review reviews={data} />
        </div>

        <div className="flex-1 flex-col gap-2">
          <ReviewChart reviews={data} />
          <ReviewsForm />
        </div>
      </div>
    </section>
  );
}
