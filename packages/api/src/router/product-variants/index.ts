import type { TRPCRouterRecord } from "@trpc/server";

import { addOptionValue } from "./add-option-value";
import { createOption } from "./create-option";
import { createVariant } from "./create-variant";
import { deleteOption } from "./delete-option";
import { deleteOptionValue } from "./delete-option-value";
import { deleteVariant } from "./delete-variant";
import { duplicateVariant } from "./duplicate-variant";
import { generateVariants } from "./generate-variants";
import { getOptions } from "./get-options";
import { getVariants } from "./get-variants";
import { previewVariants } from "./preview-variants";
import { updateOption } from "./update-option";
import { updateOptionValue } from "./update-option-value";
import { updatePrices } from "./update-prices";
import { updateStock } from "./update-stock";
import { updateVariant } from "./update-variant";

export const productVariantsRouter = {
  addOptionValue,
  createOption,
  createVariant,
  deleteOption,
  deleteOptionValue,
  deleteVariant,
  duplicateVariant,
  generateVariants,
  getOptions,
  getVariants,
  previewVariants,
  updateOption,
  updateOptionValue,
  updatePrices,
  updateStock,
  updateVariant,
} satisfies TRPCRouterRecord
