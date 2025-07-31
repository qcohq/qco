import { eq, desc, and, inArray } from '@qco/db';
import { orders, orderItems, products } from '@qco/db/schema';
import { getOrdersHistoryInput } from '@qco/web-validators';
import { protectedProcedure } from '../../trpc';
import { safeMap, safeLength } from '../../lib/safe-array';
import { getProductMainImages } from '../../lib/product-images';

export const getOrdersHistory = protectedProcedure
    .input(getOrdersHistoryInput)
    .query(async ({ ctx, input }) => {
        const userId = ctx.session.user.id;

        // Базовые условия для фильтрации
        const baseConditions = [eq(orders.customerId, userId)];

        // Добавляем фильтр по статусу, если он не "all"
        if (input.status !== 'all') {
            baseConditions.push(eq(orders.status, input.status as any));
        }

        // Получаем заказы с пагинацией
        const userOrders = await ctx.db.query.orders.findMany({
            where: and(...baseConditions),
            orderBy: [desc(orders.createdAt)],
            limit: input.limit,
            offset: input.offset,
        });

        // Получаем элементы заказа отдельно
        const orderItemsData = await ctx.db.query.orderItems.findMany({
            where: inArray(orderItems.orderId, userOrders.map(o => o.id)),
        });

        // Получаем главные изображения товаров
        const productIds = Array.from(new Set(orderItemsData.map(item => item.productId)));
        const productMainImages = await getProductMainImages(ctx.db, productIds);

        // Получаем информацию о продуктах (slug) для создания ссылок
        const productsData = await ctx.db.query.products.findMany({
            where: inArray(products.id, productIds),
            columns: {
                id: true,
                slug: true,
            },
        });

        // Создаем мапу productId -> slug
        const productSlugs = productsData.reduce((acc, product) => {
            acc[product.id] = product.slug;
            return acc;
        }, {} as Record<string, string>);



        // Получаем общее количество заказов для пагинации
        const totalCount = await ctx.db
            .select({ count: orders.id })
            .from(orders)
            .where(and(...baseConditions));

        return {
            orders: safeMap(userOrders, (order: any) => {
                const orderItemsForOrder = orderItemsData.filter(item => item.orderId === order.id);
                const shippingAddressData = order.shippingAddress ? JSON.parse(order.shippingAddress) : {};

                return {
                    id: order.id,
                    orderNumber: order.orderNumber,
                    status: order.status,
                    totalAmount: Number(order.totalAmount),
                    currency: "USD",
                    createdAt: order.createdAt,
                    updatedAt: order.updatedAt,
                    shippedAt: order.shippedAt,
                    deliveredAt: order.deliveredAt,
                    trackingNumber: order.trackingNumber,
                    trackingUrl: null,
                    items: safeMap(orderItemsForOrder, (item: any) => ({
                        id: item.id,
                        productId: item.productId,
                        slug: productSlugs[item.productId] || null,
                        name: item.productName || "Unknown Product",
                        sku: item.productSku || undefined,
                        price: Number(item.unitPrice),
                        quantity: item.quantity,
                        totalPrice: Number(item.totalPrice),
                        image: productMainImages[item.productId] || null,
                        product: null,
                        variant: null,
                    })),
                    shippingAddress: shippingAddressData,
                };
            }),
            totalCount: totalCount.length,
            hasMore: safeLength(userOrders) === input.limit,
        };
    }); 
