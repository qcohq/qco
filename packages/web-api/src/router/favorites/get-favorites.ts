import { publicProcedure } from "../../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { eq, desc, and, isNull, asc } from '@qco/db';
import { favorites, productFiles } from '@qco/db/schema';
import { getFileUrl } from "@qco/lib";

const getFavoritesInput = z.object({
    guestId: z.string().optional(),
    limit: z.number().min(1).max(100).default(50),
    offset: z.number().min(0).default(0),
});

export const getFavorites = publicProcedure
    .input(getFavoritesInput)
    .query(async ({ ctx, input }) => {
        try {
            let whereCondition;

            if (ctx.session?.user?.id) {
                // Авторизованный пользователь
                whereCondition = and(
                    eq(favorites.customerId, ctx.session.user.id),
                    isNull(favorites.guestId)
                );
            } else if (input.guestId) {
                // Гостевой пользователь
                whereCondition = and(
                    eq(favorites.guestId, input.guestId),
                    isNull(favorites.customerId)
                );
            } else {
                // Нет идентификации - возвращаем пустой массив
                return [];
            }

            const favoritesData = await ctx.db.query.favorites.findMany({
                where: whereCondition,
                orderBy: [desc(favorites.createdAt)],
                limit: input.limit,
                offset: input.offset,
                with: {
                    product: {
                        with: {
                            files: {
                                with: {
                                    file: true,
                                },
                                orderBy: [
                                    // Сначала файлы с типом "main", затем остальные по порядку
                                    desc(eq(productFiles.type, "main")),
                                    asc(productFiles.order),
                                ],
                            },
                        },
                    },
                },
            });

            return favoritesData.map((favorite) => {
                // Получаем главное изображение товара (первый файл в отсортированном списке)
                const mainImage = favorite.product?.files?.[0];
                const image = mainImage?.file?.path ? getFileUrl(mainImage.file.path) : null;

                return {
                    id: favorite.id,
                    productId: favorite.productId,
                    customerId: favorite.customerId,
                    guestId: favorite.guestId,
                    createdAt: favorite.createdAt,
                    updatedAt: favorite.updatedAt,
                    product: favorite.product ? {
                        id: favorite.product.id,
                        name: favorite.product.name,
                        slug: favorite.product.slug,
                        basePrice: favorite.product.basePrice,
                        salePrice: favorite.product.salePrice,
                        discountPercent: favorite.product.discountPercent,
                        isActive: favorite.product.isActive,
                        image: image, // Главное изображение
                        images: favorite.product.files
                            ?.filter((file) => file.file?.path)
                            ?.map((file) => getFileUrl(file.file.path)) || [],
                    } : null,
                };
            });
        } catch (error) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to fetch favorites",
            });
        }
    }); 