"use client";

import { Button } from "@qco/ui/components/button";
import { Card } from "@qco/ui/components/card";
import {
  AlertTriangle,
  FileSearch,
  Filter,
  Loader2,
  PackageSearch,
  Plus,
  RefreshCw,
  ShoppingCart,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// TODO: Использовать тип из схемы пропсов состояния пустых продуктов, если появится в @qco/validators
type EmptyStateType = "empty" | "search" | "filter" | "error" | "loading";

interface EmptyProductsStateProps {
  type: EmptyStateType;
  searchTerm?: string;
  filterDescription?: string;
  errorMessage?: string;
  onResetFilters?: () => void;
  onRetry?: () => void;
  variant?: "table" | "grid" | "standalone";
}

export function EmptyProductsState({
  type,
  searchTerm = "",
  filterDescription = "",
  errorMessage = "Произошла ошибка при загрузке данных",
  onResetFilters,
  onRetry,
  variant = "standalone",
}: EmptyProductsStateProps) {
  // Определяем содержимое в зависимости от типа пустого состояния
  const getContent = () => {
    switch (type) {
      case "empty":
        return {
          icon: (
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <ShoppingCart className="h-10 w-10 text-muted-foreground" />
            </div>
          ),
          title: "Нет товаров",
          description:
            "В вашем каталоге пока нет товаров. Добавьте первый товар, чтобы начать.",
          primaryAction: (
            <Button asChild>
              <Link href="/products/new">
                <Plus className="mr-2 h-4 w-4" />
                Добавить товар
              </Link>
            </Button>
          ),
          secondaryAction: null,
        };

      case "search":
        return {
          icon: (
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <PackageSearch className="h-10 w-10 text-muted-foreground" />
            </div>
          ),
          title: "Ничего не найдено",
          description: searchTerm
            ? `По запросу "${searchTerm}" ничего не найдено. Попробуйте изменить поисковый запрос или сбросить фильтры.`
            : "По вашему запросу ничего не найдено. Попробуйте изменить поисковый запрос или сбросить фильтры.",
          primaryAction: onResetFilters ? (
            <Button onClick={onResetFilters}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Сбросить фильтры
            </Button>
          ) : null,
          secondaryAction: (
            <Button variant="outline" asChild>
              <Link href="/products">Все товары</Link>
            </Button>
          ),
        };

      case "filter":
        return {
          icon: (
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <Filter className="h-10 w-10 text-muted-foreground" />
            </div>
          ),
          title: "Нет результатов",
          description: filterDescription
            ? `Нет товаров, соответствующих фильтру по ${filterDescription}. Попробуйте изменить параметры фильтрации.`
            : "Нет товаров, соответствующих выбранным фильтрам. Попробуйте изменить параметры фильтрации.",
          primaryAction: onResetFilters ? (
            <Button onClick={onResetFilters}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Сбросить фильтры
            </Button>
          ) : null,
          secondaryAction: (
            <Button variant="outline" asChild>
              <Link href="/products">Все товары</Link>
            </Button>
          ),
        };

      case "error":
        return {
          icon: (
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-10 w-10 text-destructive" />
            </div>
          ),
          title: "Ошибка загрузки",
          description:
            errorMessage ||
            "Произошла ошибка при загрузке данных. Пожалуйста, попробуйте еще раз.",
          primaryAction: onRetry ? (
            <Button onClick={onRetry}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Попробовать снова
            </Button>
          ) : null,
          secondaryAction: (
            <Button variant="outline" asChild>
              <Link href="/">Вернуться на главную</Link>
            </Button>
          ),
        };

      case "loading":
        return {
          icon: (
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
            </div>
          ),
          title: "Загрузка данных",
          description: "Пожалуйста, подождите, идет загрузка товаров...",
          primaryAction: null,
          secondaryAction: null,
        };

      default:
        return {
          icon: (
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <FileSearch className="h-10 w-10 text-muted-foreground" />
            </div>
          ),
          title: "Нет данных",
          description: "Данные отсутствуют или не могут быть отображены.",
          primaryAction: null,
          secondaryAction: null,
        };
    }
  };

  const content = getContent();

  // Рендер для таблицы - во всю ширину
  const renderTableContent = () => (
    <div className="w-full border rounded-lg bg-card">
      <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
        <div className="mb-4">{content.icon}</div>
        <h3 className="mb-2 text-lg font-semibold">{content.title}</h3>
        <p className="mb-6 max-w-sm text-sm text-muted-foreground">
          {content.description}
        </p>
        {(content.primaryAction || content.secondaryAction) && (
          <div className="flex flex-wrap justify-center gap-3">
            {content.primaryAction}
            {content.secondaryAction}
          </div>
        )}
      </div>
    </div>
  );

  // Рендер для сетки - во всю ширину
  const renderGridContent = () => (
    <div className="col-span-full w-full border rounded-lg bg-card">
      <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
        <div className="mb-4">{content.icon}</div>
        <h3 className="mb-2 text-lg font-semibold">{content.title}</h3>
        <p className="mb-6 max-w-sm text-sm text-muted-foreground">
          {content.description}
        </p>
        {(content.primaryAction || content.secondaryAction) && (
          <div className="flex flex-wrap justify-center gap-3">
            {content.primaryAction}
            {content.secondaryAction}
          </div>
        )}
      </div>
    </div>
  );

  // Рендер для автономного использования
  const renderStandalone = () => (
    <Card className="w-full">
      <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
        <div className="mb-4">
          {content.image ? (
            <div className="relative mb-4 h-48 w-48 rounded-lg overflow-hidden">
              <Image
                src={content.image || "/placeholder.svg"}
                alt={content.title}
                fill
                className="object-contain"
              />
            </div>
          ) : (
            content.icon
          )}
        </div>
        <h3 className="mb-2 text-lg font-semibold">{content.title}</h3>
        <p className="mb-6 max-w-sm text-sm text-muted-foreground">
          {content.description}
        </p>
        {(content.primaryAction || content.secondaryAction) && (
          <div className="flex flex-wrap justify-center gap-3">
            {content.primaryAction}
            {content.secondaryAction}
          </div>
        )}
      </div>
    </Card>
  );

  // Выбираем подходящий рендер в зависимости от варианта
  switch (variant) {
    case "table":
      return renderTableContent();
    case "grid":
      return renderGridContent();
    default:
      return renderStandalone();
  }
}
