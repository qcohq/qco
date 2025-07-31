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

interface InvitationFormData {
  [key: string]: unknown;
  expiryDays?: number;
}

interface InvitationExpirySelectProps {
  form: UseFormReturn<InvitationFormData>;
  name: string;
  label?: string;
  description?: string;
}

const expiryOptions = [
  { value: "1", label: "1 день" },
  { value: "3", label: "3 дня" },
  { value: "7", label: "7 дней" },
  { value: "14", label: "14 дней" },
  { value: "30", label: "30 дней" },
] as const;

export function InvitationExpirySelect({
  form,
  name,
  label = "Срок действия приглашения",
  description = "Время, в течение которого приглашение будет активно",
}: InvitationExpirySelectProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select
            onValueChange={(value) => field.onChange(Number(value))}
            defaultValue={field.value.toString()}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Выберите срок" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {expiryOptions.map((option) => (
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
