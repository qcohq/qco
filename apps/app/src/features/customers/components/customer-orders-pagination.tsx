"use client";

import { Button } from "@qco/ui/components/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

// TODO: Использовать тип из схемы пропсов пагинации заказов клиента, если появится в @qco/validators
type CustomerOrdersPaginationProps = {
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  onPageChange: (page: number) => void;
  className?: string;
};

export function CustomerOrdersPagination({
  currentPage,
  totalPages,
  hasMore,
  onPageChange,
  className,
}: CustomerOrdersPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Предыдущая
        </Button>

        <span className="text-sm text-muted-foreground">
          Страница {currentPage} из {totalPages}
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasMore}
        >
          Следующая
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
