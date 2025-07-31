import { use } from "react";
import { EditCustomerPage } from "@/features/customers/pages/edit-customer-page";

export default function CustomerEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <EditCustomerPage customerId={id} />;
}
