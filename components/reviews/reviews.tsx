import React from "react";
import ReviewsForm from "./reviews-form";
import Review from "./review";
import { db } from "@/server";
import { desc, eq } from "drizzle-orm";
import { reviews } from "@/server/schema";
import ReviewChart from "./review-chart";
import { auth } from "@/server/auth";

export default async function Reviews({ productID }: { productID: number }) {
  const session = await auth();
  const data = await db.query.reviews.findMany({
    where: eq(reviews.productID, productID),
    with: {
      user: true,
    },
    orderBy: [desc(reviews.created)],
  });
  // console.log(user);
  return (
    <section className="py-4">
      <div className="flex gap-2 justify-stretch flex-col lg:gap-12 lg:flex-row ">
        <div className="flex-1 mb-2">
          <h2 className="text-2xl font-bold mb-4">Product Reviews</h2>
          <ReviewsForm />
          <Review reviews={data} user={session?.user} />
        </div>

        <div className="flex-1 flex-col gap-2">
          <ReviewChart reviews={data} />
        </div>
      </div>
    </section>
  );
}
