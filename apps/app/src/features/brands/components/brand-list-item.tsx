"use client";

import { Badge } from "@qco/ui/components/badge";
import { Button } from "@qco/ui/components/button";
import { Checkbox } from "@qco/ui/components/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@qco/ui/components/dropdown-menu";
import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import Image from "next/image";
import { FavoriteButton } from "@/features/brands/components/favorite-button";
import { getBrandLogoUrl } from "@/features/brands/utils/brand-file-utils";
import type { Brand } from "@/features/brands/types";

// TODO: Использовать тип из схемы пропсов элемента списка брендов, если появится в @qco/validators
interface BrandListItemProps {
  brand: Brand;
  isSelected?: boolean;
  onSelect?: (id: string, checked: boolean) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string, name: string) => void;
  onToggleFavorite: (id: string) => void;
}

export function BrandListItem({
  brand,
  isSelected = false,
  onSelect,
  onEdit,
  onDelete,
  onToggleFavorite,
}: BrandListItemProps) {
  const logoUrl = getBrandLogoUrl(brand.files);

  return (
    <tr className="group hover:bg-muted/50 transition-colors">
      <td className="px-4 py-3">
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) =>
            onSelect?.(brand.id, checked as boolean)
          }
          aria-label={`Выбрать ${brand.name}`}
        />
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-center">
          <div className="relative h-10 w-10 overflow-hidden rounded-md bg-white">
            <Image
              src={logoUrl}
              alt={`${brand.name} logo`}
              fill
              sizes="40px"
              className="object-contain p-1"
            />
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-sm font-medium">
        <button
          type="button"
          onClick={() => onEdit(brand.id)}
          className="hover:text-primary transition-colors hover:underline text-left"
        >
          {brand.name}
        </button>
      </td>
      <td className="px-4 py-3">
        {brand.categories && brand.categories.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {brand.categories.map((category) => (
              <Badge key={category.id} variant="secondary" className="text-xs">
                {category.name}
              </Badge>
            ))}
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        )}
      </td>
      <td className="hidden px-4 py-3 text-xs text-muted-foreground md:table-cell">
        {brand.description}
      </td>
      <td className="px-4 py-3 text-xs text-muted-foreground">
        {brand.createdAt
          ? new Date(brand.createdAt).toLocaleDateString("ru-RU")
          : "-"}
      </td>
      <td className="px-4 py-3 text-xs text-muted-foreground">
        {brand.foundedYear}
      </td>
      <td className="px-4 py-3 text-xs text-muted-foreground">
        {brand.countryOfOrigin}
      </td>
      <td className="px-4 py-3">
        <Badge
          variant={brand.isActive ? "default" : "secondary"}
          className="text-xs"
        >
          {brand.isActive ? "Активен" : "Неактивен"}
        </Badge>
      </td>
      <td className="px-4 py-3">
        <FavoriteButton
          isFavorited={brand.isFeatured ?? false}
          onToggleFavorite={() => onToggleFavorite(brand.id)}
          size="sm"
        />
      </td>
      <td className="px-4 py-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Действия</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEdit(brand.id)}>
              <Edit className="mr-2 h-4 w-4" />
              Редактировать
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => onDelete(brand.id, brand.name)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Удалить
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}
