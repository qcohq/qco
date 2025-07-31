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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@qco/ui/components/form";
import { Input } from "@qco/ui/components/input";
import {
  type AdminPasswordResetFormValues,
  adminPasswordResetSchema,
} from "@qco/validators";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAdminAuth } from "../hooks/use-admin-auth";

export function AdminResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const { requestPasswordReset } = useAdminAuth();

  const form = useForm<AdminPasswordResetFormValues>({
    resolver: zodResolver(adminPasswordResetSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: AdminPasswordResetFormValues) {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      await requestPasswordReset(values);
      setIsSuccess(true);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Произошла ошибка при сбросе пароля",
      );
    } finally {
      setIsLoading(false);
    }
  }

  if (isSuccess) {
    return (
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight text-green-600">
            Инструкции отправлены
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Проверьте вашу почту для сброса пароля
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              Мы отправили инструкции по сбросу пароля на указанный email адрес.
              Пожалуйста, проверьте вашу почту и следуйте инструкциям.
            </AlertDescription>
          </Alert>

          <Button asChild className="w-full" variant="outline">
            <Link href="/auth/login">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Вернуться к входу
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight">
          Сброс пароля
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Введите ваш email для получения инструкций по сбросу пароля
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="admin@example.com"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Введите адрес электронной почты, связанный с вашей учетной
                    записью
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
              size="lg"
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
          </form>
        </Form>

        <div className="text-center">
          <Button asChild variant="link" className="text-sm">
            <Link href="/auth/login">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Вернуться к входу
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
