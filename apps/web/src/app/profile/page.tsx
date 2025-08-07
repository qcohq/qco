import { AuthGuard } from "@/features/user-auth/components/auth-guard";
import { ProfileLayout } from "@/features/user-auth/components/profile-layout";
import { ProfileOverview } from "@/features/user-auth/components/profile-overview";

export default function ProfilePage() {
  return (
    <AuthGuard>
      <div className="min-h-screen">
        <main className="container mx-auto px-4 py-8">
          <ProfileLayout>
            <ProfileOverview />
          </ProfileLayout>
        </main></div>
    </AuthGuard>
  );
}
