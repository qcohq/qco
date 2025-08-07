"use client";
import { Button } from "@qco/ui/components/button";
import { Skeleton } from "@qco/ui/components/skeleton";
import { ArrowLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCategoryTree } from "@/hooks/use-category-tree";
import Link from "next/link";

interface CategoryTree {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  order?: number | null;
  isActive?: boolean;
  isFeatured?: boolean;
  children?: CategoryTree[];
}

interface NavigationState {
  currentCategory: CategoryTree | null;
  breadcrumbs: CategoryTree[];
}

interface MobileCategoryNavigatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileCategoryNavigator({
  isOpen,
  onClose,
}: MobileCategoryNavigatorProps) {
  const { categoryTree, isLoading, error } = useCategoryTree();
  const [navigationHistory, setNavigationHistory] = useState<NavigationState[]>(
    [],
  );
  const [currentState, setCurrentState] = useState<NavigationState>({
    currentCategory: null,
    breadcrumbs: [],
  });
  const [slideDirection, setSlideDirection] = useState<"left" | "right">(
    "left",
  );
  const [isAnimating, setIsAnimating] = useState(false);

  const handleCategoryClick = (category: CategoryTree) => {
    if (category.children && category.children.length > 0 && !isAnimating) {
      // Переходим в подкатегорию с анимацией слайда влево
      setIsAnimating(true);
      setSlideDirection("left");

      setTimeout(() => {
        const newState: NavigationState = {
          currentCategory: category,
          breadcrumbs: [...currentState.breadcrumbs, category],
        };

        setNavigationHistory([...navigationHistory, currentState]);
        setCurrentState(newState);
        setIsAnimating(false);
      }, 150);
    } else if (!category.children || category.children.length === 0) {
      // Это конечная категория, закрываем навигатор
      onClose();
    }
  };

  const handleBackClick = () => {
    if (navigationHistory.length > 0 && !isAnimating) {
      // Возвращаемся назад с анимацией слайда вправо
      setIsAnimating(true);
      setSlideDirection("right");

      setTimeout(() => {
        const previousState = navigationHistory[navigationHistory.length - 1];
        const newHistory = navigationHistory.slice(0, -1);

        setCurrentState(previousState);
        setNavigationHistory(newHistory);
        setIsAnimating(false);
      }, 150);
    }
  };

  const handleClose = () => {
    // Сбрасываем состояние при закрытии
    setCurrentState({ currentCategory: null, breadcrumbs: [] });
    setNavigationHistory([]);
    setIsAnimating(false);
    onClose();
  };

  // Сброс анимации при изменении состояния
  useEffect(() => {
    if (!isOpen) {
      setIsAnimating(false);
    }
  }, [isOpen]);

  // Скрываем хедер при открытии каталога
  useEffect(() => {
    const header = document.querySelector("header");
    if (header) {
      if (isOpen) {
        header.style.display = "none";
      } else {
        header.style.display = "";
      }
    }

    return () => {
      if (header) {
        header.style.display = "";
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  if (isLoading) {
    return (
      <div
        className="fixed inset-0 z-[99999] bg-white md:hidden"
        style={{ zIndex: 99999 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-lg font-semibold">Каталог</h1>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Loading Content */}
        <div className="flex-1 overflow-y-auto">
          {["category-1", "category-2", "category-3"].map((categoryKey) => (
            <div
              key={categoryKey}
              className="border-b border-gray-100 last:border-0"
            >
              <div className="p-4 bg-gray-50">
                <Skeleton className="h-5 w-24" />
              </div>
              <div className="divide-y divide-gray-100">
                {["item-1", "item-2", "item-3", "item-4"].map((itemKey) => (
                  <div
                    key={`${categoryKey}-${itemKey}`}
                    className="flex items-center justify-between p-4"
                  >
                    <Skeleton className="h-4 w-32" />
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="fixed inset-0 z-[99999] bg-white md:hidden"
        style={{ zIndex: 99999 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-lg font-semibold">Каталог</h1>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Error Content */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <p className="text-gray-500 mb-2">Ошибка загрузки каталога</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Попробовать снова
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const displayCategories =
    currentState.currentCategory?.children || categoryTree;
  const canGoBack = navigationHistory.length > 0;

  return (
    <div
      className="fixed inset-0 z-[99999] bg-white md:hidden"
      style={{ zIndex: 99999 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          {canGoBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBackClick}
              className="mr-2"
              disabled={isAnimating}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <h1 className="text-lg font-semibold">
            {currentState.currentCategory?.name || "Каталог"}
          </h1>
        </div>
        <Button variant="ghost" size="icon" onClick={handleClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Breadcrumbs */}
      {currentState.breadcrumbs.length > 0 && (
        <div className="px-4 py-2 bg-gray-50 border-b">
          <div className="flex items-center gap-2 text-sm text-gray-500 overflow-x-auto">
            <span>Главная</span>
            {currentState.breadcrumbs.map((breadcrumb, _index) => (
              <div key={breadcrumb.id} className="flex items-center gap-2">
                <ChevronRight className="h-3 w-3" />
                <span>{breadcrumb.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <div
          className={`h-full transition-transform duration-300 ease-in-out ${isAnimating
            ? slideDirection === "left"
              ? "-translate-x-full"
              : "translate-x-full"
            : "translate-x-0"
            }`}
        >
          <div className="h-full overflow-y-auto">
            {/* Show "All Products" option when inside a category */}
            {currentState.currentCategory && (
              <Link
                href={currentState.currentCategory ? `/catalog/${currentState.currentCategory.slug}` : "/catalog"}
                className="w-full flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left disabled:opacity-50 bg-blue-50"
                onClick={onClose}
                tabIndex={isAnimating ? -1 : 0}
                aria-disabled={isAnimating}
              >
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-sm font-medium text-blue-600">
                    Все товары
                  </span>
                </div>
              </Link>
            )}

            {(displayCategories as CategoryTree[])?.map(
              (category: CategoryTree) => (
                <button
                  key={category.id}
                  type="button"
                  className="w-full flex items-center justify-between p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors text-left disabled:opacity-50"
                  onClick={() => handleCategoryClick(category)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleCategoryClick(category);
                    }
                  }}
                  disabled={isAnimating}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-sm font-medium">{category.name}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {category.isFeatured && (
                      <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded">
                        HOT
                      </span>
                    )}
                    {category.children && category.children.length > 0 && (
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </button>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
