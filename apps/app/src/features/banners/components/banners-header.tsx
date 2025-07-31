import { Button } from "@qco/ui/components/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export function BannersHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Баннеры</h2>
        <p className="text-muted-foreground">
          Управляйте баннерами для вашего сайта
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button asChild>
          <Link href="/banners/new">
            <Plus className="mr-2 h-4 w-4" />
            Создать баннер
          </Link>
        </Button>
      </div>
    </div>
  );
}
