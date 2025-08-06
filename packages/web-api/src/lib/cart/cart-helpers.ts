import { db } from "@qco/db/client";
import {
  carts,
  cartItems,
  files,
  products,
  productFiles,
  productVariants,
  productVariantOptions,
  productVariantOptionValues,
  productVariantOptionCombinations,
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
type CartItemType = typeof cartItems.$inferSelect;
type BrandType = typeof brands.$inferSelect;
type ProductVariantType = typeof productVariants.$inferSelect;
type ProductFileType = typeof productFiles.$inferSelect;
type FileType = typeof files.$inferSelect;
type ProductVariantOptionType = typeof productVariantOptions.$inferSelect;
type ProductVariantOptionValueType = typeof productVariantOptionValues.$inferSelect;
type ProductVariantOptionCombinationType = typeof productVariantOptionCombinations.$inferSelect;



export interface ServerCartItemWithDetails {
  id: string;
  quantity: number;
  productId: string;
  variantId?: string | null;
  price: number | string;
  discountedPrice?: number | string | null;
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
    stock: number | null;
    mainImage: string | null;
    brand: { name: string; slug: string } | null;
  };
  variant?: {
    id: string;
    name: string;
    sku: string | null;
    price: number | string;
    compareAtPrice: number | string | null; // alias для salePrice
    stock: number | null;
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
}: {
  cartId: string;
  productId: string;
  variantId?: string;
  quantity: number;
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
      attributes: null,
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
    const productIds = cartItemsData.map((item: CartItemType) => item.productId);
    const variantIds = cartItemsData
      .filter((item: CartItemType) => item.variantId !== null)
      .map((item: CartItemType) => item.variantId as string);
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
          .map((p: ProductType) => p.brandId)
          .filter((id: string | null): id is string => !!id),
      ),
    );
    const brandsData: BrandType[] =
      brandIds.length > 0
        ? await db
          .select()
          .from(brands)
          .where(inArray(brands.id, brandIds))
        : [];
    const brandsMap = new Map(
      brandsData.map((b: BrandType) => [b.id, { name: b.name, slug: b.slug }]),
    );

    // Получаем все варианты одним запросом (если они есть)
    const variantsData: ProductVariantType[] =
      variantIds.length > 0
        ? await db
          .select()
          .from(productVariants)
          .where(inArray(productVariants.id, variantIds))
        : [];

    // Получаем опции вариантов (если есть варианты в корзине)
    let variantOptionCombinations: ProductVariantOptionCombinationType[] = [];
    let variantOptions: ProductVariantOptionType[] = [];
    let variantOptionValues: ProductVariantOptionValueType[] = [];

    if (variantIds.length > 0) {
      // Получаем комбинации опций для вариантов
      variantOptionCombinations = await db
        .select()
        .from(productVariantOptionCombinations)
        .where(inArray(productVariantOptionCombinations.variantId, variantIds));

      // Получаем уникальные ID опций и значений опций
      const optionIds = Array.from(new Set(variantOptionCombinations.map(c => c.optionId)));
      const optionValueIds = Array.from(new Set(variantOptionCombinations.map(c => c.optionValueId)));

      // Получаем данные опций и значений опций
      if (optionIds.length > 0) {
        variantOptions = await db
          .select()
          .from(productVariantOptions)
          .where(inArray(productVariantOptions.id, optionIds));
      }

      if (optionValueIds.length > 0) {
        variantOptionValues = await db
          .select()
          .from(productVariantOptionValues)
          .where(inArray(productVariantOptionValues.id, optionValueIds));
      }
    }

    // Получаем все изображения для продуктов, сортируя по типу и порядку
    const productFilesData: ProductFileType[] = await db
      .select()
      .from(productFiles)
      .where(inArray(productFiles.productId, productIds))
      .orderBy(
        desc(eq(productFiles.type, "main")),
        asc(productFiles.order)
      );

    // Получаем идентификаторы файлов, чтобы получить пути к изображениям
    const fileIds = productFilesData.map((file: ProductFileType) => file.fileId);

    // Получаем данные файлов
    const filesData: FileType[] =
      fileIds.length > 0
        ? await db.select().from(files).where(inArray(files.id, fileIds))
        : [];

    // Создаем справочники для быстрого доступа
    const productsMap = new Map<string, ProductType>(productsData.map((p: ProductType) => [p.id, p]));
    const variantsMap = new Map<string, ProductVariantType>(variantsData.map((v: ProductVariantType) => [v.id, v]));
    const filesMap = new Map<string, string>(filesData.map((file: FileType) => [file.id, file.path]));

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

    // Создаем карты для быстрого доступа к данным опций вариантов
    const optionsMap = new Map(variantOptions.map(option => [option.id, option]));
    const optionValuesMap = new Map(variantOptionValues.map(value => [value.id, value]));
    const variantOptionsMap = new Map<string, Array<{ option: ProductVariantOptionType, value: ProductVariantOptionValueType }>>();

    // Группируем опции по варiantId
    for (const combination of variantOptionCombinations) {
      if (!variantOptionsMap.has(combination.variantId)) {
        variantOptionsMap.set(combination.variantId, []);
      }

      const option = optionsMap.get(combination.optionId);
      const value = optionValuesMap.get(combination.optionValueId);

      if (option && value) {
        variantOptionsMap.get(combination.variantId)?.push({ option, value });
      }
    }

    // Преобразуем элементы корзины в требуемый формат
    const items = cartItemsData.map((item: CartItemType): ServerCartItemWithDetails => {
      // Формируем массив опций для варианта
      const options: { name: string; value: string }[] = [];

      // Если есть вариант, получаем его опции из базы данных
      if (item.variantId && variantOptionsMap.has(item.variantId)) {
        const variantOptionData = variantOptionsMap.get(item.variantId) || [];
        for (const { option, value } of variantOptionData) {
          options.push({
            name: option.name,
            value: value.displayName || value.value
          });
        }
      }

      // Если есть вариант, но нет опций в базе, используем название варианта как fallback
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
      let cartItem: ServerCartItemWithDetails = {
        id: item.id,
        quantity: item.quantity,
        productId: item.productId,
        variantId: item.variantId,
        price: item.price,
        discountedPrice: item.discountedPrice,
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
          stock: product.stock,
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
          price: variant.price,
          compareAtPrice: variant.salePrice, // salePrice становится compareAtPrice для фронтенда
          stock: variant.stock,
          isDefault: variant.isDefault,
        };
      }

      return cartItem;
    });

    // Вычисляем общую стоимость корзины и количество товаров
    const total = items.reduce(
      (sum: number, item: ServerCartItemWithDetails) => {
        let price: number;

        // Приоритет цен: вариант price > вариант compareAtPrice > продукт salePrice > продукт basePrice > сохраненная цена
        if (item.variant) {
          const variantPrice = typeof item.variant.price === "string"
            ? Number.parseFloat(item.variant.price)
            : item.variant.price;
          const variantCompareAtPrice = typeof item.variant.compareAtPrice === "string"
            ? Number.parseFloat(item.variant.compareAtPrice)
            : item.variant.compareAtPrice;

          if (variantPrice && variantPrice > 0) {
            price = variantPrice;
          } else if (variantCompareAtPrice && variantCompareAtPrice > 0) {
            price = variantCompareAtPrice;
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
