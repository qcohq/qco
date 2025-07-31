"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@qco/ui/components/form";
import { Input } from "@qco/ui/components/input";
import type { UseFormReturn } from "react-hook-form";

// TODO: Использовать тип из схемы пропсов поля имени админа, если появится в @qco/validators

export function AdminNameInput({
  form,
  name,
  label = "Имя",
  placeholder = "Введите имя администратора",
  description = "Полное имя администратора",
}: {
  form: UseFormReturn<{ [key: string]: unknown }>;
  name: string;
  label?: string;
  placeholder?: string;
  description?: string;
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input placeholder={placeholder} {...field} />
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
