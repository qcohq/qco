"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@qco/ui/components/collapsible";
import { ChevronRight, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { OrdersBadge } from "./ui/orders-badge";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@qco/ui/components/sidebar";

export const NavMain = React.memo(function NavMain({
  items,
}: {
  items: {
    title: string;
    url?: string;
    icon?: LucideIcon | React.ComponentType<{ className?: string }>;
    isActive?: boolean;
    showOrdersBadge?: boolean;
    items?: {
      title: string;
      url?: string;
      icon?: LucideIcon | React.ComponentType<{ className?: string }>;
    }[];
  }[];
}) {
  const pathname = usePathname();

  // Мемоизируем вычисление активных состояний
  const activeStates = React.useMemo(() => {
    const states = new Map<string, boolean>();

    items.forEach((item) => {
      if (item.items && item.items.length > 0) {
        const isActive = item.items.some(
          (subItem) => subItem.url && pathname.startsWith(subItem.url),
        );
        states.set(item.title, isActive);

        item.items.forEach((subItem) => {
          if (subItem.url) {
            states.set(
              `${item.title}-${subItem.title}`,
              pathname === subItem.url,
            );
          }
        });
      } else if (item.url) {
        // Специальная логика для главной страницы
        if (item.url === "/") {
          states.set(item.title, pathname === "/" || pathname === "/dashboard");
        } else {
          states.set(item.title, pathname === item.url);
        }
      }
    });

    return states;
  }, [items, pathname]);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Навигация</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          // Если у пункта есть подпункты, используем Collapsible
          if (item.items && item.items.length > 0) {
            const isActive = activeStates.get(item.title) || false;

            return (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={isActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => {
                        const isSubItemActive =
                          activeStates.get(`${item.title}-${subItem.title}`) ||
                          false;

                        return (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={isSubItemActive}
                            >
                              <Link href={subItem.url || "#"}>
                                {subItem.icon && <subItem.icon />}
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            );
          }

          // Если подпунктов нет, используем обычную кнопку
          const isActive = activeStates.get(item.title) || false;

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title}>
                <Link
                  href={item.url || "#"}
                  data-active={isActive}
                  className={item.title === "Главная" ? "font-semibold" : ""}
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  {item.showOrdersBadge && <OrdersBadge />}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
});
