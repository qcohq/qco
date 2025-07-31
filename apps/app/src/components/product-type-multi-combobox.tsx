"use client";

import { Check, ChevronsUpDown, X } from "lucide-react";
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
import { Badge } from "@qco/ui/components/badge";
import { cn } from "@qco/ui/lib/utils";
import { useTRPC } from "~/trpc/react";
import { useQuery } from "@tanstack/react-query";

interface ProductTypeItem {
  id: string;
  name: string;
}

interface ProductTypeMultiComboboxProps {
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

export function ProductTypeMultiCombobox({
  values,
  onChange,
  placeholder = "Выберите типы продуктов...",
}: ProductTypeMultiComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const trpc = useTRPC();

  // Получаем список типов продуктов
  const productTypesQueryOptions = trpc.productTypes.list.queryOptions();
  const { data, isPending } = useQuery(productTypesQueryOptions);

  const productTypes = (data?.items || []) as ProductTypeItem[];

  // Находим выбранные типы продуктов
  const selectedProductTypes = productTypes.filter((type) =>
    values.includes(type.id)
  );

  // Обработчик выбора/отмены выбора типа продукта
  const handleSelect = (id: string) => {
    if (values.includes(id)) {
      onChange(values.filter((v) => v !== id));
    } else {
      onChange([...values, id]);
    }
  };

  // Удаление типа продукта из выбранных
  const handleRemove = (id: string) => {
    onChange(values.filter((v) => v !== id));
  };

  return (
    <div className="flex flex-col gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-10"
          // biome-ignore lint/a11y/useSemanticElements: Кастомный combobox компонент
          >
            {values.length > 0
              ? `Выбрано типов: ${values.length}`
              : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Поиск типа продукта..." />
            <CommandEmpty>Типы продуктов не найдены</CommandEmpty>
            <CommandGroup>
              {isPending ? (
                <div className="p-2 text-sm text-muted-foreground">Загрузка...</div>
              ) : (
                productTypes.map((type) => (
                  <CommandItem
                    key={type.id}
                    value={type.id}
                    onSelect={() => handleSelect(type.id)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        values.includes(type.id) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {type.name}
                  </CommandItem>
                ))
              )}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Отображение выбранных типов продуктов */}
      {selectedProductTypes.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {selectedProductTypes.map((type) => (
            <Badge key={type.id} variant="secondary" className="flex items-center gap-1">
              {type.name}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleRemove(type.id)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
