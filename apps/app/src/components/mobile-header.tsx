"use client";

import { SidebarTrigger } from "./layout/sidebar/sidebar-trigger";

interface MobileHeaderProps {
  title: string;
  children?: React.ReactNode;
}

export function MobileHeader({ title, children }: MobileHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b bg-background px-4 py-3 sm:hidden">
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </header>
  );
}
