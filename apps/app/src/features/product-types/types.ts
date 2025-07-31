import type {
  ProductType,
  ProductTypeAttribute,
  ProductAttributeValue,
} from "@qco/validators";

export type { ProductType, ProductTypeAttribute, ProductAttributeValue };

export interface ProductTypeFormData {
  name: string;
  slug: string;
  description?: string;
}

export interface ProductTypeTableProps {
  productTypes: ProductType[];
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

// TODO: Использовать тип из схемы пропсов формы типа продукта, если появится в @qco/validators
export interface ProductTypeFormProps {
  productTypeId?: string;
}

export interface ProductTypeAttributeFormData {
  name: string;
  slug: string;
  type: "text" | "number" | "boolean" | "select" | "multiselect";
  options: string[];
  isFilterable: boolean;
  sortOrder: number;
  isRequired: boolean;
}

export interface ProductTypeAttributeFormProps {
  attributeId?: string;
  productTypeId: string;
}

export interface ProductTypeAttributesTableProps {
  attributes: ProductTypeAttribute[];
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}
