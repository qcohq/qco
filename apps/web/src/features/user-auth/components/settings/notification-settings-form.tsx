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
} from "@qco/ui/components/form";
import { Separator } from "@qco/ui/components/separator";
import { Switch } from "@qco/ui/components/switch";
import { updateNotificationSettingsInput } from "@qco/web-validators";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  Loader2,
  Mail,
  Megaphone,
  Newspaper,
  Save,
  ShoppingBag,
  Target,
} from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { useTRPC } from "@/trpc/react";

type NotificationSettingsFormValues = {
  emailNotifications: boolean;
  pushNotifications: boolean;
  orderUpdates: boolean;
  promotions: boolean;
  newsletter: boolean;
  marketing: boolean;
};

type FormData = {
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  orderUpdates?: boolean;
  promotions?: boolean;
  newsletter?: boolean;
  marketing?: boolean;
};

export function NotificationSettingsForm() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery(
    trpc.profile.getNotificationSettings.queryOptions({}),
  );

  const { mutate, isPending, error } = useMutation(
    trpc.profile.updateNotificationSettings.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.profile.getNotificationSettings.queryFilter(),
        );
      },
    }),
  );

  const form = useForm<FormData>({
    resolver: zodResolver(updateNotificationSettingsInput),
    defaultValues: {
      emailNotifications: true,
      pushNotifications: true,
      orderUpdates: true,
      promotions: true,
      newsletter: false,
      marketing: false,
    },
  });

  // Обновляем значения формы когда данные загружены
  React.useEffect(() => {
    if (settings) {
      form.reset(settings);
    }
  }, [settings, form]);

  const onSubmit = (data: FormData) => {
    mutate(data as NotificationSettingsFormValues);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Настройки уведомлений</CardTitle>
          <CardDescription>
            Управляйте уведомлениями и рассылками
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Загрузка настроек...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Настройки уведомлений</CardTitle>
        <CardDescription>Управляйте уведомлениями и рассылками</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error.message}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <h3 className="text-lg font-medium">Email уведомления</h3>
              </div>

              <FormField
                control={form.control}
                name="emailNotifications"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Общие email уведомления
                      </FormLabel>
                      <FormDescription>
                        Получать уведомления на email
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="orderUpdates"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Обновления заказов
                      </FormLabel>
                      <FormDescription>
                        Уведомления о статусе заказов
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Bell className="h-4 w-4" />
                <h3 className="text-lg font-medium">Push уведомления</h3>
              </div>

              <FormField
                control={form.control}
                name="pushNotifications"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Push уведомления
                      </FormLabel>
                      <FormDescription>
                        Получать уведомления в браузере
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Megaphone className="h-4 w-4" />
                <h3 className="text-lg font-medium">Маркетинг и рассылки</h3>
              </div>

              <FormField
                control={form.control}
                name="promotions"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Акции и скидки
                      </FormLabel>
                      <FormDescription>
                        Уведомления о специальных предложениях
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="newsletter"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Новостная рассылка
                      </FormLabel>
                      <FormDescription>
                        Новости о новых товарах и обновлениях
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="marketing"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Маркетинговые материалы
                      </FormLabel>
                      <FormDescription>
                        Персонализированные предложения и рекомендации
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Сохранение...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Сохранить настройки
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
