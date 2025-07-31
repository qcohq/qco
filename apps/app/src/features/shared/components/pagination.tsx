"use client";

import { Button } from "@qco/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@qco/ui/components/select";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
}: PaginationProps) {
  // Функция для создания диапазона страниц
  const range = (start: number, end: number) => {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  // Создаем массив страниц для отображения
  const createPaginationItems = () => {
    // Если страниц мало, показываем все
    if (totalPages <= 5) {
      return range(1, totalPages);
    }

    // Вычисляем диапазон страниц вокруг текущей
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    // Определяем, нужно ли показывать многоточие
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

    // Всегда показываем первую и последнюю страницу
    if (shouldShowLeftDots && shouldShowRightDots) {
      // Показываем многоточие с обеих сторон
      return [
        1,
        "...",
        ...range(leftSiblingIndex, rightSiblingIndex),
        "...",
        totalPages,
      ];
    }
    if (shouldShowLeftDots) {
      // Показываем многоточие только слева
      return [1, "...", ...range(leftSiblingIndex, totalPages)];
    }
    if (shouldShowRightDots) {
      // Показываем многоточие только справа
      return [...range(1, rightSiblingIndex), "...", totalPages];
    }
    // Показываем все страницы
    return range(1, totalPages);
  };

  const paginationItems = createPaginationItems();

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
      >
        <ChevronsLeft className="h-4 w-4" />
        <span className="sr-only">Первая страница</span>
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Предыдущая страница</span>
      </Button>

      <div className="mx-1 flex items-center gap-1">
        {paginationItems.map((item, index) => {
          if (item === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="text-muted-foreground px-2 py-1 text-sm"
              >
                ...
              </span>
            );
          }

          return (
            <Button
              key={`page-${item}`}
              variant={currentPage === item ? "default" : "outline"}
              size="icon"
              className="h-8 w-8"
              onClick={() => onPageChange(item as number)}
            >
              {item}
            </Button>
          );
        })}
      </div>

      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Следующая страница</span>
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
      >
        <ChevronsRight className="h-4 w-4" />
        <span className="sr-only">Последняя страница</span>
      </Button>
    </div>
  );
}

interface PaginationInfoProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
}

export function PaginationInfo({
  currentPage,
  pageSize,
  totalItems,
}: PaginationInfoProps) {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="text-muted-foreground text-sm">
      Показано{" "}
      {totalItems > 0 ? `${startItem}-${endItem} из ${totalItems}` : "0"}{" "}
      товаров
    </div>
  );
}

interface PaginationSizeSelectorProps {
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  options: number[];
  className?: string;
}

export function PaginationSizeSelector({
  pageSize,
  onPageSizeChange,
  options,
  className = "",
}: PaginationSizeSelectorProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-muted-foreground text-sm">Показывать по:</span>
      <Select
        value={pageSize.toString()}
        onValueChange={(value) => onPageSizeChange(Number.parseInt(value))}
      >
        <SelectTrigger className="h-8 w-[70px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option.toString()}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
