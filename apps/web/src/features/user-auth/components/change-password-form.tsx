"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
  type ChangePasswordFormValues,
  changePasswordSchema,
} from "@qco/web-validators";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useTRPC } from "../../../trpc/react";
import { PasswordInput } from "./password-input";

export function ChangePasswordForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const trpc = useTRPC();

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const changePasswordMutationOptions =
    trpc.account.changePassword.mutationOptions({
      onSuccess: (data: { success: boolean; message: string }) => {
        toast.success("Пароль изменен", {
          description: data.message,
        });
        setIsSuccess(true);
        form.reset();
      },
      onError: (error: { message: string }) => {
        toast.error("Ошибка", {
          description: error.message || "Не удалось изменить пароль",
        });
      },
    });

  const { mutate, isPending } = useMutation(changePasswordMutationOptions);

  function onSubmit(values: ChangePasswordFormValues) {
    mutate(values);
  }

  if (isSuccess) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-xl font-semibold">
            Пароль успешно изменен
          </CardTitle>
          <CardDescription>
            Ваш пароль был обновлен. Используйте новый пароль при следующем
            входе.
          </CardDescription>
        </CardHeader>

        <CardContent className="text-center">
          <Button onClick={() => setIsSuccess(false)} className="w-full">
            Изменить еще раз
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-2">
        <CardTitle className="text-xl font-semibold">Смена пароля</CardTitle>
        <CardDescription>
          Введите текущий пароль и новый пароль для изменения
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
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
                      disabled={isPending}
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
                      placeholder="Минимум 8 символов"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Новый пароль должен содержать минимум 8 символов, буквы и
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
                  <FormLabel>Подтвердите новый пароль</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Повторите новый пароль"
                      disabled={isPending}
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
              disabled={isPending}
              size="lg"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Изменение...
                </>
              ) : (
                "Изменить пароль"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
