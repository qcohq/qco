"use client";

import { Skeleton } from "@qco/ui/components/skeleton";

interface BrandsHeaderProps {
  title?: string;
  description?: string;
  isLoading?: boolean;
  className?: string;
}

export function BrandsHeader({
  title = "Наши бренды",
  description = "Мы гордимся сотрудничеством с ведущими мировыми домами моды, предлагая вам только лучшее.",
  isLoading = false,
  className = "",
}: BrandsHeaderProps) {
  if (isLoading) {
    return (
      <div className={`text-center mb-12 ${className}`}>
        <Skeleton className="h-12 w-64 mx-auto mb-4" />
        <Skeleton className="h-6 w-96 mx-auto" />
      </div>
    );
  }

  return (
    <div className={`text-center mb-12 ${className}`}>
      <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4">
        {title}
      </h2>
      <p className="text-muted-foreground max-w-xl mx-auto">{description}</p>
    </div>
  );
}
