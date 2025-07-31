import { Card } from "@qco/ui/components/card";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@qco/ui/components/select";
import { Textarea } from "@qco/ui/components/textarea";
import type { productCreateSchema } from "@qco/validators";
import type { useForm } from "react-hook-form";
import type { z } from "zod";
import { useProductTypesOptimized } from "../hooks/use-product-types-optimized";


type FormData = z.infer<typeof productCreateSchema>;

export function ProductCreateFormBasicInfo({
  form,
}: {
  form: ReturnType<typeof useForm<FormData>>;
}) {
  const { productTypes, isLoading: isProductTypesLoading } =
    useProductTypesOptimized();

  const { control } = form;

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Основная информация</h2>
      <Card className="p-6 space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Название продукта
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    {...field}
                    value={field.value || ""}
                    placeholder="Введите название продукта"
                  />
                </FormControl>
                <FormDescription className="text-xs text-gray-500">
                  Введите название продукта (максимум 255 символов)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Описание продукта
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value || ""}
                    rows={4}
                    placeholder="Опишите характеристики и особенности продукта"
                  />
                </FormControl>
                <FormDescription className="text-xs text-gray-500">
                  Опишите характеристики и особенности продукта (максимум 2000
                  символов)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="basePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Базовая цена
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    value={field.value || ""}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </FormControl>
                <FormDescription className="text-xs text-gray-500">
                  Укажите базовую цену продукта в рублях
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
                <FormLabel className="text-sm font-medium text-gray-700">
                  Цена со скидкой
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    value={field.value || ""}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </FormControl>
                <FormDescription className="text-xs text-gray-500">
                  Укажите цену со скидкой (необязательно)
                </FormDescription>
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
                <FormControl>
                  <Select
                    value={field.value || ""}
                    onValueChange={field.onChange}
                    disabled={isProductTypesLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите тип продукта" />
                    </SelectTrigger>
                    <SelectContent>
                      {productTypes.map((type: ProductType) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription className="text-xs text-gray-500">
                  Выберите тип продукта для корректного отображения атрибутов и
                  фильтров
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
