"use client";

import { Button } from "@qco/ui/components/button";
import { Checkbox } from "@qco/ui/components/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@qco/ui/components/form";
import { Input } from "@qco/ui/components/input";
import { Label } from "@qco/ui/components/label";
import { toast } from "@qco/ui/hooks/use-toast";
import type { ProductUpdateInput } from "@qco/validators";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

import { useTRPC } from "~/trpc/react";

interface ProductEditFormSettingsProps {
  isNewProduct: boolean;
  onDelete: () => void;
  isDeleting: boolean;
  productId: string;
}

export function ProductEditFormSettings({
  isNewProduct,
  onDelete,
  isDeleting,
  productId,
}: ProductEditFormSettingsProps) {
  const { control, setValue } = useFormContext<ProductUpdateInput>();
  const [isSettingOutOfStock, setIsSettingOutOfStock] = useState(false);

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const handleChange = <T extends keyof ProductUpdateInput>(
    field: T,
    value: ProductUpdateInput[T],
  ) => {
    setValue(field, value, { shouldDirty: true, shouldValidate: true });
  };

  // Мутация для обнуления остатков
  const setOutOfStockMutation = useMutation(
    trpc.products.setOutOfStock.mutationOptions({
      onSuccess: (data) => {
        setIsSettingOutOfStock(false);
        toast({
          title: "Успех",
          description: `Остатки обнулены. Обновлено ${data.variantsUpdated} вариантов.`,
        });

        // Инвалидируем запросы для обновления данных
        queryClient.invalidateQueries({
          queryKey: trpc.products.getById.queryKey({ id: productId }),
        });
      },
      onError: (error) => {
        setIsSettingOutOfStock(false);
        toast({
          title: "Ошибка",
          description: error.message || "Не удалось обнулить остатки",
          variant: "destructive",
        });
      },
    }),
  );

  // Обработчик обнуления остатков
  const handleSetOutOfStock = () => {
    setIsSettingOutOfStock(true);
    setOutOfStockMutation.mutate({ productId });
  };
  return (
    <section id="settings" className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-6 w-1 bg-primary rounded-full" />
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Дополнительные настройки
          </h2>
          <p className="text-sm text-gray-500">
            Настройте видимость и дополнительные параметры товара
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <FormField
              control={control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <Label
                    className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-4 has-[[data-state=checked]]:border-green-600 has-[[data-state=checked]]:bg-green-50 dark:has-[[data-state=checked]]:border-green-900 dark:has-[[data-state=checked]]:bg-green-950 cursor-pointer"
                    htmlFor="isActive"
                  >
                    <FormControl>
                      <Checkbox
                        id="isActive"
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          handleChange("isActive", checked);
                        }}
                        className="shadow-none data-[state=checked]:border-green-600 data-[state=checked]:bg-green-600"
                      />
                    </FormControl>
                    <div className="grid gap-1 font-normal">
                      <div className="font-medium text-gray-700">
                        Товар активен
                      </div>
                      <div className="text-muted-foreground leading-snug text-xs text-gray-500">
                        Активные товары отображаются в магазине
                      </div>
                    </div>
                  </Label>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <Label
                    className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-4 has-[[data-state=checked]]:border-green-600 has-[[data-state=checked]]:bg-green-50 dark:has-[[data-state=checked]]:border-green-900 dark:has-[[data-state=checked]]:bg-green-950 cursor-pointer"
                    htmlFor="isFeatured"
                  >
                    <FormControl>
                      <Checkbox
                        id="isFeatured"
                        checked={field.value ?? false}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          handleChange("isFeatured", checked);
                        }}
                        className="shadow-none data-[state=checked]:border-green-600 data-[state=checked]:bg-green-600"
                      />
                    </FormControl>
                    <div className="grid gap-1 font-normal">
                      <div className="font-medium text-gray-700">
                        Рекомендуемый товар
                      </div>
                      <div className="text-muted-foreground leading-snug text-xs text-gray-500">
                        Отображается на главной странице и в рекомендациях
                      </div>
                    </div>
                  </Label>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="isNew"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <Label
                    className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-4 has-[[data-state=checked]]:border-green-600 has-[[data-state=checked]]:bg-green-50 dark:has-[[data-state=checked]]:border-green-900 dark:has-[[data-state=checked]]:bg-green-950 cursor-pointer"
                    htmlFor="isNew"
                  >
                    <FormControl>
                      <Checkbox
                        id="isNew"
                        checked={field.value ?? false}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          handleChange("isNew", checked);
                        }}
                        className="shadow-none data-[state=checked]:border-green-600 data-[state=checked]:bg-green-600"
                      />
                    </FormControl>
                    <div className="grid gap-1 font-normal">
                      <div className="font-medium text-gray-700">Новинка</div>
                      <div className="text-muted-foreground leading-snug text-xs text-gray-500">
                        Отображается в разделе новинок и с соответствующим
                        бейджем
                      </div>
                    </div>
                  </Label>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="isTaxable"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <Label
                    className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-4 has-[[data-state=checked]]:border-green-600 has-[[data-state=checked]]:bg-green-50 dark:has-[[data-state=checked]]:border-green-900 dark:has-[[data-state=checked]]:bg-green-950 cursor-pointer"
                    htmlFor="isTaxable"
                  >
                    <FormControl>
                      <Checkbox
                        id="isTaxable"
                        checked={field.value !== false}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          handleChange("isTaxable", checked);
                        }}
                        className="shadow-none data-[state=checked]:border-green-600 data-[state=checked]:bg-green-600"
                      />
                    </FormControl>
                    <div className="grid gap-1 font-normal">
                      <div className="font-medium text-gray-700">
                        Облагается налогом
                      </div>
                      <div className="text-muted-foreground leading-snug text-xs text-gray-500">
                        Налог будет рассчитан автоматически
                      </div>
                    </div>
                  </Label>
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <FormField
              control={control}
              name="sku"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Артикул (SKU)
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
                    Уникальный идентификатор товара
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Кнопка обнуления остатков */}
        {!isNewProduct && (
          <div className="border-t border-gray-200 pt-6">
            <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
              <h3 className="mb-3 text-base font-medium text-orange-800">
                Управление остатками
              </h3>
              <p className="mb-4 text-sm text-orange-700">
                Обнулит остатки основного товара и всех его вариантов. Действие
                можно отменить, установив новые значения.
              </p>
              <Button
                variant="destructive"
                onClick={handleSetOutOfStock}
                disabled={isSettingOutOfStock}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {isSettingOutOfStock ? "Обнуление..." : "Нет в наличии"}
              </Button>
            </div>
          </div>
        )}

        {/* Кнопка удаления товара */}
        {!isNewProduct && (
          <div className="border-t border-gray-200 pt-6">
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <h3 className="mb-3 text-base font-medium text-red-800">
                Опасная зона
              </h3>
              <p className="mb-4 text-sm text-red-700">
                Удаление товара нельзя отменить. Все данные будут безвозвратно
                удалены.
              </p>
              <Button
                variant="destructive"
                onClick={onDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700"
              >
                {isDeleting ? "Удаление..." : "Удалить товар"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
