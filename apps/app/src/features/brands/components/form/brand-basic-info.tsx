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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@qco/ui/components/tooltip";
import type { brandSchema } from "@qco/validators";
import { useMutation } from "@tanstack/react-query";
import { Info, Link, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { z } from "zod";

import { useTRPC } from "~/trpc/react";

// TODO: Использовать тип из схемы пропсов базовой информации бренда, если появится в @qco/validators
type BrandFormValues = z.infer<typeof brandSchema>;

interface BrandBasicInfoProps {
  form: UseFormReturn<BrandFormValues>;
  onSlugChange?: () => void;
  brandId?: string; // Для редактирования бренда
}

export function BrandBasicInfo({
  form,
  onSlugChange,
  brandId,
}: BrandBasicInfoProps) {
  const trpc = useTRPC();
  const [isGeneratingSlug, setIsGeneratingSlug] = useState(false);
  const [userModifiedSlug, setUserModifiedSlug] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Мутация для генерации слага
  const generateSlugMutationOptions = trpc.brands.generateSlug.mutationOptions({
    onSuccess: (data) => {
      if (!userModifiedSlug) {
        form.setValue("slug", data.slug);
      }
      setIsGeneratingSlug(false);
    },
    onError: (error) => {
      console.error("Ошибка генерации слага:", error);
      setIsGeneratingSlug(false);
    },
  });

  const generateSlugMutation = useMutation(generateSlugMutationOptions);

  // Автоматическая генерация слага при изменении названия
  const handleNameChange = (name: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (name.trim() && !userModifiedSlug) {
      setIsGeneratingSlug(true);
      debounceRef.current = setTimeout(() => {
        generateSlugMutation.mutate({
          name: name.trim(),
          excludeId: brandId,
        });
      }, 500);
    }
  };

  // Отслеживание изменений в поле слага пользователем
  const handleSlugChange = (slug: string) => {
    if (slug !== form.getValues("slug")) {
      setUserModifiedSlug(true);
    }
  };

  // Очистка debounce при размонтировании
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div className="mt-4 grid grid-cols-1 gap-6">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <div className="flex h-7 items-center gap-2">
              <FormLabel htmlFor="brand-name" className="text-sm font-medium">
                Название бренда <span className="text-destructive">*</span>
              </FormLabel>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="text-muted-foreground h-4 w-4 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-80">
                      Название бренда будет отображаться на сайте и в каталоге
                      товаров. Используйте официальное название бренда.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <FormControl>
              <Input
                id="brand-name"
                placeholder="Например: Nike, Adidas, Puma"
                {...field}
                className="h-10"
                onChange={(e) => {
                  field.onChange(e);
                  handleNameChange(e.target.value);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="slug"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <div className="flex h-7 items-center gap-2">
              <FormLabel htmlFor="brand-slug" className="text-sm font-medium">
                URL-адрес <span className="text-destructive">*</span>
              </FormLabel>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="text-muted-foreground h-4 w-4 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-80">
                      URL-адрес страницы бренда. Генерируется автоматически из
                      названия, но может быть изменен.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <FormControl>
              <div className="flex">
                <div className="bg-muted flex items-center justify-center rounded-l-md border border-r-0 px-3">
                  {isGeneratingSlug ? (
                    <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
                  ) : (
                    <Link className="text-muted-foreground h-4 w-4" />
                  )}
                </div>
                <Input
                  id="brand-slug"
                  placeholder="url-adres-brenda"
                  className="h-10 rounded-l-none"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    handleSlugChange(e.target.value);
                    onSlugChange?.();
                  }}
                />
              </div>
            </FormControl>
            <FormDescription className="text-xs">
              Пример: https://example.com/brands/{field.value}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="brandColor"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <div className="flex h-7 items-center gap-2">
              <FormLabel htmlFor="brand-color" className="text-sm font-medium">
                Фирменный цвет
              </FormLabel>
            </div>
            <FormControl>
              <div className="flex items-center gap-2">
                <div className="flex-shrink-0">
                  <Input
                    id="brand-color"
                    type="color"
                    className="h-10 w-12 p-1"
                    {...field}
                  />
                </div>
                <Input
                  id="brand-color-hex"
                  {...field}
                  className="h-10 flex-1"
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
