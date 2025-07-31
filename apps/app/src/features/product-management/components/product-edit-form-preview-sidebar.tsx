"use client";

import type { RouterOutputs } from "@qco/api";
import { Badge } from "@qco/ui/components/badge";
import { Button } from "@qco/ui/components/button";
import { ScrollArea } from "@qco/ui/components/scroll-area";
import type { ProductUpdateInput } from "@qco/validators";
import { ExternalLink, Trash2 } from "lucide-react";
import Link from "next/link";
import { OptimizedImage } from "@/features/shared/components/optimized-image";
import { env } from "~/env";
import { DuplicateProductButton } from "./duplicate-product-button";

interface ProductEditFormPreviewSidebarProps {
  formData: ProductUpdateInput;
  isNewProduct: boolean;
  isDeleting: boolean;
  setDeleteDialogOpen: (open: boolean) => void;
  files?: RouterOutputs["products"]["getById"]["files"];
  productId?: string;
}

export function ProductEditFormPreviewSidebar({
  formData,
  isNewProduct,
  isDeleting,
  setDeleteDialogOpen,
  files = [],
  productId,
}: ProductEditFormPreviewSidebarProps) {
  return (
    <div className="hidden w-80 shrink-0 xl:block">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="border-b border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900">Предпросмотр товара</h3>
          <p className="text-sm text-gray-500 mt-1">
            Как товар будет выглядеть в магазине
          </p>
        </div>

        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="p-4 space-y-6">
            {/* Карточка товара */}
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
              {files.find((file) => file.type === "main")?.meta.url ? (
                <OptimizedImage
                  src={files.find((file) => file.type === "main")?.meta.url!}
                  alt={
                    files.find((file) => file.type === "main")?.alt ??
                    formData.name ??
                    "Превью товара"
                  }
                  width={255}
                  height={200}
                  className="aspect-square w-full"
                  objectFit="cover"
                />
              ) : (
                <div className="aspect-square w-full bg-gray-100 flex items-center justify-center">
                  <p className="text-gray-500 text-sm">Нет изображения</p>
                </div>
              )}

              <div className="p-4">
                <h4 className="font-medium text-gray-900 truncate">
                  {formData.name || "Название товара"}
                </h4>
                {formData.description ? (
                  <div
                    className="prose max-w-none mt-2 text-sm text-gray-600"
                    dangerouslySetInnerHTML={{ __html: formData.description }}
                  />
                ) : (
                  <p className="text-gray-600 mt-2 line-clamp-2 text-sm">
                    Описание товара
                  </p>
                )}

                <div className="mt-3 flex items-center justify-between">
                  <Badge variant={formData.isActive ? "default" : "secondary"}>
                    {formData.isActive ? "Активен" : "Неактивен"}
                  </Badge>
                  {formData.isFeatured && (
                    <Badge
                      variant="outline"
                      className="text-orange-600 border-orange-200"
                    >
                      Рекомендуемый
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Информация о товаре */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Информация о товаре</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-500">Артикул:</span>
                  <span className="font-medium text-gray-900">
                    {formData.sku || "-"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-500">Статус:</span>
                  <span className="font-medium text-gray-900">
                    {formData.isActive ? "Активен" : "Неактивен"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-500">Цена:</span>
                  <span className="font-medium text-gray-900">
                    {formData.basePrice
                      ? `${formData.basePrice} ₽`
                      : "Не указана"}
                  </span>
                </div>
                {formData.salePrice &&
                  formData.salePrice < (formData.basePrice || 0) && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-500">Цена со скидкой:</span>
                      <span className="font-medium text-green-600">
                        {formData.salePrice} ₽
                      </span>
                    </div>
                  )}
              </div>
            </div>

            {/* Быстрые действия */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Быстрые действия</h4>
              <div className="space-y-3">
                {!isNewProduct && productId && (
                  <DuplicateProductButton productId={productId} />
                )}
                {!isNewProduct && formData.slug && (
                  <Link
                    href={`${env.NEXT_PUBLIC_WEB_APP_URL}/products/${formData.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full block"
                  >
                    <Button variant="outline" className="justify-start mb-1">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Посмотреть на сайте
                    </Button>
                  </Link>
                )}
                {!isNewProduct && (
                  <Button
                    variant="destructive"
                    className="w-full justify-start"
                    onClick={() => setDeleteDialogOpen(true)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {isDeleting ? "Удаление..." : "Удалить товар"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
