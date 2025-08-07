import { AuthGuard } from "@/features/user-auth/components/auth-guard";
import { ProfileLayout } from "@/features/user-auth/components/profile-layout";
import { SettingsPage } from "@/features/user-auth/components/settings/settings-page";

export default function SettingsPageRoute() {
  return (
    <AuthGuard>
      <div className="min-h-screen">
        <main className="container mx-auto px-4 py-8">
          <ProfileLayout>
            <SettingsPage />
          </ProfileLayout>
        </main></div>
    </AuthGuard>
  );
}
