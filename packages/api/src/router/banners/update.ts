import { TRPCError } from "@trpc/server";
import { eq, asc } from "@qco/db";

import { banners, bannerFiles, categories } from "@qco/db/schema";
import { protectedProcedure } from "../../trpc";
import { resolveFileIdOrPath } from "../../lib/resolve-file-id-or-path";
import { getFileUrl } from "@qco/lib";

import { updateBannerSchema } from "@qco/validators";

export const update = protectedProcedure
  .input(updateBannerSchema)
  .mutation(async ({ ctx, input }) => {
    try {
      const { id, files, categoryId, page, ...updateData } = input;

      // Проверяем существование баннера
      const existingBanner = await ctx.db.query.banners.findFirst({
        where: eq(banners.id, id),
      });

      if (!existingBanner) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Баннер не найден",
        });
      }

      // Валидируем categoryId, если он передан
      let validatedCategoryId = categoryId ?? null;
      if (categoryId !== undefined) {
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
      }

      // Подготавливаем данные для обновления
      const mappedUpdateData = {
        ...updateData,
        page: page || null, // Используем page из схемы API
        categoryId: validatedCategoryId,
        updatedAt: new Date(),
        updatedBy: ctx.session?.user.id ?? "",
      };

      // Обновляем баннер
      const [updatedBanner] = await ctx.db
        .update(banners)
        .set(mappedUpdateData)
        .where(eq(banners.id, id))
        .returning();

      // Обрабатываем файлы
      if (files !== undefined) {
        // Удаляем старые файлы
        await ctx.db.delete(bannerFiles).where(eq(bannerFiles.bannerId, id));

        // Если есть новые файлы, добавляем их
        if (files.length > 0) {
          // Обрабатываем файлы с resolveFileIdOrPath
          const resolvedFiles = await Promise.all(
            files.map(async (file) => {
              const resolvedFileId = await resolveFileIdOrPath({
                ctx,
                fileIdOrPath: file.fileId,
                fileType: "banner",
                uploadedBy: ctx.session?.user?.id || "system",
                meta: file.meta,
              });

              return {
                bannerId: id,
                fileId: resolvedFileId,
                type: file.type,
                order: file.order,
              };
            })
          );

          await ctx.db.insert(bannerFiles).values(resolvedFiles);
        }
      }

      // Получаем обновленные файлы с полной информацией
      const bannerWithFiles = await ctx.db.query.banners.findFirst({
        where: eq(banners.id, id),
        with: {
          files: {
            with: {
              file: true,
            },
            orderBy: asc(bannerFiles.order),
          },
        },
      });

      // Форматируем ответ
      const formattedBanner = {
        id: bannerWithFiles!.id,
        title: bannerWithFiles!.title || bannerWithFiles!.name,
        description: bannerWithFiles!.description,
        link: bannerWithFiles!.link,
        linkText: bannerWithFiles!.buttonText,
        buttonText: bannerWithFiles!.buttonText,
        buttonLink: bannerWithFiles!.buttonLink,
        isActive: bannerWithFiles!.isActive,
        isFeatured: bannerWithFiles!.isFeatured,
        position: bannerWithFiles!.position,
        page: bannerWithFiles!.page, // Используем page везде
        sortOrder: bannerWithFiles!.sortOrder || 0,
        categoryId: bannerWithFiles!.categoryId,
        files: bannerWithFiles!.files?.map(bf => ({
          fileId: bf.fileId,
          type: bf.type,
          order: bf.order,
          url: bf.file?.path ? getFileUrl(bf.file.path) : null,
          file: {
            name: bf.file?.name,
            mimeType: bf.file?.mimeType,
            size: bf.file?.size,
          },
        })) || [],
      };

      return formattedBanner;
    } catch (error) {
      if (error instanceof TRPCError) throw error;

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error instanceof Error ? error.message : "Ошибка при обновлении баннера",
      });
    }
  }); 
