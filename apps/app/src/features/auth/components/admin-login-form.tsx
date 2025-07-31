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
import { type AdminLoginFormValues, adminLoginSchema } from "@qco/validators";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { paths } from "~/routes/paths";
import { useAdminAuth } from "../hooks/use-admin-auth";
import { PasswordInput } from "./password-input";

export function AdminLoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn } = useAdminAuth();
  const router = useRouter();

  const form = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: AdminLoginFormValues) {
    setIsLoading(true);
    setError(null);

    try {
      await signIn(values);
      router.push(paths.dashboard.root);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Произошла ошибка при входе",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight">
          Вход в панель администратора
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Введите ваши данные для входа в систему
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

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Пароль</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Введите пароль"
                      disabled={isLoading}
                      {...field}
                    />
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
                  Вход...
                </>
              ) : (
                "Войти"
              )}
            </Button>
          </form>
        </Form>

        <div className="text-center">
          <Button asChild variant="link" className="text-sm">
            <Link href="/reset-password">Забыли пароль?</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
