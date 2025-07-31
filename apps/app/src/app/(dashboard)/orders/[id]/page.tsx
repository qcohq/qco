"use client";
import { useParams } from "next/navigation";
import { OrderDetailsPage } from "@/features/orders/pages/order-details-page";

export default function OrderDetails() {
  const params = useParams();
  const orderId = params.id as string;

  return <OrderDetailsPage orderId={orderId} />;
}
