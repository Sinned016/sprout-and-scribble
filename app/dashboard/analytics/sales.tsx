import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TotalOrders } from "@/lib/infer-type";
import Image from "next/image";
import placeholderUser from "@/public/placeholder-user.jpg";
import { productVariants } from "@/server/schema";

export default function Sales({ totalOrders }: { totalOrders: TotalOrders[] }) {
  return (
    <Card className="flex-1 shrink-0">
      <CardHeader>
        <CardTitle>New sales</CardTitle>
        <CardDescription>Here are your recent sales</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Image</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {totalOrders.map(
              ({ orders, product, quantity, productVariants }) => (
                <TableRow className="font-medium" key={orders.id}>
                  <TableCell>
                    {orders.user.image && orders.user.name ? (
                      <div className="flex items-center gap-2 w-32">
                        <Image
                          src={orders.user.image}
                          width={25}
                          height={25}
                          alt={orders.user.name}
                          className="rounded-full"
                        />
                        <p className="text-xs font-medium">
                          {orders.user.name}
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Image
                          src={placeholderUser}
                          width={25}
                          height={25}
                          alt="User not found"
                          className="rounded-full"
                        />
                        <p className="text-xs font-medium">User not found</p>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{product.title}</TableCell>
                  <TableCell>${product.price}</TableCell>
                  <TableCell>{quantity}</TableCell>
                  <TableCell>
                    <Image
                      src={productVariants.variantImages[0].url}
                      alt={product.title}
                      width={48}
                      height={48}
                    />
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
