import { eq, desc, asc, ilike, or, and } from "@qco/db";
import { brands } from "@qco/db/schema";
import { getAllBrandsSchema, brandsListSchema } from "@qco/validators";
import { getFileUrl } from "@qco/lib";
import { protectedProcedure } from "../../trpc";
import type { TRPCContext } from "../../trpc";

export const getAll = protectedProcedure
  .input(getAllBrandsSchema)
  .output(brandsListSchema)
  .query(async ({ ctx, input }: { ctx: TRPCContext; input: any }) => {
    const {
      page,
      limit,
      search,
      isActive,
      sortBy,
      sortOrder,
    } = input;

    const offset = (page - 1) * limit;

    // Строим условия поиска
    const whereConditions: any[] = [];

    if (search) {
      whereConditions.push(
        or(
          ilike(brands.name, `%${search}%`),
          ilike(brands.description, `%${search}%`)
        )
      );
    }

    if (isActive !== undefined) {
      whereConditions.push(eq(brands.isActive, isActive));
    }

    // Определяем порядок сортировки
    const orderByField = sortBy === "name" ? brands.name :
      sortBy === "createdAt" ? brands.createdAt :
        sortBy === "updatedAt" ? brands.updatedAt :
          sortBy === "isActive" ? brands.isActive :
            brands.isFeatured;

    const orderByFunction = sortOrder === "asc" ? asc : desc;

    // Получаем бренды с категориями и файлами
    const brandsList = await ctx.db.query.brands.findMany({
      where: whereConditions.length > 0 ?
        whereConditions.length === 1 ? whereConditions[0] : and(...whereConditions) : undefined,
      orderBy: orderByFunction(orderByField),
      limit,
      offset,
      with: {
        brandCategories: {
          with: {
            category: true,
          },
        },
        files: {
          with: {
            file: true,
          },
          orderBy: (files, { asc }) => [
            asc(files.type),
            asc(files.order),
          ],
        },
      },
    });

    // Получаем общее количество брендов с учетом фильтров
    const totalCountResult = await ctx.db.select().from(brands).where(
      whereConditions.length > 0 ?
        whereConditions.length === 1 ? whereConditions[0] : and(...whereConditions) : undefined
    );
    const totalCount = totalCountResult.length;

    // Форматируем данные для фронтенда
    const formattedBrands = brandsList.map((brand) => {
      // Форматируем категории
      const categories = brand.brandCategories?.map((bc) => ({
        id: bc.category.id,
        name: bc.category.name,
        slug: bc.category.slug,
        description: bc.category.description,
        parentId: bc.category.parentId,
        isActive: bc.category.isActive,
        sortOrder: bc.category.sortOrder,
        metaTitle: bc.category.metaTitle,
        metaDescription: bc.category.metaDescription,
        xmlId: bc.category.xmlId,
        createdAt: bc.category.createdAt,
        updatedAt: bc.category.updatedAt,
      })) || [];

      // Форматируем файлы
      const files = brand.files?.map((bf) => {
        let url: string | null = null;
        if (bf.file?.path) {
          url = getFileUrl(bf.file.path);
        }
        return {
          id: bf.id,
          brandId: bf.brandId,
          fileId: bf.fileId,
          type: bf.type,
          order: bf.order,
          createdAt: bf.createdAt,
          file: {
            id: bf.file?.id || "",
            path: bf.file?.path || "",
            name: bf.file?.name || "",
            mimeType: bf.file?.mimeType || "",
            size: bf.file?.size || 0,
          },
          url,
        };
      }) || [];

      return {
        id: brand.id,
        name: brand.name,
        slug: brand.slug,
        description: brand.description,
        shortDescription: brand.shortDescription,
        website: brand.website,
        email: brand.email,
        phone: brand.phone,
        isActive: brand.isActive,
        isFeatured: brand.isFeatured,
        foundedYear: brand.foundedYear,
        countryOfOrigin: brand.countryOfOrigin,
        brandColor: brand.brandColor,
        metaTitle: brand.metaTitle,
        metaDescription: brand.metaDescription,
        metaKeywords: brand.metaKeywords,
        createdAt: brand.createdAt,
        updatedAt: brand.updatedAt,
        createdBy: brand.createdBy,
        updatedBy: brand.updatedBy,
        categories,
        files,
      };
    });

    return {
      items: formattedBrands,
      meta: {
        page,
        limit,
        total: totalCount,
        pageCount: Math.ceil(totalCount / limit),
      },
    };
  });
