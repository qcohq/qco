import { eq, and, or, isNull, isNotNull } from "drizzle-orm";
import { favorites } from "./schema";

// Типы для работы с избранными товарами
export interface FavoriteWithProduct {
  id: string;
  productId: string;
  customerId: string | null;
  guestId: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
  updatedAt: Date;
  product: {
    id: string;
    name: string;
    slug: string;
    basePrice: number | null;
    salePrice: number | null;
    discountPercent: number | null;
    isActive: boolean;
  };
}

// Утилиты для работы с избранными товарами
export const favoriteUtils = {
  // Получить избранные товары для авторизованного пользователя
  getCustomerFavorites: (customerId: string) =>
    and(
      eq(favorites.customerId, customerId),
      isNull(favorites.guestId)
    ),

  // Получить избранные товары для неавторизованного пользователя
  getGuestFavorites: (guestId: string) =>
    and(
      eq(favorites.guestId, guestId),
      isNull(favorites.customerId)
    ),

  // Проверить, добавлен ли товар в избранное для авторизованного пользователя
  isProductInCustomerFavorites: (customerId: string, productId: string) =>
    and(
      eq(favorites.customerId, customerId),
      eq(favorites.productId, productId),
      isNull(favorites.guestId)
    ),

  // Проверить, добавлен ли товар в избранное для неавторизованного пользователя
  isProductInGuestFavorites: (guestId: string, productId: string) =>
    and(
      eq(favorites.guestId, guestId),
      eq(favorites.productId, productId),
      isNull(favorites.customerId)
    ),

  // Получить избранные товары по IP и User Agent (для неавторизованных пользователей)
  getFavoritesByDevice: (ipAddress: string, userAgent: string) =>
    and(
      eq(favorites.ipAddress, ipAddress),
      eq(favorites.userAgent, userAgent),
      isNull(favorites.customerId)
    ),

  // Объединить гостевые избранные товары с аккаунтом пользователя
  mergeGuestFavoritesToCustomer: (guestId: string, customerId: string) => ({
    customerId,
    guestId: null,
  }),
}; 
