/**
 * Утилиты для работы с корзиной
 */

import { deleteCookie, getCookie, setCookie } from "cookies-next";

const CART_ID_KEY = "cart_id";
const CART_SESSION_ID_KEY = "cart_session_id";

/**
 * Получает ID корзины из cookies
 */
export function getCartIdFromStorage(): string | null {
  if (typeof window === "undefined") return null;

  try {
    const cartId = getCookie(CART_ID_KEY);
    return cartId ? String(cartId) : null;
  } catch (error) {
    console.error("Ошибка при получении cart_id из cookies:", error);
    return null;
  }
}

/**
 * Сохраняет ID корзины в cookies
 */
export function setCartIdToStorage(cartId: string): void {
  if (typeof window === "undefined") return;

  try {
    setCookie(CART_ID_KEY, cartId, {
      maxAge: 60 * 60 * 24 * 30, // 30 дней в секундах
      path: "/",
      sameSite: "lax",
    });
  } catch (error) {
    console.error("Ошибка при сохранении cart_id в cookies:", error);
  }
}

/**
 * Удаляет ID корзины из cookies
 */
export function removeCartIdFromStorage(): void {
  if (typeof window === "undefined") return;

  try {
    deleteCookie(CART_ID_KEY);
  } catch (error) {
    console.error("Ошибка при удалении cart_id из cookies:", error);
  }
}

/**
 * Получает ID сессии корзины из cookies
 */
export function getCartSessionIdFromCookies(): string | null {
  if (typeof window === "undefined") return null;

  try {
    const sessionId = getCookie(CART_SESSION_ID_KEY);
    return sessionId ? String(sessionId) : null;
  } catch (error) {
    console.error("Ошибка при получении cart_session_id из cookies:", error);
    return null;
  }
}

/**
 * Устанавливает ID сессии корзины в cookies
 */
export function setCartSessionIdToCookies(sessionId: string): void {
  if (typeof window === "undefined") return;

  try {
    setCookie(CART_SESSION_ID_KEY, sessionId, {
      maxAge: 60 * 60 * 24 * 30, // 30 дней в секундах
      path: "/",
      sameSite: "lax",
    });
  } catch (error) {
    console.error("Ошибка при сохранении cart_session_id в cookies:", error);
  }
}

/**
 * Удаляет ID сессии корзины из cookies
 */
export function removeCartSessionIdFromCookies(): void {
  if (typeof window === "undefined") return;

  try {
    deleteCookie(CART_SESSION_ID_KEY);
  } catch (error) {
    console.error("Ошибка при удалении cart_session_id из cookies:", error);
  }
}

/**
 * Получает ID корзины для API запросов
 * Приоритет: cartId > sessionId
 */
export function getCartIdForApi(): { cartId?: string; sessionId?: string } {
  const cartId = getCartIdFromStorage();
  const sessionId = getCartSessionIdFromCookies();

  return {
    cartId: cartId || undefined,
    sessionId: sessionId || undefined,
  };
}

/**
 * Сохраняет данные корзины после успешного API запроса
 */
export function saveCartData(cartId: string, sessionId?: string): void {
  setCartIdToStorage(cartId);
  if (sessionId) {
    setCartSessionIdToCookies(sessionId);
  }
}

/**
 * Очищает данные корзины
 */
export function clearCartData(): void {
  removeCartIdFromStorage();
  removeCartSessionIdFromCookies();
}
