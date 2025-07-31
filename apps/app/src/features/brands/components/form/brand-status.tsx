"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@qco/ui/components/form";
import { Switch } from "@qco/ui/components/switch";
import type { brandSchema } from "@qco/validators";
import type { UseFormReturn } from "react-hook-form";
import type { z } from "zod";

// TODO: Использовать тип из схемы пропсов статуса бренда, если появится в @qco/validators
type BrandFormValues = z.infer<typeof brandSchema>;

interface BrandStatusProps {
  form: UseFormReturn<BrandFormValues>;
}

export function BrandStatus({ form }: BrandStatusProps) {
  return (
    <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* Active status */}
      <FormField
        control={form.control}
        name="isActive"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between space-y-0 space-x-2 rounded-md border p-4 shadow-sm">
            <div className="space-y-1">
              <FormLabel className="text-base font-medium">Активный</FormLabel>
              <FormDescription className="text-xs">
                Бренд будет отображаться на сайте
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                className="data-[state=checked]:bg-primary"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Featured status */}
      <FormField
        control={form.control}
        name="isFeatured"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between space-y-0 space-x-2 rounded-md border p-4 shadow-sm">
            <div className="space-y-1">
              <FormLabel className="text-base font-medium">
                Рекомендуемый
              </FormLabel>
              <FormDescription className="text-xs">
                Бренд будет отображаться в разделе "Рекомендуемые"
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                className="data-[state=checked]:bg-primary"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
