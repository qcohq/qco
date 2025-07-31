"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@qco/ui/components/alert-dialog";
import { Badge } from "@qco/ui/components/badge";
import { Button } from "@qco/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@qco/ui/components/card";
// biome-ignore lint/correctness/noUnusedImports: DeliverySettings используется в useState
import type { DeliverySettings } from "@qco/validators";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, Mail, MapPin, Package, Plus, Trash2, Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useTRPC } from "~/trpc/react";
import { DeliverySettingsForm } from "./delivery-settings-form";

const deliveryTypeIcons = {
  pickup: MapPin,
  courier: Truck,
  post: Mail,
  cdek: Package,
  boxberry: Package,
};

const deliveryTypeLabels = {
  pickup: "Самовывоз",
  courier: "Курьер",
  post: "Почта России",
  cdek: "СДЭК",
  boxberry: "Boxberry",
};

export function DeliverySettingsPage() {
  const [editingSetting, setEditingSetting] = useState<DeliverySettings | null>(
    null,
  );
  const [isCreating, setIsCreating] = useState(false);
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const queryOptions = trpc.deliverySettings.getAll.queryOptions();
  const { data: settings } = useQuery(queryOptions);

  const deleteMutation = useMutation(
    trpc.deliverySettings.delete.mutationOptions({
      onSuccess: () => {
        toast.success("Настройки доставки удалены");
        queryClient.invalidateQueries(
          trpc.deliverySettings.getAll.queryFilter(),
        );
      },
      onError: (error: Error) => {
        toast.error(error.message);
      },
    }),
  );

  const handleDelete = (id: string) => {
    deleteMutation.mutate({ id });
  };

  const handleSuccess = () => {
    setIsCreating(false);
    setEditingSetting(null);
    queryClient.invalidateQueries(trpc.deliverySettings.getAll.queryFilter());
  };

  const formatCurrency = (amount: string | null) => {
    if (!amount) return "0 ₽";
    return `${Number.parseFloat(amount).toLocaleString("ru-RU")} ₽`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Настройки доставки</h2>
          <p className="text-muted-foreground">
            Управляйте способами доставки и их параметрами
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Добавить настройки
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Создать настройки доставки</CardTitle>
            <CardDescription>
              Заполните форму для создания новых настроек доставки
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DeliverySettingsForm onSuccess={handleSuccess} />
            <div className="mt-4">
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Отмена
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {editingSetting && (
        <Card>
          <CardHeader>
            <CardTitle>Редактировать настройки доставки</CardTitle>
            <CardDescription>
              Измените параметры выбранных настроек доставки
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DeliverySettingsForm
              initialData={{
                ...editingSetting,
                minOrderAmount: Number.parseFloat(
                  editingSetting.minOrderAmount || "0",
                ),
                maxOrderAmount: editingSetting.maxOrderAmount
                  ? Number.parseFloat(editingSetting.maxOrderAmount)
                  : undefined,
                deliveryCost: Number.parseFloat(
                  editingSetting.deliveryCost || "0",
                ),
                freeDeliveryThreshold: editingSetting.freeDeliveryThreshold
                  ? Number.parseFloat(editingSetting.freeDeliveryThreshold)
                  : undefined,
                weightLimit: editingSetting.weightLimit
                  ? Number.parseFloat(editingSetting.weightLimit)
                  : undefined,
                regions: editingSetting.regions || [],
              }}
              onSuccess={handleSuccess}
            />
            <div className="mt-4">
              <Button variant="outline" onClick={() => setEditingSetting(null)}>
                Отмена
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!isCreating && !editingSetting && (
        <div className="grid gap-4">
          {settings?.map((setting: DeliverySettings) => {
            const IconComponent =
              deliveryTypeIcons[
              setting.deliveryType as keyof typeof deliveryTypeIcons
              ] || Package;

            return (
              <Card key={setting.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <IconComponent className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {setting.name}
                          {setting.isDefault && (
                            <Badge variant="default" className="text-xs">
                              По умолчанию
                            </Badge>
                          )}
                          <Badge
                            variant={setting.isActive ? "default" : "secondary"}
                          >
                            {setting.isActive ? "Активна" : "Неактивна"}
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          {
                            deliveryTypeLabels[
                            setting.deliveryType as keyof typeof deliveryTypeLabels
                            ]
                          }
                          {setting.description && ` • ${setting.description}`}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingSetting(setting)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Удалить настройки доставки
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Вы уверены, что хотите удалить настройки "
                              {setting.name}"? Это действие нельзя отменить.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Отмена</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(setting.id)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Удалить
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Стоимость:</span>
                      <p>{formatCurrency(setting.deliveryCost)}</p>
                    </div>
                    <div>
                      <span className="font-medium">Срок доставки:</span>
                      <p>
                        {setting.estimatedDays
                          ? `${setting.estimatedDays} дн.`
                          : "Не указан"}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">Мин. заказ:</span>
                      <p>{formatCurrency(setting.minOrderAmount)}</p>
                    </div>
                    <div>
                      <span className="font-medium">Бесплатная доставка:</span>
                      <p>
                        {setting.freeDeliveryThreshold
                          ? `от ${formatCurrency(setting.freeDeliveryThreshold)}`
                          : "Нет"}
                      </p>
                    </div>
                  </div>

                  {setting.regions && setting.regions.length > 0 && (
                    <div className="mt-4">
                      <span className="font-medium text-sm">
                        Регионы доставки:
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {setting.regions.slice(0, 3).map((region: string) => (
                          <Badge
                            key={region}
                            variant="outline"
                            className="text-xs"
                          >
                            {region}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
