"use client";
import { Button } from "@qco/ui/components/button";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-6">
      <AlertTriangle className="w-20 h-20 text-destructive" />
      <h1 className="text-4xl font-bold">500 – Произошла ошибка</h1>
      <p className="text-lg text-muted-foreground max-w-md">
        Извините, произошла непредвиденная ошибка. Пожалуйста, попробуйте ещё
        раз или обратитесь в поддержку, если проблема сохраняется.
      </p>
      <div className="flex gap-4 mt-4">
        <Button onClick={() => reset()} size="lg" variant="outline">
          Попробовать снова
        </Button>
        <Button asChild size="lg">
          <Link href="/">Перейти в панель управления</Link>
        </Button>
      </div>
    </div>
  );
}
