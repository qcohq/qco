"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";

export function ProductEditFormLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-background sticky top-0 z-10 flex h-14 shrink-0 items-center border-b px-4">
        <div className="flex items-center gap-2">
          <div className="text-muted-foreground flex items-center gap-1 text-sm">
            <Link
              href="/products"
              className="hover:text-foreground transition-colors"
            >
              Товары
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">Загрузка...</span>
          </div>
        </div>
      </header>
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <div className="border-primary mx-auto h-8 w-8 animate-spin rounded-full border-b-2" />
          <p className="text-muted-foreground mt-2 text-sm">
            Загрузка данных...
          </p>
        </div>
      </div>
    </div>
  );
}
