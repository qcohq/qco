import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@qco/ui/components/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@qco/ui/components/select";
import React from "react";
import { useProductTypesOptimized } from "../hooks/use-product-types-optimized";

interface ProductTypeSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
}

export const ProductTypeSelect = React.memo(
  ({
    value,
    onValueChange,
    disabled = false,
    label = "Тип продукта",
    description = "Выберите тип продукта для корректного отображения атрибутов и фильтров",
  }: ProductTypeSelectProps) => {
    const { productTypes, isLoading, isError } = useProductTypesOptimized();

    if (isError) {
      return (
        <FormItem>
          <FormLabel className="text-sm font-medium text-gray-700">
            {label}
          </FormLabel>
          <FormControl>
            <div className="text-sm text-red-600">
              Ошибка загрузки типов продуктов
            </div>
          </FormControl>
        </FormItem>
      );
    }

    return (
      <FormItem>
        <FormLabel className="text-sm font-medium text-gray-700">
          {label}
        </FormLabel>
        <FormControl>
          <Select
            value={value}
            onValueChange={onValueChange}
            disabled={disabled || isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Выберите тип продукта" />
            </SelectTrigger>
            <SelectContent>
              {productTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormControl>
        {description && (
          <div className="text-xs text-gray-500">{description}</div>
        )}
        <FormMessage />
      </FormItem>
    );
  },
);

ProductTypeSelect.displayName = "ProductTypeSelect";
