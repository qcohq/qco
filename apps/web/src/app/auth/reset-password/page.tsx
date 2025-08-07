import { Suspense } from "react";
import { ResetPasswordForm } from "@/features/user-auth/components/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
