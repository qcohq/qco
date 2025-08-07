import type { Metadata } from "next";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { RegisterForm } from "@/features/user-auth/components/register-form";

export const metadata: Metadata = {
  title: "Регистрация | Eleganter",
  description: "Создайте новый аккаунт в Eleganter",
};

export default function RegisterPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <RegisterForm />
    </Suspense>
  );
}
