import { Suspense } from "react";
import { AdminsPage } from "~/features/admins/pages/AdminsPage";
import { AdminsSkeleton } from "~/features/admins/components/admins-skeleton";

export const metadata = {
  title: "Администраторы",
  description: "Управление администраторами системы",
};

export default function AdminsPageRoute() {
  return (
    <Suspense fallback={<AdminsSkeleton />}>
      <AdminsPage />
    </Suspense>
  );
}
