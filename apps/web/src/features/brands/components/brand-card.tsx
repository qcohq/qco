"use client";

import type { BrandListItem } from "@qco/web-validators";
import Image from "next/image";
import Link from "next/link";

interface BrandCardProps {
  brand: BrandListItem;
  className?: string;
}

export function BrandCard({ brand, className = "" }: BrandCardProps) {
  return (
    <Link
      href={`/brands/${brand.slug}`}
      className={`group block w-full ${className}`}
      aria-label={`Перейти к бренду ${brand.name}`}
    >
      <div className="relative w-full h-20 flex items-center justify-center p-4 rounded-lg transition-all duration-300 ease-in-out">
        {brand.logo ? (
          <Image
            src={brand.logo}
            alt={`${brand.name} logo`}
            width={130}
            height={50}
            className="object-contain max-h-10 w-auto group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
              {brand.name}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
