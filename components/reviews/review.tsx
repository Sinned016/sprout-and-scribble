"use client";

import { ReviewsWithUser } from "@/lib/infer-type";
import { motion } from "framer-motion";
import { Card } from "../ui/card";
import Image from "next/image";
import { formatDistance, subDays } from "date-fns";
import Stars from "./stars";
import { Session } from "next-auth";
import { Delete, DeleteIcon, Trash } from "lucide-react";
import DeleteReview from "./delete-review";

export default function Review({
  reviews,
  user,
}: {
  reviews: ReviewsWithUser[];
  user: any; // FIX THIS ANY
}) {
  return (
    <motion.div className="flex flex-col gap-4">
      {reviews.length === 0 && (
        <p className="py-2 text-md font-medium">No reviews yet</p>
      )}
      {reviews.map((review) => (
        <Card className="p-4 relative" key={review.id}>
          <div className="flex gap-2 items-center">
            <Image
              className="rounded-full "
              width={32}
              height={32}
              src={review.user.image!}
              alt={review.user.name!}
            />

            <div>
              <p className="text-sm font-bold">{review.user.name}</p>
              <div className="flex items-center gap-2">
                <Stars rating={review.rating} />
                <p className="text-xs text-bold text-muted-foreground">
                  {formatDistance(subDays(review.created!, 0), new Date())}
                </p>
              </div>
            </div>
            <DeleteReview user={user} review={review} />
          </div>
          <p className="font-meduim mt-2">{review.comment}</p>
        </Card>
      ))}
    </motion.div>
  );
}
