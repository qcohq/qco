import { protectedProcedure } from "../../../trpc";
import {
  OrdersFilterSchema,
  AccountOrdersSchema,
} from "@qco/web-validators";
import { TRPCError } from "@trpc/server";
import {
  orders,
  productVariants,
  productVariantOptions,
  productVariantOptionValues,
  productVariantOptionCombinations
} from "@qco/db/schema";
import { and, asc, desc, eq, sql, inArray } from "@qco/db";
import { z } from "zod";
import { getProductMainImages } from "../../../lib/product-images";

/**
 * Функция для получения опций варианта товара
 */
async function getVariantOptions(
  ctx: any,
  variantId: string
): Promise<Array<{ name: string; value: string; slug: string }>> {
  if (!variantId) return [];

  try {
    // Получаем комбинации опций для конкретного варианта
    const optionCombinations = await ctx.db.query.productVariantOptionCombinations.findMany({
      where: eq(productVariantOptionCombinations.variantId, variantId),
      with: {
        option: true,
        optionValue: true,
      },
    });

    // Форматируем опции варианта
    const variantOptions = optionCombinations
      .filter(combination => combination.option && combination.optionValue)
      .map(combination => ({
        name: combination.option!.name,
        value: combination.optionValue!.displayName || combination.optionValue!.value,
        slug: combination.option!.slug,
      }));

    return variantOptions;
  } catch (error) {
    console.error('Error getting variant options:', error);
    return [];
  }
}

export const getOrders = protectedProcedure
  .input(
    OrdersFilterSchema.extend({
      cursor: z.number().optional(),
    }),
  )
  .output(
    z.object({
      orders: AccountOrdersSchema,
      page: z.number(),
      limit: z.number(),
      total: z.number(),
      totalPages: z.number(),
      nextPage: z.number().optional(),
    }),
  )
  .query(async ({ ctx, input }) => {
    const userId = ctx.session?.user?.id;
    if (!userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not authenticated",
      });
    }

    try {
      const { status, sortBy = "date-desc", limit = 10, cursor = 1 } = input;
      const page = cursor;

      const whereConditions = [eq(orders.customerId, userId)];
      if (status) {
        whereConditions.push(eq(orders.status, status));
      }

      const sortMapping = {
        "date-desc": desc(orders.createdAt),
        "date-asc": asc(orders.createdAt),
        "amount-desc": desc(orders.totalAmount),
        "amount-asc": asc(orders.totalAmount),
        status: asc(orders.status),
      };
      const orderBy = sortMapping[sortBy] || desc(orders.createdAt);

      const [total] = await ctx.db
        .select({ count: sql<number>`count(*)::int` })
        .from(orders)
        .where(and(...whereConditions));

      if (!total) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get total count",
        });
      }

      const dbOrders = await ctx.db.query.orders.findMany({
        where: and(...whereConditions),
        orderBy: [orderBy],
        limit: limit,
        offset: (page - 1) * limit,
        with: {
          items: true,
        },
      });

      // Получаем главные изображения товаров для всех заказов
      const allProductIds = Array.from(new Set(
        dbOrders.flatMap(order => order.items.map(item => item.productId))
      ));
      const productMainImages = await getProductMainImages(ctx.db, allProductIds);

      // Получаем информацию о вариантах товаров
      const allVariantIds = Array.from(new Set(
        dbOrders.flatMap(order => order.items.map(item => item.variantId).filter((id): id is string => Boolean(id)))
      ));
      let variantsMap: Record<string, any> = {};
      if (allVariantIds.length > 0) {
        const variantsData = await ctx.db.query.productVariants.findMany({
          where: inArray(productVariants.id, allVariantIds),
        });

        variantsMap = variantsData.reduce((acc, variant) => {
          acc[variant.id] = variant;
          return acc;
        }, {} as Record<string, any>);
      }

      const formattedOrders = await Promise.all(dbOrders.map(async (order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        subtotalAmount: Number(order.subtotalAmount),
        shippingAmount: Number(order.shippingAmount),
        discountAmount: Number(order.discountAmount),
        taxAmount: Number(order.taxAmount),
        totalAmount: Number(order.totalAmount),
        paymentMethod: order.paymentMethod,
        shippingMethod: order.shippingMethod,
        customerId: order.customerId,
        shippingAddressId: order.shippingAddressId,
        notes: order.notes,
        trackingNumber: order.trackingNumber,
        trackingUrl: order.trackingUrl,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        confirmedAt: order.confirmedAt,
        shippedAt: order.shippedAt,
        deliveredAt: order.deliveredAt,
        cancelledAt: order.cancelledAt,
        items: await Promise.all(order.items.map(async (item) => {
          const variant = item.variantId ? variantsMap[item.variantId] : null;

          // Получаем опции варианта товара
          const variantOptions = item.variantId
            ? await getVariantOptions(ctx, item.variantId)
            : [];

          return {
            id: item.id,
            orderId: item.orderId,
            productId: item.productId,
            variantId: item.variantId,
            productName: item.productName,
            productSku: item.productSku,
            variantName: item.variantName,
            quantity: item.quantity,
            unitPrice: Number(item.unitPrice),
            totalPrice: Number(item.totalPrice),
            attributes: item.attributes as Record<string, unknown> | null,
            image: productMainImages[item.productId] || null,
            createdAt: item.createdAt,
            // Дополнительная информация о варианте
            variantSku: variant?.sku || null,
            variantBarcode: variant?.barcode || null,
            variantPrice: variant?.price ? Number(variant.price) : null,
            variantSalePrice: variant?.salePrice ? Number(variant.salePrice) : null,
            variantStock: variant?.stock || null,
            variantWeight: variant?.weight || null,
            variantDimensions: variant ? {
              width: variant.width || null,
              height: variant.height || null,
              depth: variant.depth || null,
            } : null,
            // Опции варианта товара
            variantOptions: variantOptions.length > 0 ? variantOptions : null,
          };
        })),
      })));

      const totalPages = Math.ceil(total.count / limit);
      const nextPage = page < totalPages ? page + 1 : undefined;

      return {
        orders: formattedOrders,
        page,
        limit,
        total: total.count,
        totalPages,
        nextPage,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to validate order data",
          cause: error,
        });
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch orders",
      });
    }
  });
