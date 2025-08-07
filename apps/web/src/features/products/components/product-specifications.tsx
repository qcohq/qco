// apps/web/src/features/products/components/product-specifications.tsx
"use client";

import type { ProductAttribute } from "@qco/web-validators";

interface ProductSpecificationsProps {
  specifications?: Record<string, any>;
  attributes?: ProductAttribute[];
  className?: string;
  description?: string;
}

export default function ProductSpecifications({
  specifications,
  attributes,
  className,
  description,
}: ProductSpecificationsProps) {
  // Если нет ни спецификаций, ни атрибутов, не отображаем компонент
  if ((!attributes || attributes.length === 0) && (!specifications || Object.keys(specifications).length === 0)) {
    return null;
  }

  return (
    <div className={`space-y-2 sm:space-y-3 ${className}`}>
      <h3 className="font-medium text-sm sm:text-base">
        Характеристики
      </h3>
      {description && (
        <p className="text-xs sm:text-sm text-muted-foreground mb-2">
          {description}
        </p>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-100 rounded-md">
          <tbody>
            {/* Отображаем спецификации продукта */}
            {specifications && Object.keys(specifications).length > 0 &&
              Object.entries(specifications).map(([key, value]) => (
                <tr key={key} className="border-b border-gray-100 last:border-0">
                  <td className="py-2 px-3 text-muted-foreground text-xs sm:text-sm w-1/2">
                    {key}
                  </td>
                  <td className="py-2 px-3 font-medium text-xs sm:text-sm w-1/2">
                    {String(value)}
                  </td>
                </tr>
              ))
            }

            {/* Отображаем атрибуты типа продукта */}
            {attributes?.map((attribute) => (
              <tr key={attribute.id} className="border-b border-gray-100 last:border-0">
                <td className="py-2 px-3 text-muted-foreground text-xs sm:text-sm w-1/2">
                  {attribute.name}
                </td>
                <td className="py-2 px-3 font-medium text-xs sm:text-sm w-1/2">
                  {attribute.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
