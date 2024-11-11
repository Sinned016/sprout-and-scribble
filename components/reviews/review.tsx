"use client";

import { ReviewsWithUser } from "@/lib/infer-type";
import { motion } from "framer-motion";
import { Card } from "../ui/card";
import Image from "next/image";
import { formatDistance, subDays } from "date-fns";

export default function Review({ reviews }: { reviews: ReviewsWithUser[] }) {
  return (
    <motion.div className="flex flex-col gap-4">
      {reviews.map((review) => (
        <Card className="p-4" key={review.id}>
          <div className="flex gap-2 items-center">
            <Image
              className="rounded-full "
              width={32}
              height={32}
              src={review.user.image!}
              alt={review.user.name!}
            />

            <div>
              <p>{review.user.name}</p>
              <div className="flex items-center gap-2">
                <h1>Stars</h1>
                <p className="text-xs text-bold text-muted-foreground">
                  {formatDistance(subDays(review.created!, 0), new Date())}
                </p>
              </div>
            </div>
          </div>
          <p>{review.comment}</p>
        </Card>
      ))}
    </motion.div>
  );
}
