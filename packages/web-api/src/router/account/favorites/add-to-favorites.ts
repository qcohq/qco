import { protectedProcedure } from "../../../trpc";
import { AddToFavoritesSchema } from "@qco/web-validators";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { and, eq } from "@qco/db";
import { favorites, products } from "@qco/db/schema";

export const addToFavorites = protectedProcedure
  .input(AddToFavoritesSchema)
  .output(
    z.object({
      success: z.boolean(),
      message: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const userId = ctx.session?.user?.id;
    if (!userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Пользователь не авторизован",
      });
    }

    try {
      // Проверяем, существует ли продукт
      const product = await ctx.db.query.products.findFirst({
        where: eq(products.id, input.productId),
      });

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Товар не найден",
        });
      }

      // Проверяем, добавлен ли уже товар в избранное
      const existingFavorite = await ctx.db.query.favorites.findFirst({
        where: and(
          eq(favorites.customerId, userId),
          eq(favorites.productId, input.productId)
        ),
      });

      if (existingFavorite) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Товар уже добавлен в избранное",
        });
      }

      // Добавляем товар в избранное
      await ctx.db.insert(favorites).values({
        customerId: userId,
        productId: input.productId,
        guestId: null,
        ipAddress: null,
        userAgent: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return {
        success: true,
        message: "Товар добавлен в избранное",
      };
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Не удалось добавить товар в избранное",
      });
    }
  });
