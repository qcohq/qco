import { TRPCError } from "@trpc/server";
import { eq, and, desc, gte, lte, isNull, or, inArray } from "@qco/db";
import { banners, bannerFiles, files, categories } from "@qco/db/schema";
import { publicProcedure } from "../../trpc";
import { getFileUrl } from "@qco/lib";
import {
  getBannersByPositionSchema,
  bannersListSchema
} from "@qco/web-validators";

export const getByPosition = publicProcedure
  .input(getBannersByPositionSchema)
  .output(bannersListSchema)
  .query(async ({ ctx, input }) => {
    try {
      const { position, page, categorySlug, limit } = input;
      const now = new Date();

      // Базовые условия для активных баннеров
      const baseConditions = [
        eq(banners.isActive, true),
        eq(banners.position, position),
      ];

      // Добавляем фильтр по категории если указан slug
      if (categorySlug) {
        // Сначала находим категорию по slug
        const category = await ctx.db.query.categories.findFirst({
          where: eq(categories.slug, categorySlug),
          columns: { id: true }
        });

        if (category) {
          baseConditions.push(eq(banners.categoryId, category.id));
        } else {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Category not found",
          });
        }
      }

      const bannersData = await ctx.db
        .select({
          id: banners.id,
          name: banners.name,
          title: banners.title,
          description: banners.description,
          link: banners.link,
          isActive: banners.isActive,
          isFeatured: banners.isFeatured,
          position: banners.position,
          categoryId: banners.categoryId,
          createdAt: banners.createdAt,
          updatedAt: banners.updatedAt,
        })
        .from(banners)
        .where(and(...baseConditions))
        .orderBy(desc(banners.createdAt))
        .limit(limit);

      if (bannersData.length === 0) {
        return [];
      }

      const bannerIds = bannersData.map((b: any) => b.id);

      const bannerFilesData = await ctx.db
        .select({
          id: bannerFiles.id,
          bannerId: bannerFiles.bannerId,
          type: bannerFiles.type,
          order: bannerFiles.order,
          fileId: bannerFiles.fileId,
        })
        .from(bannerFiles)
        .where(inArray(bannerFiles.bannerId, bannerIds))
        .orderBy(bannerFiles.order);

      const fileIds = bannerFilesData.map((bf: any) => bf.fileId);
      const filesData = await ctx.db
        .select({
          id: files.id,
          path: files.path, // Используем правильное поле path
          filename: files.name,
          mimeType: files.mimeType,
          size: files.size,
        })
        .from(files)
        .where(inArray(files.id, fileIds));

      // Создаем мапу файлов для быстрого доступа
      const filesMap = new Map(filesData.map((file: any) => [file.id, file]));

      // Создаем мапу баннеров с их файлами
      const bannerFilesMap = new Map<string, any[]>();
      bannerFilesData.forEach((bf: any) => {
        if (!bannerFilesMap.has(bf.bannerId)) {
          bannerFilesMap.set(bf.bannerId, []);
        }
        bannerFilesMap.get(bf.bannerId)?.push({
          id: bf.id,
          type: bf.type,
          order: bf.order,
          file: filesMap.get(bf.fileId) as any,
        });
      });

      // Объединяем баннеры с их файлами
      const bannersWithFiles = bannersData.map((banner: any) => {
        const bannerFilesData = bannerFilesMap.get(banner.id) || [];

        return {
          id: banner.id,
          name: banner.name,
          title: banner.title,
          subtitle: null,
          description: banner.description,
          link: banner.link,
          buttonText: null,
          buttonLink: null,
          isActive: banner.isActive,
          isFeatured: banner.isFeatured,
          sortOrder: 0,
          position: banner.position,
          page: null,
          categoryId: banner.categoryId,
          createdAt: banner.createdAt,
          updatedAt: banner.updatedAt,
          createdBy: null,
          updatedBy: null,
          files: bannerFilesData.map((file: any) => ({
            id: file.id,
            bannerId: banner.id,
            fileId: file.file.id,
            type: file.type,
            order: file.order,
            createdAt: new Date(),
            file: {
              id: file.file.id,
              url: getFileUrl(file.file.path),
              filename: file.file.filename,
              mimeType: file.file.mimeType,
              size: file.file.size,
            },
          })),
        };
      });

      return bannersWithFiles;
    } catch (error) {

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch banners",
      });
    }
  }); 
