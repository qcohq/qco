import { TRPCError } from "@trpc/server";
import { eq } from "@qco/db";
import { banners, bannerFiles, categories } from "@qco/db/schema";
import { protectedProcedure } from "../../trpc";
import { resolveFileIdOrPath } from "../../lib/resolve-file-id-or-path";

import { createBannerSchema } from "@qco/validators";

export const create = protectedProcedure
  .input(createBannerSchema)
  .mutation(async ({ input, ctx }) => {
    try {
      const {
        title,
        subtitle,
        description,
        link,
        buttonText,
        buttonLink,
        isActive,
        isFeatured,
        sortOrder,
        position,
        page,
        categoryId,
        files,
      } = input;

      // Валидируем categoryId, если он передан
      let validatedCategoryId = categoryId ?? null;
      if (categoryId && categoryId.trim() !== "") {
        const category = await ctx.db.query.categories.findFirst({
          where: eq(categories.id, categoryId),
        });

        if (!category) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Категория с ID ${categoryId} не найдена`,
          });
        }
      } else {
        // Если categoryId пустой или не передан, устанавливаем null
        validatedCategoryId = null;
      }

      // Создаем баннер
      const [createdBanner] = await ctx.db
        .insert(banners)
        .values({
          name: title, // Используем title в качестве name
          title,
          subtitle,
          description,
          link,
          buttonText,
          buttonLink,
          isActive,
          isFeatured,
          sortOrder,
          position,
          page: page || null, // Используем page из схемы API
          categoryId: validatedCategoryId,
          createdBy: ctx.session?.user.id ?? "",
          updatedBy: ctx.session?.user.id ?? "",
        })
        .returning();

      if (!createdBanner) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Не удалось создать баннер",
        });
      }

      // Обрабатываем файлы
      if (files && files.length > 0) {
        const bannerFilesData = await Promise.all(
          files.map(async (file, index) => {
            // Используем resolveFileIdOrPath для создания записи в таблице files, если её нет
            const resolvedFileId = await resolveFileIdOrPath({
              ctx,
              fileIdOrPath: file.fileId,
              fileType: "banner",
              uploadedBy: ctx.session?.user?.id || "system",
              meta: file.meta,
            });

            return {
              bannerId: createdBanner.id,
              fileId: resolvedFileId,
              type: file.type,
              order: file.order || index,
            };
          })
        );

        await ctx.db.insert(bannerFiles).values(bannerFilesData);
      }

      return createdBanner;
    } catch (error) {
      if (error instanceof TRPCError) throw error;

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error instanceof Error ? error.message : "Ошибка при создании баннера",
      });
    }
  }); 
