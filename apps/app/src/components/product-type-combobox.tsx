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
import { useTRPC } from "~/trpc/react";
import { useQuery } from "@tanstack/react-query";

interface ProductTypeItem {
  id: string;
  name: string;
}

interface ProductTypeComboboxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function ProductTypeCombobox({
  value,
  onChange,
  placeholder = "Выберите тип продукта...",
}: ProductTypeComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const trpc = useTRPC();

  // Получаем список типов продуктов
  const productTypesQueryOptions = trpc.productTypes.list.queryOptions();
  const { data, isPending } = useQuery(productTypesQueryOptions);

  const productTypes = (data?.items || []) as ProductTypeItem[];

  // Находим выбранный тип продукта
  const selectedProductType = productTypes.find((type) => type.id === value);

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
          {value && selectedProductType
            ? selectedProductType.name
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
                  onSelect={(currentValue) => {
                    onChange(currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === type.id ? "opacity-100" : "opacity-0"
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
  );
}
