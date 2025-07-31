import type {
  createProductTypeAttributeSchema,
  productTypeAttributeSchema,
  updateProductTypeAttributeSchema,
} from "@qco/validators";
import type { z } from "zod";

export type ProductTypeAttribute = z.infer<typeof productTypeAttributeSchema>;
export type CreateProductTypeAttribute = z.infer<
  typeof createProductTypeAttributeSchema
>;
export type UpdateProductTypeAttribute = z.infer<
  typeof updateProductTypeAttributeSchema
>;
