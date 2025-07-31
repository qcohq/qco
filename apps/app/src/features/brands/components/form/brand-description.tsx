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
import { Textarea } from "@qco/ui/components/textarea";
import type { brandSchema } from "@qco/validators";
import type { UseFormReturn } from "react-hook-form";
import type { z } from "zod";

// TODO: Использовать тип из схемы пропсов описания бренда, если появится в @qco/validators
type BrandFormValues = z.infer<typeof brandSchema>;

interface BrandDescriptionProps {
  form: UseFormReturn<BrandFormValues>;
}

export function BrandDescription({ form }: BrandDescriptionProps) {
  return (
    <div className="mt-4 space-y-6">
      {/* Full description */}
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">
              Полное описание
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Введите полное описание бренда..."
                className="min-h-[150px] resize-y"
                {...field}
              />
            </FormControl>
            <FormDescription className="mt-1 text-xs">
              Подробное описание бренда, его история, ценности и особенности
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Short description */}
      <FormField
        control={form.control}
        name="shortDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">
              Краткое описание
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Введите краткое описание бренда..."
                className="min-h-[80px] resize-y"
                {...field}
              />
            </FormControl>
            <FormDescription className="mt-1 text-xs">
              Краткое описание для отображения в списках и карточках (до 200
              символов)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Founded year and country */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormField
          control={form.control}
          name="foundedYear"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">
                Год основания
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Например: 1985"
                  className="h-10"
                  {...field}
                />
              </FormControl>
              <FormDescription className="mt-1 text-xs">
                Год, когда бренд был основан
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="countryOfOrigin"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">
                Страна происхождения
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Например: Италия"
                  className="h-10"
                  {...field}
                />
              </FormControl>
              <FormDescription className="mt-1 text-xs">
                Страна, в которой был основан бренд
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
