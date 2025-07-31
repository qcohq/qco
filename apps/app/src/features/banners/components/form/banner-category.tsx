"use client";

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
  FormDescription,
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
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import type { Control, FieldValues } from "react-hook-form";
import { useFormContext } from "react-hook-form";

import { useTRPC } from "~/trpc/react";

// TODO: Использовать тип из схемы пропсов категории баннера, если появится в @qco/validators
interface BannerCategoryProps {
  name: string;
  label: string;
  placeholder?: string;
  description?: string;
  control?: Control<FieldValues>;
}

export function BannerCategory({
  name,
  label,
  placeholder = "Выберите категорию...",
  description,
  control,
}: BannerCategoryProps) {
  const [open, setOpen] = useState(false);
  const form = useFormContext();
  const trpc = useTRPC();

  // Получаем категории первого уровня с правильным использованием tRPC
  const queryOptions = trpc.categories.getFirstLevel.queryOptions();
  const { data: categories = [] } = useQuery(queryOptions);

  return (
    <FormField
      control={control || form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  aria-expanded={open}
                  className="w-full justify-between"
                >
                  {field.value
                    ? categories.find((category) => category.id === field.value)
                      ?.name
                    : placeholder}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Поиск категории..." />
                <CommandList>
                  <CommandEmpty>Категория не найдена.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      value=""
                      onSelect={() => {
                        form.setValue(name, "");
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          field.value === "" ? "opacity-100" : "opacity-0",
                        )}
                      />
                      Без категории
                    </CommandItem>
                    {categories.map((category) => (
                      <CommandItem
                        key={category.id}
                        value={category.name}
                        onSelect={() => {
                          form.setValue(name, category.id);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            category.id === field.value
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
          {description && (
            <FormDescription>{description}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
