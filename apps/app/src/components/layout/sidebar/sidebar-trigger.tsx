"use client";

import { Button } from "@qco/ui/components/button";
import { useSidebar } from "@qco/ui/components/sidebar";
import { Menu } from "lucide-react";
import type React from "react";

interface SidebarTriggerProps extends React.ComponentProps<typeof Button> {}

export function SidebarTrigger({ className, ...props }: SidebarTriggerProps) {
  const { toggleSidebar } = useSidebar();

  const handleClick = () => {
    toggleSidebar();
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`h-9 w-9 rounded-md ${className || ""}`}
      onClick={handleClick}
      {...props}
    >
      <Menu className="h-5 w-5" />
      <span className="sr-only">Открыть меню</span>
    </Button>
  );
}
