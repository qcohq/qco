import { SidebarProvider } from "@qco/ui/components/sidebar";
import * as React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { MobileHeader } from "@/components/mobile-header";

export default function DashboardLayout(props: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden w-full">
        <AppSidebar key="app-sidebar" />
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Мобильный хедер с кнопкой сайдбара */}
          <MobileHeader title="Панель управления" />
          <main className="flex-1 overflow-auto p-4">
            <React.Suspense fallback={<div>Загрузка...</div>}>
              {props.children}
            </React.Suspense>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
