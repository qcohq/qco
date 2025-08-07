import { AddressesManagement } from "@/features/user-auth/components/addresses-management";
import { AuthGuard } from "@/features/user-auth/components/auth-guard";
import { ProfileLayout } from "@/features/user-auth/components/profile-layout";

export default function AddressesPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen">
        <main className="container mx-auto px-4 py-8">
          <ProfileLayout>
            <AddressesManagement />
          </ProfileLayout>
        </main></div>
    </AuthGuard>
  );
}
