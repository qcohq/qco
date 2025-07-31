import { z } from "zod";

export const productSpecificationSchema = z.object({
    id: z.string(),
    productId: z.string(),
    name: z.string(),
    value: z.string(),
    unit: z.string().optional(),
    group: z.string().optional(),
    sortOrder: z.number(),
    isActive: z.boolean(),
    isFilterable: z.boolean(),
});

export type ProductSpecificationSchema = z.infer<typeof productSpecificationSchema>;

export const createProductSpecificationSchema = productSpecificationSchema.omit({ id: true }).extend({ productId: z.string() });
export const updateProductSpecificationSchema = productSpecificationSchema.pick({ id: true, productId: true }).extend({
    name: z.string(),
    value: z.string(),
    unit: z.string().optional(),
    group: z.string().optional(),
    sortOrder: z.number(),
    isActive: z.boolean(),
    isFilterable: z.boolean(),
});
export const deleteProductSpecificationSchema = z.object({ id: z.string(), productId: z.string() }); 