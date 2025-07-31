"use client";

import { Button } from "@qco/ui/components/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { BannerForm } from "@/features/banners/components/banner-form";

export default function NewBannerPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center border-b bg-white px-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/banners">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Назад к баннерам
            </Link>
          </Button>
          <div className="h-6 w-px bg-gray-200" />
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Создать баннер
            </h1>
            <p className="text-sm text-gray-500">
              Добавьте новый баннер для отображения на сайте
            </p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 p-6">
        <div className="mx-auto max-w-4xl">
          <BannerForm />
        </div>
      </div>
    </div>
  );
}
