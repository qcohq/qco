"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@qco/ui/components/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@qco/ui/components/form";
import { Input } from "@qco/ui/components/input";
import { Textarea } from "@qco/ui/components/textarea";
import { createProductTypeSchema } from "@qco/validators";
import { Check, RefreshCw, X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { useSlugChecker } from "../hooks/use-slug-checker";
import { generateSlugFromName } from "../utils/slug-generator";

// TODO: Использовать тип из схемы пропсов формы типа продукта, если появится в @qco/validators
interface ProductTypeFormProps {
  onSubmit: (values: z.infer<typeof createProductTypeSchema>) => void;
  initialValues?: z.infer<typeof createProductTypeSchema> & { id?: string };
  isEdit?: boolean;
  isPending?: boolean;
}

export function ProductTypeForm({
  onSubmit,
  initialValues,
  isEdit,
  isPending,
}: ProductTypeFormProps) {
  const {
    isChecking: isCheckingSlug,
    result: slugCheckResult,
    checkSlugUniqueness,
    clearResult: clearSlugResult,
  } = useSlugChecker({ excludeId: initialValues?.id });

  const form = useForm<z.infer<typeof createProductTypeSchema>>({
    resolver: zodResolver(createProductTypeSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      ...(initialValues || {}),
    },
  });

  // Автоматическая генерация slug при вводе name
  const nameValue = form.watch("name");
  const slugValue = form.watch("slug");

  useEffect(() => {
    if (
      nameValue &&
      nameValue.length >= 2 &&
      (!slugValue || slugValue.trim() === "")
    ) {
      const generatedSlug = generateSlugFromName(nameValue);
      form.setValue("slug", generatedSlug, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }, [nameValue, slugValue, form]);

  // Функция для генерации слага из названия
  const generateSlug = () => {
    const name = form.getValues("name");
    if (name) {
      const generatedSlug = generateSlugFromName(name);
      form.setValue("slug", generatedSlug, {
        shouldDirty: true,
        shouldValidate: true,
      });
      clearSlugResult(); // Сброс результата проверки
    }
  };

  // Функция для проверки уникальности слага
  const handleCheckSlugUniqueness = async () => {
    const slug = form.getValues("slug");
    if (slug) {
      await checkSlugUniqueness(slug);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Название</FormLabel>
              <FormControl>
                <Input placeholder="Например, Футболка" {...field} />
              </FormControl>
              <FormDescription>
                Название типа продукта, которое будет отображаться в интерфейсе
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <div className="flex gap-2">
                  <Input placeholder="Например, t-shirt" {...field} />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={generateSlug}
                    disabled={!nameValue}
                    className="shrink-0"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Генерировать
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCheckSlugUniqueness}
                    disabled={!field.value || isCheckingSlug}
                    className="shrink-0"
                  >
                    {isCheckingSlug ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4 mr-2" />
                    )}
                    Проверить
                  </Button>
                </div>
              </FormControl>
              <FormDescription>
                Уникальный идентификатор для URL. Генерируется автоматически из
                названия
              </FormDescription>
              {slugCheckResult && (
                <div
                  className={`flex items-center gap-2 text-sm ${slugCheckResult.isUnique ? "text-green-600" : "text-red-600"
                    }`}
                >
                  {slugCheckResult.isUnique ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                  {slugCheckResult.message}
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Описание</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Краткое описание типа продукта (необязательно)"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Дополнительная информация о типе продукта
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4 justify-end pt-8">
          <Button
            type="submit"
            disabled={
              isPending || (slugCheckResult && !slugCheckResult.isUnique)
            }
            className="px-8 py-2 text-base"
          >
            {isPending ? "Сохранение..." : isEdit ? "Сохранить" : "Создать"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
