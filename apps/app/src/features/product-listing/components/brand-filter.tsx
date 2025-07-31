"use client";

import { Checkbox } from "@qco/ui/components/checkbox";
import { Label } from "@qco/ui/components/label";
import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "~/trpc/react";

export interface BrandFilterProps {
  value: string[];
  onChange: (brands: string[]) => void;
}

export function BrandFilter({ value, onChange }: BrandFilterProps) {
  const trpc = useTRPC();
  const { data: brands = [] } = useQuery(trpc.brands.getAll.queryOptions({}));
  const handleBrandToggle = (brandId: string, checked: boolean) => {
    const newBrands = checked
      ? [...value, brandId]
      : value.filter((id) => id !== brandId);
    onChange(newBrands);
  };

  return (
    <div className="space-y-2">
      <Label>Бренды</Label>
      <div className="max-h-60 overflow-y-auto">
        {brands?.items?.map((brand) => (
          <div key={brand.id} className="flex items-center gap-2">
            <Checkbox
              id={`brand-${brand.id}`}
              checked={value.includes(brand.id)}
              onCheckedChange={(checked) =>
                handleBrandToggle(brand.id, !!checked)
              }
            />
            <Label htmlFor={`brand-${brand.id}`}>{brand.name}</Label>
          </div>
        ))}
      </div>
    </div>
  );
}
