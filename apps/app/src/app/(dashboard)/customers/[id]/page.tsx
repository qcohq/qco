import { use } from "react";
import { CustomerDetailPage } from "@/features/customers/pages/customer-detail-page";

export default function CustomerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);

  return <CustomerDetailPage customerId={resolvedParams.id} />;
}
