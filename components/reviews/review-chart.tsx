"use client";
import React, { useMemo } from "react";
import { Card, CardDescription, CardTitle } from "../ui/card";
import Stars from "./stars";
import { ReviewsWithUser } from "@/lib/infer-type";
import { getReviewAverage } from "@/lib/review-average";
import { Progress } from "../ui/progress";

export default function ReviewChart({
  reviews,
}: {
  reviews: ReviewsWithUser[];
}) {
  const getRatingsByStars = useMemo(() => {
    const ratingValues = Array.from({ length: 5 }, () => 0);
    const totalReviews = reviews.length;

    reviews.forEach((review) => {
      const starIndex = review.rating - 1;

      if (starIndex >= 0 && starIndex < 5) {
        ratingValues[starIndex]++;
      }
    });
    console.log(ratingValues);
    return ratingValues.map((rating) => (rating / totalReviews) * 100);
  }, [reviews]);

  const averageRating = getReviewAverage(reviews.map((r) => r.rating));
  return (
    <Card className="flex flex-col p-8 rounded-md gap-4 mb-2">
      <div className="flex flex-col gap-2">
        <CardTitle>Product Rating:</CardTitle>
        <CardDescription className="text-lg font-medium">
          {averageRating.toFixed(1)} stars
        </CardDescription>
      </div>
      {getRatingsByStars.map((rating, index) => (
        <div key={index} className="flex gap-2 justify-between items-center">
          <p className="flex gap-1 text-xs font-medium">
            {index + 1} <span>stars</span>
          </p>
          <Progress value={rating} />
        </div>
      ))}
    </Card>
  );
}
