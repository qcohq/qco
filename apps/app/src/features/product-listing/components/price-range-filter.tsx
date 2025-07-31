"use client";

import { Label } from "@qco/ui/components/label";
import { Slider } from "@qco/ui/components/slider";
import { useDebounce } from "@qco/ui/hooks/use-debounce";
import { useEffect, useState } from "react";

export interface PriceRangeFilterProps {
  value?: [number, number];
  onChange: (range: [number, number]) => void;
  min?: number;
  max?: number;
}

export function PriceRangeFilter({
  value,
  onChange,
  min = 0,
  max = 10000,
}: PriceRangeFilterProps) {
  const [internalValue, setInternalValue] = useState<[number, number]>(
    value ?? [min, max],
  );

  const debouncedOnChange = useDebounce(onChange, 500);

  useEffect(() => {
    if (value) {
      setInternalValue(value);
    }
  }, [value]);

  const handleValueChange = (newValue: number[]) => {
    const range = [newValue[0], newValue[1]] as [number, number];
    setInternalValue(range);
    debouncedOnChange(range);
  };

  return (
    <div className="space-y-4">
      <Label>Диапазон цен</Label>
      <Slider
        min={min}
        max={max}
        step={100}
        value={internalValue}
        onValueChange={handleValueChange}
        minStepsBetweenThumbs={1}
      />
      <div className="text-muted-foreground flex justify-between text-sm">
        <span>{internalValue[0]} ₽</span>
        <span>{internalValue[1]} ₽</span>
      </div>
    </div>
  );
}
