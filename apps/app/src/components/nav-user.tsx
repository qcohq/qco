"use client";

import { BadgeCheck, Bell, ChevronsUpDown, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

// Функция для получения URL DiceBear
const getDiceBearAvatar = (name: string) => {
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("");
  return `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(initials)}`;
};

import { signOut } from "@qco/auth/client";
import { Avatar, AvatarFallback, AvatarImage } from "@qco/ui/components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@qco/ui/components/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@qco/ui/components/sidebar";
import { cn } from "@/lib/utils";

import { paths } from "~/routes/paths";

export const NavUser = React.memo(function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string | null;
  };
}) {
  const { isMobile } = useSidebar();
  const router = useRouter();

  const handleSignOut = React.useCallback(async () => {
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push(paths.login.root); // redirect to login page
          },
        },
      });
    } catch (error) {
      console.error("Ошибка при выходе из системы:", error);
    }
  }, [router]);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className={cn(
                "data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground",
                "transition-all duration-300 ease-in-out",
                "hover:bg-sidebar-accent/50 group",
              )}
            >
              <Avatar className="h-8 w-8 rounded-lg transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:shadow-sm">
                <AvatarImage
                  src={user.avatar || getDiceBearAvatar(user.name)}
                  alt={user.name}
                />
                <AvatarFallback className="rounded-lg">ИИ</AvatarFallback>
              </Avatar>
              <div
                className={cn(
                  "grid flex-1 text-left text-sm leading-tight",
                  "transition-all duration-300 ease-in-out",
                  "group-data-[collapsible=icon]:opacity-0",
                  "group-hover:translate-x-0.5",
                )}
              >
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown
                className={cn(
                  "ml-auto size-4",
                  "transition-all duration-300 ease-in-out",
                  "group-data-[collapsible=icon]:opacity-0",
                  "group-hover:translate-y-0.5",
                )}
              />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={user.avatar || "/placeholder.svg"}
                    alt={user.name}
                  />
                  <AvatarFallback className="rounded-lg">ИИ</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="group transition-all duration-200 hover:translate-x-0.5">
                <BadgeCheck className="transition-transform duration-200 group-hover:scale-110" />
                Аккаунт
              </DropdownMenuItem>
              <DropdownMenuItem className="group transition-all duration-200 hover:translate-x-0.5">
                <Bell className="transition-transform duration-200 group-hover:scale-110" />
                Уведомления
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="group transition-all duration-200 hover:translate-x-0.5"
            >
              <LogOut className="transition-transform duration-200 group-hover:scale-110" />
              Выйти
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
});
