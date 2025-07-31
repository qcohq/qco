import {
  FileText,
  Folder,
  Image,
  Library,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Tag,
  Users,
  BarChart3,
} from "lucide-react";
import type React from "react";
import { BrandIcon, ProjectIcon } from "~/components/icons";

/**
 * Тип для элементов меню с рекурсивной структурой
 * @property title - Название пункта меню
 * @property url - URL для перехода (опционально для элементов с подменю)
 * @property icon - Иконка из библиотеки Lucide
 * @property isActive - Флаг активного состояния
 * @property items - Дочерние элементы меню
 * @property badge - Числовой или текстовый индикатор (например, количество новых элементов)
 * @property showOrdersBadge - Флаг для отображения бейджа с количеством новых заказов
 */
export interface MenuItem {
  title: string;
  url?: string;
  icon?: React.ComponentType<{ className?: string }>;
  isActive?: boolean;
  items?: MenuItem[];
  badge?: number | string;
  showOrdersBadge?: boolean;
}

export const ecommerceNavItems: MenuItem[] = [
  {
    title: "Главная",
    url: "/",
    icon: ProjectIcon,
  },
  {
    title: "Аналитика",
    url: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Продукты",
    icon: ShoppingBag,
    items: [
      {
        title: "Товары",
        url: "/products",
        icon: ShoppingBag,
      },
      {
        title: "Типы продуктов",
        url: "/product-types",
        icon: Library,
      },
    ],
  },
  {
    title: "Клиенты",
    url: "/customers",
    icon: Users,
  },
  {
    title: "Заказы",
    url: "/orders",
    icon: ShoppingCart,
    showOrdersBadge: true,
  },
  {
    title: "Бренды",
    url: "/brands",
    icon: BrandIcon,
  },
  {
    title: "Категории",
    url: "/categories",
    icon: Library,
  },
  {
    title: "Баннеры",
    url: "/banners",
    icon: Image,
  },
  {
    title: "Администраторы",
    url: "/admins",
    icon: Users,
  },
  {
    title: "Блог",
    icon: FileText,
    items: [
      {
        title: "Записи",
        url: "/blog",
      },
      {
        title: "Теги",
        url: "/blog/tags",
        icon: Tag,
      },
      {
        title: "Категории",
        url: "/blog/categories",
        icon: Folder,
      },
    ],
  },
  {
    title: "Настройки",
    icon: Settings,
    items: [
      {
        title: "Общие",
        url: "/settings/general",
      },
      {
        title: "Магазин",
        url: "/settings/store",
      },
      {
        title: "Доставка",
        url: "/settings/delivery",
      },
      {
        title: "Оплата",
        url: "/settings/payment",
      },
      {
        title: "Пользователи",
        url: "/settings/users",
      },
      {
        title: "Интеграции",
        url: "/settings/integrations",
      },
    ],
  },
];
