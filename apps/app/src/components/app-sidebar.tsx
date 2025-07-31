"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from "@qco/ui/components/sidebar";
import * as React from "react";
import { NavMain } from "~/components/nav-main";
import { ecommerceNavItems } from "~/data/nav-config";
import { useUserProfile } from "~/hooks/use-user-profile";
import { NavUser } from "./nav-user";
import { OrdersStats } from "./ui/orders-stats";

export const AppSidebar = React.memo(function AppSidebar() {
  const { profile } = useUserProfile();

  // Мемоизируем конфигурацию навигации
  const navItems = React.useMemo(() => ecommerceNavItems, []);

  // Подготавливаем данные пользователя для компонента NavUser
  const userData = React.useMemo(() => {
    return profile
      ? {
        name: profile.name || "Пользователь",
        email: profile.email,
        avatar: profile.image,
      }
      : {
        name: "Загрузка...",
        email: "",
        avatar: "",
      };
  }, [profile]);

  return (
    <Sidebar>
      <SidebarContent>
        <NavMain items={navItems} />
        <OrdersStats />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
});
