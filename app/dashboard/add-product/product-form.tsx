"use client";

import { zProductSchema, ProductSchema } from "@/types/product-schema";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DollarSign } from "lucide-react";
import Tiptap from "./tiptap";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { createProduct } from "@/server/actions/create-product";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { getProduct } from "@/server/actions/get-product";
import { useEffect } from "react";

export default function ProductForm() {
  const form = useForm<zProductSchema>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
    },
    mode: "onChange",
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const editMode = searchParams.get("id");

  useEffect(() => {
    if (editMode) {
      checkProduct(parseInt(editMode));
    }
  }, []);

  const checkProduct = async (id: number) => {
    if (id) {
      const data = await getProduct(id);

      if (data.error) {
        toast.error(data.error);
        router.push("/dashboard/products");
        return;
      }

      if (data.success) {
        form.setValue("title", data.success.title);
        form.setValue("description", data.success.description);
        form.setValue("price", data.success.price);
        form.setValue("id", id);
      }
    }
  };

  let loadingToastId: string | number;
  const { execute, status } = useAction(createProduct, {
    onSuccess: (data) => {
      if (data.data?.success) {
        router.push("/dashboard/products");
        toast.success(data.data?.success);

        if (loadingToastId) {
          toast.dismiss(loadingToastId);
        }
      }
      if (data.data?.error) {
        toast.error(data.data?.error);

        if (loadingToastId) {
          toast.dismiss(loadingToastId);
        }
      }
    },
    onExecute: () => {
      if (editMode) {
        loadingToastId = toast.loading("Editing Product...");
      } else {
        loadingToastId = toast.loading("Creating Product...");
      }
    },
  });

  async function onSubmit(values: zProductSchema) {
    execute(values);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editMode ? "Edit Product" : "Create Product"}</CardTitle>
        <CardDescription>
          {editMode
            ? "Make changes to existing product"
            : "Add a brand new product"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Product Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Saekdong Stripe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Tiptap val={field.value} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Product Price</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <DollarSign
                        className="p-2 bg-muted rounded-md"
                        size={36}
                      />
                      <Input
                        {...field}
                        type="number"
                        placeholder="Your price in USD"
                        step={0.1}
                        min={0}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              className="w-full"
              disabled={
                status === "executing" ||
                !form.formState.isValid ||
                !form.formState.isDirty
              }
              type="submit"
            >
              {editMode ? "Save Changes" : "Create Product"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
