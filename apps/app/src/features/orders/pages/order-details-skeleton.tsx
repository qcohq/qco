import { Button } from "@qco/ui/components/button";
import { Skeleton } from "@qco/ui/components/skeleton";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function OrderDetailsSkeleton() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-16 shrink-0 items-center border-b px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/orders">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Назад</span>
            </Link>
          </Button>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-20" />
        </div>
      </header>
      <main className="flex-1 p-4 md:p-6">
        <div className="grid gap-4 md:gap-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-5 w-36" />
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-10 w-32" />
              <div className="flex gap-2">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-24" />
              </div>
            </div>
          </div>
          <div className="grid gap-4">
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </main>
    </div>
  );
}
