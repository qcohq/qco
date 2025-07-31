"use client";

import { EditCustomerClient } from "../components/edit-customer-client";

export function EditCustomerPage({ customerId }: { customerId: string }) {
  return <EditCustomerClient customerId={customerId} />;
}
