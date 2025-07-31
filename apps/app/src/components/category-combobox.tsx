"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

import { Button } from "@qco/ui/components/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@qco/ui/components/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@qco/ui/components/popover";
import { cn } from "@qco/ui/lib/utils";

interface CategoryItem {
  id: string;
  name: string;
  children?: CategoryItem[];
}

interface CategoryComboboxProps {
  value: string;
  onChange: (value: string) => void;
  categories: CategoryItem[];
  placeholder?: string;
}

// Функция для преобразования дерева категорий в плоский список с уровнями вложенности
function flattenCategories(categories: CategoryItem[], level = 0): { id: string; name: string; level: number }[] {
  let result: { id: string; name: string; level: number }[] = [];

  for (const category of categories) {
    // Добавляем текущую категорию с указанием уровня вложенности
    result.push({
      id: category.id,
      name: category.name,
      level: level,
    });

    // Рекурсивно добавляем дочерние категории с увеличением уровня
    if (category.children && category.children.length > 0) {
      result = result.concat(flattenCategories(category.children, level + 1));
    }
  }

  return result;
}

export function CategoryCombobox({
  value,
  onChange,
  categories,
  placeholder = "Выберите категорию...",
}: CategoryComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Преобразуем дерево категорий в плоский список с уровнями вложенности
  const flatCategories = React.useMemo(() => {
    return flattenCategories(categories);
  }, [categories]);

  // Фильтруем категории по поисковому запросу
  const filteredCategories = React.useMemo(() => {
    if (!searchQuery) return flatCategories;

    return flatCategories.filter((category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [flatCategories, searchQuery]);

  // Находим выбранную категорию
  const selectedCategory = flatCategories.find((cat) => cat.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-10"
        // biome-ignore lint/a11y/useSemanticElements: Кастомный combobox компонент
        >
          {value && selectedCategory
            ? selectedCategory.name
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder="Поиск категории..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandEmpty>Категории не найдены</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-y-auto">
            {/* Опция "Нет родительской категории" */}
            <CommandItem
              value=""
              onSelect={() => {
                onChange("");
                setOpen(false);
              }}
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  value === "" ? "opacity-100" : "opacity-0"
                )}
              />
              Нет родительской категории
            </CommandItem>

            {/* Список категорий с отступами для уровней */}
            {filteredCategories.map((category) => (
              <CommandItem
                key={category.id}
                value={category.id}
                onSelect={(currentValue) => {
                  onChange(currentValue);
                  setOpen(false);
                }}
                className="flex items-center"
              >
                <div className="flex items-center">
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === category.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {/* Добавляем отступ в зависимости от уровня вложенности */}
                  {category.level > 0 && (
                    <span
                      className="inline-block"
                      style={{
                        width: `${category.level * 16}px`,
                        marginRight: '4px'
                      }}
                    />
                  )}
                  {/* Показываем вертикальную линию для вложенных уровней */}
                  {category.level > 0 && (
                    <span className="inline-block h-4 w-4 mr-1 text-gray-400">└</span>
                  )}
                  {category.name}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
