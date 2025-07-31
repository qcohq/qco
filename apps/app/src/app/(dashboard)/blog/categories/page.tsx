"use client";

import { BlogCategoriesManager } from "~/components/blog/blog-categories-manager";

export default function BlogCategoriesPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Управление категориями
        </h1>
        <p className="text-muted-foreground">
          Создавайте и редактируйте категории для организации записей блога
        </p>
      </div>

      <BlogCategoriesManager />
    </div>
  );
}
