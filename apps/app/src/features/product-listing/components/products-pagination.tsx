"use client";

import {
  Pagination,
  PaginationInfo,
  PaginationSizeSelector,
} from "@/features/shared/components/pagination";

interface ProductsPaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
}

export function ProductsPagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
}: ProductsPaginationProps) {
  return (
    <div className="flex flex-col items-center justify-between gap-4 border-t px-4 py-3 sm:flex-row">
      <PaginationInfo
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={totalItems}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />

      <PaginationSizeSelector
        pageSize={pageSize}
        onPageSizeChange={onPageSizeChange}
        options={pageSizeOptions}
        className="hidden md:flex"
      />
    </div>
  );
}
