"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Badge } from "@qco/ui/components/badge";
import { Button } from "@qco/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@qco/ui/components/card";
import { Input } from "@qco/ui/components/input";
import { Label } from "@qco/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@qco/ui/components/select";
import { Switch } from "@qco/ui/components/switch";
import { Textarea } from "@qco/ui/components/textarea";
import {
  type DeliverySettings,
  deliverySettingsSchema,
} from "@qco/web-validators";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface DeliverySettingsFormProps {
  initialData?: DeliverySettings;
  onSuccess?: () => void;
}

const deliveryTypes = [
  { value: "pickup", label: "Самовывоз" },
  { value: "courier", label: "Курьерская доставка" },
  { value: "post", label: "Почта России" },
  { value: "cdek", label: "СДЭК" },
  { value: "boxberry", label: "Boxberry" },
];

const russianRegions = [
  "Москва",
  "Санкт-Петербург",
  "Московская область",
  "Ленинградская область",
  "Краснодарский край",
  "Ростовская область",
  "Свердловская область",
  "Республика Татарстан",
  "Челябинская область",
  "Нижегородская область",
  "Самарская область",
  "Республика Башкортостан",
  "Красноярский край",
  "Пермский край",
  "Воронежская область",
  "Волгоградская область",
  "Саратовская область",
  "Тюменская область",
  "Оренбургская область",
  "Иркутская область",
];

export function DeliverySettingsForm({
  initialData,
  onSuccess,
}: DeliverySettingsFormProps) {
  const [selectedRegions, setSelectedRegions] = useState<string[]>(
    initialData?.regions || [],
  );
  const [newRegion, setNewRegion] = useState("");
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const form = useForm<DeliverySettings>({
    resolver: zodResolver(deliverySettingsSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      isActive: initialData?.isActive ?? true,
      deliveryType: initialData?.deliveryType || "pickup",
      minOrderAmount: initialData?.minOrderAmount || 0,
      maxOrderAmount: initialData?.maxOrderAmount,
      deliveryCost: initialData?.deliveryCost || 0,
      freeDeliveryThreshold: initialData?.freeDeliveryThreshold,
      estimatedDays: initialData?.estimatedDays,
      weightLimit: initialData?.weightLimit,
      sizeLimit: initialData?.sizeLimit || "",
      isDefault: initialData?.isDefault ?? false,
    },
  });

  // Создаем опции мутации с помощью mutationOptions
  const createMutationOptions = trpc.deliverySettings.create.mutationOptions({
    onSuccess: () => {
      toast.success("Настройки доставки созданы");
      // Инвалидируем кэш запроса списка настроек доставки
      queryClient.invalidateQueries({
        queryKey: trpc.deliverySettings.getAll.queryKey()
      });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const updateMutationOptions = trpc.deliverySettings.update.mutationOptions({
    onSuccess: () => {
      toast.success("Настройки доставки обновлены");
      // Инвалидируем кэш запроса списка настроек доставки
      queryClient.invalidateQueries({
        queryKey: trpc.deliverySettings.getAll.queryKey()
      });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  // Используем опции с хуками useMutation
  const createMutation = useMutation(createMutationOptions);
  const updateMutation = useMutation(updateMutationOptions);

  const onSubmit = (data: DeliverySettings) => {
    const formData = {
      ...data,
      regions: selectedRegions,
    };

    if (initialData?.id) {
      updateMutation.mutate({ id: initialData.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const addRegion = () => {
    if (newRegion && !selectedRegions.includes(newRegion)) {
      setSelectedRegions([...selectedRegions, newRegion]);
      setNewRegion("");
    }
  };

  const removeRegion = (region: string) => {
    setSelectedRegions(selectedRegions.filter((r) => r !== region));
  };

  const isLoading = createMutation.isLoading || updateMutation.isLoading;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Основные настройки</CardTitle>
          <CardDescription>
            Настройте основные параметры доставки
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Название</Label>
              <Input
                id="name"
                {...form.register("name")}
                placeholder="Например: Курьерская доставка по Москве"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="deliveryType">Тип доставки</Label>
              <Select
                value={form.watch("deliveryType")}
                onValueChange={(value) =>
                  form.setValue("deliveryType", value as any)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите тип доставки" />
                </SelectTrigger>
                <SelectContent>
                  {deliveryTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              {...form.register("description")}
              placeholder="Дополнительная информация о доставке"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minOrderAmount">
                Минимальная сумма заказа (₽)
              </Label>
              <Input
                id="minOrderAmount"
                type="number"
                step="0.01"
                {...form.register("minOrderAmount", { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxOrderAmount">
                Максимальная сумма заказа (₽)
              </Label>
              <Input
                id="maxOrderAmount"
                type="number"
                step="0.01"
                {...form.register("maxOrderAmount", { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="deliveryCost">Стоимость доставки (₽)</Label>
              <Input
                id="deliveryCost"
                type="number"
                step="0.01"
                {...form.register("deliveryCost", { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="freeDeliveryThreshold">
                Порог бесплатной доставки (₽)
              </Label>
              <Input
                id="freeDeliveryThreshold"
                type="number"
                step="0.01"
                {...form.register("freeDeliveryThreshold", {
                  valueAsNumber: true,
                })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estimatedDays">Срок доставки (дни)</Label>
              <Input
                id="estimatedDays"
                type="number"
                {...form.register("estimatedDays", { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weightLimit">Лимит веса (кг)</Label>
              <Input
                id="weightLimit"
                type="number"
                step="0.01"
                {...form.register("weightLimit", { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sizeLimit">Лимит размеров (ДxШxВ см)</Label>
            <Input
              id="sizeLimit"
              {...form.register("sizeLimit")}
              placeholder="Например: 100x50x50"
            />
          </div>

          <div className="space-y-2">
            <Label>Регионы доставки</Label>
            <div className="flex gap-2">
              <Select value={newRegion} onValueChange={setNewRegion}>
                <SelectTrigger className="w-[300px]">
                  <SelectValue placeholder="Выберите регион" />
                </SelectTrigger>
                <SelectContent>
                  {russianRegions
                    .filter((region) => !selectedRegions.includes(region))
                    .map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Button type="button" onClick={addRegion} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedRegions.map((region) => (
                <Badge
                  key={region}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {region}
                  <button
                    type="button"
                    onClick={() => removeRegion(region)}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={form.watch("isActive")}
              onCheckedChange={(checked) => form.setValue("isActive", checked)}
            />
            <Label htmlFor="isActive">Активна</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isDefault"
              checked={form.watch("isDefault")}
              onCheckedChange={(checked) => form.setValue("isDefault", checked)}
            />
            <Label htmlFor="isDefault">По умолчанию</Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Сохранение..." : initialData ? "Обновить" : "Создать"}
        </Button>
      </div>
    </form>
  );
}
