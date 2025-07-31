import { BrandsSkeleton } from "@/features/brands/components/brands-skeleton";

export default function BrandsLoadingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="flex h-14 shrink-0 items-center border-b px-4">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">Управление брендами</h1>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-4">
        <BrandsSkeleton />
      </main>
    </div>
  );
}
