import { z } from "zod";

// Локальный тип элемента корзины для фронтенда
export const clientCartItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  quantity: z.number(),
  image: z.string(),
  color: z.string().optional(),
  size: z.string().optional(),
  variantId: z.string().optional(),
  options: z.string().optional(),
  productId: z.string().optional(),
});

export type ClientCartItem = z.infer<typeof clientCartItemSchema>;

// Тип элемента корзины с сервера (соответствует таблице cartItems)
export const serverCartItemSchema = z.object({
  id: z.string(),
  cartId: z.string(),
  productId: z.string(),
  variantId: z.string().nullable(),
  quantity: z.number(),
  price: z.number(), // decimal в БД, но возвращаем как number
  discountedPrice: z.number().nullable(), // decimal в БД, но возвращаем как number
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ServerCartItem = z.infer<typeof serverCartItemSchema>;

// Схема продукта в элементе корзины
export const cartItemProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  basePrice: z.number().nullable(),
  salePrice: z.number().nullable(),
  discountPercent: z.number().nullable(),
  sku: z.string().nullable(),
  stock: z.number().nullable(),
  mainImage: z.string().nullable().optional(),
  brand: z.object({ name: z.string(), slug: z.string() }).nullable().optional(),
});

// Схема варианта в элементе корзины
export const cartItemVariantSchema = z.object({
  id: z.string(),
  name: z.string(),
  sku: z.string().nullable(),
  price: z.union([z.number(), z.string()]),
  compareAtPrice: z.union([z.number(), z.string()]).nullable(),
  stock: z.number().nullable(),
  isDefault: z.boolean(),
}).nullable();

// Расширенный тип элемента корзины с сервера
export const serverCartItemWithDetailsSchema = serverCartItemSchema.extend({
  product: cartItemProductSchema.optional(),
  variant: cartItemVariantSchema.optional(),
  options: z.array(z.object({ name: z.string(), value: z.string() })),
});

export type ServerCartItemWithDetails = z.infer<typeof serverCartItemWithDetailsSchema>;

// Тип корзины с сервера с расширенными элементами (соответствует таблице carts)
export const cartWithItemsSchema = z.object({
  id: z.string(),
  customerId: z.string().nullable(),
  sessionId: z.string().nullable(),
  status: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  expiresAt: z.date().nullable(),
  metadata: z.record(z.string(), z.unknown()).nullable(),
  items: z.array(serverCartItemWithDetailsSchema),
  total: z.number().optional(),
  itemCount: z.number().optional(),
});

export type CartWithItems = z.infer<typeof cartWithItemsSchema>;

// Тип для совместимости с API
export const apiCartWithItemsSchema = z.object({
  id: z.string(),
  items: z.array(serverCartItemWithDetailsSchema),
  total: z.number().optional(),
  itemCount: z.number().optional(),
});

export type ApiCartWithItems = z.infer<typeof apiCartWithItemsSchema>;

// Схема для мини-корзины
export const miniCartItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string(),
  quantity: z.number(),
  price: z.number(),
  color: z.string().optional(),
  size: z.string().optional(),
  variantId: z.string().optional(),
  productId: z.string(),
});

export type MiniCartItem = z.infer<typeof miniCartItemSchema>;

export const miniCartSchema = z.object({
  items: z.array(miniCartItemSchema),
  total: z.number(),
  itemCount: z.number(),
});

export type MiniCart = z.infer<typeof miniCartSchema>;

// Схемы для API запросов
export const getCartSchema = z.object({
  sessionId: z.string().optional(),
  cartId: z.string().optional(),
});

export type GetCartInput = z.infer<typeof getCartSchema>;

export const addItemSchema = z.object({
  sessionId: z.string().optional(), // может быть undefined для авторизованных пользователей
  productId: z.string(),
  variantId: z.string().optional(),
  quantity: z.number().min(1),
});

export type AddItemInput = z.infer<typeof addItemSchema>;

export const updateItemSchema = z.object({
  cartItemId: z.string(),
  quantity: z.number().min(1),
});

export type UpdateItemInput = z.infer<typeof updateItemSchema>;

export const removeItemSchema = z.object({
  cartItemId: z.string(),
});

export type RemoveItemInput = z.infer<typeof removeItemSchema>;

export const clearCartSchema = z.object({
  cartId: z.string(),
});

export type ClearCartInput = z.infer<typeof clearCartSchema>;

// Ответы API
export const cartResponseSchema = apiCartWithItemsSchema;
export type CartResponse = z.infer<typeof cartResponseSchema>;

export const cartOperationResponseSchema = z.object({
  success: z.boolean(),
  cart: apiCartWithItemsSchema.optional(),
});

export type CartOperationResponse = z.infer<typeof cartOperationResponseSchema>;

// Для обратной совместимости
export const cartItemSchema = serverCartItemSchema;
export const cartSchema = z.object({
  id: z.string(),
  customerId: z.string().nullable(),
  sessionId: z.string().nullable(),
  status: z.string(),
  items: z.array(cartItemSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
  expiresAt: z.date().nullable(),
  metadata: z.record(z.string(), z.unknown()).nullable(),
});

export type Cart = z.infer<typeof cartSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;

// Базовые типы для корзины из cart-helpers.ts

// Базовая схема для корзины с ID
export const simpleCartWithIdSchema = z.object({
  id: z.string()
});

export type SimpleCartWithId = z.infer<typeof simpleCartWithIdSchema>;

// Схема для элемента корзины с количеством
export const basicCartItemWithQuantitySchema = z.object({
  id: z.string(),
  quantity: z.number(),
  productId: z.string(),
  variantId: z.string().nullable(),
  price: z.number(),
  product: cartItemProductSchema.optional(),
  variant: cartItemVariantSchema.optional()
});

export type BasicCartItemWithQuantity = z.infer<typeof basicCartItemWithQuantitySchema>;

// Схема для корзины с элементами
export const basicCartWithItemsSchema = z.object({
  id: z.string(),
  items: z.array(basicCartItemWithQuantitySchema)
});

export type BasicCartWithItems = z.infer<typeof basicCartWithItemsSchema>;
