"use client";

interface BrandsPaginationProps {
  totalCount: number;
  currentCount: number;
  totalPages: number;
  currentPage: number;
  className?: string;
}

export function BrandsPagination({
  totalCount,
  currentCount,
  totalPages,
  currentPage,
  className = "",
}: BrandsPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={`text-center mt-12 ${className}`}>
      <p className="text-muted-foreground">
        Показано {currentCount} из {totalCount} брендов
      </p>
      <p className="text-sm text-muted-foreground mt-2">
        Страница {currentPage} из {totalPages}
      </p>
    </div>
  );
}
