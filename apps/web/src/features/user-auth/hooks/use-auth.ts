"use client";
import type {
  LoginFormValues,
  NewPasswordFormValues,
  PasswordResetFormValues,
  RegisterFormValues,
} from "@qco/web-validators";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@qco/web-auth/client";
import { useSession } from "./use-session";

export function useAuth() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { session, sessionLoading: isSessionLoading } = useSession();

  // Вход в систему
  const signIn = async (
    data: LoginFormValues,
    options?: { isAfterRegistration?: boolean }
  ): Promise<{ success: boolean; error?: string }> => {
    return new Promise((resolve) => {
      authClient.signIn.email(
        {
          email: data.email,
          password: data.password,
          callbackURL: "/profile",
          rememberMe: false,
        },
        {
          onSuccess: () => {
            if (options?.isAfterRegistration) {
              toast.success("Регистрация и вход выполнены", {
                description: "Добро пожаловать в Eleganter! Не забудьте подтвердить ваш email.",
              });
            } else {
              toast.success("Вход выполнен", {
                description: "Добро пожаловать в Eleganter!",
              });
            }

            // Проверяем, есть ли параметр redirect
            const redirectTo = searchParams.get("redirect");
            if (redirectTo) {
              router.push(redirectTo);
            } else {
              router.push("/profile");
            }
            resolve({ success: true });
          },
          onError: (ctx) => {
            let errorMessage =
              "Неверный email или пароль. Пожалуйста, проверьте введенные данные и попробуйте снова.";

            // Обработка различных типов ошибок
            if (ctx.error.status === 401) {
              errorMessage =
                "Неверный email или пароль. Пожалуйста, проверьте введенные данные и попробуйте снова.";
            } else if (ctx.error.status === 429) {
              errorMessage =
                "Слишком много попыток входа. Пожалуйста, подождите несколько минут и попробуйте снова.";
            } else if (ctx.error.status === 500) {
              errorMessage =
                "Внутренняя ошибка сервера. Пожалуйста, попробуйте позже или обратитесь в службу поддержки.";
            } else if (ctx.error.status === 503) {
              errorMessage =
                "Сервис временно недоступен. Пожалуйста, попробуйте позже.";
            } else if (ctx.error.message) {
              errorMessage = ctx.error.message;
            }

            resolve({ success: false, error: errorMessage });
          },
        },
      );
    });
  };

  // Регистрация
  const signUp = async (
    data: RegisterFormValues,
  ): Promise<{ success: boolean; error?: string }> => {
    return new Promise((resolve) => {
      const fullName = data.lastName
        ? `${data.firstName} ${data.lastName}`
        : data.firstName;

      authClient.signUp.email(
        {
          email: data.email,
          password: data.password,
          name: fullName,
          callbackURL: "/auth/email-verified",
        },
        {
          onSuccess: () => {
            // Не показываем toast и не перенаправляем - это будет сделано в форме регистрации
            resolve({ success: true });
          },
          onError: (ctx) => {
            let errorMessage = "Произошла ошибка при регистрации.";

            // Обработка различных типов ошибок
            if (ctx.error.status === 409) {
              errorMessage =
                "Пользователь с таким email уже существует. Попробуйте войти в систему или используйте другой email.";
            } else if (ctx.error.status === 400) {
              if (ctx.error.message?.includes("email")) {
                errorMessage =
                  "Некорректный email адрес. Пожалуйста, проверьте правильность написания.";
              } else if (ctx.error.message?.includes("password")) {
                errorMessage =
                  "Пароль не соответствует требованиям безопасности. Пароль должен содержать минимум 8 символов, включая буквы и цифры.";
              } else if (ctx.error.message?.includes("name")) {
                errorMessage =
                  "Имя должно содержать минимум 2 символа и не превышать 50 символов.";
              } else {
                errorMessage = "Проверьте правильность введенных данных.";
              }
            } else if (ctx.error.status === 422) {
              // Проверяем, связана ли ошибка с существующим email
              if (
                ctx.error.message?.toLowerCase().includes("existing") ||
                ctx.error.message?.toLowerCase().includes("already exists") ||
                ctx.error.message?.toLowerCase().includes("duplicate") ||
                ctx.error.message?.toLowerCase().includes("user already exists")
              ) {
                errorMessage =
                  "Пользователь с таким email уже существует. Попробуйте войти в систему или используйте другой email.";
              } else {
                errorMessage =
                  "Данные не прошли валидацию. Пожалуйста, проверьте правильность введенной информации.";
              }
            } else if (ctx.error.status === 429) {
              errorMessage =
                "Слишком много попыток регистрации. Пожалуйста, подождите несколько минут и попробуйте снова.";
            } else if (ctx.error.status === 500) {
              errorMessage =
                "Внутренняя ошибка сервера. Пожалуйста, попробуйте позже или обратитесь в службу поддержки.";
            } else if (ctx.error.status === 503) {
              errorMessage =
                "Сервис временно недоступен. Пожалуйста, попробуйте позже.";
            } else if (ctx.error.message) {
              // Дополнительная проверка на различные варианты ошибки существующего пользователя
              const errorMsgLower = ctx.error.message.toLowerCase();
              if (
                errorMsgLower.includes("user already exists") ||
                errorMsgLower.includes("email already exists") ||
                errorMsgLower.includes("account already exists") ||
                errorMsgLower.includes("пользователь уже существует") ||
                errorMsgLower.includes("email уже существует") ||
                errorMsgLower.includes("аккаунт уже существует")
              ) {
                errorMessage =
                  "Пользователь с таким email уже существует. Попробуйте войти в систему или используйте другой email.";
              } else {
                errorMessage = ctx.error.message;
              }
            }

            resolve({ success: false, error: errorMessage });
          },
        },
      );
    });
  };

  // Сброс пароля
  const resetPassword = async (
    data: PasswordResetFormValues,
  ): Promise<{ success: boolean; error?: string }> => {
    return new Promise((resolve) => {
      authClient.requestPasswordReset(
        {
          email: data.email,
          redirectTo: "/auth/reset-password",
        },
        {
          onSuccess: () => {
            toast.success("Инструкции отправлены", {
              description: "Проверьте вашу почту для сброса пароля",
            });
            resolve({ success: true });
          },
          onError: (ctx: any) => {
            let errorMessage =
              "Не удалось отправить инструкции по сбросу пароля.";

            // Обработка различных типов ошибок
            if (ctx.error.status === 404) {
              errorMessage =
                "Пользователь с таким email не найден. Проверьте правильность email адреса.";
            } else if (ctx.error.status === 400) {
              if (ctx.error.message?.includes("email")) {
                errorMessage =
                  "Некорректный email адрес. Пожалуйста, проверьте правильность написания.";
              } else {
                errorMessage = "Проверьте правильность введенных данных.";
              }
            } else if (ctx.error.status === 429) {
              errorMessage =
                "Слишком много попыток сброса пароля. Пожалуйста, подождите несколько минут и попробуйте снова.";
            } else if (ctx.error.status === 500) {
              errorMessage =
                "Внутренняя ошибка сервера. Пожалуйста, попробуйте позже или обратитесь в службу поддержки.";
            } else if (ctx.error.status === 503) {
              errorMessage =
                "Сервис временно недоступен. Пожалуйста, попробуйте позже.";
            } else if (ctx.error.message) {
              errorMessage = ctx.error.message;
            }

            resolve({ success: false, error: errorMessage });
          },
        },
      );
    });
  };

  // Сброс пароля с токеном
  const resetPasswordWithToken = async (
    token: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    return new Promise((resolve) => {
      authClient.resetPassword(
        {
          token,
          newPassword: password,
        },
        {
          onSuccess: () => {
            toast.success("Пароль обновлен", {
              description: "Ваш пароль успешно изменен",
            });
            resolve({ success: true });
          },
          onError: (ctx: any) => {
            let errorMessage = "Не удалось обновить пароль.";

            // Обработка различных типов ошибок
            if (ctx.error.status === 400) {
              if (ctx.error.message?.includes("token")) {
                errorMessage =
                  "Недействительный или истекший токен. Запросите новую ссылку для сброса пароля.";
              } else if (ctx.error.message?.includes("password")) {
                errorMessage =
                  "Пароль не соответствует требованиям безопасности. Пароль должен содержать минимум 8 символов, включая буквы и цифры.";
              } else {
                errorMessage = "Проверьте правильность введенных данных.";
              }
            } else if (ctx.error.status === 404) {
              errorMessage =
                "Токен не найден или уже использован. Запросите новую ссылку для сброса пароля.";
            } else if (ctx.error.status === 410) {
              errorMessage =
                "Ссылка для сброса пароля истекла. Запросите новую ссылку.";
            } else if (ctx.error.status === 429) {
              errorMessage =
                "Слишком много попыток сброса пароля. Пожалуйста, подождите несколько минут и попробуйте снова.";
            } else if (ctx.error.status === 500) {
              errorMessage =
                "Внутренняя ошибка сервера. Пожалуйста, попробуйте позже или обратитесь в службу поддержки.";
            } else if (ctx.error.status === 503) {
              errorMessage =
                "Сервис временно недоступен. Пожалуйста, попробуйте позже.";
            } else if (ctx.error.message) {
              errorMessage = ctx.error.message;
            }

            resolve({ success: false, error: errorMessage });
          },
        },
      );
    });
  };

  // Выход из системы
  const signOut = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Выход выполнен", {
              description: "Вы успешно вышли из системы.",
            });
            router.push("/auth/login");
          },
          onError: () => {
            toast.error("Ошибка при выходе", {
              description: "Произошла ошибка при выходе из системы.",
            });
          },
        },
      });
    } catch (error) {
      toast.error("Ошибка при выходе", {
        description: "Произошла ошибка при выходе из системы.",
      });
    }
  };

  // Запрос повторной отправки письма с подтверждением email
  const requestEmailVerification = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        let errorMessage = "Не удалось отправить письмо с подтверждением.";

        if (response.status === 404) {
          errorMessage = "Пользователь с таким email не найден. Убедитесь, что вы используете правильный email адрес.";
        } else if (response.status === 400) {
          if (data.error?.toLowerCase().includes("already verified")) {
            errorMessage = "Ваш email уже подтвержден.";
          } else if (data.error?.toLowerCase().includes("email is required")) {
            errorMessage = "Email адрес обязателен.";
          } else {
            errorMessage = "Некорректный запрос. Проверьте email адрес.";
          }
        } else if (response.status === 409) {
          errorMessage = "Письмо с подтверждением уже отправлено. Проверьте вашу почту или подождите перед повторной отправкой.";
        } else if (response.status === 429) {
          errorMessage = "Слишком много запросов. Подождите несколько минут и попробуйте снова.";
        } else if (response.status === 500) {
          errorMessage = "Внутренняя ошибка сервера. Попробуйте позже или обратитесь в службу поддержки.";
        } else if (data.error) {
          errorMessage = data.error;
        }

        toast.error("Ошибка отправки письма", {
          description: errorMessage,
        });
        return { success: false, error: errorMessage };
      }

      toast.success("Письмо отправлено", {
        description: "Проверьте вашу почту для подтверждения email",
      });
      return { success: true };
    } catch (error) {
      console.error("Email verification error:", error);
      const errorMessage = "Произошла ошибка при отправке письма. Попробуйте позже.";

      toast.error("Ошибка отправки письма", {
        description: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

  return {
    session,
    isSessionLoading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    resetPasswordWithToken,
    requestEmailVerification,
    isAuthenticated: !!session?.user,
  };
}
