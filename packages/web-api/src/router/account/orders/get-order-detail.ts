import { protectedProcedure } from "../../../trpc";
import { OrderDetailSchema } from "@qco/web-validators";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  orders,
  orderItems,
  products,
  productVariants,
  productVariantOptions,
  productVariantOptionValues,
  productVariantOptionCombinations
} from "@qco/db/schema";
import { and, eq, inArray } from "@qco/db";
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

export const getOrderDetail = protectedProcedure
  .input(z.object({ orderId: z.string() }))
  .output(OrderDetailSchema)
  .query(async ({ ctx, input }) => {
    const userId = ctx.session?.user?.id;
    if (!userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not authenticated",
      });
    }

    try {
      const order = await ctx.db.query.orders.findFirst({
        where: and(eq(orders.id, input.orderId), eq(orders.customerId, userId)),
        with: {
          items: true,
        },
      });

      if (!order) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Order not found",
        });
      }

      // Получаем главные изображения товаров
      const productIds = Array.from(new Set(order.items.map(item => item.productId)));
      const productMainImages = await getProductMainImages(ctx.db, productIds);

      // Получаем информацию о вариантах товаров
      const variantIds = order.items.map(item => item.variantId).filter((id): id is string => Boolean(id));
      let variantsMap: Record<string, any> = {};
      if (variantIds.length > 0) {
        const variantsData = await ctx.db.query.productVariants.findMany({
          where: inArray(productVariants.id, variantIds),
        });

        variantsMap = variantsData.reduce((acc, variant) => {
          acc[variant.id] = variant;
          return acc;
        }, {} as Record<string, any>);
      }

      const formattedOrder = {
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
      };

      return formattedOrder;
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
        message: "Failed to fetch order details",
      });
    }
  });
