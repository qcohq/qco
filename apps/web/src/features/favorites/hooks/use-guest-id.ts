"use client";

import { useEffect, useState } from "react";
import { createId } from "@paralleldrive/cuid2";

const GUEST_ID_KEY = "qco_guest_id";

export function useGuestId() {
    const [guestId, setGuestId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            // Пытаемся получить существующий guestId из localStorage
            const storedGuestId = localStorage.getItem(GUEST_ID_KEY);

            if (storedGuestId) {
                setGuestId(storedGuestId);
            } else {
                // Создаем новый guestId
                const newGuestId = createId();
                localStorage.setItem(GUEST_ID_KEY, newGuestId);
                setGuestId(newGuestId);
            }
        } catch (error) {
            console.error("Ошибка при работе с guestId:", error);
            // В случае ошибки создаем временный guestId
            const fallbackGuestId = createId();
            setGuestId(fallbackGuestId);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const clearGuestId = () => {
        try {
            localStorage.removeItem(GUEST_ID_KEY);
            setGuestId(null);
        } catch (error) {
            console.error("Ошибка при очистке guestId:", error);
        }
    };

    return {
        guestId,
        isLoading,
        clearGuestId,
    };
} 