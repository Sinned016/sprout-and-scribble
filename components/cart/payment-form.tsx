"use client";

import { useCartStore } from "@/lib/client-store";
import {
  AddressElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { Button } from "../ui/button";
import { useState } from "react";
import { createPaymentIntent } from "@/server/actions/create-payment-intent";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createOrder } from "@/server/actions/create-order";

export default function PaymentForm({ totalPrice }: { totalPrice: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const { cart, setCheckoutProgress, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { execute } = useAction(createOrder, {
    onSuccess(data) {
      if (data?.data?.error) {
        toast.error(data.data.error);
      }

      if (data?.data?.success) {
        setIsLoading(false);
        toast.success(data.data.success);
        setCheckoutProgress("confirmation-page");
        clearCart();
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!stripe || !elements) {
      setIsLoading(false);
      return;
    }

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setErrorMessage(submitError.message!);
      setIsLoading(false);
      return;
    }

    const result = await createPaymentIntent({
      amount: totalPrice,
      currency: "usd",
      cart: cart.map((item) => ({
        quantity: item.variant.quantity,
        productID: item.id,
        title: item.name,
        price: item.price,
        image: item.image,
      })),
    });

    console.log(result);

    if (result?.data?.error) {
      setErrorMessage(result.data.error);
      setIsLoading(false);
      return;
    }

    if (result?.data?.success) {
      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret: result.data.success.clientSecretID!,
        redirect: "if_required",
        confirmParams: {
          return_url: "http://localhost:3000/success",
          receipt_email: result.data.success.user as string,
        },
      });

      if (error) {
        setErrorMessage(error.message!);
        setIsLoading(false);
        return;
      } else {
        setIsLoading(false);
        execute({
          status: "pending",
          total: totalPrice,
          products: cart.map((item) => ({
            productID: item.id,
            quantity: item.variant.quantity,
            variantID: item.variant.variantID,
          })),
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <AddressElement options={{ mode: "shipping" }} />
      <Button
        className=" my-4 w-full"
        disabled={!stripe || !elements || isLoading}
      >
        {isLoading ? "Processing..." : "Pay now"}
      </Button>
    </form>
  );
}
