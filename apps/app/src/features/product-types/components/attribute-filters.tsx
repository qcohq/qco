"use client";

import { Badge } from "@qco/ui/components/badge";
import { Button } from "@qco/ui/components/button";
import { Input } from "@qco/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@qco/ui/components/select";
import { Filter, Search, SortAsc, SortDesc, X } from "lucide-react";
import { useState } from "react";

interface AttributeFiltersProps {
  onFiltersChange: (filters: AttributeFilters) => void;
  onSortChange: (sort: AttributeSort) => void;
  filters: AttributeFilters;
  sort: AttributeSort;
}

export interface AttributeFilters {
  search: string;
  type: string;
  isRequired: boolean | null;
  isFilterable: boolean | null;
  isActive: boolean | null;
}

export interface AttributeSort {
  field: "name" | "type" | "sortOrder" | "createdAt";
  direction: "asc" | "desc";
}

const ATTRIBUTE_TYPES = [
  { value: "", label: "Все типы" },
  { value: "text", label: "Текст" },
  { value: "number", label: "Число" },
  { value: "boolean", label: "Да/Нет" },
  { value: "select", label: "Выбор из списка" },
  { value: "multiselect", label: "Множественный выбор" },
];

const SORT_FIELDS = [
  { value: "name", label: "По названию" },
  { value: "type", label: "По типу" },
  { value: "sortOrder", label: "По порядку" },
  { value: "createdAt", label: "По дате создания" },
];

export function AttributeFilters({
  onFiltersChange,
  onSortChange,
  filters,
  sort,
}: AttributeFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (key: keyof AttributeFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const handleSortChange = (field: AttributeSort["field"]) => {
    const direction =
      sort.field === field && sort.direction === "asc" ? "desc" : "asc";
    onSortChange({ field, direction });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      type: "",
      isRequired: null,
      isFilterable: null,
      isActive: null,
    });
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== "" && value !== null,
  );

  return (
    <div className="space-y-4">
      {/* Основные фильтры */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск по названию или описанию..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="pl-10"
          />
        </div>

        <Select
          value={filters.type}
          onValueChange={(value) => handleFilterChange("type", value)}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Тип атрибута" />
          </SelectTrigger>
          <SelectContent>
            {ATTRIBUTE_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Фильтры
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-1">
              {
                Object.values(filters).filter((v) => v !== "" && v !== null)
                  .length
              }
            </Badge>
          )}
        </Button>
      </div>

      {/* Расширенные фильтры */}
      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border rounded-lg bg-muted/50">
          <div className="space-y-2">
            <label className="text-sm font-medium">Обязательность</label>
            <Select
              value={
                filters.isRequired === null ? "" : filters.isRequired.toString()
              }
              onValueChange={(value) =>
                handleFilterChange(
                  "isRequired",
                  value === "" ? null : value === "true",
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Все" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Все</SelectItem>
                <SelectItem value="true">Обязательные</SelectItem>
                <SelectItem value="false">Необязательные</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Фильтрация</label>
            <Select
              value={
                filters.isFilterable === null
                  ? ""
                  : filters.isFilterable.toString()
              }
              onValueChange={(value) =>
                handleFilterChange(
                  "isFilterable",
                  value === "" ? null : value === "true",
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Все" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Все</SelectItem>
                <SelectItem value="true">Фильтруемые</SelectItem>
                <SelectItem value="false">Нефильтруемые</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Статус</label>
            <Select
              value={
                filters.isActive === null ? "" : filters.isActive.toString()
              }
              onValueChange={(value) =>
                handleFilterChange(
                  "isActive",
                  value === "" ? null : value === "true",
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Все" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Все</SelectItem>
                <SelectItem value="true">Активные</SelectItem>
                <SelectItem value="false">Неактивные</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Сортировка и очистка */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Сортировка:</span>
          <div className="flex gap-1">
            {SORT_FIELDS.map((field) => (
              <Button
                key={field.value}
                variant={sort.field === field.value ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  handleSortChange(field.value as AttributeSort["field"])
                }
                className="flex items-center gap-1"
              >
                {field.label}
                {sort.field === field.value &&
                  (sort.direction === "asc" ? (
                    <SortAsc className="h-3 w-3" />
                  ) : (
                    <SortDesc className="h-3 w-3" />
                  ))}
              </Button>
            ))}
          </div>
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Очистить фильтры
          </Button>
        )}
      </div>
    </div>
  );
}
