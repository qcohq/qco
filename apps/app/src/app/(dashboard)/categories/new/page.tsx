import { Suspense } from "react";

import { CreateCategoryPage } from "@/features/categories/pages/create-category-page";
import { CategoryFormSkeleton } from "@/features/categories/components/category-form-skeleton";

export default function CreateCategoryPageServer() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50/50">
      {/* Header */}
      <header className="bg-background sticky top-0 z-10 flex h-14 shrink-0 items-center border-b px-4">
        <div className="flex items-center gap-2">
          <div className="text-muted-foreground flex items-center gap-1 text-sm">
            <span className="text-foreground font-medium">
              Создание категории
            </span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <div className="container mx-auto max-w-4xl px-4 py-6">
          <Suspense fallback={<CategoryFormSkeleton />}>
            <CreateCategoryPage />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
