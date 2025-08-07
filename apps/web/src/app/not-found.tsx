"use client";

import { Button } from "@qco/ui/components/button";
import { ArrowLeft, Home, Search } from "lucide-react";
import Link from "next/link";
export default function NotFound() {
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8 max-w-2xl mx-auto">
          <div className="space-y-4">
            <h1 className="font-playfair text-8xl md:text-9xl font-bold text-gray-200">
              404
            </h1>
            <h2 className="font-playfair text-3xl md:text-4xl font-bold">
              Страница не найдена
            </h2>
            <p className="text-muted-foreground text-lg">
              К сожалению, запрашиваемая страница не существует или была
              перемещена
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                На главную
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/catalog">
                <Search className="h-4 w-4 mr-2" />
                Каталог товаров
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад
            </Button>
          </div>

          <div className="pt-8 border-t">
            <p className="text-sm text-muted-foreground mb-4">
              Популярные разделы:
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Link
                href="/catalog/zhenschinam"
                className="text-sm hover:underline"
              >
                Женщинам
              </Link>
              <span className="text-gray-300">•</span>
              <Link
                href="/catalog/muzhchinam"
                className="text-sm hover:underline"
              >
                Мужчинам
              </Link>
              <span className="text-gray-300">•</span>
              <Link href="/sale" className="text-sm hover:underline">
                Распродажа
              </Link>
              <span className="text-gray-300">•</span>
              <Link href="/new" className="text-sm hover:underline">
                Новинки
              </Link>
            </div>
          </div>
        </div>
      </main></div>
  );
}
