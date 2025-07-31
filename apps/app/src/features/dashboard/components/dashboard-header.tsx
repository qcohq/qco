import { Button } from "@qco/ui/components/button";
import { SidebarTrigger } from "@qco/ui/components/sidebar";
import { Bell, Search } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center border-b px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-xl font-semibold">Панель управления</h1>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <Button variant="ghost" size="icon">
          <Search className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Bell className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
