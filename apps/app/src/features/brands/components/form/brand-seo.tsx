"use client";

import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@qco/ui/components/form";
import { Input } from "@qco/ui/components/input";
import { Textarea } from "@qco/ui/components/textarea";
import { Search, Tag } from "lucide-react";
import type { brandSchema } from "@qco/validators";
import type { UseFormReturn } from "react-hook-form";
import type { z } from "zod";

// TODO: Использовать тип из схемы пропсов SEO бренда, если появится в @qco/validators
type BrandFormValues = z.infer<typeof brandSchema>;

interface BrandSEOProps {
    form: UseFormReturn<BrandFormValues>;
}

export function BrandSEO({ form }: BrandSEOProps) {
    return (
        <div className="mt-4 space-y-4">
            {/* Meta Title */}
            <FormField
                control={form.control}
                name="metaTitle"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-sm font-medium">Meta Title</FormLabel>
                        <FormControl>
                            <div className="relative">
                                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                <Input
                                    placeholder="Название бренда - описание"
                                    className="h-10 pl-10"
                                    {...field}
                                />
                            </div>
                        </FormControl>
                        <FormDescription className="mt-1 text-xs">
                            Заголовок страницы для поисковых систем (до 60 символов)
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Meta Description */}
            <FormField
                control={form.control}
                name="metaDescription"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-sm font-medium">Meta Description</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder="Краткое описание бренда для поисковых систем..."
                                className="min-h-[80px] resize-none"
                                {...field}
                            />
                        </FormControl>
                        <FormDescription className="mt-1 text-xs">
                            Описание страницы для поисковых систем (до 160 символов)
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Meta Keywords */}
            <FormField
                control={form.control}
                name="metaKeywords"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-sm font-medium">Meta Keywords</FormLabel>
                        <FormControl>
                            <div className="relative">
                                <Tag className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                <Input
                                    placeholder="бренд, одежда, мода, стиль"
                                    className="h-10 pl-10"
                                    value={field.value?.join(", ") || ""}
                                    onChange={(e) => {
                                        const keywords = e.target.value
                                            .split(",")
                                            .map((k) => k.trim())
                                            .filter((k) => k.length > 0);
                                        field.onChange(keywords);
                                    }}
                                />
                            </div>
                        </FormControl>
                        <FormDescription className="mt-1 text-xs">
                            Ключевые слова через запятую для поисковых систем
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
} 