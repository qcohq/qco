import { useMemo } from "react";

/**
 * Хук для получения списка секций баннера
 * @returns Массив объектов с id и label для выбора секции баннера
 */
export function useBannerSections() {
  const sections = useMemo(() => {
    return [
      { id: "home", label: "Главная страница" },
      { id: "catalog", label: "Каталог" },
      { id: "product", label: "Страница товара" },
      { id: "cart", label: "Корзина" },
      { id: "checkout", label: "Оформление заказа" },
      { id: "account", label: "Личный кабинет" },
      { id: "blog", label: "Блог" },
      { id: "other", label: "Другое" },
    ];
  }, []);

  return sections;
}
