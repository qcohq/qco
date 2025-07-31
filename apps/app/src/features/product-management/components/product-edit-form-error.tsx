"use client";

import { Button } from "@qco/ui/components/button";
import { Card } from "@qco/ui/components/card";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface ProductEditFormErrorProps {
  error: string;
}

export function ProductEditFormError({ error }: ProductEditFormErrorProps) {
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
            <span className="text-foreground font-medium">Ошибка</span>
          </div>
        </div>
      </header>
      <div className="flex flex-1 items-center justify-center">
        <Card className="max-w-md bg-red-50 p-8">
          <div className="text-center text-red-600">
            <p className="font-medium">Ошибка загрузки данных</p>
            <p className="mt-1 text-sm">{error}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Попробовать снова
            </Button>
            <Button variant="ghost" className="mt-2 w-full" asChild>
              <Link href="/products">Вернуться к списку товаров</Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
