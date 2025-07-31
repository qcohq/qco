import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { publicProcedure } from "../../trpc";
import { orders, orderItems, productFiles, files } from "@qco/db/schema";
import { eq, desc, and, sql, asc } from "@qco/db";
import { db } from "@qco/db/client";

// Схема для фильтров заказов
const getOrdersSchema = z.object({
    limit: z.number().min(1).max(100).default(20),
    offset: z.number().min(0).default(0),
    status: z.string().optional(),
    customerId: z.string().optional(),
    orderNumber: z.string().optional(),
});

/**
 * Получение списка заказов с пагинацией и фильтрацией
 */
export const getOrdersProcedure = publicProcedure
    .input(getOrdersSchema)
    .query(async ({ input }) => {
        const { limit, offset, status, customerId, orderNumber } = input;

        try {
            // Базовые условия для фильтрации
            const whereConditions = [];

            // Фильтр по статусу
            if (status) {
                whereConditions.push(eq(orders.status, status as any));
            }

            // Фильтр по ID клиента
            if (customerId) {
                whereConditions.push(eq(orders.customerId, customerId));
            }

            // Фильтр по номеру заказа
            if (orderNumber) {
                whereConditions.push(eq(orders.orderNumber, orderNumber));
            }

            // Получаем общее количество заказов
            const totalCountQuery = whereConditions.length > 0
                ? and(...whereConditions)
                : undefined;

            const [totalResult] = await db
                .select({ count: sql<number>`count(*)::int` })
                .from(orders)
                .where(totalCountQuery);

            const total = totalResult?.count || 0;

            // Получаем заказы с пагинацией
            const dbOrders = await db.query.orders.findMany({
                where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
                orderBy: [desc(orders.createdAt)],
                limit,
                offset,
                with: {
                    customer: true,
                },
            });

            // Получаем элементы заказов
            const orderIds = dbOrders.map(order => order.id);
            const orderItemsData = orderIds.length > 0
                ? await db.query.orderItems.findMany({
                    where: sql`${orderItems.orderId} = ANY(${orderIds})`,
                })
                : [];

            // Группируем элементы по заказам
            const itemsByOrderId = orderItemsData.reduce((acc, item) => {
                if (!acc[item.orderId]) {
                    acc[item.orderId] = [];
                }
                acc[item.orderId]?.push(item);
                return acc;
            }, {} as Record<string, typeof orderItemsData>);

            // Преобразуем заказы в формат для фронтенда
            const ordersWithItems = await Promise.all(
                dbOrders.map(async (order) => {
                    const orderItems = itemsByOrderId[order.id] || [];

                    // Получаем основное изображение для каждого товара
                    const productIds = orderItems.map(item => item.productId);
                    const productMainImages = await getProductMainImages(productIds);

                    // Создаем элементы заказа в нужном формате
                    const items = createCartItemsFromOrderItems(orderItems, productMainImages);

                    return {
                        id: order.id,
                        orderNumber: order.orderNumber,
                        status: order.status,
                        totalAmount: Number(order.totalAmount),
                        subtotalAmount: Number(order.subtotalAmount),
                        shippingAmount: Number(order.shippingAmount),
                        discountAmount: Number(order.discountAmount),
                        taxAmount: Number(order.taxAmount),
                        paymentMethod: order.paymentMethod,
                        shippingMethod: order.shippingMethod,
                        customerId: order.customerId,
                        customer: order.customer ? {
                            id: order.customer.id,
                            firstName: order.customer.firstName,
                            lastName: order.customer.lastName,
                            email: order.customer.email,
                            phone: order.customer.phone,
                        } : null,
                        items,
                        createdAt: order.createdAt,
                        updatedAt: order.updatedAt,
                        confirmedAt: order.confirmedAt,
                        shippedAt: order.shippedAt,
                        deliveredAt: order.deliveredAt,
                        cancelledAt: order.cancelledAt,
                        trackingNumber: order.trackingNumber,
                        trackingUrl: order.trackingUrl,
                        notes: order.notes,
                        metadata: order.metadata,
                    };
                })
            );

            return {
                orders: ordersWithItems,
                pagination: {
                    total,
                    limit,
                    offset,
                    hasMore: offset + limit < total,
                    totalPages: Math.ceil(total / limit),
                    currentPage: Math.floor(offset / limit) + 1,
                },
            };
        } catch (error: unknown) {
            console.error("Error in getOrdersProcedure:", error);

            if (error instanceof TRPCError) {
                throw error;
            }

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to retrieve orders",
                cause: error,
            });
        }
    });

// Вспомогательные функции из order-helpers.ts
async function getProductMainImages(productIds: readonly string[]): Promise<Record<string, string | null>> {
    if (productIds.length === 0) return {};

    try {
        const mainFiles = await db
            .select({
                productId: productFiles.productId,
                filePath: files.path,
            })
            .from(productFiles)
            .innerJoin(files, eq(productFiles.fileId, files.id))
            .where(sql`${productFiles.productId} = ANY(${productIds})`)
            .orderBy(
                desc(eq(productFiles.type, "main")),
                asc(productFiles.order)
            );

        // Группируем файлы по productId и берем первый (основной) для каждого продукта
        const productImagesMap = new Map<string, string>();
        for (const file of mainFiles) {
            if (!productImagesMap.has(file.productId)) {
                productImagesMap.set(file.productId, file.filePath);
            }
        }

        return Object.fromEntries(productImagesMap);
    } catch (error) {
        console.error("Error getting product main images:", error);
        return {};
    }
}

function createCartItemsFromOrderItems(
    orderItems: any[],
    productMainImages: Record<string, string | null>
) {
    return orderItems.map((item) => ({
        id: item.id,
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        price: Number(item.unitPrice),
        totalPrice: Number(item.totalPrice),
        productName: item.productName,
        productSku: item.productSku,
        variantName: item.variantName,
        attributes: item.attributes || {},
        image: productMainImages[item.productId] || null,
    }));
} 