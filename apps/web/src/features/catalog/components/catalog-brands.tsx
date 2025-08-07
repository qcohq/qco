
import type { FeaturedBrandsList } from "@qco/web-validators";
import Image from "next/image";
import Link from "next/link";

interface CatalogBrandsProps {
  brands: FeaturedBrandsList;
}

export function CatalogBrands({ brands }: CatalogBrandsProps) {
  if (!brands || brands.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Популярные бренды</h2>
      <div className="grid md:grid-cols-6 gap-4">
        {brands.map((brand) => (
          <Link key={brand.id} href={`/brands/${brand.slug}`}>
            <div className="hover:shadow-lg transition-shadow cursor-pointer">
              <div className="p-4 text-center">
                <div className="relative aspect-square rounded-lg overflow-hidden mb-3">
                  {brand.logo && (
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      fill
                      className="object-contain p-2"
                    />
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
