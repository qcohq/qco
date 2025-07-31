"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@qco/ui/components/card";
import { CheckCircle, Layers, Star, XCircle } from "lucide-react";
import type { CategoryListItem } from "./types";

// TODO: Использовать тип из схемы пропсов статистики категорий, если появится в @qco/validators

export function CategoriesStats({ categories }: { categories: CategoryListItem[] }) {
  const totalCategories = categories.length;
  const activeCategories = categories.filter((c) => c.isActive).length;
  const inactiveCategories = categories.filter((c) => !c.isActive).length;
  const featuredCategories = 0; // Поле isFeatured не существует в API

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-muted-foreground text-sm font-medium">
            Всего категорий
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Layers className="text-muted-foreground mr-2 h-4 w-4" />
            <span className="text-2xl font-bold">{totalCategories}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-muted-foreground text-sm font-medium">
            Активные
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
            <span className="text-2xl font-bold">{activeCategories}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-muted-foreground text-sm font-medium">
            Неактивные
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <XCircle className="mr-2 h-4 w-4 text-red-500" />
            <span className="text-2xl font-bold">{inactiveCategories}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-muted-foreground text-sm font-medium">
            Избранные
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Star className="mr-2 h-4 w-4 text-amber-500" />
            <span className="text-2xl font-bold">{featuredCategories}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
