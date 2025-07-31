import { db } from "@qco/db/client";
import {
  carts,
  cartItems,
  files,
  products,
  productFiles,
  productVariants,
  productAttributeValues,
  productTypeAttributes,
  brands,
} from "@qco/db/schema";

import type {
  SimpleCartWithId,
  BasicCartItemWithQuantity,
} from "@qco/web-validators";
import { TRPCError } from "@trpc/server";
import { and, asc, desc, eq, inArray } from "@qco/db";
import { getFileUrl } from "@qco/lib";

// Типы для TypeScript
type ProductType = typeof products.$inferSelect;



export interface ServerCartItemWithDetails {
  id: string;
  quantity: number;
  productId: string;
  variantId?: string | null;
  price: number | string;
  discountedPrice?: number | string | null;
  attributes: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
  product: {
    id: string;
    name: string;
    slug: string;
    sku: string;
    description: string | null;
    basePrice: number | string | null;
    salePrice: number | string | null;
    discountPercent: number | null;
    stock: number;
    mainImage: string | null;
    brand: { name: string; slug: string } | null;
  };
  variant?: {
    id: string;
    name: string;
    sku: string | null;
    barcode: string | null;
    price: number | string;
    salePrice: number | string | null;
    costPrice: number | string | null;
    stock: number;
    minStock: number;
    weight: number | string | null;
    width: number | string | null;
    height: number | string | null;
    depth: number | string | null;
    isActive: boolean;
    isDefault: boolean;
  };
  options: { name: string; value: string }[];
}

export interface CartWithItems {
  id: string;
  customerId?: string | null;
  sessionId?: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date | null;
  metadata?: Record<string, unknown> | null;
  items: ServerCartItemWithDetails[];
  total: number;
  itemCount: number;
}

/**
 * Поиск или создание корзины
 * @param params Параметры поиска/создания корзины
 * @returns Объект с ID корзины
 */
export async function findOrCreateCart({
  cartId,
  sessionId,
}: {
  cartId?: string;
  sessionId?: string;
}): Promise<SimpleCartWithId> {
  try {
    // Если передан ID корзины, пытаемся найти её
    if (cartId) {
      const existingCart = await db.query.carts.findFirst({
        where: eq(carts.id, cartId),
      });

      if (existingCart) {
        return { id: existingCart.id };
      }
    }

    // Если передан ID сессии, пытаемся найти корзину по нему
    if (sessionId) {
      const existingCart = await db.query.carts.findFirst({
        where: eq(carts.sessionId, sessionId),
      });

      if (existingCart) {
        return { id: existingCart.id };
      }
    }

    // Если корзина не найдена, создаем новую
    const result = await db
      .insert(carts)
      .values({
        sessionId: sessionId ?? null,
        status: "active",
      })
      .returning();

    if (!result?.length) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create cart",
      });
    }

    const newCart = result[0];
    if (!newCart?.id) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Invalid cart data returned after creation",
      });
    }

    return { id: newCart.id };
  } catch (error) {

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to find or create cart",
    });
  }
}

/**
 * Поиск товара в корзине
 * @param params Параметры поиска
 * @returns Найденный товар или null
 */
export async function findCartItem({
  cartId,
  productId,
  variantId,
}: {
  cartId: string;
  productId: string;
  variantId?: string;
}): Promise<BasicCartItemWithQuantity | null> {
  try {
    const item = await db.query.cartItems.findFirst({
      where: and(
        eq(cartItems.cartId, cartId),
        eq(cartItems.productId, productId),
        variantId
          ? eq(cartItems.variantId, variantId)
          : eq(cartItems.variantId, null as unknown as string),
      ),
    });

    if (!item) return null;

    return {
      id: item.id,
      quantity: item.quantity,
      productId: item.productId,
      variantId: item.variantId,
      price: Number(item.price),
      attributes: item.attributes as Record<string, unknown> | null,
    };
  } catch (error) {

    return null;
  }
}

/**
 * Обновляет количество товара в корзине
 * @param itemId ID товара в корзине
 * @param quantity Новое количество
 */
export async function updateCartItemQuantity(
  itemId: string,
  quantity: number,
): Promise<void> {
  try {
    await db
      .update(cartItems)
      .set({ quantity, updatedAt: new Date() })
      .where(eq(cartItems.id, itemId));
  } catch (error) {

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to update cart item quantity",
    });
  }
}

/**
 * Создает новый товар в корзине
 * @param params Параметры создания товара
 */
export async function createCartItem({
  cartId,
  productId,
  variantId,
  quantity,
  attributes,
}: {
  cartId: string;
  productId: string;
  variantId?: string;
  quantity: number;
  attributes?: Record<string, unknown>;
}): Promise<void> {
  try {
    // Получаем цену продукта или варианта
    let price: number | string;

    if (variantId) {
      const variant = await db.query.productVariants.findFirst({
        where: eq(productVariants.id, variantId),
      });

      if (variant) {
        // Приоритет цен варианта: salePrice > price
        const variantSalePrice = typeof variant.salePrice === 'string' ? Number.parseFloat(variant.salePrice) : variant.salePrice;
        const variantPrice = typeof variant.price === 'string' ? Number.parseFloat(variant.price) : variant.price;

        if (variantSalePrice && variantSalePrice > 0) {
          price = variantSalePrice;
        } else if (variantPrice && variantPrice > 0) {
          price = variantPrice;
        } else {
          // Если у варианта нет цены, берем цену продукта
          const product = await db.query.products.findFirst({
            where: eq(products.id, productId),
          });

          const productSalePrice = typeof product?.salePrice === 'string' ? Number.parseFloat(product.salePrice) : product?.salePrice;
          const productBasePrice = typeof product?.basePrice === 'string' ? Number.parseFloat(product.basePrice) : product?.basePrice;

          price = productSalePrice && productSalePrice > 0
            ? productSalePrice
            : productBasePrice && productBasePrice > 0
              ? productBasePrice
              : 0;
        }
      } else {
        // Если вариант не найден, берем цену продукта
        const product = await db.query.products.findFirst({
          where: eq(products.id, productId),
        });

        const productSalePrice = typeof product?.salePrice === 'string' ? Number.parseFloat(product.salePrice) : product?.salePrice;
        const productBasePrice = typeof product?.basePrice === 'string' ? Number.parseFloat(product.basePrice) : product?.basePrice;

        price = productSalePrice && productSalePrice > 0
          ? productSalePrice
          : productBasePrice && productBasePrice > 0
            ? productBasePrice
            : 0;
      }
    } else {
      // Если нет variantId, берем цену продукта
      const product = await db.query.products.findFirst({
        where: eq(products.id, productId),
      });

      // Приоритет: salePrice > basePrice > 0
      const productSalePrice = typeof product?.salePrice === 'string' ? Number.parseFloat(product.salePrice) : product?.salePrice;
      const productBasePrice = typeof product?.basePrice === 'string' ? Number.parseFloat(product.basePrice) : product?.basePrice;

      price = productSalePrice && productSalePrice > 0
        ? productSalePrice
        : productBasePrice && productBasePrice > 0
          ? productBasePrice
          : 0;
    }



    await db.insert(cartItems).values({
      cartId,
      productId,
      variantId: variantId ?? null,
      quantity,
      price: typeof price === 'number' ? String(price) : price,
      attributes: attributes || null,
    });
  } catch (error) {

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to create cart item",
    });
  }
}

/**
 * Получает корзину с товарами
 * @param cartId ID корзины
 * @returns Корзина с товарами или null
 */
export async function getCartWithItems(
  cartId: string,
): Promise<CartWithItems | null> {
  try {
    // Получаем корзину
    const cart = await db.query.carts.findFirst({
      where: eq(carts.id, cartId),
    });

    if (!cart) return null;

    // Получаем все товары в корзине
    const cartItemsData = await db.query.cartItems.findMany({
      where: eq(cartItems.cartId, cartId),
    });



    if (cartItemsData.length === 0) {
      return {
        id: cart.id,
        customerId: cart.customerId,
        sessionId: cart.sessionId,
        status: cart.status,
        createdAt: cart.createdAt,
        updatedAt: cart.updatedAt,
        items: [],
        total: 0,
        itemCount: 0,
      };
    }

    // Получаем идентификаторы продуктов и вариантов для последующих запросов
    const productIds = cartItemsData.map((item: any) => item.productId);
    const variantIds = cartItemsData
      .filter((item: any) => item.variantId !== null)
      .map((item: any) => item.variantId);

    // Проверяем, есть ли продукты
    if (productIds.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No products found in cart",
      });
    }

    // Получаем все продукты одним запросом
    const productsData = await db
      .select()
      .from(products)
      .where(inArray(products.id, productIds));



    // Получаем все brandId
    const brandIds = Array.from(
      new Set(
        productsData
          .map((p: any) => p.brandId)
          .filter((id: any): id is string => !!id),
      ),
    );
    const brandsData =
      brandIds.length > 0
        ? await db
          .select()
          .from(brands)
          .where(inArray(brands.id, brandIds))
        : [];
    const brandsMap = new Map(
      brandsData.map((b: any) => [b.id, { name: b.name, slug: b.slug }]),
    );

    // Получаем все варианты одним запросом (если они есть)
    const variantsData =
      variantIds.length > 0
        ? await db
          .select()
          .from(productVariants)
          .where(inArray(productVariants.id, variantIds))
        : [];



    // Получаем связи вариантов с атрибутами
    const variantAttributeValues: any[] = []; // нет поля variantId в схеме productAttributeValues

    // Получаем все изображения для продуктов, сортируя по типу и порядку
    const productFilesData = await db
      .select()
      .from(productFiles)
      .where(inArray(productFiles.productId, productIds))
      .orderBy(
        desc(eq(productFiles.type, "main")),
        asc(productFiles.order)
      );

    // Получаем идентификаторы файлов, чтобы получить пути к изображениям
    const fileIds = productFilesData.map((file: any) => file.fileId);

    // Получаем данные файлов
    const filesData =
      fileIds.length > 0
        ? await db.select().from(files).where(inArray(files.id, fileIds))
        : [];

    // Создаем справочники для быстрого доступа
    const productsMap = new Map(productsData.map((p: any) => [p.id, p]));
    const variantsMap = new Map(variantsData.map((v: any) => [v.id, v]));
    const filesMap = new Map(filesData.map((file: any) => [file.id, file.path]));

    // Создаем карту изображений продуктов (берем первое изображение для каждого продукта)
    const imagesMap = new Map();
    const processedProducts = new Set();
    for (const productFile of productFilesData) {
      if (!processedProducts.has(productFile.productId)) {
        const filePath = filesMap.get(productFile.fileId);
        if (filePath) {
          imagesMap.set(productFile.productId, filePath);
          processedProducts.add(productFile.productId);
        }
      }
    }

    // Получаем все ключи атрибутов из корзины
    const attributeValueIds: string[] = [];
    for (const item of cartItemsData) {
      const attrs = item.attributes;
      if (attrs) {
        for (const v of Object.values(attrs)) {
          if (typeof v === "string" && /^attv_/.exec(v))
            attributeValueIds.push(v);
        }
      }
    }
    const uniqueAttributeValueIds = Array.from(new Set(attributeValueIds));
    let attributeValues: any[] = [];
    let attributeMap = new Map();
    if (uniqueAttributeValueIds.length > 0) {
      attributeValues = await db
        .select()
        .from(productAttributeValues)
        .where(inArray(productAttributeValues.id, uniqueAttributeValueIds));
      const attributeIds = Array.from(
        new Set(attributeValues.map((av: any) => av.attributeId)),
      );
      const attributes = await db
        .select()
        .from(productTypeAttributes)
        .where(inArray(productTypeAttributes.id, attributeIds));
      attributeMap = new Map(attributes.map((a: any) => [a.id, a]));
    }

    // Преобразуем элементы корзины в требуемый формат
    const items = cartItemsData.map((item: any): ServerCartItemWithDetails => {
      const attributes = item.attributes;

      // Формируем массив опций с названиями и значениями
      const options: { name: string; value: string }[] = [];
      if (attributes) {
        for (const [key, val] of Object.entries(attributes)) {
          if (typeof val === "string" && /^attv_/.exec(val)) {
            const attrValue = attributeValues.find((av: any) => av.id === val);
            if (attrValue) {
              const attr = attributeMap.get(attrValue.attributeId);
              if (attr) {
                options.push({ name: attr.name, value: attrValue.value });
              }
            }
          } else if (typeof val === "string") {
            options.push({ name: key, value: val });
          }
        }
      }

      // Если есть вариант, но нет опций из атрибутов, пытаемся получить опции из связей варианта
      if (item.variantId && options.length === 0) {
        const variantAttributeValuesForVariant = variantAttributeValues.filter(
          (vav: any) => vav.variantId === item.variantId
        );

        for (const vav of variantAttributeValuesForVariant) {
          const attrValue = attributeValues.find((av: any) => av.id === vav.id); // нет поля attributeValueId
          if (attrValue) {
            const attr = attributeMap.get(attrValue.attributeId);
            if (attr) {
              options.push({ name: attr.name, value: attrValue.value });
            }
          }
        }
      }

      // Если есть вариант, но нет опций, и у варианта есть название, добавляем его как опцию
      if (item.variantId && options.length === 0) {
        const variant = variantsMap.get(item.variantId);
        if (variant?.name) {
          options.push({ name: "Вариант", value: variant.name });
        }
      }

      // Находим связанный продукт
      const product = productsMap.get(item.productId) as ProductType | undefined;
      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Product not found for cart item: ${item.id}`,
        });
      }

      // Находим изображение продукта
      const mainImage = imagesMap.get(product.id);

      // Базовый объект элемента корзины
      const cartItem: ServerCartItemWithDetails = {
        id: item.id,
        quantity: item.quantity,
        productId: item.productId,
        variantId: item.variantId,
        price: item.price,
        discountedPrice: item.discountedPrice,
        attributes: attributes
          ? Object.fromEntries(
            Object.entries(attributes).map(([k, v]) => [k, String(v)]),
          )
          : null,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        product: {
          id: product.id,
          name: product.name,
          slug: product.slug,
          sku: product.sku || "",
          description: product.description,
          basePrice: product.basePrice,
          salePrice: product.salePrice,
          discountPercent: product.discountPercent,
          stock: product.stock || 0,
          mainImage: mainImage ? getFileUrl(mainImage) : null,
          brand:
            product.brandId && brandsMap.has(product.brandId)
              ? (brandsMap.get(product.brandId) as {
                name: string;
                slug: string;
              } | null)
              : null,
        },
        options,
      };

      // Если есть вариант, добавляем информацию о нем
      if (item.variantId) {
        const variant = variantsMap.get(item.variantId);
        if (!variant) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Variant not found for cart item: ${item.id}`,
          });
        }

        cartItem.variant = {
          id: variant.id,
          name: variant.name,
          sku: variant.sku,
          barcode: variant.barcode,
          price: variant.price,
          salePrice: variant.salePrice,
          costPrice: variant.costPrice,
          stock: variant.stock,
          minStock: variant.minStock,
          weight: variant.weight,
          width: variant.width,
          height: variant.height,
          depth: variant.depth,
          isActive: variant.isActive,
          isDefault: variant.isDefault,
        };
      }

      return cartItem;
    });

    // Вычисляем общую стоимость корзины и количество товаров
    const total = items.reduce(
      (sum: number, item: ServerCartItemWithDetails) => {
        let price: number;

        // Приоритет цен: вариант salePrice > вариант price > продукт salePrice > продукт basePrice > сохраненная цена
        if (item.variant) {
          const variantSalePrice = typeof item.variant.salePrice === "string"
            ? Number.parseFloat(item.variant.salePrice)
            : item.variant.salePrice;
          const variantPrice = typeof item.variant.price === "string"
            ? Number.parseFloat(item.variant.price)
            : item.variant.price;

          if (variantSalePrice && variantSalePrice > 0) {
            price = variantSalePrice;
          } else if (variantPrice && variantPrice > 0) {
            price = variantPrice;
          } else {
            // Если у варианта нет цены, используем цену продукта
            const productSalePrice = typeof item.product.salePrice === "string"
              ? Number.parseFloat(item.product.salePrice)
              : item.product.salePrice;
            const productBasePrice = typeof item.product.basePrice === "string"
              ? Number.parseFloat(item.product.basePrice)
              : item.product.basePrice;

            price = productSalePrice && productSalePrice > 0
              ? productSalePrice
              : productBasePrice && productBasePrice > 0
                ? productBasePrice
                : 0;
          }
        } else {
          // Если нет варианта, используем цену продукта с приоритетом salePrice
          const productSalePrice = typeof item.product.salePrice === "string"
            ? Number.parseFloat(item.product.salePrice)
            : item.product.salePrice;
          const productBasePrice = typeof item.product.basePrice === "string"
            ? Number.parseFloat(item.product.basePrice)
            : item.product.basePrice;

          price = productSalePrice && productSalePrice > 0
            ? productSalePrice
            : productBasePrice && productBasePrice > 0
              ? productBasePrice
              : 0;
        }

        // Если все цены равны 0, используем сохраненную цену как fallback
        if (price === 0) {
          if (typeof item.price === "string") {
            const cleanPrice = item.price.trim().replace(',', '.');
            price = Number.parseFloat(cleanPrice);
            if (isNaN(price)) {
              price = 0;
            }
          } else if (typeof item.price === "number") {
            price = item.price;
          } else {
            price = 0;
          }
        }

        return sum + price * item.quantity;
      },
      0,
    );

    const itemCount = items.reduce(
      (count: number, item: ServerCartItemWithDetails) => count + item.quantity,
      0,
    );

    return {
      id: cart.id,
      customerId: cart.customerId,
      sessionId: cart.sessionId,
      status: cart.status,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
      items,
      total,
      itemCount,
    };
  } catch (error) {

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to get cart with items",
    });
  }
}

/**
 * Поиск корзины по ID сессии
 * @param sessionId ID сессии
 * @returns Корзина или null
 */
export async function findCartBySessionId(
  sessionId: string,
): Promise<SimpleCartWithId | null> {
  try {
    const cart = await db.query.carts.findFirst({
      where: eq(carts.sessionId, sessionId),
    });

    return cart ? { id: cart.id } : null;
  } catch (error) {

    return null;
  }
}
