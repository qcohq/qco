import { db } from "@qco/db/client-ws";
import { TRPCError } from "@trpc/server";
import { eq, inArray } from "@qco/db";
import { createId } from "@paralleldrive/cuid2";
import { findOrCreateCustomerByEmail } from "../checkout/customer-helpers";

// Импорты типов и схем из базы данных
import { orders as ordersTable, orderItems as orderItemsTable, productFiles, files, customers } from "@qco/db/schema";
import {
  OrderStatus,
  PaymentMethod as DbPaymentMethod,
  ShippingMethod as DbShippingMethod,
} from "@qco/db/schema";

// Импорты типов и схем из валидаторов
import type { BasicCartWithItems } from "@qco/web-validators";
import type {
  CustomerInfo,
  WebOrder,
  PaymentMethod,
  ShippingMethod,
} from "@qco/web-validators";
import {
  paymentMethodSchema,
  shippingMethodSchema,
  basicCartWithItemsSchema,
  basicCartItemWithQuantitySchema,
  webOrderSchema,
} from "@qco/web-validators";
import { getFileUrl } from "@qco/lib";

/**
 * Типы для результатов запросов к БД
 */
type OrderFromDB = typeof ordersTable.$inferSelect;
type OrderItemFromDB = typeof orderItemsTable.$inferSelect;

type MainFileRow = {
  productId: string;
  filePath: string;
  fileType: string;
  fileOrder: number;
};

type OrderMetadata = {
  customerInfo?: CustomerInfo;
};

/**
 * Интерфейс для создания заказа
 */
export interface CreateOrderParams {
  customerInfo: CustomerInfo;
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
  cart: BasicCartWithItems;
  subtotal: number;
  shippingCost: number;
  total: number;
  taxAmount?: number;
  discountAmount?: number;
  shippingAddress?: CustomerInfo;
  createProfile?: boolean; // Новое поле для создания профиля
}

/**
 * Генерирует номер заказа
 */
function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `ORD-${year}${month}-${random}`;
}

/**
 * Преобразует тип способа оплаты из веб-валидатора в тип базы данных
 */
function mapPaymentMethodToDb(method: PaymentMethod): string {
  // Сопоставление типов оплаты из веб-валидатора с типами в БД
  switch (method.type) {
    case "credit_card":
      return DbPaymentMethod.CREDIT_CARD;
    case "cash_on_delivery":
      return DbPaymentMethod.CASH_ON_DELIVERY;
    case "bank_transfer":
      return DbPaymentMethod.BANK_TRANSFER;
    case "digital_wallet":
      return DbPaymentMethod.DIGITAL_WALLET;
    default:
      return DbPaymentMethod.CREDIT_CARD;
  }
}

/**
 * Преобразует тип способа доставки из веб-валидатора в тип базы данных
 */
function mapShippingMethodToDb(method: ShippingMethod): string {
  // Сопоставление типов доставки из веб-валидатора с типами в БД
  switch (method.id) {
    case "standard":
      return DbShippingMethod.STANDARD;
    case "express":
      return DbShippingMethod.EXPRESS;
    case "overnight":
      return DbShippingMethod.SAME_DAY;
    default:
      return DbShippingMethod.STANDARD;
  }
}

/**
 * Создание нового заказа с использованием транзакций для повышения производительности
 */
export async function createOrder(
  params: CreateOrderParams,
): Promise<WebOrder> {
  const {
    customerInfo,
    shippingMethod,
    paymentMethod,
    cart,
    subtotal,
    shippingCost,
    total,
    createProfile,
  } = params;

  try {
    // Получаем или создаём customer (гостя или зарегистрированного)
    const customer = await findOrCreateCustomerByEmail({
      email: customerInfo.email,
      firstName: customerInfo.firstName,
      lastName: customerInfo.lastName,
      phone: customerInfo.phone,
      company: customerInfo.company, // Добавляем компанию
      isGuest: !createProfile, // Если создаем профиль, то не гость
    });
    if (!customer) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create or find customer",
      });
    }

    // Данные пользователя уже обновлены в findOrCreateCustomerByEmail

    // Если нужно сохранить адрес в профиль (для авторизованных и неавторизованных пользователей)
    if (customerInfo.saveAddress) {
      try {
        // Импортируем необходимые модули для создания адреса
        const { customerAddresses } = await import("@qco/db/schema");
        const { eq } = await import("@qco/db");

        // Проверяем, есть ли уже адрес у этого пользователя
        const existingAddress = await db.query.customerAddresses.findFirst({
          where: eq(customerAddresses.customerId, customer.id),
        });

        // Создаем адрес, если его нет
        if (!existingAddress) {
          await db.insert(customerAddresses).values({
            id: createId(),
            customerId: customer.id,
            type: "shipping",
            firstName: customerInfo.firstName,
            lastName: customerInfo.lastName,
            addressLine1: customerInfo.address,
            addressLine2: customerInfo.apartment,
            city: customerInfo.city,
            state: customerInfo.state,
            postalCode: customerInfo.postalCode,
            country: "Россия", // По умолчанию
            isDefault: true, // Делаем основным адресом
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      } catch (error) {
        console.error("Error saving address to profile:", error);
        // Не прерываем создание заказа, если не удалось сохранить адрес
      }
    }

    // Создаем заказ в базе данных с использованием транзакции
    const orderId = createId();
    const now = new Date();
    const orderNumber = generateOrderNumber();

    console.log("🔧 createOrder: Создаем заказ с ID:", orderId);

    // Подготавливаем данные для вставки в БД
    const newOrder: typeof ordersTable.$inferInsert = {
      id: orderId,
      orderNumber: orderNumber,
      customerId: customer.id,
      status: OrderStatus.PENDING,
      totalAmount: String(total),
      subtotalAmount: String(subtotal),
      taxAmount: String(params.taxAmount ?? 0),
      shippingAmount: String(shippingCost),
      discountAmount: String(params.discountAmount ?? 0),
      paymentMethod: mapPaymentMethodToDb(paymentMethod) as any,
      shippingMethod: mapShippingMethodToDb(shippingMethod) as any,
      metadata: {
        customerInfo,

        createProfile, // Сохраняем информацию о создании профиля
      },
    };

    // Создаем элементы заказа
    const orderItemsToInsert: typeof orderItemsTable.$inferInsert[] = cart.items.map((item) => ({
      id: createId(),
      orderId: orderId,
      productId: item.productId,
      productName: item.product?.name || "Unknown Product",
      variantId: item.variantId || null,
      quantity: item.quantity,
      unitPrice: String(item.price),
      totalPrice: String(Number(item.price) * item.quantity),
    }));

    console.log("🔧 createOrder: Вставляем заказ в БД");

    // Выполняем все операции в одной транзакции
    await db.transaction(async (tx) => {
      // Вставляем заказ
      await tx.insert(ordersTable).values(newOrder);

      // Вставляем элементы заказа, если они есть
      if (orderItemsToInsert.length > 0) {
        await tx.insert(orderItemsTable).values(orderItemsToInsert);
      }
    });

    console.log("🔧 createOrder: Заказ успешно создан в БД");

    // Создаем объект заказа для возврата без дополнительного запроса к БД
    const order: WebOrder = {
      id: orderId,
      orderNumber,
      createdAt: now,
      updatedAt: now,
      status: OrderStatus.PENDING,
      customerInfo,
      shippingMethod,
      paymentMethod,
      cart,
      subtotal,
      shippingCost,
      total,
      paymentStatus: "pending",
      notes: paymentMethod.description ?? undefined,

    };

    console.log("🔧 createOrder: Заказ успешно создан, возвращаем объект");
    return order;
  } catch (error: unknown) {
    console.error("❌ createOrder: Ошибка при создании заказа:", error);

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to create order",
      cause: error,
    });
  }
}

/**
 * Получает главные изображения продуктов
 */
async function getProductMainImages(productIds: readonly string[]): Promise<Record<string, string | null>> {
  const productMainImages: Record<string, string | null> = {};

  if (productIds.length === 0) {
    return productMainImages;
  }

  try {
    const mainFiles: MainFileRow[] = (
      await db
        .select({
          productId: productFiles.productId,
          filePath: files.path,
          fileType: productFiles.type,
          fileOrder: productFiles.order,
        })
        .from(productFiles)
        .innerJoin(files, eq(productFiles.fileId, files.id))
        .where(inArray(productFiles.productId, productIds))
        .orderBy(productFiles.productId, productFiles.type, productFiles.order)
    ).map((row) => ({ ...row, fileOrder: row.fileOrder ?? 0 }));

    // Группируем по productId, берем type: 'main', иначе первый
    for (const pid of productIds) {
      const files = mainFiles.filter((f) => f.productId === pid);
      const main = files.find((f) => f.fileType === "main") || files[0];
      productMainImages[pid] = main ? getFileUrl(main.filePath) : null;
    }

    return productMainImages;
  } catch (error) {
    console.warn("Failed to fetch product images:", error);
    return productMainImages;
  }
}

/**
 * Создает элементы корзины из элементов заказа
 */
function createCartItemsFromOrderItems(
  orderItems: OrderItemFromDB[],
  productMainImages: Record<string, string | null>
) {
  return orderItems.map((item) => {
    try {
      const mainImage = item.productId && productMainImages[item.productId]
        ? productMainImages[item.productId]
        : null;

      const product = {
        id: item.productId,
        name: item.productName || "Unknown Product",
        slug: "", // Не имеем доступа к слагу из заказа
        description: "", // Не имеем доступа к описанию из заказа
        basePrice: Number.parseFloat(item.unitPrice),
        salePrice: null,
        discountPercent: null,
        sku: item.productSku || null,
        stock: null,
        mainImage,
      };

      // Формируем вариант, если он есть
      const variant = item.variantId ? {
        id: item.variantId,
        name: item.variantName,
        sku: item.productSku || null,
        barcode: null,
        price: Number.parseFloat(item.unitPrice),
        salePrice: null,
        costPrice: null,
        stock: null,
        minStock: null,
        weight: null,
        width: null,
        height: null,
        depth: null,
        isActive: true,
        isDefault: false,
      } : null;

      // Используем Zod для валидации каждого элемента корзины
      return basicCartItemWithQuantitySchema.parse({
        id: item.id,
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity || 1,
        price: Number.parseFloat(item.unitPrice),
        attributes: item.attributes || null,
        product,
        variant,
      });
    } catch (validationError) {
      console.error("Validation error for cart item:", validationError, item);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Invalid cart item data",
        cause: validationError,
      });
    }
  });
}

/**
 * Парсит метаданные заказа
 */
function parseOrderMetadata(metadata: Record<string, unknown> | null): OrderMetadata {
  if (!metadata) {
    return {};
  }

  try {
    return metadata as OrderMetadata;
  } catch (error) {
    console.warn("Failed to parse order metadata:", error);
    return {};
  }
}

/**
 * Получает информацию о клиенте из метаданных или возвращает fallback
 */
function getCustomerInfoFromMetadata(metadata: OrderMetadata): CustomerInfo {
  return metadata.customerInfo ?? {
    email: "guest@example.com",
    firstName: "Guest",
    lastName: "User",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
  };
}

/**
 * Определяет название способа доставки на основе метода
 */
function getShippingName(method: string): string {
  switch (method) {
    case "express":
      return "Экспресс-доставка";
    case "overnight":
      return "Доставка на следующий день";
    default:
      return "Стандартная доставка";
  }
}

/**
 * Определяет ожидаемый срок доставки
 */
function getEstimatedDelivery(method: string): string {
  switch (method) {
    case "express":
      return "2-3 рабочих дня";
    case "overnight":
      return "На следующий рабочий день";
    default:
      return "4-6 рабочих дней";
  }
}

/**
 * Создает объект способа доставки
 */
function createShippingMethod(order: OrderFromDB): ShippingMethod {
  return shippingMethodSchema.parse({
    id: order.shippingMethod ?? "standard",
    name: getShippingName(order.shippingMethod ?? "standard"),
    description: "Стандартная доставка",
    price: Number.parseFloat(order.shippingAmount),
    estimatedDelivery: getEstimatedDelivery(order.shippingMethod ?? "standard"),
  });
}

/**
 * Определяет тип оплаты на основе метода оплаты
 */
function getPaymentType(method: string): "credit_card" | "cash_on_delivery" | "digital_wallet" | "bank_transfer" {
  if (method === "cash_on_delivery") return "cash_on_delivery";
  if (["apple_pay", "google_pay", "paypal"].includes(method)) return "digital_wallet";
  if (method === "bank_transfer") return "bank_transfer";
  return "credit_card";
}

/**
 * Определяет название метода оплаты
 */
function getPaymentName(method: string): string {
  const names: Record<string, string> = {
    credit_card: "Банковская карта",
    cash_on_delivery: "Наложенный платеж",
    apple_pay: "Apple Pay",
    google_pay: "Google Pay",
    paypal: "PayPal",
  };
  return names[method] ?? "Банковская карта";
}

/**
 * Создает объект способа оплаты
 */
function createPaymentMethod(order: OrderFromDB): PaymentMethod {
  return paymentMethodSchema.parse({
    id: order.paymentMethod ?? "card",
    type: getPaymentType(order.paymentMethod ?? "card"),
    name: getPaymentName(order.paymentMethod ?? "card"),
    description: order.notes ?? undefined,
  });
}

/**
 * Получение заказа по ID
 */
export async function getOrderById(orderId: string): Promise<WebOrder> {
  try {
    // Получаем заказ из базы данных
    const orderResult = await db.query.orders.findFirst({
      where: eq(ordersTable.id, orderId),
    });

    if (!orderResult) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Order not found",
      });
    }

    // Получаем элементы заказа
    const orderItemsResult = await db.query.orderItems.findMany({
      where: eq(orderItemsTable.orderId, orderId),
    });

    // Получаем уникальные ID продуктов
    const productIds = Array.from(
      new Set(
        orderItemsResult
          .map((i) => i.productId)
          .filter((id): id is string => !!id),
      ),
    ) as readonly string[];

    // Получаем главное изображение для каждого продукта
    const productMainImages = await getProductMainImages(productIds);

    // Создаем объект корзины для заказа с использованием Zod для валидации
    const cartItems = createCartItemsFromOrderItems(orderItemsResult, productMainImages);

    // Создаем объект корзины с использованием Zod
    const fallbackCart = basicCartWithItemsSchema.parse({
      id: orderId,
      items: cartItems,
    });

    // Извлекаем информацию о клиенте из метаданных
    const metadata = parseOrderMetadata(orderResult.metadata);
    const customerInfo = getCustomerInfoFromMetadata(metadata);

    // Получаем данные о способах доставки и оплаты
    const shippingMethod = createShippingMethod(orderResult);
    const paymentMethod = createPaymentMethod(orderResult);

    // Формируем объект заказа в формате веб-валидатора
    try {
      const order = webOrderSchema.parse({
        id: orderResult.id,
        createdAt: orderResult.createdAt,
        updatedAt: orderResult.updatedAt,
        status: orderResult.status,
        customerInfo,
        shippingMethod,
        paymentMethod,
        cart: fallbackCart,
        subtotal: Number.parseFloat(orderResult.subtotalAmount),
        shippingCost: Number.parseFloat(orderResult.shippingAmount),
        total: Number.parseFloat(orderResult.totalAmount),
        paymentStatus: "PENDING",
        notes: orderResult.notes ?? undefined,
        orderNumber: orderResult.orderNumber,
      });

      return order;
    } catch (validationError) {
      console.error("Validation error for order:", validationError, {
        orderId: orderResult.id,
        status: orderResult.status,
        paymentStatus: "PENDING",
      });
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Invalid order data",
        cause: validationError,
      });
    }
  } catch (error: unknown) {
    if (error instanceof TRPCError) {
      throw error;
    }

    // Логируем детали ошибки для отладки
    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
    }

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to retrieve order",
      cause: error,
    });
  }
}
