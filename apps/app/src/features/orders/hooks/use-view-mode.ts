"use client";

import { useEffect, useState } from "react";

export function useViewMode() {
  const [compactMode, setCompactMode] = useState(false);

  // Загрузка предпочтений пользователя из localStorage
  useEffect(() => {
    const savedCompactMode = localStorage.getItem("orderDetailsCompactMode");
    if (savedCompactMode !== null) {
      setCompactMode(savedCompactMode === "true");
    } else {
      // По умолчанию включаем компактный режим на мобильных устройствах
      setCompactMode(window.innerWidth < 768);
    }
  }, []);

  // Сохранение предпочтений пользователя в localStorage
  useEffect(() => {
    localStorage.setItem("orderDetailsCompactMode", compactMode.toString());
  }, [compactMode]);

  return {
    compactMode,
    setCompactMode,
    toggleCompactMode: () => setCompactMode((prev) => !prev),
  };
}
