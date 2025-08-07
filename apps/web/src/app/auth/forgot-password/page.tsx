import type { Metadata } from "next";
import { Suspense } from "react";
import { ForgotPasswordForm } from "@/features/user-auth/components/forgot-password-form";

export const metadata: Metadata = {
  title: "Восстановление пароля | Eleganter",
  description: "Восстановите доступ к вашему аккаунту Eleganter",
};

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <ForgotPasswordForm />
    </Suspense>
  );
}
