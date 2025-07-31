import { eq, inArray } from '@qco/db';
import { orders, orderItems, products } from '@qco/db/schema';
import { getOrderByIdInput } from '@qco/web-validators';
import { protectedProcedure } from '../../trpc';
import { getProductMainImages } from '../../lib/product-images';

export const getOrderById = protectedProcedure
    .input(getOrderByIdInput)
    .query(async ({ ctx, input }) => {
        const userId = ctx.session.user.id;

        const order = await ctx.db.query.orders.findFirst({
            where: eq(orders.id, input.orderId),
            with: {
                items: true,
            },
        });

        if (!order || order.customerId !== userId) {
            throw new Error('Заказ не найден');
        }

        // Получаем элементы заказа отдельно
        const orderItemsData = await ctx.db.query.orderItems.findMany({
            where: eq(orderItems.orderId, order.id),
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

        // Парсим адреса из JSON полей
        const shippingAddressData = {}; // нет поля shippingAddress в схеме

        return {
            id: order.id,
            orderNumber: order.orderNumber,
            status: order.status,
            totalAmount: Number(order.totalAmount),
            currency: "USD", // нет поля currency в схеме
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            shippedAt: order.shippedAt,
            deliveredAt: order.deliveredAt,
            trackingNumber: order.trackingNumber,
            trackingUrl: null, // нет поля trackingUrl в схеме
            items: orderItemsData.map((item: any) => ({
                id: item.id,
                productId: item.productId,
                slug: productSlugs[item.productId] || null,
                name: item.productName || "Unknown Product",
                sku: item.productSku || undefined,
                price: Number(item.unitPrice),
                quantity: item.quantity,
                totalPrice: Number(item.totalPrice),
                image: productMainImages[item.productId] || null,
                product: null, // нет связи product в схеме
                variant: null, // нет связи variant в схеме
            })),
            shippingAddress: shippingAddressData,
        };
    }); 
