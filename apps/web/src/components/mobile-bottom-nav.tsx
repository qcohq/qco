"use client";
import { Grid3X3, Heart, Home, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCartCountSafe } from "@/features/cart/hooks/use-cart-count";
import { useFavoritesCount } from "@/features/favorites/hooks/use-favorites-count";
import MobileCatalogOverlay from "./mobile-catalog-overlay";

const navItems = [
  {
    icon: Home,
    label: "Главная",
    href: "/",
    id: "home",
  },
  {
    icon: Grid3X3,
    label: "Каталог",
    href: "/catalog",
    id: "catalog",
  },
  {
    icon: ShoppingBag,
    label: "Корзина",
    href: "/cart",
    id: "cart",
  },
  {
    icon: Heart,
    label: "Избранное",
    href: "/favorites",
    id: "favorites",
  },
  {
    icon: User,
    label: "Профиль",
    href: "/profile",
    id: "profile",
  },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { itemCount } = useCartCountSafe();
  const { favoritesCount } = useFavoritesCount();
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 md:hidden">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || (item.id === "home" && pathname === "/");

          // Определяем количество для бейджа
          let badge = 0;
          if (item.id === "favorites") {
            badge = favoritesCount?.length || 0;
          } else if (item.id === "cart") {
            badge = itemCount || 0;
          }

          return item.id === "catalog" ? (
            <button
              type="button"
              key={item.id}
              onClick={() => setIsCatalogOpen(true)}
              className={`flex flex-col items-center justify-center space-y-1 transition-colors relative ${isActive
                ? "text-primary"
                : "text-gray-500 hover:text-gray-700 active:text-primary"
                }`}
            >
              <div className="relative">
                <Icon className={`h-5 w-5 ${isActive ? "text-black" : ""}`} />
                {badge > 0 && (
                  <span className="absolute -top-2 -right-2 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {badge > 99 ? "99+" : badge}
                  </span>
                )}
              </div>
              <span
                className={`text-xs font-medium ${isActive ? "text-black" : ""}`}
              >
                {item.label}
              </span>
              {isActive && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-black rounded-full" />
              )}
            </button>
          ) : (
            <Link
              key={item.id}
              href={item.href}
              className={`flex flex-col items-center justify-center space-y-1 transition-colors relative ${isActive
                ? "text-primary"
                : "text-gray-500 hover:text-gray-700 active:text-primary"
                }`}
            >
              <div className="relative">
                <Icon className={`h-5 w-5 ${isActive ? "text-black" : ""}`} />
                {badge > 0 && (
                  <span className="absolute -top-2 -right-2 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {badge > 99 ? "99+" : badge}
                  </span>
                )}
              </div>
              <span
                className={`text-xs font-medium ${isActive ? "text-black" : ""}`}
              >
                {item.label}
              </span>
              {isActive && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-black rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
      <MobileCatalogOverlay
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
      />
    </nav>
  );
}
