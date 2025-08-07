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
  type PasswordResetFormValues,
  passwordResetSchema,
} from "@qco/web-validators";
import { ArrowLeft, CheckCircle, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/use-auth";

export function ForgotPasswordForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { resetPassword } = useAuth();

  const form = useForm<PasswordResetFormValues>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: PasswordResetFormValues) => {
    setIsLoading(true);
    setError(null);

    const result = await resetPassword(data);

    if (result.success) {
      setIsSubmitted(true);
    } else {
      setError(
        result.error ||
          "Произошла ошибка при отправке инструкций. Попробуйте еще раз.",
      );
    }

    setIsLoading(false);
  };

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
                Проверьте вашу почту
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Мы отправили инструкции по сбросу пароля на ваш email
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-6">
              <div className="space-y-6">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>Инструкции отправлены</span>
                  </div>

                  <div className="text-xs sm:text-sm text-muted-foreground space-y-2">
                    <p>
                      Если вы не получили письмо, проверьте папку "Спам" или
                      убедитесь, что указали правильный email адрес.
                    </p>
                    <p>Письмо может прийти в течение нескольких минут.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button
                    variant="outline"
                    className="w-full h-10 sm:h-12 text-sm sm:text-base"
                    onClick={() => setIsSubmitted(false)}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Отправить еще раз
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full h-10 text-sm"
                    asChild
                  >
                    <Link href="/auth/login">Вернуться к входу</Link>
                  </Button>
                </div>

                <div className="text-center">
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
          <CardTitle className="text-2xl font-bold">
            Восстановление пароля
          </CardTitle>
          <CardDescription>
            Введите вашу почту для сброса пароля
          </CardDescription>
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Email <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="example@email.com"
                        className="h-10 sm:h-12 text-sm sm:text-base"
                        disabled={isLoading}
                        {...field}
                      />
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
                    Отправка...
                  </>
                ) : (
                  "Отправить инструкции"
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
