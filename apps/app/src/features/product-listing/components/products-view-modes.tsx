"use client";

import { Tabs, TabsList, TabsTrigger } from "@qco/ui/components/tabs";

interface ProductsViewModesProps {
  viewMode: "table" | "tile" | "compact";
  onViewModeChange: (mode: "table" | "tile" | "compact") => void;
}

export function ProductsViewModes({
  viewMode,
  onViewModeChange,
}: ProductsViewModesProps) {
  return (
    <Tabs
      value={viewMode}
      onValueChange={(value) =>
        onViewModeChange(value as "table" | "tile" | "compact")
      }
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
        <TabsTrigger value="table">Таблица</TabsTrigger>
        <TabsTrigger value="tile">Плитка</TabsTrigger>
        <TabsTrigger value="compact">Компактный</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
