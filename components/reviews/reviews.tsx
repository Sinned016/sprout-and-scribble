import React from "react";
import ReviewsForm from "./reviews-form";
import Review from "./review";
import { db } from "@/server";
import { desc, eq } from "drizzle-orm";
import { reviews } from "@/server/schema";

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
      <div>
        <ReviewsForm />
        <Review reviews={data} />
      </div>
    </section>
  );
}
