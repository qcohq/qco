import type { Metadata } from "next";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { LoginForm } from "@/features/user-auth/components/login-form";

export const metadata: Metadata = {
  title: "Вход в аккаунт | Eleganter",
  description: "Войдите в свой аккаунт Eleganter",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LoginForm />
    </Suspense>
  );
}
