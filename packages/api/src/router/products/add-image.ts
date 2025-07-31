import { TRPCError } from "@trpc/server";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";

import { files, products, productFiles } from "@qco/db/schema";
import { getFileUrl } from "@qco/lib";

import { resolveFileIdOrPath } from "../../lib/resolve-file-id-or-path";
import { protectedProcedure } from "../../trpc";

export const addImage = protectedProcedure
  .input(
    z.object({
      productId: z.string(),
      file: z.object({
        fileId: z.string(), // fileId или path (после загрузки на S3)
        type: z.string().default("gallery"), // gallery | main | ...
        order: z.number().optional(),
        alt: z.string().optional(),
        meta: z
          .object({
            name: z.string().optional(),
            mimeType: z.string().optional(),
            size: z.number().optional(),
          })
          .optional(),
      }),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    try {
      // Проверяем существование продукта
      const product = await ctx.db.query.products.findFirst({
        where: eq(products.id, input.productId),
      });
      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Товар с ID ${input.productId} не найден`,
        });
      }
      // Получаем/создаём fileId (resolveFileIdOrPath создаёт File при необходимости)
      const fileId = await resolveFileIdOrPath({
        ctx,
        fileIdOrPath: input.file.fileId,
        fileType: "product_image",
        uploadedBy: ctx.session?.user?.id ?? "system",
        meta: input.file.meta,
      });
      // Определяем порядок
      let order = input.file.order;
      if (typeof order !== "number") {
        const maxOrderResult = await ctx.db
          .select({ maxOrder: sql`max("order")` })
          .from(productFiles)
          .where(eq(productFiles.productId, input.productId));
        order = (Number(maxOrderResult[0]?.maxOrder) || 0) + 1;
      }
      // Создаём ProductFile
      const [productFile] = await ctx.db
        .insert(productFiles)
        .values({
          productId: input.productId,
          fileId,
          type: input.file.type,
          order,
          alt: input.file.alt ?? input.file.meta?.name ?? "",
        })
        .returning();
      // Получаем file для ответа (с url)
      const file = await ctx.db.query.files.findFirst({
        where: eq(files.id, fileId),
      });
      let url = null;
      if (file?.path) {
        url = getFileUrl(file.path);
      }
      return {
        ...productFile,
        meta: {
          url,
          name: file?.name ?? null,
          mimeType: file?.mimeType ?? null,
          size: file?.size ?? null,
        },
      };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Ошибка добавления изображения: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  });
