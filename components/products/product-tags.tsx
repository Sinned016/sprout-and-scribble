"use client";

import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { useRouter, useSearchParams } from "next/navigation";

export default function ProductTags() {
  const router = useRouter();
  const params = useSearchParams();
  const tag = params.get("tag");

  const setFilter = (tag: string) => {
    if (tag) {
      router.push(`?tag=${tag}`);
    } else {
      router.push("/");
    }
  };
  return (
    <div className="my-4 flex gap-4 items-center justify-center">
      <Badge
        onClick={() => setFilter("")}
        className={cn(
          "cursor-pointer hover:opacity-100 bg-black hover:bg-black/75",
          !tag ? "opacity-100" : "opacity-50"
        )}
      >
        All
      </Badge>
      <Badge
        onClick={() => setFilter("blue")}
        className={cn(
          "cursor-pointer bg-blue-500 hover:opacity-100 hover:bg-blue-600",
          tag === "blue" && tag ? "opacity-100" : "opacity-50"
        )}
      >
        Blue
      </Badge>
      <Badge
        onClick={() => setFilter("green")}
        className={cn(
          "cursor-pointer bg-green-500 hover:opacity-100 hover:bg-green-600",
          tag === "green" && tag ? "opacity-100" : "opacity-50"
        )}
      >
        Green
      </Badge>
      <Badge
        onClick={() => setFilter("pink")}
        className={cn(
          "cursor-pointer bg-pink-500 hover:opacity-100 hover:bg-pink-600",
          tag === "pink" && tag ? "opacity-100" : "opacity-50"
        )}
      >
        Pink
      </Badge>
      <Badge
        onClick={() => setFilter("yellow")}
        className={cn(
          "cursor-pointer bg-yellow-500 hover:opacity-100 hover:bg-yellow-600",
          tag === "pink" && tag ? "opacity-100" : "opacity-50"
        )}
      >
        Yellow
      </Badge>
      <Badge
        onClick={() => setFilter("orange")}
        className={cn(
          "cursor-pointer bg-orange-500 hover:opacity-100 hover:bg-orange-600",
          tag === "pink" && tag ? "opacity-100" : "opacity-50"
        )}
      >
        Orange
      </Badge>
      <Badge
        onClick={() => setFilter("purple")}
        className={cn(
          "cursor-pointer bg-purple-500 hover:opacity-100 hover:bg-purple-600",
          tag === "pink" && tag ? "opacity-100" : "opacity-50"
        )}
      >
        Purple
      </Badge>
    </div>
  );
}
