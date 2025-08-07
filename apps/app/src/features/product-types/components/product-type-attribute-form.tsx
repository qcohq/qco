"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@qco/ui/components/button";
import { Checkbox } from "@qco/ui/components/checkbox";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@qco/ui/components/select";
import { TagInput } from "@qco/ui/components/tag-input";
import { Textarea } from "@qco/ui/components/textarea";
import { createProductTypeAttributeSchema } from "@qco/validators";
import slugify from "@sindresorhus/slugify";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { AttributePreview } from "./attribute-preview";

interface ProductTypeAttributeFormProps {
  onSubmit: (values: z.infer<typeof createProductTypeAttributeSchema>) => void;
  initialValues?: z.infer<typeof createProductTypeAttributeSchema> & {
    id?: string;
  };
  isEdit?: boolean;
  isPending?: boolean;
  productTypeId?: string;
  onCancel?: () => void;
}

export function ProductTypeAttributeForm({
  onSubmit,
  initialValues,
  isEdit,
  isPending,
  productTypeId,
  onCancel,
}: ProductTypeAttributeFormProps) {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(createProductTypeAttributeSchema),
    defaultValues: {
      name: "",
      slug: "",
      type: "text",
      options: [],
      isFilterable: false,
      sortOrder: 0,
      isRequired: false,
      productTypeId: productTypeId || "",
      isActive: true,
      ...(initialValues || {}),
    },
  });

  // Автоматическая генерация slug при вводе name
  const nameValue = form.watch("name");

  useEffect(() => {
    if (nameValue && nameValue.length >= 2) {
      const generatedSlug = slugify(nameValue, { lowercase: true });
      form.setValue("slug", generatedSlug, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }, [nameValue, form.setValue]);

  // Получаем значения для предварительного просмотра
  const previewValues = form.watch();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Кнопка "Назад" */}
          <div className="flex justify-start">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="px-4 py-2 text-base"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Назад
            </Button>
          </div>

          {/* Основная информация */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Основная информация</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Название атрибута *</FormLabel>
                    <FormControl>
                      <Input placeholder="Например, Цвет" {...field} />
                    </FormControl>
                    <FormDescription>
                      Название атрибута, которое будет отображаться в интерфейсе
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
                    <FormLabel>Slug *</FormLabel>
                    <FormControl>
                      <Input placeholder="Например, color" {...field} />
                    </FormControl>
                    <FormDescription>
                      Уникальный идентификатор атрибута. Генерируется
                      автоматически из названия
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Тип и настройки */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Тип и настройки</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Тип атрибута *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите тип атрибута" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="text">Текст</SelectItem>
                        <SelectItem value="number">Число</SelectItem>
                        <SelectItem value="boolean">Да/Нет</SelectItem>
                        <SelectItem value="select">Выбор из списка</SelectItem>
                        <SelectItem value="multiselect">
                          Множественный выбор
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Тип данных для этого атрибута
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sortOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Порядок сортировки</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="0"
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number.parseInt(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      Порядок отображения атрибута в списке
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Опции для выбора */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Опции для выбора</h3>
            <FormField
              control={form.control}
              name="options"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Опции</FormLabel>
                  <FormControl>
                    <TagInput
                      placeholder="Введите опцию и нажмите Enter"
                      value={field.value || []}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      minLength={2}
                      maxLength={50}
                      allowDuplicates={false}
                      maxTags={100}
                      validateTag={(tag) => {
                        // Проверяем, что опция не содержит специальных символов
                        if (/[<>{}]/.test(tag)) {
                          return "Опция не должна содержать специальные символы";
                        }
                        return null;
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Добавьте опции для типов "Выбор из списка" и "Множественный выбор".
                    Для других типов это поле можно оставить пустым.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Настройки поведения */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Настройки поведения</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="isRequired"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Обязательный атрибут</FormLabel>
                      <FormDescription>
                        Атрибут должен быть заполнен для всех продуктов этого
                        типа
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isFilterable"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Фильтруемый атрибут</FormLabel>
                      <FormDescription>
                        Атрибут будет доступен для фильтрации в каталоге
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Активный атрибут</FormLabel>
                      <FormDescription>
                        Атрибут будет доступен для использования
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex gap-4 justify-end pt-8 border-t">
            <Button
              type="submit"
              disabled={isPending}
              className="px-8 py-2 text-base"
            >
              {isPending ? "Сохранение..." : isEdit ? "Сохранить" : "Создать"}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="px-8 py-2 text-base"
              >
                Отмена
              </Button>
            )}
          </div>
        </form>
      </Form>

      {/* Предварительный просмотр */}
      <div className="space-y-6">
        <div className="sticky top-6">
          <h3 className="text-lg font-medium mb-4">Предварительный просмотр</h3>
          <AttributePreview
            name={previewValues.name || "Название атрибута"}
            type={previewValues.type}
            options={previewValues.options || []}
            isRequired={previewValues.isRequired || false}
            isFilterable={previewValues.isFilterable || false}
          />
        </div>
      </div>
    </div>
  );
}
