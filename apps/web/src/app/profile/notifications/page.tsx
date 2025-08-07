import { AuthGuard } from "@/features/user-auth/components/auth-guard";
import { ProfileLayout } from "@/features/user-auth/components/profile-layout";

export default function NotificationsPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen">
        <main className="container mx-auto px-4 py-8">
          <ProfileLayout>
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Уведомления</h2>
                <p className="text-muted-foreground">Настройки уведомлений</p>
              </div>
              <div className="text-center py-8">
                <p className="text-gray-500">
                  Компонент управления уведомлениями будет добавлен позже
                </p>
              </div>
            </div>
          </ProfileLayout>
        </main></div>
    </AuthGuard>
  );
}
