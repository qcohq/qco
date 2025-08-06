import { TRPCError } from "@trpc/server";
import { createOrderSchema } from "@qco/web-validators";
import { publicProcedure } from "../../trpc";
import { getCartWithItems } from "../../lib/cart/cart-helpers";
import { createOrder } from "../../lib/orders/order-helpers";
import { sendEmail, OrderCreatedEmail } from "@qco/emails";

/**
 * Создание нового заказа на основе корзины
 */
export const createOrderProcedure = publicProcedure
  .input(createOrderSchema)
  .mutation(async ({ input }) => {
    const {
      cartId,
      customerInfo,
      shippingMethod,
      paymentMethod,
      createProfile,
    } = input;

    try {
      // Получаем корзину с товарами
      const cart = await getCartWithItems(cartId);

      // Проверяем наличие корзины и товаров в ней
      if (!cart?.items?.length) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cart is empty or does not exist",
        });
      }

      // Рассчитываем стоимость товаров в корзине
      const subtotal = cart.items.reduce((sum, item) => {
        const price = Number.parseFloat(String(item.price)) || 0;
        return sum + price * item.quantity;
      }, 0);

      // Добавляем стоимость доставки
      const shippingCost = shippingMethod.price;
      const total = subtotal + shippingCost;

      // Создаем заказ
      const order = await createOrder({
        customerInfo,
        shippingMethod,
        paymentMethod,
        cart: {
          ...cart,
          items: cart.items.map((item) => ({
            id: item.id,
            price: String(item.price),
            quantity: item.quantity,
            variantId: item.variantId ?? null,
            productId: item.productId,

            product: item.product
              ? {
                ...item.product,
                basePrice: item.product.basePrice
                  ? String(item.product.basePrice)
                  : null,
                salePrice: item.product.salePrice
                  ? String(item.product.salePrice)
                  : null,
              }
              : undefined,
            variant: item.variant,
          })) as any,
        },
        subtotal,
        shippingCost,
        total,
        createProfile, // Передаем параметр создания профиля
      });

      // Отправляем email уведомление клиенту о создании заказа
      try {
        const orderItems = cart.items.map((item) => ({
          name: item.product?.name || `Product ${item.productId}`,
          quantity: item.quantity,
          price: `${Number.parseFloat(String(item.price)).toFixed(2)} ₽`,
        }));

        await sendEmail({
          react: OrderCreatedEmail({
            username: customerInfo.firstName || "Customer",
            orderNumber: order.orderNumber,
            totalAmount: `${total.toFixed(2)} ₽`,
            items: orderItems,
            shippingAddress: customerInfo,
            paymentMethod: paymentMethod.name || paymentMethod.type,
            shippingMethod: shippingMethod.name,
            subtotal: `${subtotal.toFixed(2)} ₽`,
            shippingCost: `${shippingCost.toFixed(2)} ₽`,
          }),
          subject: `Заказ №${order.id} успешно создан`,
          to: [customerInfo.email],
        });
      } catch (emailError) {

        // Не прерываем выполнение процедуры, если email не удалось отправить
      }

      return {
        success: true,
        orderId: order.id,
      };
    } catch (error: unknown) {


      // Если ошибка уже является TRPCError, пробрасываем её дальше
      if (error instanceof TRPCError) {
        throw error;
      }

      // Иначе создаем новую ошибку
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create order",
        cause: error,
      });
    }
  });
