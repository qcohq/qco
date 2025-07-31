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
import { HelpCircle } from "lucide-react";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import {
  calculateDiscountPercent,
  calculateSalePrice,
} from "../utils/form-utils";

export function ProductEditFormPricing() {
  const { control, watch, setValue } = useFormContext();
  const formData = watch();
  const basePrice = formData.basePrice as number | undefined;
  const salePrice = formData.salePrice as number | undefined;
  const discountPercent = formData.discountPercent as number | undefined;

  // Вычисляем процент скидки и цену со скидкой с помощью утилит
  const computedDiscountPercent = calculateDiscountPercent(
    basePrice || 0,
    salePrice || 0,
  );

  // Автоматически обновляем цену со скидкой при изменении процента скидки
  useEffect(() => {
    if (
      basePrice &&
      discountPercent &&
      discountPercent > 0 &&
      discountPercent <= 100
    ) {
      const newSalePrice = calculateSalePrice(basePrice, discountPercent);
      setValue("salePrice", newSalePrice, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }, [basePrice, discountPercent, setValue]);

  return (
    <section id="pricing" className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-6 w-1 bg-primary rounded-full" />
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Ценообразование
          </h2>
          <p className="text-sm text-gray-500">
            Настройте цены и скидки для товара
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
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

          <FormField
            control={control}
            name="discountPercent"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Процент скидки
                  </FormLabel>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Процент скидки от базовой цены. При изменении
                          автоматически обновляется цена со скидкой
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    min="0"
                    max="100"
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
                  Процент скидки от базовой цены (0-100%)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {basePrice && salePrice && salePrice < basePrice && (
          <div className="rounded-lg bg-green-50 p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800">
                  Скидка: {computedDiscountPercent}%
                </p>
                <p className="text-sm text-green-600">
                  Экономия: {(basePrice - salePrice || 0).toFixed(2)} ₽
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-green-800">
                  {salePrice.toFixed(2)} ₽
                </p>
                <p className="text-sm text-green-600 line-through">
                  {basePrice.toFixed(2)} ₽
                </p>
              </div>
            </div>
          </div>
        )}

        {basePrice && salePrice && salePrice >= basePrice && (
          <div className="rounded-lg bg-yellow-50 p-4 border border-yellow-200">
            <p className="text-sm text-yellow-800">
              ⚠️ Цена со скидкой должна быть меньше базовой цены
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
