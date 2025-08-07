import { AuthGuard } from "@/features/user-auth/components/auth-guard";
import OrdersHistory from "@/features/user-auth/components/orders-history";
import { ProfileLayout } from "@/features/user-auth/components/profile-layout";

export default function OrdersPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen">
        <main className="container mx-auto px-4 py-8">
          <ProfileLayout>
            <OrdersHistory />
          </ProfileLayout>
        </main></div>
    </AuthGuard>
  );
}
