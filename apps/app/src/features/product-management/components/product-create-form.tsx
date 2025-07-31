"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@qco/ui/components/button";
import { Card } from "@qco/ui/components/card";
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
import { Textarea } from "@qco/ui/components/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@qco/ui/components/tooltip";
import { toast } from "@qco/ui/hooks/use-toast";
import { productCreateSchema } from "@qco/validators";
import slugify from "@sindresorhus/slugify";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle,
  ChevronRight,
  HelpCircle,
  Loader2,
  Save,
  Wand2,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { useSlugValidation } from "~/features/product-management/hooks/use-slug-validation";
import { useTRPC } from "~/trpc/react";
import { useProductTypesOptimized } from "../hooks/use-product-types-optimized";
import { ProductEditFormLoading } from "./product-edit-form-loading";

type FormData = z.infer<typeof productCreateSchema>;

// Компонент заголовка формы
function ProductCreateFormHeader({
  isSaving,
  canSubmit,
  onSubmit,
}: {
  isSaving: boolean;
  canSubmit: boolean;
  onSubmit: () => void;
}) {
  return (
    <header className="bg-background sticky top-0 z-10 flex h-14 shrink-0 items-center border-b px-4">
      <div className="flex items-center gap-2">
        <div className="text-muted-foreground flex items-center gap-1 text-sm">
          <Link
            href="/products"
            className="hover:text-foreground transition-colors"
          >
            Товары
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">Новый товар</span>
        </div>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Button
          size="sm"
          className="gap-1"
          onClick={onSubmit}
          disabled={isSaving || !canSubmit}
        >
          <Save className="h-4 w-4" />
          <span>{isSaving ? "Создание..." : "Создать черновик"}</span>
        </Button>
      </div>
    </header>
  );
}

// Компонент основной информации
function ProductCreateFormBasicInfo({
  form,
}: {
  form: ReturnType<typeof useForm<FormData>>;
}) {
  const { control, watch, setValue } = form;
  const trpc = useTRPC();
  const [isGeneratingUnique, setIsGeneratingUnique] = useState(false);

  // Получаем список типов продуктов
  const { productTypes, isLoading: isProductTypesLoading } =
    useProductTypesOptimized();
  const nameValue = watch("name");
  const slugValue = watch("slug");

  // Валидация уникальности слага
  const slugValidation = useSlugValidation({
    slug: slugValue || "",
    enabled: !!slugValue && slugValue.length >= 2,
  });

  // Мутация для генерации уникального слага
  const generateUniqueSlugMutationOptions =
    trpc.products.generateUniqueSlug.mutationOptions({
      onSuccess: (data) => {
        if (data.slug) {
          setValue("slug", data.slug);
          toast({
            title: "Уникальный слаг сгенерирован",
            description: `URL "${data.slug}" создан автоматически`,
          });
        }
      },
      onError: () => {
        toast({
          title: "Ошибка",
          description: "Не удалось сгенерировать уникальный URL",
          variant: "destructive",
        });
      },
      onSettled: () => {
        setIsGeneratingUnique(false);
      },
    });

  const { mutate: generateUniqueSlug } = useMutation(
    generateUniqueSlugMutationOptions,
  );

  useEffect(() => {
    if (nameValue && nameValue.length >= 2) {
      const generatedSlug = slugify(nameValue, {
        lowercase: true,
      });
      setValue("slug", generatedSlug);
    }
  }, [nameValue, setValue]);

  // Функция для ручной генерации слага
  const generateSlug = () => {
    const currentName = watch("name");
    if (currentName && currentName.length >= 2) {
      const generatedSlug = slugify(currentName, {
        lowercase: true,
      });
      setValue("slug", generatedSlug);
      toast({
        title: "Слаг сгенерирован",
        description: `Слаг "${generatedSlug}" создан на основе названия товара`,
      });
    } else {
      toast({
        title: "Ошибка",
        description: "Сначала введите название товара (минимум 2 символа)",
        variant: "destructive",
      });
    }
  };

  // Функция для генерации уникального слага
  const handleGenerateUniqueSlug = () => {
    if (slugValue && slugValue.length >= 2) {
      setIsGeneratingUnique(true);
      generateUniqueSlug({ baseSlug: slugValue });
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-6 w-1 bg-primary rounded-full" />
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Основная информация
          </h2>
          <p className="text-sm text-gray-500">
            Основные данные о товаре, которые будут отображаться в каталоге
          </p>
        </div>
      </div>

      <Card className="p-6 space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Название товара
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Введите название товара"
                    {...field}
                    className="h-10"
                  />
                </FormControl>
                <FormDescription className="text-xs text-gray-500">
                  Название товара, которое будет отображаться в каталоге
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  URL-адрес (слаг)
                </FormLabel>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <FormControl>
                      <Input
                        placeholder="url-tovara"
                        {...field}
                        className={`h-10 pr-10 ${slugValidation.isAvailable === false ? "border-destructive" : slugValidation.isAvailable === true ? "border-green-500" : ""}`}
                      />
                    </FormControl>
                    {/* Индикатор статуса валидации */}
                    {slugValue && slugValue.length >= 2 && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {slugValidation.isChecking ? (
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        ) : slugValidation.isAvailable === true ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : slugValidation.isAvailable === false ? (
                          <XCircle className="h-4 w-4 text-destructive" />
                        ) : null}
                      </div>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={generateSlug}
                    disabled={!nameValue}
                    className="h-10 w-10"
                    title="Сгенерировать слаг из названия"
                  >
                    <Wand2 className="h-4 w-4" />
                  </Button>
                </div>
                <FormDescription className="text-xs text-gray-500">
                  Уникальный URL-адрес для страницы товара. Генерируется
                  автоматически из названия или нажмите кнопку для ручной
                  генерации.
                </FormDescription>
                {/* Показываем ошибку дублирования слага */}
                {slugValidation.isAvailable === false &&
                  slugValidation.existingProduct && (
                    <div className="space-y-2">
                      <p className="text-sm text-destructive">
                        URL уже используется товаром "
                        {slugValidation.existingProduct.name}"
                      </p>
                      <button
                        type="button"
                        onClick={handleGenerateUniqueSlug}
                        disabled={isGeneratingUnique}
                        className="text-sm text-blue-600 hover:text-blue-800 underline disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isGeneratingUnique ? (
                          <>
                            <Loader2 className="inline h-3 w-3 animate-spin mr-1" />
                            Генерируем уникальный URL...
                          </>
                        ) : (
                          "Сгенерировать уникальный URL"
                        )}
                      </button>
                    </div>
                  )}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="productTypeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Тип продукта
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isProductTypesLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите тип продукта" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {isProductTypesLoading ? (
                      <SelectItem value="loading" disabled>
                        Загрузка...
                      </SelectItem>
                    ) : productTypes.length > 0 ? (
                      productTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="empty" disabled>
                        Нет доступных типов продуктов
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormDescription className="text-xs text-gray-500">
                  Выберите тип продукта для правильной категоризации
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="description"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel className="text-sm font-medium text-gray-700">
                  Описание
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Введите описание товара"
                    className="min-h-32 resize-none"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormDescription className="text-xs text-gray-500">
                  Полное описание товара, которое будет отображаться на странице
                  товара
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="sku"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Артикул
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Введите артикул товара"
                    {...field}
                    value={field.value ?? ""}
                    className="h-10"
                  />
                </FormControl>
                <FormDescription className="text-xs text-gray-500">
                  Уникальный идентификатор товара в вашем каталоге
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </Card>
    </section>
  );
}

// Компонент ценообразования
function ProductCreateFormPricing({
  form,
}: {
  form: ReturnType<typeof useForm<FormData>>;
}) {
  const { control } = form;

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-6 w-1 bg-primary rounded-full" />
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Ценообразование
          </h2>
          <p className="text-sm text-gray-500">
            Настройте цены товара для отображения в каталоге
          </p>
        </div>
      </div>

      <Card className="p-6 space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={control}
            name="basePrice"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-1">
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Базовая цена
                  </FormLabel>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Текущая цена товара, по которой он продается. Это
                          основная цена без учета скидок
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const value =
                        e.target.value === ""
                          ? undefined
                          : Number(e.target.value);
                      field.onChange(value);
                    }}
                    className="h-10"
                  />
                </FormControl>
                <FormDescription className="text-xs text-gray-500">
                  Основная цена товара без скидки
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="salePrice"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-1">
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Цена со скидкой
                  </FormLabel>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Специальная цена со скидкой. Если указана, то именно
                          она будет показана покупателям вместо базовой цены
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const value =
                        e.target.value === ""
                          ? undefined
                          : Number(e.target.value);
                      field.onChange(value);
                    }}
                    className="h-10"
                  />
                </FormControl>
                <FormDescription className="text-xs text-gray-500">
                  Цена товара со скидкой (если применима)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </Card>
    </section>
  );
}

// Компонент информационного блока
function ProductCreateFormInfo() {
  return (
    <section className="space-y-6">
      <Card className="border-blue-200 bg-blue-50 p-6">
        <div className="flex items-start gap-3">
          <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <div className="h-2 w-2 rounded-full bg-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-blue-900 mb-1">
              Создание черновика товара
            </h3>
            <p className="text-sm text-blue-800">
              Товар будет создан в статусе "Черновик". После создания вы сможете
              добавить изображения, варианты товара, категории и другие
              настройки на странице редактирования.
            </p>
          </div>
        </div>
      </Card>
    </section>
  );
}

export function ProductCreateForm() {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm({
    resolver: zodResolver(productCreateSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      sku: "",
      isActive: true,
      isFeatured: false,
      isNew: false,
      isTaxable: true,
      productTypeId: "", // Добавляем поле для типа продукта
    },
  });

  const {
    formState: { isDirty, isValid, errors },
    watch,
    handleSubmit,
  } = form;

  const nameValue = watch("name");
  const slugValue = watch("slug");

  // Определяем, можно ли отправить форму
  const canSubmit = (): boolean => {
    if (isSaving) {
      return false;
    }

    // Для черновиков достаточно названия и слага
    return Boolean(
      isDirty &&
        nameValue &&
        slugValue &&
        nameValue.trim().length >= 2 &&
        slugValue.trim().length >= 2,
    );
  };

  // Получение категорий - нужно только для проверки загрузки
  const categoriesQueryOptions = trpc.categories.tree.queryOptions();
  const { isLoading: isCategoriesLoading, error: categoriesError } = useQuery(
    categoriesQueryOptions,
  );

  // Обработка ошибок загрузки
  useEffect(() => {
    if (categoriesError) {
      const errorMessage =
        categoriesError.message ?? "Произошла ошибка при загрузке категорий";
      toast({
        title: "Ошибка",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [categoriesError]);

  // Мутация создания продукта
  const createProductMutationOptions = trpc.products.create.mutationOptions({
    onSuccess: (data) => {
      // Инвалидируем кэш списка товаров
      void queryClient.invalidateQueries({
        queryKey: trpc.products.list.queryKey(),
      });

      toast({
        title: "Успех",
        description: `Товар "${data.name}" успешно создан как черновик`,
      });
      // Перенаправляем пользователя на страницу редактирования товара после успешного создания
      void router.push(`/products/${data.id}/edit`);
    },
    onError: (error) => {
      // Определяем тип ошибки для более точного сообщения
      let errorTitle = "Ошибка";
      let errorDescription = "Не удалось создать товар";

      if (error.data?.code === "CONFLICT") {
        errorTitle = "Конфликт данных";
        errorDescription = error.message || "Товар с таким URL уже существует";
      } else if (error.data?.code === "BAD_REQUEST") {
        errorTitle = "Некорректные данные";
        errorDescription =
          error.message || "Проверьте правильность заполнения полей";
      } else if (error.data?.code === "UNAUTHORIZED") {
        errorTitle = "Ошибка авторизации";
        errorDescription = "У вас нет прав для создания товаров";
      } else if (error.data?.code === "INTERNAL_SERVER_ERROR") {
        errorTitle = "Ошибка сервера";
        errorDescription =
          error.message || "Произошла внутренняя ошибка сервера";
      } else {
        // Для остальных ошибок используем сообщение из сервера
        errorDescription = error.message || "Произошла неизвестная ошибка";
      }

      toast({
        title: errorTitle,
        description: errorDescription,
        variant: "destructive",
      });
    },
  });

  const { mutateAsync: createProduct } = useMutation(
    createProductMutationOptions,
  );

  // Обработчик отправки формы
  async function onSubmit(values: FormData) {
    try {
      setIsSaving(true);

      // Проверяем обязательные поля для черновика
      const requiredFields = ["name", "slug", "productTypeId"];
      const hasRequiredFields = requiredFields.every((field) => {
        const value = values[field as keyof FormData];
        return value && String(value).trim().length > 0;
      });

      if (!hasRequiredFields) {
        toast({
          title: "Ошибка валидации",
          description:
            "Для создания товара обязательно заполните название, URL товара и выберите тип продукта",
          variant: "destructive",
        });
        return;
      }

      // Создаем товар в статусе черновика (по умолчанию в API)
      await createProduct(values);
    } catch (_error) {
      // Ошибка обработается в onError мутации
    } finally {
      setIsSaving(false);
    }
  }

  // Загрузка
  if (isCategoriesLoading) {
    return <ProductEditFormLoading />;
  }

  return (
    <Form {...form}>
      <div className="flex min-h-screen flex-col bg-gray-50/50">
        <ProductCreateFormHeader
          isSaving={isSaving}
          canSubmit={canSubmit()}
          onSubmit={handleSubmit(onSubmit)}
        />

        <div className="flex-1">
          <div className="container mx-auto max-w-4xl px-4 py-6">
            <div className="space-y-8">
              <ProductCreateFormInfo />
              <ProductCreateFormBasicInfo form={form} />
              <ProductCreateFormPricing form={form} />
            </div>
          </div>
        </div>
      </div>
    </Form>
  );
}
