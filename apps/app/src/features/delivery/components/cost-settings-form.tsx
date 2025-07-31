"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@qco/ui/components/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@qco/ui/components/form";
import { Input } from "@qco/ui/components/input";
// biome-ignore lint/correctness/noUnusedImports: DeliverySettings используется в useFormContext
import type { DeliverySettings } from "@qco/validators";
import { useFormContext } from "react-hook-form";

export function CostSettingsForm() {
  const form = useFormContext<DeliverySettings>();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Настройки стоимости</CardTitle>
        <CardDescription>
          Настройте параметры стоимости и лимиты заказов
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="minOrderAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Минимальная сумма заказа (₽)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maxOrderAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Максимальная сумма заказа (₽)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="deliveryCost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Стоимость доставки (₽)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="freeDeliveryThreshold"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Порог бесплатной доставки (₽)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
