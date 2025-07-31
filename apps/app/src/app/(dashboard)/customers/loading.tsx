import { Card, CardContent, CardHeader } from "@qco/ui/components/card";
import { Skeleton } from "@qco/ui/components/skeleton";

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Шапка страницы */}
      <header className="flex h-16 shrink-0 items-center border-b px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-7 w-40" />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-40" />
        </div>
      </header>

      {/* Основное содержимое */}
      <main className="flex-1 space-y-4 p-4 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-80" />
            <Skeleton className="h-10 w-32" />
          </div>
          <Skeleton className="h-6 w-48" />
        </div>

        <Card>
          <CardHeader className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-64" />
              </div>
              <Skeleton className="h-9 w-40" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="border-t">
              <div className="p-4">
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={`customer-list-skeleton-row-${i}-${Date.now()}`}
                      className="flex items-center justify-between"
                    >
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-5 w-32" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
