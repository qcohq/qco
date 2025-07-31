import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@qco/ui/components/pagination";

const PAGE_SIZE = 20;

export function BannersPagination({
  page,
  totalPages,
  totalBanners,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  totalBanners: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        Показано {(page - 1) * PAGE_SIZE + 1} -{" "}
        {Math.min(page * PAGE_SIZE, totalBanners)} из {totalBanners} баннеров
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(Math.max(1, page - 1))}
              className={
                page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"
              }
            />
          </PaginationItem>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = i + 1;
            return (
              <PaginationItem key={pageNum}>
                <PaginationLink
                  onClick={() => onPageChange(pageNum)}
                  isActive={page === pageNum}
                  className="cursor-pointer"
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            );
          })}
          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange(Math.min(totalPages, page + 1))}
              className={
                page === totalPages
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
