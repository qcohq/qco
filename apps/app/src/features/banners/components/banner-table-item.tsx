"use client";

import { Badge } from "@qco/ui/components/badge";
import { Button } from "@qco/ui/components/button";
import { Checkbox } from "@qco/ui/components/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@qco/ui/components/dropdown-menu";
import { TableCell, TableRow } from "@qco/ui/components/table";
import { Edit, Eye, EyeOff, Star, Trash2 } from "lucide-react";
import Link from "next/link";

import { OptimizedImage } from "@/features/shared/components/optimized-image";
import type { BannerListFromAPI } from "../types";

interface BannerTableItemProps {
  banner: BannerListFromAPI;
  isSelected: boolean;
  onSelect: (bannerId: string, selected: boolean) => void;
  onDelete: (bannerId: string) => void;
}

export function BannerTableItem({
  banner,
  isSelected,
  onSelect,
  onDelete,
}: BannerTableItemProps) {
  const mainImage =
    banner.files?.find((file) => file.type === "desktop") ||
    banner.files?.find((file) => file.type === "primary") ||
    banner.files?.[0];

  const _formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("ru-RU");
  };

  const getPositionLabel = (position: string) => {
    const positions: Record<string, string> = {
      hero: "Главный",
      sidebar: "Боковая панель",
      "category-top": "Верх категории",
      "product-top": "Верх товара",
      footer: "Подвал",
      popup: "Всплывающий",
    };
    return positions[position] || position;
  };

  const getPageLabel = (page?: string) => {
    if (!page) return "—";
    const pages: Record<string, string> = {
      home: "Главная",
      category: "Категория",
      product: "Товар",
      cart: "Корзина",
      checkout: "Оформление",
    };
    return pages[page] || page;
  };

  return (
    <TableRow className="group hover:bg-muted/50 transition-colors">
      <TableCell className="py-2">
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onSelect(banner.id, !!checked)}
          className="h-4 w-4"
        />
      </TableCell>

      <TableCell className="py-2">
        <div className="h-12 w-16 overflow-hidden rounded-md border bg-muted">
          {mainImage?.url ? (
            <OptimizedImage
              src={mainImage.url}
              alt={mainImage.altText || banner.title}
              width={64}
              height={48}
              objectFit="cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <span className="text-xs">Нет фото</span>
            </div>
          )}
        </div>
      </TableCell>

      <TableCell className="py-2">
        <div className="space-y-1">
          <div className="font-medium">
            <Link
              href={`/banners/${banner.id}/edit`}
              className="hover:text-primary transition-colors hover:underline"
            >
              {banner.title}
            </Link>
          </div>
          {banner.description && (
            <div className="text-xs text-muted-foreground line-clamp-1">
              {banner.description}
            </div>
          )}
        </div>
      </TableCell>

      <TableCell className="py-2">
        {banner.category ? (
          <Badge variant="secondary" className="text-xs">
            {banner.category.name}
          </Badge>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        )}
      </TableCell>

      <TableCell className="py-2">
        <Badge variant="outline" className="text-xs">
          {getPositionLabel(banner.position)}
        </Badge>
      </TableCell>

      <TableCell className="py-2 text-sm">
        {getPageLabel(banner.page)}
      </TableCell>

      <TableCell className="py-2 text-center">
        <Badge
          variant={banner.sortOrder > 0 ? "default" : "secondary"}
          className="text-xs"
        >
          {banner.sortOrder}
        </Badge>
      </TableCell>

      <TableCell className="py-2">
        <div className="flex items-center gap-1">
          {banner.isActive ? (
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200"
            >
              <Eye className="mr-1 h-3 w-3" />
              Активен
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="bg-slate-50 text-slate-700 border-slate-200"
            >
              <EyeOff className="mr-1 h-3 w-3" />
              Неактивен
            </Badge>
          )}
          {banner.isFeatured && <Star className="h-3 w-3 text-yellow-500" />}
        </div>
      </TableCell>

      <TableCell className="py-2 text-center text-sm">
        {banner.createdAt ? new Date(banner.createdAt).toLocaleDateString('ru-RU') : '-'}
      </TableCell>

      <TableCell className="py-2 text-center text-sm">
        {banner.updatedAt ? new Date(banner.updatedAt).toLocaleDateString('ru-RU') : '-'}
      </TableCell>

      <TableCell className="py-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <span className="sr-only">Открыть меню</span>
              <span className="h-4 w-4">⋯</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/banners/${banner.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Редактировать
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/banners/${banner.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                Просмотр
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(banner.id)}
              className="text-white bg-red-600 hover:bg-red-700 focus:bg-red-700 focus:text-white"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Удалить
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
