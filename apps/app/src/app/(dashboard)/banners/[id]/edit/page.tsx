import { Button } from "@qco/ui/components/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { BannerEditContainer } from "@/features/banners/components/banner-edit-container";

interface EditBannerPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditBannerPage({ params }: EditBannerPageProps) {
  const { id } = await params;
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center border-b bg-white px-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/banners">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Назад к баннерам
            </Link>
          </Button>
          <div className="h-6 w-px bg-gray-200" />
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Редактировать баннер
            </h1>
            <p className="text-sm text-gray-500">
              Обновите информацию о баннере
            </p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-4xl">
          <BannerEditContainer bannerId={id} />
        </div>
      </main>
    </div>
  );
}
