"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@qco/ui/components/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@qco/ui/components/select";
import type { UseFormReturn } from "react-hook-form";

interface AdminRoleSelectProps {
  form: UseFormReturn<{ [key: string]: unknown }>;
  name: string;
  label?: string;
  description?: string;
}

const roleOptions = [
  { value: "super_admin", label: "Супер-админ" },
  { value: "admin", label: "Администратор" },
  { value: "moderator", label: "Модератор" },
  { value: "editor", label: "Редактор" },
] as const;

export function AdminRoleSelect({
  form,
  name,
  label = "Роль",
  description = "Уровень доступа в системе",
}: AdminRoleSelectProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Выберите роль" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {roleOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
