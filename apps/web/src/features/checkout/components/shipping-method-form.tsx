"use client";

import { Badge } from "@qco/ui/components/badge";
import { Button } from "@qco/ui/components/button";
import { Calendar } from "@qco/ui/components/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@qco/ui/components/card";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@qco/ui/components/form";
import { Input } from "@qco/ui/components/input";
import { Label } from "@qco/ui/components/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@qco/ui/components/popover";
import { RadioGroup, RadioGroupItem } from "@qco/ui/components/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@qco/ui/components/select";
import { Textarea } from "@qco/ui/components/textarea";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import {
  CalendarIcon,
  Clock,
  Mail,
  MapPin,
  Package,
  Truck,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/react";

const deliveryTypeIcons = {
  pickup: MapPin,
  courier: Truck,
  post: Mail,
  cdek: Package,
  boxberry: Package,
};

const deliveryTypeLabels = {
  pickup: "Самовывоз",
  courier: "Курьерская доставка",
  post: "Почта России",
  cdek: "СДЭК",
  boxberry: "Boxberry",
};

interface ShippingMethodFormProps {
  form: UseFormReturn<any>;
  cartTotal: number;
  userRegion?: string;
  mobileFlat?: boolean;
  onBlur?: (fieldName: string) => void;
}

export function ShippingMethodForm({
  form,
  cartTotal,
  userRegion,
  mobileFlat = false,
  onBlur,
}: ShippingMethodFormProps) {
  const [selectedPickupPoint, setSelectedPickupPoint] = useState<string>("");
  const trpc = useTRPC();

  const deliverySettingsQueryOptions =
    trpc.deliverySettings.getAll.queryOptions();
  const { data: deliverySettings } = useQuery(deliverySettingsQueryOptions);

  // Получаем точки самовывоза для выбранного способа доставки
  const selectedMethod = form.watch("shippingMethod");
  const selectedSetting = deliverySettings?.find(
    (setting: any) => setting.id === selectedMethod,
  );

  const pickupPointsQueryOptions =
    trpc.deliverySettings.getPickupPoints.queryOptions(
      { deliverySettingsId: selectedMethod },
      {
        enabled: !!selectedMethod && selectedSetting?.deliveryType === "pickup",
      },
    );
  const { data: pickupPoints } = useQuery(pickupPointsQueryOptions);

  // Фильтруем доступные способы доставки
  const availableMethods =
    deliverySettings?.filter((setting: any) => {
      if (!setting.isActive) return false;

      // Проверяем минимальную сумму заказа
      if (
        setting.minOrderAmount &&
        cartTotal < Number.parseFloat(setting.minOrderAmount)
      ) {
        return false;
      }

      // Проверяем максимальную сумму заказа
      if (
        setting.maxOrderAmount &&
        cartTotal > Number.parseFloat(setting.maxOrderAmount)
      ) {
        return false;
      }

      // Проверяем регион доставки
      if (setting.regions && setting.regions.length > 0 && userRegion) {
        return setting.regions.includes(userRegion);
      }

      return true;
    }) || [];

  const calculateDeliveryCost = (setting: any) => {
    const cost = Number.parseFloat(setting.deliveryCost || "0");
    const threshold = Number.parseFloat(setting.freeDeliveryThreshold || "0");

    if (threshold > 0 && cartTotal >= threshold) {
      return 0;
    }

    return cost;
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString("ru-RU")} ₽`;
  };

  return (
    <Card className={mobileFlat ? "border-0 rounded-none shadow-none p-0 sm:rounded-xl sm:border sm:shadow-sm sm:p-0" : undefined}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Способ доставки
        </CardTitle>
        <CardDescription>
          Выберите удобный способ получения заказа
        </CardDescription>
      </CardHeader>
      <CardContent className={mobileFlat ? "px-0 space-y-4" : "px-6 py-6 space-y-4"}>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="shippingMethod"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedPickupPoint("");
                      // Сохраняем черновик при выборе способа доставки
                      setTimeout(() => onBlur?.("shippingMethod"), 100);
                    }}
                    value={field.value}
                    className="grid gap-3"
                  >
                    {availableMethods.map((setting: any) => {
                      const IconComponent =
                        deliveryTypeIcons[
                        setting.deliveryType as keyof typeof deliveryTypeIcons
                        ] || Truck;
                      const deliveryCost = calculateDeliveryCost(setting);

                      return (
                        <Label
                          className={
                            "has-[[data-state=checked]]:border-ring has-[[data-state=checked]]:bg-primary/5 flex items-start gap-3 rounded-lg border p-3 w-full" +
                            (mobileFlat ? " border-0 bg-transparent p-2" : "")
                          }
                          key={setting.id}
                        >
                          <RadioGroupItem
                            value={setting.id}
                            id={setting.id}
                            className="data-[state=checked]:border-primary"
                          />
                          <div className="grid gap-1 font-normal flex-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 font-medium">
                                <IconComponent className="h-5 w-5" />
                                {setting.name}
                              </div>
                              <span className="font-semibold">
                                {deliveryCost === 0
                                  ? "Бесплатно"
                                  : formatCurrency(deliveryCost)}
                              </span>
                            </div>
                            <div className="text-muted-foreground pr-2 text-xs leading-snug text-balance">
                              {
                                deliveryTypeLabels[
                                setting.deliveryType as keyof typeof deliveryTypeLabels
                                ]
                              }
                              {setting.description && ` • ${setting.description}`}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                Срок доставки:{" "}
                                {setting.estimatedDays
                                  ? `${setting.estimatedDays} дн.`
                                  : "Не указан"}
                              </span>
                              {setting.isDefault && (
                                <Badge variant="outline" className="text-xs">
                                  По умолчанию
                                </Badge>
                              )}
                            </div>
                            {setting.freeDeliveryThreshold &&
                              cartTotal <
                              Number.parseFloat(
                                setting.freeDeliveryThreshold,
                              ) && (
                                <p className="text-xs text-blue-600">
                                  Бесплатная доставка от {formatCurrency(
                                    Number.parseFloat(
                                      setting.freeDeliveryThreshold,
                                    ),
                                  )}
                                </p>
                              )}
                          </div>
                        </Label>
                      );
                    })}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Выбор точки самовывоза */}
        {selectedSetting?.deliveryType === "pickup" &&
          pickupPoints &&
          pickupPoints.length > 0 && (
            <div className="space-y-4 pt-4 border-t">
              <FormField
                control={form.control}
                name="pickupPoint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Точка самовывоза
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите точку самовывоза" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {pickupPoints.map((point: any) => (
                          <SelectItem key={point.id} value={point.id}>
                            <div className="flex flex-col">
                              <span className="font-medium">{point.name}</span>
                              <span className="text-sm text-muted-foreground">
                                {point.address}, {point.city}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Информация о выбранной точке самовывоза */}
              {form.watch("pickupPoint") && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  {(() => {
                    const selectedPoint = pickupPoints.find(
                      (point: any) => point.id === form.watch("pickupPoint"),
                    );
                    if (!selectedPoint) return null;

                    return (
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {selectedPoint.name}
                          </span>
                        </div>
                        <p className="text-muted-foreground">
                          {selectedPoint.address}
                        </p>
                        {selectedPoint.phone && (
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Телефон:</span>
                            <span className="text-muted-foreground">
                              {selectedPoint.phone}
                            </span>
                          </div>
                        )}
                        {selectedPoint.workingHours && (
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Часы работы:</span>
                            <span className="text-muted-foreground">
                              {selectedPoint.workingHours}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          )}

        {/* Поля для даты и времени доставки (только для курьера) */}
        {selectedSetting?.deliveryType === "courier" && (
          <div className="space-y-4 pt-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="deliveryDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      Дата доставки
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: ru })
                            ) : (
                              <span>Выберите дату</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => {
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            return date < today;
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="deliveryTimeSlot"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Время доставки
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите время" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="09:00-12:00">
                          09:00 - 12:00
                        </SelectItem>
                        <SelectItem value="12:00-15:00">
                          12:00 - 15:00
                        </SelectItem>
                        <SelectItem value="15:00-18:00">
                          15:00 - 18:00
                        </SelectItem>
                        <SelectItem value="18:00-21:00">
                          18:00 - 21:00
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="deliveryInstructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Дополнительные инструкции для доставки</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Например: позвонить за 15 минут до доставки, код домофона, этаж и т.д."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Укажите любые дополнительные инструкции для курьера
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {availableMethods.length === 0 && (
          <div className="text-center py-8">
            <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Нет доступных способов доставки для вашего региона или суммы
              заказа
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
