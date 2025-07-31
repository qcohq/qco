"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useFormContext } from "react-hook-form";

import { cn } from "@qco/ui/lib/utils";
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
import { useTRPC } from "~/trpc/react";
import { useDebounce } from "@qco/ui/hooks/use-debounce";

interface Brand {
    id: string;
    name: string;
    slug: string;
}

// TODO: Использовать тип из схемы пропсов комбобокса брендов, если появится в @qco/validators
interface BrandComboboxFormProps {
    name: string;
    label?: string;
    description?: string;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
}

export function BrandComboboxForm({
    name,
    label = "Бренд",
    description,
    placeholder = "Выберите бренд...",
    className,
    disabled = false,
}: BrandComboboxFormProps) {
    const { control } = useFormContext();
    const [open, setOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");
    const trpc = useTRPC();

    // Используем debounce для поиска
    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    // Создаем опции запроса для получения брендов
    const brandsQueryOptions = trpc.brands.getBrandsForSelect.queryOptions({
        search: debouncedSearchQuery || undefined,
        limit: 50,
    });

    // Получаем бренды
    const { data: brandsData, isLoading, error } = useQuery({
        ...brandsQueryOptions,
        enabled: open, // Загружаем только когда открыт
    });

    const brands = brandsData?.data || [];

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => {
                // Получаем выбранный бренд, если он не в списке
                const selectedBrandQueryOptions = trpc.brands.getBrandsForSelect.queryOptions({
                    defaultBrandId: field.value,
                    limit: 1,
                });

                const { data: selectedBrandData } = useQuery({
                    ...selectedBrandQueryOptions,
                    enabled: !!field.value && !brands.find((brand) => brand.id === field.value),
                });

                // Находим выбранный бренд
                const selectedBrand = React.useMemo(() => {
                    if (!field.value) return null;

                    // Сначала ищем в текущем списке
                    const brandInList = brands.find((brand) => brand.id === field.value);
                    if (brandInList) return brandInList;

                    // Если не найден в списке, берем из отдельного запроса
                    return selectedBrandData?.data?.[0] || null;
                }, [field.value, brands, selectedBrandData]);

                const handleSelect = (currentValue: string) => {
                    field.onChange(currentValue === field.value ? "" : currentValue);
                    setOpen(false);
                    setSearchQuery("");
                };

                return (
                    <FormItem className={className}>
                        <FormLabel>{label}</FormLabel>
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={open}
                                        className={cn("w-full justify-between")}
                                        disabled={disabled}
                                    >
                                        {selectedBrand ? selectedBrand.name : placeholder}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0" align="start">
                                <Command>
                                    <CommandInput
                                        placeholder="Поиск брендов..."
                                        value={searchQuery}
                                        onValueChange={setSearchQuery}
                                        className="h-9"
                                    />
                                    <CommandList>
                                        <CommandEmpty>
                                            {isLoading ? (
                                                <div className="flex items-center justify-center py-6">
                                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                    Загрузка...
                                                </div>
                                            ) : error ? (
                                                <div className="flex items-center justify-center py-6 text-red-500">
                                                    Ошибка загрузки
                                                </div>
                                            ) : (
                                                "Бренды не найдены"
                                            )}
                                        </CommandEmpty>
                                        <CommandGroup>
                                            {brands.map((brand) => (
                                                <CommandItem
                                                    key={brand.id}
                                                    value={brand.name}
                                                    onSelect={() => handleSelect(brand.id)}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            field.value === brand.id ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    {brand.name}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        {description && <FormDescription>{description}</FormDescription>}
                        <FormMessage />
                    </FormItem>
                );
            }}
        />
    );
} 