//export const dynamic = "force-dynamic";
//export const revalidate = 5;

import Algolia from "@/components/products/algolia";
import ProductTags from "@/components/products/product-tags";
import Products from "@/components/products/products";
import { db } from "@/server";
export const revalidate = 60 * 60;

export default async function Home() {
  const data = await db.query.productVariants.findMany({
    with: {
      variantImages: true,
      variantTags: true,
      product: true,
    },
    orderBy: (productVariants, { desc }) => [desc(productVariants.id)],
  });

  console.log(data);

  return (
    <main>
      <Algolia />
      <ProductTags />
      <Products variants={data} />
    </main>
  );
}
