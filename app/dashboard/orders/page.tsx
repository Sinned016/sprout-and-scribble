import { db } from "@/server";
import { auth } from "@/server/auth";
import { orders } from "@/server/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistance, subMinutes } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";

export default async function Orders() {
  const user = await auth();

  if (!user) {
    redirect("/login");
  }

  const userOrders = await db.query.orders.findMany({
    where: eq(orders.userID, user.user.id),
    with: {
      orderProduct: {
        with: {
          product: true,
          productVariants: { with: { variantImages: true } },
          orders: true,
        },
      },
    },
  });

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Your Orders</CardTitle>
        <CardDescription>Check the status of your orders</CardDescription>
      </CardHeader>

      <CardContent>
        <Table>
          <TableCaption>A list of your recent orders</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="">Order Number</TableHead>
              <TableHead className="">Total</TableHead>
              <TableHead className="">Status</TableHead>
              <TableHead className="">Created</TableHead>
              <TableHead className="">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>${order.total / 100}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      order.status === "succeeded"
                        ? "bg-green-700"
                        : "bg-secondary-foreground"
                    }
                  >
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs font-medium">
                  {formatDistance(subMinutes(order.created!, 0), new Date(), {
                    addSuffix: true,
                  })}
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant={"ghost"}>
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <DialogTrigger>
                            <Button className="w-full" variant={"ghost"}>
                              View Details
                            </Button>
                          </DialogTrigger>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Order Details #{order.id}</DialogTitle>
                      </DialogHeader>
                      <Card className="overflow-auto p-2 flex flex-col gap-4">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="">Image</TableHead>
                              <TableHead className="">Price</TableHead>
                              <TableHead className="">Product</TableHead>
                              <TableHead className="">Color</TableHead>
                              <TableHead className="">Quantity</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {order.orderProduct.map((product) => (
                              <TableRow key={product.productID}>
                                <TableCell>
                                  <Image
                                    src={
                                      product.productVariants.variantImages[0]
                                        .url
                                    }
                                    alt={product.product.title}
                                    width={48}
                                    height={48}
                                  />
                                </TableCell>

                                <TableCell>${product.product.price}</TableCell>

                                <TableCell>{product.product.title}</TableCell>

                                <TableCell>
                                  <div
                                    style={{
                                      background: product.productVariants.color,
                                    }}
                                    className="w-4 h-4 rounded-full"
                                  ></div>
                                </TableCell>

                                <TableCell className="text-medium">
                                  {product.quantity}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Card>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
