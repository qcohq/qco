import { TRPCError } from "@trpc/server";
import { eq, inArray } from "drizzle-orm";

import {
  orders,
  productFiles,
  files,
  customers,
  products,
  productVariants,
  productVariantOptionCombinations
} from "@qco/db/schema";
import { protectedProcedure } from "../../trpc";
import { getOrderByIdSchema, orderWithCustomerSchema } from "@qco/validators";
import { getFileUrl } from "@qco/lib";
import type { TRPCContext } from "../../trpc";
/**
 * Функция для получения опций варианта товара
 */
async function getVariantOptions(
  ctx: TRPCContext,
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
      .filter((combination) => combination.option && combination.optionValue)
      .map((combination) => ({
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

export const byId = protectedProcedure
  .input(getOrderByIdSchema)
  .output(orderWithCustomerSchema)
  .query(async ({ ctx, input }) => {
    const { id } = input;

    const order = await ctx.db.query.orders.findFirst({
      where: eq(orders.id, id),
      with: {
        customer: true,
        items: {
          with: {
            product: true,
            variant: true,
          },
        },
      },
    });

    if (!order) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Order not found",
      });
    }

    const customer = await ctx.db.query.customers.findFirst({
      where: eq(customers.id, order.customerId),
    });

    if (!customer) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Customer not found",
      });
    }

    // Получаем ID файлов продуктов
    const productIds = order.items?.map(item => item.productId).filter((id): id is string => Boolean(id)) || [];

    // Получаем файлы продуктов
    let productImagesMap: Record<string, string> = {};
    if (productIds.length > 0) {
      const fileIds = await ctx.db
        .select({ id: productFiles.fileId, productId: productFiles.productId })
        .from(productFiles)
        .where(inArray(productFiles.productId, productIds));

      if (fileIds.length > 0) {
        const fileIdList = fileIds.map(f => f.id);
        const images = await ctx.db
          .select({ id: files.id, path: files.path })
          .from(files)
          .where(inArray(files.id, fileIdList));

        // Создаем мапу productId -> imagePath (берем первое изображение для каждого товара)
        const productFileMap = fileIds.reduce((acc, file) => {
          if (!acc[file.productId]) {
            acc[file.productId] = file.id;
          }
          return acc;
        }, {} as Record<string, string>);

        productImagesMap = images.reduce((acc, image) => {
          // Находим productId для этого изображения
          const productId = Object.keys(productFileMap).find(key => productFileMap[key] === image.id);
          if (productId && !acc[productId]) {
            acc[productId] = image.path;
          }
          return acc;
        }, {} as Record<string, string>);
      }
    }

    // Получаем slug товаров для создания ссылок
    let productSlugs: Record<string, string> = {};
    if (productIds.length > 0) {
      const productsData = await ctx.db.query.products.findMany({
        where: inArray(products.id, productIds),
        columns: {
          id: true,
          slug: true,
        },
      });

      productSlugs = productsData.reduce((acc, product) => {
        acc[product.id] = product.slug;
        return acc;
      }, {} as Record<string, string>);
    }

    // Получаем информацию о вариантах товаров
    const variantIds = order.items?.map(item => item.variantId).filter((id): id is string => Boolean(id)) || [];
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

    return {
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        subtotalAmount: order.subtotalAmount,
        totalAmount: order.totalAmount,
        taxAmount: order.taxAmount,
        shippingAmount: order.shippingAmount,
        discountAmount: order.discountAmount,
        paymentMethod: order.paymentMethod || undefined,
        paymentStatus: order.paymentStatus || undefined,
        shippingMethod: order.shippingMethod || undefined,
        customerId: order.customerId,
        customer: {
          id: customer.id,
          customerCode: customer.customerCode,
          name: customer.name,
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          emailVerified: customer.emailVerified,
          phone: customer.phone,
          dateOfBirth: customer.dateOfBirth,
          gender: customer.gender,
          image: customer.image,
          isGuest: customer.isGuest,
          createdAt: customer.createdAt,
          updatedAt: customer.updatedAt,
        },
        shippingAddressId: order.shippingAddressId,
        notes: order.notes,
        trackingNumber: order.trackingNumber,
        trackingUrl: order.trackingUrl,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        cancelledAt: order.cancelledAt,
        metadata: order.metadata as Record<string, unknown> | null,
        items: await Promise.all(order.items?.map(async (item) => {
          const imagePath = productImagesMap[item.productId];
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
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,

            createdAt: item.createdAt,
            slug: productSlugs[item.productId] || null,
            image: imagePath ? getFileUrl(imagePath) : null,
            // Дополнительная информация о варианте
            variantSku: variant?.sku || null,
            variantPrice: variant?.price || null,
            variantSalePrice: variant?.salePrice || null,
            // Опции варианта товара
            variantOptions: variantOptions.length > 0 ? variantOptions : null,
          };
        }) || []),
      },

    };
  });
