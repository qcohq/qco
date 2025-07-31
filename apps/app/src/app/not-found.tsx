"use client";
import { Button } from "@qco/ui/components/button";
import { Ghost } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-6">
      <Ghost className="w-20 h-20 text-muted-foreground" />
      <h1 className="text-4xl font-bold">404 – Страница не найдена</h1>
      <p className="text-lg text-muted-foreground max-w-md">
        Извините, страница, которую вы ищете, не существует или была перемещена.
      </p>
      <Button asChild size="lg" className="mt-4">
        <Link href="/">Перейти в панель управления</Link>
      </Button>
    </div>
  );
}
