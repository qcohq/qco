import type { ProductItem, ProductUpdateInput } from "@qco/validators";

// Используем типы из валидаторов вместо RouterOutputs
export type Product = ProductItem;

export interface ProductAttribute {
  id: string;
  name: string;
  values: string[];
}

// TODO: Использовать тип из схемы данных формы продукта, если появится в @qco/validators
export interface ProductFormData {
  id?: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  isFeatured: boolean;
  isNew: boolean;
  sku?: string;
  brandId?: string;
  categories?: string[];
  files?: Product["files"];
}

// TODO: Использовать тип из схемы пропсов формы продукта, если появится в @qco/validators
// TODO: Использовать тип из схемы пропсов менеджера атрибутов, если появится в @qco/validators

// Экспортируем типы из валидаторов
export type { ProductItem, ProductUpdateInput };
