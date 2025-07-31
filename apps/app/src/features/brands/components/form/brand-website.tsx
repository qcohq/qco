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
import type { brandSchema } from "@qco/validators";
import { Globe } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import type { z } from "zod";

// TODO: Использовать тип из схемы пропсов веб-сайта бренда, если появится в @qco/validators
type BrandFormValues = z.infer<typeof brandSchema>;

interface BrandWebsiteProps {
  form: UseFormReturn<BrandFormValues>;
}

export function BrandWebsite({ form }: BrandWebsiteProps) {
  return (
    <div className="mt-4 space-y-4">
      {/* Website */}
      <FormField
        control={form.control}
        name="website"
        render={({ field }) => (
          <FormItem className="max-w-xl">
            <FormLabel className="text-sm font-medium">Веб-сайт</FormLabel>
            <FormControl>
              <div className="relative">
                <Globe className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  placeholder="https://example.com"
                  className="h-10 pl-10"
                  {...field}
                />
              </div>
            </FormControl>
            <FormDescription className="mt-1 text-xs">
              Официальный сайт бренда
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
