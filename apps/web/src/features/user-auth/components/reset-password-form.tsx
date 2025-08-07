"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription } from "@qco/ui/components/alert";
import { Button } from "@qco/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@qco/ui/components/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@qco/ui/components/form";
import { Input } from "@qco/ui/components/input";
import {
  type NewPasswordFormValues,
  newPasswordSchema,
} from "@qco/web-validators";
import {
  ArrowLeft,
  CheckCircle,
  Eye,
  EyeOff,
  Loader2,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/use-auth";

export function ResetPasswordForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { resetPasswordWithToken } = useAuth();

  const form = useForm<NewPasswordFormValues>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: NewPasswordFormValues) => {
    if (!token) {
      setError("Отсутствует токен для сброса пароля. Запросите новую ссылку.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const result = await resetPasswordWithToken(token, data.password);

    if (result.success) {
      setIsSubmitted(true);
    } else {
      setError(
        result.error ||
          "Произошла ошибка при сбросе пароля. Попробуйте еще раз.",
      );
    }

    setIsLoading(false);
  };

  if (!token) {
    return (
      <div className="min-h-screen-content flex items-center justify-center bg-background p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md mx-auto">
          <Card className="w-full">
            <CardHeader className="space-y-1 px-4 sm:px-6 pt-6 pb-4 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                <Lock className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <CardTitle className="text-xl sm:text-2xl font-semibold text-red-600 dark:text-red-400">
                Недействительная ссылка
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Ссылка для сброса пароля недействительна или истекла
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-6">
              <div className="space-y-6">
                <div className="text-center space-y-4">
                  <div className="text-xs sm:text-sm text-muted-foreground space-y-2">
                    <p>
                      Возможно, ссылка устарела или была уже использована.
                      Запросите новую ссылку для сброса пароля.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button
                    className="w-full h-10 sm:h-12 text-sm sm:text-base"
                    asChild
                  >
                    <Link href="/auth/forgot-password">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Запросить новую ссылку
                    </Link>
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full h-10 text-sm"
                    asChild
                  >
                    <Link href="/auth/login">Вернуться к входу</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen-content flex items-center justify-center bg-background p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md mx-auto">
          <Card className="w-full">
            <CardHeader className="space-y-1 px-4 sm:px-6 pt-6 pb-4 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-xl sm:text-2xl font-semibold text-green-600 dark:text-green-400">
                Пароль изменен!
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Ваш пароль успешно обновлен
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-6">
              <div className="space-y-6">
                <div className="text-center space-y-4">
                  <div className="text-xs sm:text-sm text-muted-foreground space-y-2">
                    <p>
                      Отлично! Ваш пароль был успешно изменен. Теперь вы можете
                      войти в систему, используя новый пароль.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button
                    className="w-full h-10 sm:h-12 text-sm sm:text-base"
                    asChild
                  >
                    <Link href="/auth/login">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Войти в систему
                    </Link>
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full h-10 text-sm"
                    asChild
                  >
                    <Link href="/">Перейти на главную</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen-content items-center justify-center bg-white px-2 py-12">
      <Card className="w-full max-w-md shadow-lg border border-slate-200 rounded-2xl bg-white">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold">Сброс пароля</CardTitle>
          <CardDescription>Придумайте новый пароль для входа</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription className="text-sm">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Новый пароль <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Введите новый пароль"
                          className="h-10 sm:h-12 text-sm sm:text-base pr-10"
                          disabled={isLoading}
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Подтвердите пароль <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Повторите новый пароль"
                          className="h-10 sm:h-12 text-sm sm:text-base pr-10"
                          disabled={isLoading}
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-10 sm:h-12 text-sm sm:text-base"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Обновление...
                  </>
                ) : (
                  "Обновить пароль"
                )}
              </Button>

              <div className="text-center space-y-4">
                <div className="text-xs sm:text-sm text-muted-foreground">
                  Вспомнили пароль?{" "}
                  <Button
                    variant="link"
                    className="p-0 h-auto text-xs sm:text-sm"
                    asChild
                  >
                    <Link href="/auth/login">Войти в систему</Link>
                  </Button>
                </div>

                <div className="text-xs sm:text-sm text-muted-foreground">
                  Нужна помощь?{" "}
                  <Button
                    variant="link"
                    className="p-0 h-auto text-xs sm:text-sm"
                    asChild
                  >
                    <Link href="/help">Обратитесь в поддержку</Link>
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
