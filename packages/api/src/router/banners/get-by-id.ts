import { TRPCError } from "@trpc/server";
import { eq } from "@qco/db";

import { banners, bannerFiles, categories } from "@qco/db/schema";
import { getFileUrl } from "@qco/lib";
import { protectedProcedure } from "../../trpc";

import { getBannerByIdSchema } from "@qco/validators";

export const getById = protectedProcedure
  .input(getBannerByIdSchema)
  .query(async ({ ctx, input }) => {
    const banner = await ctx.db.query.banners.findFirst({
      where: eq(banners.id, input.id),
      with: {
        files: {
          with: {
            file: true,
          },
          orderBy: (fields, { asc }) => [asc(fields.order)],
        },
        category: true, // Добавляем join с категорией
      },
    });

    if (!banner) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Баннер не найден",
      });
    }

    // Форматируем данные для фронтенда
    const formattedBanner = {
      id: banner.id,
      title: banner.title || banner.name,
      description: banner.description,
      link: banner.link,
      linkText: banner.buttonText,
      buttonText: banner.buttonText,
      buttonLink: banner.buttonLink,
      isActive: banner.isActive,
      isFeatured: banner.isFeatured,
      position: banner.position,
      page: banner.page, // Используем page везде
      sortOrder: banner.sortOrder || 0,
      categoryId: banner.categoryId,
      category: banner.category ? {
        id: banner.category.id,
        name: banner.category.name
      } : null,
      files: banner.files?.map(bf => ({
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
  }); 
