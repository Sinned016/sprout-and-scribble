"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useAction } from "next-safe-action/hooks";
import { deleteReview } from "@/server/actions/delete-review";
import { ReviewsWithUser } from "@/lib/infer-type";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteReview({
  user,
  review,
}: {
  user: any;
  review: ReviewsWithUser;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isAdmin = user?.role;
  const loggedInUserID = user?.id;
  const reviewUserID = review?.userID;

  let loadingToastId: string | number;
  const deleteReviewAction = useAction(deleteReview, {
    onExecute: () => {
      loadingToastId = toast.loading("Deleting Product...");
      setOpen(false);
    },
    onSuccess: (data) => {
      if (data.data?.success) {
        toast.success(data.data.success);

        if (loadingToastId) {
          toast.dismiss(loadingToastId);
        }

        router.refresh();
      }

      if (data.data?.error) {
        toast.error(data.data.error);

        if (loadingToastId) {
          toast.dismiss(loadingToastId);
        }
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        {(isAdmin === "admin" || loggedInUserID === reviewUserID) && (
          <Trash
            className="absolute top-0 right-0 m-4 cursor-pointer"
            onClick={() => setOpen(true)}
            size={20}
          ></Trash>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Review?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this review?
          </DialogDescription>
        </DialogHeader>
        <Button
          className=""
          variant={"destructive"}
          onClick={() =>
            deleteReviewAction.execute({
              userID: loggedInUserID,
              reviewID: review.id,
            })
          }
        >
          Yes
        </Button>

        <DialogClose>
          <Button className="w-full">Cancel</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
