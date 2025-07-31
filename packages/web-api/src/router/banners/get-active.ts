import { TRPCError } from "@trpc/server";
import { eq, and, desc, gte, lte, isNull, or, inArray } from "@qco/db";
import { banners, bannerFiles, files } from "@qco/db/schema";
import { z } from "zod";
import { publicProcedure } from "../../trpc";
import { getFileUrl } from "@qco/lib";

// Простые схемы для валидации
const getActiveBannersSchema = z.object({
  position: z.string().optional(),
  section: z.string().optional(),
  limit: z.number().min(1).max(50).optional().default(10),
});

const bannerWithFilesSchema = z.object({
  id: z.string(),
  name: z.string(),
  title: z.string().nullable(),
  description: z.string().nullable(),
  link: z.string().nullable(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  position: z.string(),
  categoryId: z.string().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  files: z.array(z.object({
    id: z.string(),
    type: z.string(),
    order: z.number(),
    file: z.object({
      id: z.string(),
      url: z.string(),
      filename: z.string(),
      mimeType: z.string(),
      size: z.number(),
    }),
  })),
});

const bannersListSchema = z.array(bannerWithFilesSchema);

export const getActive = publicProcedure
  .input(getActiveBannersSchema)
  .output(bannersListSchema)
  .query(async ({ ctx, input }) => {
    try {
      const { position, section, limit } = input;
      const now = new Date();

      // Базовые условия для активных баннеров
      const baseConditions = [
        eq(banners.isActive, true),
      ];

      // Добавляем условие для позиции, если указана
      if (position) {
        baseConditions.push(eq(banners.position, position));
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
          url: files.path,
          filename: files.name,
          mimeType: files.mimeType,
          size: files.size,
        })
        .from(files)
        .where(inArray(files.id, fileIds));

      // Создаем мапу файлов для быстрого доступа
      const filesMap = new Map(filesData.map((file: any) => [file.id, file]));

      // Создаем мапу баннеров с их файлами
      const bannerFilesMap = new Map();
      bannerFilesData.forEach((bf: any) => {
        if (!bannerFilesMap.has(bf.bannerId)) {
          bannerFilesMap.set(bf.bannerId, []);
        }
        bannerFilesMap.get(bf.bannerId).push({
          id: bf.id,
          type: bf.type,
          order: bf.order,
          file: filesMap.get(bf.fileId),
        });
      });

      // Объединяем баннеры с их файлами
      const bannersWithFiles = bannersData.map((banner: any) => {
        const bannerFileData = bannerFilesMap.get(banner.id) || [];

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
          files: bannerFileData.map((file: any) => ({
            id: file.id,
            bannerId: banner.id,
            fileId: file.file.id,
            type: file.type,
            order: file.order,
            createdAt: new Date(),
            file: {
              id: file.file.id,
              url: getFileUrl(file.file.url),
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
        message: "Failed to fetch active banners",
      });
    }
  }); 
