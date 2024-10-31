"use client";

import { VariantsWithProduct } from "@/lib/infer-type";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "../ui/badge";
import FormatPrice from "@/lib/format-price";

type VariantTypes = {
  variants: VariantsWithProduct[];
};

export default function Products({ variants }: VariantTypes) {
  return (
    <main className="grid gap-12 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {variants.map((variant) => (
        <Link
          className="py-2"
          href={`/products/${variant.id}?id=${variant.id}&productID=${variant.productID}&price=${variant.product.price}&title=${variant.product.title}&type=${variant.productType}&image=${variant.variantImages[0].url}`}
          key={variant.id}
        >
          <Image
            className="rounded-md mb-2"
            width={720}
            height={480}
            src={variant.variantImages[0].url}
            alt={variant.product.title}
            loading="lazy"
          />
          <div className="flex justify-between">
            <div className="font-medium">
              <h2 className="">{variant.product.title}</h2>
              <p className="text-sm text-muted-foreground">
                {variant.productType}
              </p>
            </div>

            <div>
              <Badge className="text-sm" variant={"secondary"}>
                {FormatPrice(variant.product.price)}
              </Badge>
            </div>
          </div>
        </Link>
      ))}
    </main>
  );
}
