"use client";
import { Suspense } from "react";
import Breadcrumbs from "@/components/breadcrumbs";
import { BrandsAlphabetical } from "@/features/brands";

export default function KidsBrandsPage() {
  const breadcrumbItems = [
    { label: "Главная", href: "/" },
    { label: "Бренды", href: "/brands" },
    { label: "Бренды для детей", href: "/kids/brands" },
  ];

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-4">
            Бренды для детей
          </h1>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto">
            Откройте для себя мир роскошных брендов и эксклюзивных коллекций для
            детей
          </p>
        </div>

        <Suspense fallback={<div>Loading...</div>}>
          <BrandsAlphabetical categorySlug="detyam" />
        </Suspense>
      </main></div>
  );
}
