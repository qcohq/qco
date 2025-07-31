import { TRPCError } from "@trpc/server";
import { eq, asc, desc, like, and, or, count, sql } from "@qco/db";

import { banners, bannerFiles, files, categories } from "@qco/db/schema";
import { getFileUrl } from "@qco/lib";
import { protectedProcedure } from "../../trpc";

import { getBannersSchema } from "@qco/validators";

export const getAll = protectedProcedure
  .input(getBannersSchema)
  .query(async ({ ctx, input }) => {
    const { page, limit, search, position, pageFilter, isActive, sortBy, sortOrder } = input;

    try {
      // Строим условия фильтрации
      const whereConditions = [];

      if (search) {
        whereConditions.push(
          or(
            like(banners.title, `%${search}%`),
            like(banners.name, `%${search}%`),
            like(banners.description, `%${search}%`)
          )
        );
      }

      if (position) {
        whereConditions.push(eq(banners.position, position));
      }

      if (pageFilter) {
        whereConditions.push(eq(banners.page, pageFilter)); // Используем pageFilter
      }

      if (isActive !== undefined) {
        whereConditions.push(eq(banners.isActive, isActive));
      }

      // Определяем порядок сортировки
      const orderByField = sortBy === "title" ? banners.title :
        sortBy === "position" ? banners.position :
          sortBy === "sortOrder" ? banners.sortOrder :
            banners.createdAt;

      const orderDirection = sortOrder === "desc" ? desc : asc;

      // Получаем баннеры с пагинацией
      const bannersList = await ctx.db.query.banners.findMany({
        where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
        orderBy: [orderDirection(orderByField)],
        limit,
        offset: (page - 1) * limit,
        with: {
          files: {
            with: {
              file: true,
            },
            orderBy: asc(bannerFiles.order),
          },
          category: true, // Добавляем join с категорией
        },
      });

      // Получаем общее количество баннеров для пагинации
      const totalCount = await ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(banners)
        .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

      // Форматируем данные для фронтенда
      const formattedBanners = bannersList.map(banner => ({
        id: banner.id,
        title: banner.title || banner.name,
        description: banner.description,
        position: banner.position,
        page: banner.page, // Используем page везде
        sortOrder: banner.sortOrder || 0,
        isActive: banner.isActive,
        isFeatured: banner.isFeatured,
        categoryId: banner.categoryId,
        category: banner.category ? {
          id: banner.category.id,
          name: banner.category.name
        } : null,
        createdAt: banner.createdAt,
        updatedAt: banner.updatedAt,
        files: banner.files?.map(bf => ({
          id: bf.fileId,
          type: bf.type,
          url: bf.file?.path ? getFileUrl(bf.file.path) : null,
          altText: bf.file?.name || "",
        })) || [],
      }));

      return {
        items: formattedBanners,
        pagination: {
          page,
          limit,
          total: totalCount[0]?.count || 0,
          totalPages: Math.ceil((totalCount[0]?.count || 0) / limit),
        },
      };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error instanceof Error ? error.message : "Ошибка при получении баннеров",
      });
    }
  }); 
