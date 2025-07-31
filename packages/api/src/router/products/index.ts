import type { TRPCRouterRecord } from "@trpc/server";

import { bulkDelete } from "./bulk-delete";
import { addImage } from "./add-image";
import { checkSlug } from "./check-slug";
import { create } from "./create";
import { deleteProduct } from "./delete";
import { deleteImage } from "./delete-image";
import { duplicate } from "./duplicate";
import { generateUniqueSlug } from "./generate-unique-slug";
import { getById } from "./get-by-id";
import { list } from "./list";
import { setMainImage } from "./set-main-image";
import { setOutOfStock } from "./set-out-of-stock";
import { update } from "./update";
import { updateImagesOrder } from "./update-images-order";
import { specificationsRouter } from "./specifications";

export const productsRouter = {
  deleteImage,
  getById,
  list,
  create,
  update,
  addImage,
  delete: deleteProduct,
  duplicate,
  setMainImage,
  setOutOfStock,
  bulkDelete,
  updateImagesOrder,
  checkSlug,
  generateUniqueSlug,
  specifications: specificationsRouter,
} satisfies TRPCRouterRecord;
