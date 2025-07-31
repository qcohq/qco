"use client";

import { Button } from "@qco/ui/components/button";
import { useEffect, useState } from "react";
import { OptimizedImage } from "@/features/shared/components/optimized-image";
import {
  type ProductGalleryProps,
  productGallerySchema,
  type ColorImage
} from "../types";

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  // Валидация входных данных
  const validationResult = productGallerySchema.safeParse({ images, productName });

  if (!validationResult.success) {
    console.error("ProductGallery validation error:", validationResult.error);
    return (
      <div className="flex items-center justify-center p-8 text-red-500">
        Invalid product data
      </div>
    );
  }

  // Группируем изображения по цветам
  const colorGroups = images.reduce(
    (acc, img) => {
      if (!acc[img.color]) {
        acc[img.color] = [];
      }
      acc[img.color].push(img);
      return acc;
    },
    {} as Record<string, ColorImage[]>,
  );

  // Находим цвет по умолчанию или берем первый
  const defaultColor =
    images.find((img) => img.isDefault)?.color || Object.keys(colorGroups)[0];

  const [selectedColor, setSelectedColor] = useState(defaultColor);
  const [mainImage, setMainImage] = useState(colorGroups[defaultColor]?.[0]?.url || "");

  // Обновляем главное изображение при изменении цвета
  useEffect(() => {
    if (colorGroups[selectedColor]?.length > 0) {
      setMainImage(colorGroups[selectedColor][0].url);
    }
  }, [selectedColor, colorGroups]);

  // Проверяем, что у нас есть изображения
  if (!mainImage) {
    return (
      <div className="flex items-center justify-center p-8 text-gray-500">
        No images available
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-50">
        <OptimizedImage
          src={mainImage}
          alt={`${productName} - ${selectedColor}`}
          width={600}
          height={600}
          className="h-full w-full object-contain"
          priority
        />
      </div>

      {/* Цветовые варианты */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(colorGroups).map(([color, imgs]) => (
          <Button
            key={color}
            variant={selectedColor === color ? "default" : "outline"}
            className="h-auto rounded-md p-1"
            onClick={() => setSelectedColor(color)}
          >
            <div className="flex flex-col items-center gap-1">
              <div className="relative h-12 w-12 overflow-hidden rounded-md border">
                <OptimizedImage
                  src={imgs[0].url}
                  alt={color}
                  width={48}
                  height={48}
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="text-xs">{color}</span>
            </div>
          </Button>
        ))}
      </div>

      {/* Дополнительные изображения для выбранного цвета */}
      {colorGroups[selectedColor]?.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {colorGroups[selectedColor].map((img, index) => (
            <Button
              key={index}
              variant={mainImage === img.url ? "default" : "outline"}
              className="h-auto rounded-md p-1"
              onClick={() => setMainImage(img.url)}
            >
              <div className="h-16 w-16 overflow-hidden rounded-md">
                <OptimizedImage
                  src={img.url}
                  alt={`${productName} - ${selectedColor} - view ${index + 1}`}
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
              </div>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
