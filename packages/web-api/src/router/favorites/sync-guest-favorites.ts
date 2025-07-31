import { protectedProcedure } from "../../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { and, eq, isNull } from "@qco/db";
import { favorites } from "@qco/db/schema";

const syncGuestFavoritesInput = z.object({
    guestId: z.string(),
});

export const syncGuestFavorites = protectedProcedure
    .input(syncGuestFavoritesInput)
    .mutation(async ({ ctx, input }) => {
        try {
            const userId = ctx.session?.user?.id;
            if (!userId) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "User not authenticated",
                });
            }

            // Получаем гостевые избранные товары
            const guestFavorites = await ctx.db.query.favorites.findMany({
                where: and(
                    eq(favorites.guestId, input.guestId),
                    isNull(favorites.customerId)
                ),
            });

            if (guestFavorites.length === 0) {
                return {
                    success: true,
                    message: "Нет гостевых избранных товаров для синхронизации",
                    syncedCount: 0,
                };
            }

            let syncedCount = 0;

            // Для каждого гостевого избранного товара
            for (const guestFavorite of guestFavorites) {
                // Проверяем, есть ли уже этот товар в избранном пользователя
                const existingFavorite = await ctx.db.query.favorites.findFirst({
                    where: and(
                        eq(favorites.customerId, userId),
                        eq(favorites.productId, guestFavorite.productId),
                        isNull(favorites.guestId)
                    ),
                });

                if (!existingFavorite) {
                    // Добавляем товар в избранное пользователя
                    await ctx.db.insert(favorites).values({
                        customerId: userId,
                        productId: guestFavorite.productId,
                        guestId: null,
                        createdAt: guestFavorite.createdAt,
                        updatedAt: new Date(),
                    });
                    syncedCount++;
                }

                // Удаляем гостевую запись
                await ctx.db
                    .delete(favorites)
                    .where(eq(favorites.id, guestFavorite.id));
            }

            return {
                success: true,
                message: `Синхронизировано ${syncedCount} товаров`,
                syncedCount,
            };
        } catch (error) {
            if (error instanceof TRPCError) {
                throw error;
            }

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Не удалось синхронизировать избранное",
            });
        }
    }); 