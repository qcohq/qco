"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { Input } from "@qco/ui/components/input";
import { Label } from "@qco/ui/components/label";
import { Switch } from "@qco/ui/components/switch";
import { type PickupPoint, pickupPointSchema } from "@qco/web-validators";
import { Clock, Edit, MapPin, Phone, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface PickupPointsManagerProps {
  deliverySettingsId: string;
}

export function PickupPointsManager({
  deliverySettingsId,
}: PickupPointsManagerProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingPoint, setEditingPoint] = useState<PickupPoint | null>(null);
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // Создаем опции запроса с помощью queryOptions
  const pickupPointsQueryOptions = trpc.deliverySettings.getPickupPoints.queryOptions({
    deliverySettingsId,
  });

  // Используем опции с хуком useQuery
  const { data: pickupPoints, refetch } = useQuery(pickupPointsQueryOptions);

  // Создаем опции мутации с помощью mutationOptions
  const createMutationOptions = trpc.deliverySettings.createPickupPoint.mutationOptions({
    onSuccess: () => {
      toast.success("Точка самовывоза создана");
      setIsCreateDialogOpen(false);
      // Инвалидируем кэш запроса точек самовывоза
      queryClient.invalidateQueries({
        queryKey: trpc.deliverySettings.getPickupPoints.queryKey({ deliverySettingsId })
      });
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const updateMutationOptions = trpc.deliverySettings.updatePickupPoint.mutationOptions({
    onSuccess: () => {
      toast.success("Точка самовывоза обновлена");
      setEditingPoint(null);
      // Инвалидируем кэш запроса точек самовывоза
      queryClient.invalidateQueries({
        queryKey: trpc.deliverySettings.getPickupPoints.queryKey({ deliverySettingsId })
      });
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const deleteMutationOptions = trpc.deliverySettings.deletePickupPoint.mutationOptions({
    onSuccess: () => {
      toast.success("Точка самовывоза удалена");
      // Инвалидируем кэш запроса точек самовывоза
      queryClient.invalidateQueries({
        queryKey: trpc.deliverySettings.getPickupPoints.queryKey({ deliverySettingsId })
      });
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  // Используем опции с хуками useMutation
  const createMutation = useMutation(createMutationOptions);
  const updateMutation = useMutation(updateMutationOptions);
  const deleteMutation = useMutation(deleteMutationOptions);

  const handleSubmit = (data: PickupPoint) => {
    const formData = {
      ...data,
      deliverySettingsId,
    };

    if (editingPoint?.id) {
      updateMutation.mutate({ id: editingPoint.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate({ id });
  };

  const isLoading = createMutation.isLoading || updateMutation.isLoading;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold">Точки самовывоза</h3>
          <p className="text-muted-foreground">
            Управляйте точками самовывоза для выбранного способа доставки
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Добавить точку
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Создать точку самовывоза</DialogTitle>
            </DialogHeader>
            <PickupPointForm onSubmit={handleSubmit} isLoading={isLoading} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {pickupPoints?.map((point: any) => (
          <Card key={point.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <CardTitle className="text-lg">{point.name}</CardTitle>
                    <CardDescription className="flex items-center gap-4">
                      <span>
                        {point.city}, {point.region}
                      </span>
                      <Badge variant={point.isActive ? "default" : "secondary"}>
                        {point.isActive ? "Активна" : "Неактивна"}
                      </Badge>
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingPoint(point)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          Редактировать точку самовывоза
                        </DialogTitle>
                      </DialogHeader>
                      <PickupPointForm
                        initialData={point}
                        onSubmit={handleSubmit}
                        isLoading={isLoading}
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
                          Удалить точку самовывоза
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Вы уверены, что хотите удалить точку "{point.name}"?
                          Это действие нельзя отменить.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Отмена</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(point.id)}
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
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Адрес:</span>
                  <p className="text-muted-foreground">{point.address}</p>
                </div>
                {point.postalCode && (
                  <div>
                    <span className="font-medium">Индекс:</span>
                    <p className="text-muted-foreground">{point.postalCode}</p>
                  </div>
                )}
                {point.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Телефон:</span>
                    <p className="text-muted-foreground">{point.phone}</p>
                  </div>
                )}
                {point.workingHours && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Часы работы:</span>
                    <p className="text-muted-foreground">
                      {point.workingHours}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {pickupPoints?.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <MapPin className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground text-center">
              Нет точек самовывоза. Добавьте первую точку.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface PickupPointFormProps {
  initialData?: PickupPoint;
  onSubmit: (data: PickupPoint) => void;
  isLoading: boolean;
}

function PickupPointForm({
  initialData,
  onSubmit,
  isLoading,
}: PickupPointFormProps) {
  const form = useForm<PickupPoint>({
    resolver: zodResolver(pickupPointSchema),
    defaultValues: {
      name: initialData?.name || "",
      address: initialData?.address || "",
      city: initialData?.city || "",
      region: initialData?.region || "",
      postalCode: initialData?.postalCode || "",
      phone: initialData?.phone || "",
      workingHours: initialData?.workingHours || "",
      coordinates: initialData?.coordinates || "",
      isActive: initialData?.isActive ?? true,
    },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Название</Label>
          <Input
            id="name"
            {...form.register("name")}
            placeholder="Например: ТЦ Мега"
          />
          {form.formState.errors.name && (
            <p className="text-sm text-red-500">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">Город</Label>
          <Input id="city" {...form.register("city")} placeholder="Москва" />
          {form.formState.errors.city && (
            <p className="text-sm text-red-500">
              {form.formState.errors.city.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Адрес</Label>
        <Input
          id="address"
          {...form.register("address")}
          placeholder="ул. Примерная, д. 1"
        />
        {form.formState.errors.address && (
          <p className="text-sm text-red-500">
            {form.formState.errors.address.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="region">Регион</Label>
          <Input
            id="region"
            {...form.register("region")}
            placeholder="Московская область"
          />
          {form.formState.errors.region && (
            <p className="text-sm text-red-500">
              {form.formState.errors.region.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="postalCode">Почтовый индекс</Label>
          <Input
            id="postalCode"
            {...form.register("postalCode")}
            placeholder="123456"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Телефон</Label>
          <Input
            id="phone"
            {...form.register("phone")}
            placeholder="+7 (999) 123-45-67"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="workingHours">Часы работы</Label>
          <Input
            id="workingHours"
            {...form.register("workingHours")}
            placeholder="Пн-Пт 9:00-18:00"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="coordinates">Координаты (lat,lng)</Label>
        <Input
          id="coordinates"
          {...form.register("coordinates")}
          placeholder="55.7558,37.6176"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={form.watch("isActive")}
          onCheckedChange={(checked) => form.setValue("isActive", checked)}
        />
        <Label htmlFor="isActive">Активна</Label>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Сохранение..." : initialData ? "Обновить" : "Создать"}
        </Button>
      </div>
    </form>
  );
}
