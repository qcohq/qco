"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@qco/ui/components/form";
import { Input } from "@qco/ui/components/input";
import type { UseFormReturn } from "react-hook-form";
import type { BannerFormData } from "../../hooks/use-banner-form";

// TODO: Использовать тип из схемы пропсов настроек ссылки баннера, если появится в @qco/validators

export function BannerLinkSettings({ form }: { form: UseFormReturn<BannerFormData> }) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="link"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ссылка</FormLabel>
            <FormControl>
              <Input placeholder="https://example.com/page" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="linkText"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Текст ссылки</FormLabel>
            <FormControl>
              <Input placeholder="Подробнее" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
