"use client";

import { Badge } from "@qco/ui/components/badge";
import { Button } from "@qco/ui/components/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@qco/ui/components/command";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@qco/ui/components/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@qco/ui/components/popover";
import { cn } from "@qco/ui/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

import { useTRPC } from "~/trpc/react";

// TODO: Использовать тип из схемы пропсов категорий бренда, если появится в @qco/validators
interface BrandCategoriesProps {
  name: string;
  label: string;
  placeholder?: string;
  description?: string;
}

export function BrandCategories({
  name,
  label,
  placeholder = "Выберите категории...",
  description,
}: BrandCategoriesProps) {
  const [open, setOpen] = useState(false);
  const form = useFormContext();
  const trpc = useTRPC();

  // Получаем категории первого уровня с правильным использованием tRPC
  const queryOptions = trpc.categories.getFirstLevel.queryOptions();
  const { data: categories = [] } = useQuery(queryOptions);

  const selectedCategories = form.watch(name) || [];

  const handleSelect = (categoryId: string) => {
    const currentSelected = form.watch(name) || [];
    if (currentSelected.includes(categoryId)) {
      form.setValue(
        name,
        currentSelected.filter((id: string) => id !== categoryId),
      );
    } else {
      form.setValue(name, [...currentSelected, categoryId]);
    }
  };

  const handleRemove = (categoryId: string) => {
    const currentSelected = form.watch(name) || [];
    form.setValue(
      name,
      currentSelected.filter((id: string) => id !== categoryId),
    );
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field: _ }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                {/* biome-ignore lint/a11y/useSemanticElements: Button with combobox role is required for proper accessibility */}
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                >
                  {selectedCategories.length > 0
                    ? `${selectedCategories.length} категорий выбрано`
                    : placeholder}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Поиск категорий..." />
                <CommandList>
                  <CommandEmpty>Категории не найдены.</CommandEmpty>
                  <CommandGroup>
                    {categories.map((category) => (
                      <CommandItem
                        key={category.id}
                        value={category.name}
                        onSelect={() => handleSelect(category.id)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedCategories.includes(category.id)
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        {category.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* Отображение выбранных категорий */}
          {selectedCategories.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedCategories.map((categoryId: string) => {
                const category = categories.find(
                  (cat) => cat.id === categoryId,
                );
                return (
                  <Badge
                    key={categoryId}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {category?.name}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 ml-1"
                      onClick={() => handleRemove(categoryId)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                );
              })}
            </div>
          )}

          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
