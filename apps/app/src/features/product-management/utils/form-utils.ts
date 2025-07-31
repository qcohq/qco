import { productUpdateSchema } from "@qco/validators";
import { z } from "zod";

export type ProductFormData = z.infer<typeof productUpdateSchema>;

export function validateProductForm(data: ProductFormData): {
  valid: boolean;
  errors?: Record<string, string[]>;
} {
  try {
    productUpdateSchema.parse(data);
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {};

      error.errors.forEach((err) => {
        const path = err.path.join(".");
        if (!errors[path]) {
          errors[path] = [];
        }
        errors[path].push(err.message);
      });

      return { valid: false, errors };
    }

    return {
      valid: false,
      errors: { _form: ["An unexpected error occurred"] },
    };
  }
}

export const formatPrice = (price: number | undefined | null): string => {
  if (!price) return "";
  return price.toFixed(2);
};

export const parsePrice = (value: string): number | undefined => {
  if (!value || value === "") return undefined;
  const parsed = Number.parseFloat(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

export const formatPercent = (percent: number | undefined | null): string => {
  if (!percent) return "";
  return percent.toFixed(2);
};

export const parsePercent = (value: string): number | undefined => {
  if (!value || value === "") return undefined;
  const parsed = Number.parseFloat(value);
  return Number.isNaN(parsed) ? undefined : Math.max(0, Math.min(100, parsed));
};

export const generateDefaultSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
};

export const validateSlug = (slug: string): boolean => {
  const slugRegex = /^[a-z0-9-]+$/;
  return slugRegex.test(slug) && slug.length >= 2 && slug.length <= 255;
};

export const validateSKU = (sku: string): boolean => {
  const skuRegex = /^[a-zA-Z0-9\-_\s]*$/;
  return skuRegex.test(sku) && sku.length <= 100;
};

export const calculateDiscountPercent = (
  basePrice: number,
  salePrice: number,
): number => {
  if (!basePrice || !salePrice || salePrice >= basePrice) return 0;
  return Math.round(((basePrice - salePrice) / basePrice) * 100);
};

export const calculateSalePrice = (
  basePrice: number,
  discountPercent: number,
): number => {
  if (!basePrice || !discountPercent || discountPercent <= 0) return basePrice;
  return Math.round(basePrice * (1 - discountPercent / 100) * 100) / 100;
};

export const validatePriceConsistency = (
  basePrice: number,
  salePrice: number,
  discountPercent: number,
): boolean => {
  if (!basePrice || !salePrice || !discountPercent) return true;

  const expectedSalePrice = calculateSalePrice(basePrice, discountPercent);
  const tolerance = 0.01;

  return Math.abs(salePrice - expectedSalePrice) <= tolerance;
};
