"use client";

import { Button } from "@qco/ui/components/button";
import { Checkbox } from "@qco/ui/components/checkbox";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@qco/ui/components/collapsible";
import { Label } from "@qco/ui/components/label";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import type { CategoryAttribute } from "@qco/web-validators";
import type { CatalogFilters } from "../types/catalog";

interface DynamicAttributeFilterProps {
    attribute: CategoryAttribute;
    filters: CatalogFilters;
    onFilterChange: (filterType: keyof CatalogFilters, value: any) => void;
}

export default function DynamicAttributeFilter({
    attribute,
    filters,
    onFilterChange,
}: DynamicAttributeFilterProps) {
    const [isOpen, setIsOpen] = useState(true);

    const handleAttributeToggle = (value: string) => {
        const currentValues = filters.attributes[attribute.slug] || [];
        const newValues = currentValues.includes(value)
            ? currentValues.filter((v) => v !== value)
            : [...currentValues, value];

        onFilterChange("attributes", {
            ...filters.attributes,
            [attribute.slug]: newValues,
        });
    };

    const isChecked = (value: string) => {
        return (filters.attributes[attribute.slug] || []).includes(value);
    };

    const hasActiveFilters = () => {
        return (filters.attributes[attribute.slug] || []).length > 0;
    };

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
                <Button
                    variant="ghost"
                    className="w-full justify-between p-0 h-auto font-medium"
                >
                    <span className="flex items-center gap-2">
                        {attribute.name}
                        {hasActiveFilters() && (
                            <span className="w-2 h-2 bg-primary rounded-full" />
                        )}
                    </span>
                    <ChevronDown
                        className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 pt-4">
                {attribute.options.length > 0 ? (
                    attribute.options.map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                            <Checkbox
                                id={`${attribute.slug}-${option}`}
                                checked={isChecked(option)}
                                onCheckedChange={() => handleAttributeToggle(option)}
                            />
                            <Label
                                htmlFor={`${attribute.slug}-${option}`}
                                className="text-sm cursor-pointer"
                            >
                                {option}
                            </Label>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-muted-foreground">
                        Нет доступных опций
                    </p>
                )}
            </CollapsibleContent>
        </Collapsible>
    );
} 