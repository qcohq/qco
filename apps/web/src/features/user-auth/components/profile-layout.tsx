"use client";

import { Separator } from "@qco/ui/components/separator";
import {
  Bell,
  MapPin,
  Settings,
  ShoppingBag,
  Truck,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { useProfileStats } from "../hooks/use-profile-stats";
import { useSession } from "../hooks/use-session";
import { ProfileSkeleton } from "./index";
import { SignOutButton } from "./sign-out-button";

const baseMenuItems = [
  {
    id: "overview",
    label: "Обзор",
    icon: User,
    href: "/profile",
  },
  {
    id: "orders",
    label: "Мои заказы",
    icon: ShoppingBag,
    href: "/profile/orders",
    badgeKey: "activeOrders",
  },
  {
    id: "addresses",
    label: "Адреса",
    icon: MapPin,
    href: "/profile/addresses",
  },
  {
    id: "notifications",
    label: "Уведомления",
    icon: Bell,
    href: "/profile/notifications",
  },
  {
    id: "settings",
    label: "Настройки",
    icon: Settings,
    href: "/profile/settings",
  },
];

interface ProfileLayoutProps {
  children: React.ReactNode;
}

export function ProfileLayout({ children }: ProfileLayoutProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { session, sessionLoading } = useSession();
  const { data: profileStats, isLoading: statsLoading } = useProfileStats();

  // Создаем динамические пункты меню с данными из API
  const menuItems = baseMenuItems.map((item) => ({
    ...item,
    badge:
      item.badgeKey && profileStats
        ? profileStats[item.badgeKey as keyof typeof profileStats]
        : undefined,
  }));

  if (sessionLoading || statsLoading) {
    return <ProfileSkeleton />;
  }

  if (!session?.user) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-2">
            Доступ запрещен
          </h1>
          <p className="text-muted-foreground">Пожалуйста, войдите в систему</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-2">
          Мой профиль
        </h1>
        <p className="text-muted-foreground">
          Управляйте своим аккаунтом и настройками
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white border rounded-lg p-6 sticky top-8">
            {/* User Info */}
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <User className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="font-semibold text-lg">
                {session.user.name || session.user.email}
              </h3>
              <p className="text-sm text-muted-foreground">
                {session.user.email}
              </p>
            </div>

            <Separator className="mb-6" />

            {/* Navigation */}
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`flex items-center justify-between w-full p-3 rounded-lg text-sm font-medium transition-colors ${isActive
                      ? "bg-black text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && item.badge > 0 && (
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${isActive
                          ? "bg-white text-black"
                          : "bg-gray-200 text-gray-600"
                          }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            <Separator className="my-6" />

            {/* Logout */}
            <SignOutButton
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">{children}</div>
      </div>
    </div>
  );
}
