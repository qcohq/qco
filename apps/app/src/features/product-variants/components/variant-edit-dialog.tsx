"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@qco/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@qco/ui/components/dialog";
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
import { Switch } from "@qco/ui/components/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@qco/ui/components/tooltip";
import { toast } from "@qco/ui/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HelpCircle } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { useTRPC } from "~/trpc/react";
import { variantEditSchema, type VariantEditData } from "../types";

interface VariantEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant: {
    id: string;
    attributes?: { option: string; value: string }[];
  } & VariantEditData;
  productId: string;
}

export function VariantEditDialog({
  open,
  onOpenChange,
  variant,
  productId,
}: VariantEditDialogProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // Инициализируем форму с данными варианта
  const defaultValues: VariantEditData = {
    name: variant.name ?? "",
    sku: variant.sku ?? "",
    barcode: variant.barcode ?? "",
    price: variant.price ?? undefined,
    salePrice: variant.salePrice ?? undefined,
    costPrice: variant.costPrice ?? undefined,
    stock: variant.stock ?? undefined,
    isActive: variant.isActive ?? true,
    isDefault: variant.isDefault ?? false,
  };

  // Инициализируем форму
  const form = useForm({
    resolver: zodResolver(variantEditSchema),
    defaultValues,
  });

  // Обновляем форму при изменении варианта
  useEffect(() => {
    form.reset(defaultValues);
  }, [variant, form]);

  console.log(form.formState.errors);
  // Создаем опции мутации с помощью mutationOptions
  const updateVariantMutationOptions =
    trpc.productVariants.updateVariant.mutationOptions({
      onSuccess: (_data) => {
        // Инвалидируем кэш запроса списка вариантов
        queryClient.invalidateQueries({
          queryKey: trpc.productVariants.getVariants.queryKey({ productId }),
        });

        // Закрываем диалог
        onOpenChange(false);

        toast({
          title: "Успех",
          description: "Вариант успешно обновлен",
        });
      },
      onError: (error) => {
        toast({
          title: "Ошибка",
          description: error.message || "Не удалось обновить вариант",
          variant: "destructive",
        });
      },
    });

  // Используем опции с хуком useMutation
  const { mutate, isPending } = useMutation(updateVariantMutationOptions);

  // Обработчик отправки формы
  function onSubmit(values: VariantEditData) {
    mutate({
      id: variant.id,
      ...values,
      salePrice: values.salePrice ?? undefined,
      costPrice: values.costPrice ?? undefined,
    });
  }

  // Получаем строку с атрибутами варианта
  const getAttributesString = () => {
    if (!variant.attributes || variant.attributes.length === 0) {
      return "Без атрибутов";
    }

    return variant.attributes
      .map((attr) => `${attr.option}: ${attr.value}`)
      .join(", ");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Редактировать вариант</DialogTitle>
        </DialogHeader>

        <div className="mb-4">
          <h3 className="mb-1 text-sm font-medium">Опции варианта:</h3>
          <p className="text-muted-foreground text-sm">
            {getAttributesString()}
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название (необязательно)</FormLabel>
                  <FormControl>
                    <Input placeholder="Название варианта" {...field} />
                  </FormControl>
                  <FormDescription>
                    Если не указано, будет использоваться комбинация опций
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sku"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SKU (необязательно)</FormLabel>
                  <FormControl>
                    <Input placeholder="SKU" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="barcode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Штрихкод (необязательно)</FormLabel>
                  <FormControl>
                    <Input placeholder="Штрихкод" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-1">
                      <FormLabel>Базовая цена</FormLabel>
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
                        placeholder="Базовая цена"
                        min={0}
                        step="0.01"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(
                            value === "" ? undefined : Number(value),
                          );
                        }}
                        value={field.value === undefined || field.value === null ? "" : field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="costPrice"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-1">
                      <FormLabel>Себестоимость</FormLabel>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Себестоимость товара для расчета прибыли. Не
                              отображается покупателям
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Себестоимость"
                        min={0}
                        step="0.01"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(
                            value === "" ? undefined : Number(value),
                          );
                        }}
                        value={field.value === undefined || field.value === null ? "" : field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="salePrice"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-1">
                      <FormLabel>Цена со скидкой</FormLabel>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Специальная цена со скидкой. Если указана, то
                              именно она будет показана покупателям вместо
                              базовой цены
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Цена со скидкой"
                        min={0}
                        step="0.01"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(
                            value === "" ? undefined : Number(value),
                          );
                        }}
                        value={field.value === undefined || field.value === null ? "" : field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Количество на складе</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Количество"
                      min={0}
                      step="1"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(
                          value === "" ? undefined : Number(value),
                        );
                      }}
                      value={field.value === undefined ? "" : field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Активен</FormLabel>
                    <FormDescription>
                      Вариант будет виден покупателям
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value ?? true}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isDefault"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Вариант по умолчанию</FormLabel>
                    <FormDescription>
                      Этот вариант будет выбран по умолчанию при просмотре товара
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value ?? false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Отмена
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Сохранение..." : "Сохранить"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
