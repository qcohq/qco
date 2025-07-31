"use client";

import { Badge } from "@qco/ui/components/badge";
import { Button } from "@qco/ui/components/button";
import { Card, CardFooter } from "@qco/ui/components/card";
import { Checkbox } from "@qco/ui/components/checkbox";
import { cn } from "@qco/ui/lib/utils";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { FavoriteButton } from "@/features/brands/components/favorite-button";
import { getBrandLogoUrl } from "@/features/brands/utils/brand-file-utils";
import type { Brand } from "@/features/brands/types";

// TODO: Использовать тип из схемы пропсов карточки бренда, если появится в @qco/validators

export function BrandCard({
  brand,
  isSelected = false,
  onSelect,
  onEdit,
  onDelete,
  onToggleFavorite,
  className,
}: {
  brand: Brand;
  isSelected?: boolean;
  onSelect?: (id: string, checked: boolean) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string, name: string) => void;
  onToggleFavorite: (id: string) => void;
  className?: string;
}) {
  const logoUrl = getBrandLogoUrl(brand.files);

  return (
    <Card
      className={cn("group relative transition-all hover:shadow-md", className)}
    >
      <button
        type="button"
        className="bg-muted focus:ring-primary relative h-40 w-full cursor-pointer overflow-hidden focus:ring-2 focus:ring-offset-2 focus:outline-none"
        onClick={() => onEdit(brand.id)}
        aria-label={`Редактировать бренд ${brand.name}`}
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            onEdit(brand.id);
          }
        }}
      >
        <div className="absolute inset-0 z-20 flex items-end bg-gradient-to-t from-black/70 to-transparent p-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white drop-shadow">
              {brand.name}
            </h3>
            <div className="mt-1 flex gap-2">
              {brand.isActive ? (
                <Badge variant="secondary" className="text-xs">
                  Активен
                </Badge>
              ) : (
                <Badge variant="destructive" className="text-xs">
                  Неактивен
                </Badge>
              )}
            </div>
          </div>
          <FavoriteButton
            isFavorited={brand.isFeatured ?? false}
            onToggleFavorite={() => onToggleFavorite(brand.id)}
            size="sm"
          />
        </div>
        <div className="pointer-events-none absolute top-0 left-0 z-0 h-full w-full">
          <Image
            src={logoUrl}
            alt={`${brand.name} logo`}
            fill
            sizes="320px"
            className="bg-white object-contain"
          />
        </div>
      </button>
      <div className="absolute top-2 right-2 z-2000 flex gap-1">
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) =>
            onSelect?.(brand.id, checked as boolean)
          }
          aria-label={`Выбрать ${brand.name}`}
          className="bg-white/90"
        />
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:bg-destructive/10 bg-white/90"
          onClick={() => onDelete(brand.id, brand.name)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <CardFooter className="flex flex-col items-start gap-2 p-4">
        <div className="flex w-full items-center justify-between">
          <span className="text-muted-foreground text-xs">
            {brand.foundedYear && `Основан в ${brand.foundedYear}`}
          </span>
          <span className="text-muted-foreground text-xs">
            {brand.countryOfOrigin && `Страна: ${brand.countryOfOrigin}`}
          </span>
        </div>
        <p className="text-muted-foreground mt-2 line-clamp-2 text-xs">
          {brand.description}
        </p>
      </CardFooter>
    </Card>
  );
}

export type { Brand };
