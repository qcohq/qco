import type { BannersList } from "@qco/web-validators";
import Image from "next/image";

interface CatalogBannersProps {
  banners: BannersList;
}

export function CatalogBanners({ banners }: CatalogBannersProps) {
  if (!banners || banners.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Рекомендуем</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="relative h-48 bg-gray-100 rounded-lg overflow-hidden"
          >
            {banner.files?.[0]?.file?.url && (
              <Image
                src={banner.files[0].file.url}
                alt={banner.title}
                fill
                className="object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end">
              <div className="p-4 text-white">
                <h3 className="font-semibold">{banner.title}</h3>
                {banner.description && (
                  <p className="text-sm opacity-90">{banner.description}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
