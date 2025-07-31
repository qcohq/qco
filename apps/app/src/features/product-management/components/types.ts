import { z } from "zod";

// Zod схема для атрибута
const attributeSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["select", "multiple", "color", "text"]),
  options: z.array(z.string()),
  required: z.boolean().optional(),
  description: z.string().optional(),
});

// Zod схема для варианта
const variantSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  price: z.number(),
  salePrice: z.number().optional(),
  costPrice: z.number().optional(),
  stock: z.number(),
  minStock: z.number().optional(),
  weight: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  depth: z.number().optional(),
  isActive: z.boolean().optional(),
  isDefault: z.boolean().optional(),
  attributes: z.record(z.string(), z.string()),
});

// Zod схема для шаблона атрибута
const attributeTemplateSchema = z.object({
  name: z.string(),
  type: z.enum(["select", "multiple", "color", "text"]),
  options: z.array(z.string()),
  required: z.boolean(),
});

// Выводим типы из Zod схем
export type Attribute = z.infer<typeof attributeSchema>;
export type Variant = z.infer<typeof variantSchema>;
export type AttributeTemplate = z.infer<typeof attributeTemplateSchema>;

// Экспортируем схемы для использования в других местах
export { attributeSchema, variantSchema, attributeTemplateSchema };

// Утилитарная функция для создания декартова произведения
export function cartesianProduct(arrays: string[][]): string[][] {
  return arrays.reduce(
    (acc, curr) => acc.flatMap((x) => curr.map((y) => [...x, y])),
    [[]] as string[][],
  );
}
