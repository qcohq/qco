"use client";

import { getCookie, setCookie } from "cookies-next";
import { useCallback, useEffect, useState } from "react";
import { env } from "../../../env";

const CART_SESSION_ID_KEY = "cart_session_id";
const CART_ID_KEY = "cart_id";

/**
 * Хук для управления идентификатором сессии корзины
 * @returns Объект с идентификатором сессии корзины и идентификатором корзины
 */
export function useCartSession() {
  const [sessionId, setSessionIdState] = useState<string>("");
  const [cartId, setCartIdState] = useState<string>("");

  // Получаем ID сессии из cookies
  const getSessionId = useCallback((): string => {
    if (typeof window === "undefined") return "";

    try {
      const sessionId = getCookie(CART_SESSION_ID_KEY);
      return sessionId ? String(sessionId) : "";
    } catch (error) {
      console.error("Ошибка при получении cart_session_id из cookies:", error);
      return "";
    }
  }, []);

  // Получаем ID корзины из cookies
  const getCartId = useCallback((): string => {
    if (typeof window === "undefined") return "";

    try {
      const cartId = getCookie(CART_ID_KEY);
      return cartId ? String(cartId) : "";
    } catch (error) {
      console.error("Ошибка при получении cart_id из cookies:", error);
      return "";
    }
  }, []);

  // Устанавливаем ID сессии в cookies
  const setSessionId = useCallback((newSessionId: string): void => {
    try {
      if (typeof window !== "undefined") {
        setCookie(CART_SESSION_ID_KEY, newSessionId, {
          maxAge: 60 * 60 * 24 * 30, // 30 дней в секундах
          path: "/",
          sameSite: "lax",
          secure: env.NODE_ENV === "production",
        });
        setSessionIdState(newSessionId);
      }
    } catch (error) {
      console.error("Ошибка при сохранении cart_session_id в cookies:", error);
    }
  }, []);

  // Устанавливаем ID корзины в cookies
  const setCartId = useCallback((newCartId: string): void => {
    try {
      if (typeof window !== "undefined") {
        setCookie(CART_ID_KEY, newCartId, {
          maxAge: 60 * 60 * 24 * 30, // 30 дней в секундах
          path: "/",
          sameSite: "lax",
          secure: env.NODE_ENV === "production",
        });
        setCartIdState(newCartId);
      }
    } catch (error) {
      console.error("Ошибка при сохранении cart_id в cookies:", error);
    }
  }, []);

  // Инициализация при загрузке
  useEffect(() => {
    const currentSessionId = getSessionId();
    const currentCartId = getCartId();

    setSessionIdState(currentSessionId);
    setCartIdState(currentCartId);

    // Инициализируем sessionId, если его нет
    if (!currentSessionId) {
      const newSessionId = crypto.randomUUID();
      setSessionId(newSessionId);
    }
  }, [getSessionId, getCartId, setSessionId]);

  /**
   * Обновляет ID корзины, если он изменился
   * @param newCartId Новый ID корзины
   */
  const updateCartId = useCallback(
    (newCartId: string): void => {
      if (newCartId !== cartId) {
        setCartId(newCartId);
      }
    },
    [cartId, setCartId],
  );

  return {
    sessionId: sessionId || undefined,
    cartId: cartId || undefined,
    setCartId,
    updateCartId,
  };
}
