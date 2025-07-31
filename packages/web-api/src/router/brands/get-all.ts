import { brands } from "@qco/db/schema";
import { getFileUrl } from "@qco/lib";
import { eq, desc, asc, and, like, sql } from "@qco/db";
import { publicProcedure } from "../../trpc";
import { z } from "zod";
import {
  brandListItemSchema,
  getAllBrandsInputSchema,
  getAllBrandsResponseSchema
} from "@qco/web-validators";
import type { BrandWithFiles, BrandListItem } from "@qco/web-validators";

export const getAllBrands = publicProcedure
  .input(getAllBrandsInputSchema)
  .output(getAllBrandsResponseSchema)
  .query(async ({ ctx, input }) => {
    const {
      page = 1,
      limit = 20,
      search,
      featured,
      sortBy = "name",
      sortOrder = "asc",
    } = input || {};

    const offset = (page - 1) * limit;

    // Строим условия фильтрации
    const whereConditions = [eq(brands.isActive, true)];

    if (search) {
      whereConditions.push(
        like(brands.name, `%${search}%`)
      );
    }

    if (featured !== undefined) {
      whereConditions.push(eq(brands.isFeatured, featured));
    }

    // Определяем сортировку
    let orderByClause;
    switch (sortBy) {
      case "name":
        orderByClause = sortOrder === "asc" ? asc(brands.name) : desc(brands.name);
        break;
      case "createdAt":
        orderByClause = sortOrder === "asc" ? asc(brands.createdAt) : desc(brands.createdAt);
        break;
      case "isFeatured":
        orderByClause = sortOrder === "asc"
          ? [asc(brands.isFeatured), asc(brands.name)]
          : [desc(brands.isFeatured), asc(brands.name)];
        break;
      default:
        orderByClause = asc(brands.name);
    }

    // Получаем бренды с файлами
    const brandsData = await ctx.db.query.brands.findMany({
      where: and(...whereConditions),
      orderBy: orderByClause,
      with: {
        files: {
          with: {
            file: true,
          },
        },
      },
      limit,
      offset,
    }) as BrandWithFiles[];

    // Получаем общее количество брендов для пагинации
    const totalCount = await ctx.db
      .select({ count: sql<number>`count(*)` })
      .from(brands)
      .where(and(...whereConditions));

    // Формируем список брендов с логотипом
    const brandsList: BrandListItem[] = brandsData.map((brand) => {
      const logoFile = brand.files?.find((f) => f.type === "logo");
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
        logo: logoFile?.file.path ? getFileUrl(logoFile.file.path) : null,
      };
    });

    return {
      brands: brandsList,
      pagination: {
        page,
        limit,
        total: totalCount[0]?.count || 0,
        totalPages: Math.ceil((totalCount[0]?.count || 0) / limit),
      },
    };
  }); 
