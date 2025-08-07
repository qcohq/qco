"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@qco/ui/components/card";
import { Separator } from "@qco/ui/components/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@qco/ui/components/tabs";
import { Settings, Shield, Truck, User } from "lucide-react";
import React from "react";
import { DeliverySettingsList } from "@/features/delivery-settings/components/delivery-settings-list";
import { AccountSettingsForm } from "./account-settings-form";
import { ChangePasswordForm } from "./change-password-form";

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Настройки</h2>
        <p className="text-muted-foreground">
          Управляйте настройками вашего аккаунта
        </p>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="account" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Аккаунт
          </TabsTrigger>
          <TabsTrigger value="delivery" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Доставка
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Безопасность
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-6">
          <AccountSettingsForm />
        </TabsContent>

        <TabsContent value="delivery" className="space-y-6">
          <DeliverySettingsList />
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <ChangePasswordForm />

          <Separator />

          <Card>
            <CardHeader>
              <CardTitle>Дополнительная безопасность</CardTitle>
              <CardDescription>
                Дополнительные настройки для защиты вашего аккаунта
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4">
                <h4 className="font-medium mb-2">
                  Двухфакторная аутентификация
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Добавьте дополнительный уровень защиты к вашему аккаунту
                </p>
                <p className="text-sm text-muted-foreground">
                  Функция будет доступна в ближайшее время
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <h4 className="font-medium mb-2">Активные сессии</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Просматривайте и управляйте активными сессиями
                </p>
                <p className="text-sm text-muted-foreground">
                  Функция будет доступна в ближайшее время
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
