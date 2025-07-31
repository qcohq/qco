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
import { Switch } from "@qco/ui/components/switch";
import { TagInput } from "@qco/ui/components/tag-input";
import { Textarea } from "@qco/ui/components/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useTRPC } from "~/trpc/react";
import { z } from "zod";
import {
  createProductTypeAttributeSchema,
  updateProductTypeAttributeSchema,
  type CreateProductTypeAttributeInput,
  type UpdateProductTypeAttributeInput
} from "@qco/validators";
import slugify from "@sindresorhus/slugify";

// Схема для формы (объединяет create и update схемы)
const formSchema = createProductTypeAttributeSchema.extend({
  id: z.string().optional(),
  description: z.string().optional(),
  isSearchable: z.boolean().default(false),
  defaultValue: z.string().optional(),
  minValue: z.string().optional(),
  maxValue: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// TODO: Использовать тип из схемы пропсов формы атрибута, если появится в @qco/validators
interface AttributeFormProps {
  productTypeId: string;
  initialData?: Partial<FormValues>;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function AttributeForm({
  productTypeId,
  initialData,
  onSuccess,
  onCancel,
}: AttributeFormProps) {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      name: "",
      slug: "",
      description: "",
      type: "text",
      isRequired: false,
      isFilterable: false,
      isSearchable: false,
      defaultValue: "",
      minValue: "",
      maxValue: "",
      options: [],
      sortOrder: 0,
      isActive: true,
      productTypeId: productTypeId,
      ...initialData,
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
  }, [nameValue, form]);

  // Если есть initialData, обновляем форму при изменении данных
  useEffect(() => {
    if (initialData) {
      Object.entries(initialData).forEach(([key, value]) => {
        if (value !== undefined) {
          if (key === "options") {
            // Обрабатываем поле options как массив
            form.setValue(key as keyof FormValues, (value as string[]) || []);
          } else {
            form.setValue(
              key as keyof FormValues,
              value as unknown as string | number | boolean,
            );
          }
        }
      });
    }
  }, [form, initialData]);

  const isEditMode = !!initialData?.id;

  // Мутация для создания или обновления атрибута
  const mutationOptions = isEditMode
    ? trpc.productTypeAttributes.update.mutationOptions({
      onSuccess: (_data) => {
        toast.success("Атрибут успешно обновлен");
        // Инвалидируем запросы для конкретного типа продукта
        queryClient.invalidateQueries({
          queryKey: trpc.productTypeAttributes.getByProductType.queryKey({
            productTypeId,
          }),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.productTypeAttributes.getAll.queryKey({
            productTypeId,
          }),
        });
        // Также инвалидируем общий список атрибутов
        queryClient.invalidateQueries({
          queryKey: trpc.productTypeAttributes.getAll.queryKey(),
        });
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/product-types/${productTypeId}/attributes`);
        }
      },
      onError: (error) => {
        toast.error(
          `Ошибка: ${error.message || "Не удалось обновить атрибут"}`,
        );
      },
    })
    : trpc.productTypeAttributes.create.mutationOptions({
      onSuccess: (_data) => {
        toast.success("Атрибут успешно создан");
        // Инвалидируем запросы для конкретного типа продукта
        queryClient.invalidateQueries({
          queryKey: trpc.productTypeAttributes.getByProductType.queryKey({
            productTypeId,
          }),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.productTypeAttributes.getAll.queryKey({
            productTypeId,
          }),
        });
        // Также инвалидируем общий список атрибутов
        queryClient.invalidateQueries({
          queryKey: trpc.productTypeAttributes.getAll.queryKey(),
        });
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/product-types/${productTypeId}/attributes`);
        }
      },
      onError: (error) => {
        toast.error(
          `Ошибка: ${error.message || "Не удалось создать атрибут"}`,
        );
      },
    });

  const { mutate, isPending } = useMutation(mutationOptions);

  const onSubmit = (values: FormValues) => {
    if (isEditMode && values.id) {
      // Для редактирования отправляем данные с id
      const updateData: UpdateProductTypeAttributeInput = {
        id: values.id,
        name: values.name,
        slug: values.slug,
        type: values.type,
        options: values.options,
        isFilterable: values.isFilterable,
        isRequired: values.isRequired,
        sortOrder: values.sortOrder,
        isActive: values.isActive,
        productTypeId: values.productTypeId,
      };
      mutate(updateData);
    } else {
      // Для создания отправляем данные без id
      const createData: CreateProductTypeAttributeInput = {
        name: values.name,
        slug: values.slug,
        type: values.type,
        options: values.options,
        isFilterable: values.isFilterable,
        isRequired: values.isRequired,
        sortOrder: values.sortOrder,
        isActive: values.isActive,
        productTypeId: values.productTypeId,
      };
      mutate(createData);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Верхняя панель с кнопками */}
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center space-x-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                if (onCancel) {
                  onCancel();
                } else {
                  router.push(`/product-types/${productTypeId}/attributes`);
                }
              }}
              disabled={isPending}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Назад
            </Button>
            <div>
              <h2 className="text-lg font-semibold">
                {isEditMode ? "Редактирование атрибута" : "Создание атрибута"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {isEditMode
                  ? "Измените параметры атрибута"
                  : "Создайте новый атрибут для типа продукта"
                }
              </p>
            </div>
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Сохранение..." : isEditMode ? "Обновить" : "Создать"}
          </Button>
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Название атрибута</FormLabel>
              <FormControl>
                <Input placeholder="Введите название атрибута" {...field} />
              </FormControl>
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
                <Input placeholder="Введите slug атрибута" {...field} />
              </FormControl>
              <FormDescription>
                Уникальный идентификатор атрибута (генерируется автоматически)
              </FormDescription>
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
                  placeholder="Введите описание атрибута"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>
                Необязательное описание атрибута
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Тип атрибута</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                Тип определяет, какие данные можно вводить в этот атрибут
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {(form.watch("type") === "select" ||
          form.watch("type") === "multiselect") && (
            <FormField
              control={form.control}
              name="options"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Варианты выбора</FormLabel>
                  <FormControl>
                    <TagInput
                      placeholder="Введите опцию и нажмите Enter"
                      value={field.value || []}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      minLength={2}
                      maxLength={50}
                      allowDuplicates={false}
                      maxTags={20}
                      validateTag={(tag) => {
                        if (/[<>{}]/.test(tag)) {
                          return "Опция не должна содержать специальные символы";
                        }
                        return null;
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Добавьте варианты выбора. Введите опцию и нажмите Enter для
                    добавления. Минимум 2 опции для типов "Выбор из списка" и "Множественный выбор".
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="isRequired"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Обязательный</FormLabel>
                  <FormDescription>Требуется заполнение</FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isFilterable"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Фильтруемый</FormLabel>
                  <FormDescription>Можно фильтровать</FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isSearchable"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Поиск</FormLabel>
                  <FormDescription>Доступен для поиска</FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {form.watch("type") === "number" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="minValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Минимальное значение</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Минимальное значение"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Максимальное значение</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Максимальное значение"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <FormField
          control={form.control}
          name="defaultValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Значение по умолчанию</FormLabel>
              <FormControl>
                <Input
                  placeholder="Значение по умолчанию"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>
                Значение, которое будет установлено по умолчанию
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="sortOrder"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Порядок сортировки</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormDescription>Порядок отображения атрибута</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
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

      </form>
    </Form>
  );
}
