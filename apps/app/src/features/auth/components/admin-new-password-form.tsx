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
  type AdminNewPasswordFormValues,
  adminNewPasswordSchema,
} from "@qco/validators";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAdminAuth } from "../hooks/use-admin-auth";

interface AdminNewPasswordFormProps {
  token: string;
}

export function AdminNewPasswordForm({ token }: AdminNewPasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { resetPassword } = useAdminAuth();

  const form = useForm<AdminNewPasswordFormValues>({
    resolver: zodResolver(adminNewPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: AdminNewPasswordFormValues) {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      await resetPassword(values.password, token);
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
            Пароль изменен
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Ваш пароль успешно изменен
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              Ваш пароль был успешно изменен. Теперь вы можете войти в систему с
              новым паролем.
            </AlertDescription>
          </Alert>

          <Button asChild className="w-full" variant="outline">
            <Link href="/auth/login">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Перейти к входу
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
          Установить новый пароль
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Введите новый пароль для вашей учетной записи
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Новый пароль</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        disabled={isLoading}
                        className="pr-10"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="sr-only">
                          {showPassword ? "Скрыть пароль" : "Показать пароль"}
                        </span>
                      </Button>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Пароль должен содержать минимум 8 символов, включая буквы и
                    цифры
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
                  <FormLabel>Подтвердите пароль</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        disabled={isLoading}
                        className="pr-10"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        disabled={isLoading}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="sr-only">
                          {showConfirmPassword
                            ? "Скрыть пароль"
                            : "Показать пароль"}
                        </span>
                      </Button>
                    </div>
                  </FormControl>
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
                  Сохранение...
                </>
              ) : (
                "Сохранить новый пароль"
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
