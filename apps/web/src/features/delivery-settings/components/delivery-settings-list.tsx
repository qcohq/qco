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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@qco/ui/components/dialog";
import { Switch } from "@qco/ui/components/switch";
import { Edit, Mail, MapPin, Package, Plus, Trash2, Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

export function DeliverySettingsList() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingSetting, setEditingSetting] = useState<any>(null);
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // Создаем опции запроса с помощью queryOptions
  const settingsQueryOptions = trpc.deliverySettings.getAll.queryOptions();

  // Используем опции с хуком useQuery
  const { data: settings, refetch } = useQuery(settingsQueryOptions);

  // Создаем опции мутации с помощью mutationOptions
  const deleteMutationOptions = trpc.deliverySettings.delete.mutationOptions({
    onSuccess: () => {
      toast.success("Настройки доставки удалены");
      // Инвалидируем кэш запроса списка настроек доставки
      queryClient.invalidateQueries({
        queryKey: trpc.deliverySettings.getAll.queryKey()
      });
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  // Используем опции с хуком useMutation
  const deleteMutation = useMutation(deleteMutationOptions);

  const handleDelete = (id: string) => {
    deleteMutation.mutate({ id });
  };

  const handleSuccess = () => {
    setIsCreateDialogOpen(false);
    setEditingSetting(null);
    refetch();
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
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Добавить настройки
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Создать настройки доставки</DialogTitle>
            </DialogHeader>
            <DeliverySettingsForm onSuccess={handleSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {settings?.map((setting: any) => {
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
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingSetting(setting)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>
                            Редактировать настройки доставки
                          </DialogTitle>
                        </DialogHeader>
                        <DeliverySettingsForm
                          initialData={{
                            ...setting,
                            minOrderAmount: Number.parseFloat(
                              setting.minOrderAmount || "0",
                            ),
                            maxOrderAmount: setting.maxOrderAmount
                              ? Number.parseFloat(setting.maxOrderAmount)
                              : undefined,
                            deliveryCost: Number.parseFloat(
                              setting.deliveryCost || "0",
                            ),
                            freeDeliveryThreshold: setting.freeDeliveryThreshold
                              ? Number.parseFloat(setting.freeDeliveryThreshold)
                              : undefined,
                            weightLimit: setting.weightLimit
                              ? Number.parseFloat(setting.weightLimit)
                              : undefined,
                            regions: setting.regions || [],
                          }}
                          onSuccess={handleSuccess}
                        />
                      </DialogContent>
                    </Dialog>
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
                      {setting.regions.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{setting.regions.length - 3} еще
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {settings?.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Нет настроек доставки</h3>
            <p className="text-muted-foreground text-center mb-4">
              Создайте первую настройку доставки для вашего магазина
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Добавить настройки
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
