import { Card, CardContent, CardHeader } from "@qco/ui/components/card";
import { Skeleton } from "@qco/ui/components/skeleton";

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Шапка страницы */}
      <header className="flex h-16 shrink-0 items-center border-b px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-7 w-64" />
        </div>
      </header>

      {/* Основное содержимое */}
      <main className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-3xl">
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Card>
                <CardHeader className="p-4 md:p-6">
                  <Skeleton className="mb-2 h-6 w-48" />
                  <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent className="space-y-4 p-4 md:p-6">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={`customer-new-skeleton-field-${i}-${Date.now()}`}
                      className="space-y-2"
                    >
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  ))}
                </CardContent>
                <div className="flex justify-between p-4 md:p-6">
                  <Skeleton className="h-10 w-28" />
                  <Skeleton className="h-10 w-28" />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
