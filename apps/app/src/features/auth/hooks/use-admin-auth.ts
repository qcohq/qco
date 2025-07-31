"use client";
import { authClient, useSession } from "@qco/auth/client";
import type {
  AdminLoginFormValues,
  AdminPasswordResetFormValues,
} from "@qco/validators";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useAdminAuth() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  // Вход в систему
  const signIn = async (formData: AdminLoginFormValues) => {
    const { error } = await authClient.signIn.email({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      if (error.status === 403) {
        toast.error("Подтвердите email", {
          description:
            "Пожалуйста, подтвердите свой адрес электронной почты перед входом.",
        });
      } else {
        toast.error("Ошибка входа", {
          description:
            error.message ||
            "Неверный email или пароль. Пожалуйста, попробуйте снова.",
        });
      }
      throw error;
    }

    toast.success("Вход выполнен", {
      description: "Добро пожаловать в панель администратора!",
    });
    router.push("/");
  };

  // Запрос сброса пароля
  const requestPasswordReset = async (data: AdminPasswordResetFormValues) => {
    const { error } = await authClient.requestPasswordReset({
      email: data.email,
      redirectTo: "/reset-password",
    });

    if (error) {
      toast.error("Ошибка сброса пароля", {
        description: error.message || "Произошла ошибка при сбросе пароля.",
      });
      throw error;
    }

    toast.success("Инструкции отправлены", {
      description: "Проверьте вашу почту для сброса пароля.",
    });
  };

  // Сброс пароля с токеном
  const resetPassword = async (newPassword: string, token: string) => {
    const { error } = await authClient.resetPassword({
      newPassword,
      token,
    });

    if (error) {
      toast.error("Ошибка сброса пароля", {
        description: error.message || "Произошла ошибка при сбросе пароля.",
      });
      throw error;
    }

    toast.success("Пароль изменен", {
      description: "Ваш пароль успешно изменен.",
    });
    router.push("/auth/login");
  };

  // Выход из системы
  const signOut = async () => {
    const { error } = await authClient.signOut();

    if (error) {
      toast.error("Ошибка выхода", {
        description: error.message || "Произошла ошибка при выходе из системы",
      });
      throw error;
    }

    toast.success("Выход выполнен", {
      description: "Вы успешно вышли из системы",
    });
    router.push("/auth/login");
  };

  return {
    signIn,
    requestPasswordReset,
    resetPassword,
    signOut,
    session,
    isPending,
    isAuthenticated: !!session?.user,
  };
}
