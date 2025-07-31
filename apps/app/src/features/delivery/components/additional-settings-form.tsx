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
import { Switch } from "@qco/ui/components/switch";
// biome-ignore lint/correctness/noUnusedImports: DeliverySettings используется в useFormContext
import type { DeliverySettings } from "@qco/validators";
import { useFormContext } from "react-hook-form";

export function AdditionalSettingsForm() {
  const form = useFormContext<DeliverySettings>();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Дополнительные настройки</CardTitle>
        <CardDescription>
          Настройте дополнительные параметры доставки
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="estimatedDays"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Срок доставки (дни)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
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
            name="weightLimit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Лимит веса (кг)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.1"
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="sizeLimit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ограничения по размеру</FormLabel>
              <FormControl>
                <Input
                  placeholder="Например: Максимум 50x50x50 см"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between">
              <div className="space-y-0.5">
                <FormLabel>Активна</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Включить или отключить данный способ доставки
                </p>
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
          name="isDefault"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between">
              <div className="space-y-0.5">
                <FormLabel>По умолчанию</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Использовать как способ доставки по умолчанию
                </p>
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
      </CardContent>
    </Card>
  );
}
