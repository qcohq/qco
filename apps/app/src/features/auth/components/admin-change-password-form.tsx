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
import {
  type AdminChangePasswordFormValues,
  adminChangePasswordSchema,
} from "@qco/validators";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { PasswordInput } from "./password-input";

export function AdminChangePasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<AdminChangePasswordFormValues>({
    resolver: zodResolver(adminChangePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(_values: AdminChangePasswordFormValues) {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      // Здесь будет вызов API для смены пароля
      // await changePassword(values)
      setIsSuccess(true);
      form.reset();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Произошла ошибка при смене пароля";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-bold tracking-tight">
          Смена пароля
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Введите текущий пароль и новый пароль для смены
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isSuccess && (
          <Alert>
            <AlertDescription>Пароль успешно изменен!</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Текущий пароль</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Введите текущий пароль"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Введите ваш текущий пароль для подтверждения
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Новый пароль</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Введите новый пароль"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Новый пароль должен содержать минимум 8 символов
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Подтвердите новый пароль</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Повторите новый пароль"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Повторите новый пароль для подтверждения
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
                  Смена пароля...
                </>
              ) : (
                "Сменить пароль"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
