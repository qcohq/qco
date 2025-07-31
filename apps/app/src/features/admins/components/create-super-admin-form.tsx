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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff, Loader2, Shield, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createSuperAdminSchema } from "@qco/validators";
import type { z } from "zod";
import { useTRPC } from "~/trpc/react";

type CreateSuperAdminFormData = z.infer<typeof createSuperAdminSchema>;

export function CreateSuperAdminForm() {
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<CreateSuperAdminFormData>({
    resolver: zodResolver(createSuperAdminSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const createSuperAdminMutationOptions =
    trpc.admins.createSuperAdmin.mutationOptions({
      onSuccess: (_data) => {
        // Показываем успешное уведомление
        toast.success(
          "Первый суперадминистратор успешно создан! Теперь вы можете войти в систему.",
        );
        queryClient.invalidateQueries({
          queryKey: trpc.admins.checkEmpty.queryKey(),
        }); // Перенаправляем на страницу логина
        router.push("/login");
      },
      onError: (error) => {
        setError(error.message || "Не удалось создать суперадмина");
        toast.error(error.message || "Не удалось создать суперадмина");
      },
    });

  const { mutate, isPending } = useMutation(createSuperAdminMutationOptions);

  function onSubmit(values: CreateSuperAdminFormData) {
    setError(null);

    // Создаем суперадмина через наш tRPC роут
    mutate({
      name: values.name,
      email: values.email,
      password: values.password,
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-xl">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center space-x-2">
            <Shield className="h-8 w-8 text-primary" />
            <CardTitle className="text-2xl font-bold">
              Создание суперадмина
            </CardTitle>
          </div>
          <CardDescription className="text-center">
            Создайте первого администратора системы
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Имя</FormLabel>
                    <FormControl>
                      <Input placeholder="Введите имя" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Этот email будет использоваться для входа в систему
                    </FormDescription>
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
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Минимум 8 символов"
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
                    <FormDescription>
                      Пароль должен содержать минимум 8 символов
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Создание...
                  </>
                ) : (
                  <>
                    <User className="mr-2 h-4 w-4" />
                    Создать суперадмина
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
