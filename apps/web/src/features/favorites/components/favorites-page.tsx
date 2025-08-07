"use client";

import { Button } from "@qco/ui/components/button";
import { Heart, LogIn, X } from "lucide-react";
import Link from "next/link";
import { useFavorites } from "../hooks/use-favorites";
import ProductCard from "@/features/products/components/product-card";
import { ProductGridSkeleton } from "@/features/products/components/product-skeleton";

// Тип для данных избранного из API
interface FavoriteItem {
  id: string;
  productId: string;
  customerId: string | null;
  guestId: string | null;
  createdAt: Date;
  updatedAt: Date;
  product: {
    id: string;
    name: string;
    slug: string;
    basePrice: number | null;
    salePrice: number | null;
    discountPercent: number | null;
    isActive: boolean;
    image: string | null; // Главное изображение
    images: string[];
  } | null;
}

export default function FavoritesPage() {
  const {
    favorites,
    isLoading,
    error,
    removeFromFavorites,
    clearFavorites,
    isLocal,
  } = useFavorites();

  const removeFavorite = (productId: string) => {
    removeFromFavorites(productId);
  };

  const clearAllFavorites = () => {
    clearFavorites();
  };

  // Преобразуем данные избранного в формат для ProductCard
  const favoriteProducts = (favorites as FavoriteItem[])
    .filter((favorite) => favorite.product) // Фильтруем только те, у которых есть данные о продукте
    .map((favorite) => ({
      id: favorite.productId,
      name: favorite.product?.name || "Товар",
      slug: favorite.product?.slug || favorite.productId,
      description: "",
      basePrice: favorite.product?.basePrice || 0,
      salePrice: favorite.product?.salePrice || null,
      onSale: Boolean(favorite.product?.salePrice),
      image: favorite.product?.image || "/placeholder.svg", // Используем главное изображение
      images: favorite.product?.images || [],
      brand: "",
      inStock: true,
      category: "",
      isNew: false,
      rating: 0,
    }));

  if (isLoading) {
    return (
      <div className="space-y-6 sm:space-y-8">
        {/* Заголовок */}
        <div className="space-y-2 sm:space-y-3">
          <h1 className="font-playfair text-2xl sm:text-3xl md:text-4xl font-bold">
            Избранное
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Загрузка избранного...
          </p>
        </div>

        {/* Скелетон продуктов */}
        <ProductGridSkeleton count={8} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 sm:py-16">
        <Heart className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-gray-400 mb-4 sm:mb-6" />
        <h1 className="font-playfair text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
          Ошибка загрузки
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 px-4">
          Не удалось загрузить список избранного
        </p>
        <Button onClick={() => window.location.reload()} size="lg">
          Попробовать снова
        </Button>
      </div>
    );
  }

  if (favoriteProducts.length === 0) {
    return (
      <div className="text-center py-8 sm:py-16">
        <Heart className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-gray-400 mb-4 sm:mb-6" />
        <h1 className="font-playfair text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
          Ваш список избранного пуст
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 px-4">
          Добавляйте товары в избранное, чтобы не потерять понравившиеся вещи
        </p>
        <Button asChild size="lg">
          <Link href="/catalog">Перейти к покупкам</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
        <div className="space-y-2 sm:space-y-3">
          <h1 className="font-playfair text-2xl sm:text-3xl md:text-4xl font-bold">
            Избранное
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            {favoriteProducts.length} товар(ов) в избранном
          </p>

          {/* Показываем предупреждение для гостей */}
          {isLocal && (
            <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2 sm:gap-3">
                <LogIn className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-blue-800 font-medium">
                    Вы используете гостевой режим
                  </p>
                  <p className="text-xs sm:text-sm text-blue-700 mt-1">
                    Войдите в аккаунт, чтобы синхронизировать избранное между
                    устройствами и сохранить его навсегда
                  </p>
                  <Button asChild size="sm" className="mt-2">
                    <Link href="/auth/login">Войти в аккаунт</Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            variant="outline"
            size="sm"
            className="sm:text-sm"
            onClick={clearAllFavorites}
          >
            Очистить все
          </Button>
        </div>
      </div>

      {/* Grid View */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8">
        {favoriteProducts.map((product) => (
          <div key={product.id} className="relative group">
            <ProductCard product={product} />
            <Button
              size="icon"
              variant="secondary"
              className="absolute top-2 right-2 sm:top-3 sm:right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-red-100 text-red-600 hover:bg-red-200 h-7 w-7 sm:h-8 sm:w-8 z-10"
              onClick={() => removeFavorite(product.id)}
            >
              <X className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
