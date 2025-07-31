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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@qco/ui/components/select";
import { Textarea } from "@qco/ui/components/textarea";
// biome-ignore lint/correctness/noUnusedImports: DeliverySettings используется в useFormContext
import type { DeliverySettings } from "@qco/validators";
import { useFormContext } from "react-hook-form";

const deliveryTypes = [
  { value: "pickup", label: "Самовывоз" },
  { value: "courier", label: "Курьерская доставка" },
  { value: "post", label: "Почта России" },
  { value: "cdek", label: "СДЭК" },
  { value: "boxberry", label: "Boxberry" },
];

export function BasicSettingsForm() {
  const form = useFormContext<DeliverySettings>();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Основные настройки</CardTitle>
        <CardDescription>Настройте основные параметры доставки</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Название</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Например: Курьерская доставка по Москве"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="deliveryType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Тип доставки</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите тип доставки" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {deliveryTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Описание</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Дополнительная информация о доставке"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
