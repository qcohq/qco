"use client";

import { Button } from "@qco/ui/components/button";

// TODO: Использовать тип из схемы пропсов пагинации админов, если появится в @qco/validators

export function AdminPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
      <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
        Показано {startItem} - {endItem} из {totalItems}
      </p>
      <div className="flex gap-2 justify-center sm:justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex-1 sm:flex-none"
        >
          Назад
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="flex-1 sm:flex-none"
        >
          Вперед
        </Button>
      </div>
    </div>
  );
}
