"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@qco/ui/components/form";
import { Switch } from "@qco/ui/components/switch";
import type { UseFormReturn } from "react-hook-form";

// TODO: Использовать тип из схемы пропсов переключателя активности админа, если появится в @qco/validators

export function AdminActiveSwitch({
  form,
  name,
  label = "Активен",
  description = "Администратор может войти в систему",
}: {
  form: UseFormReturn<{ [key: string]: unknown }>;
  name: string;
  label?: string;
  description?: string;
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <FormLabel className="text-base">{label}</FormLabel>
            <FormDescription>{description}</FormDescription>
          </div>
          <FormControl>
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
