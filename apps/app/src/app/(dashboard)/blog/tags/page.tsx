"use client";

import { BlogTagsManager } from "~/components/blog/blog-tags-manager";

export default function BlogTagsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Управление тегами</h1>
        <p className="text-muted-foreground">
          Создавайте и редактируйте теги для категоризации записей блога
        </p>
      </div>

      <BlogTagsManager />
    </div>
  );
}
