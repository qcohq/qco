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
import { Mail, Phone } from "lucide-react";
import type { brandSchema } from "@qco/validators";
import type { UseFormReturn } from "react-hook-form";
import type { z } from "zod";

// TODO: Использовать тип из схемы пропсов контактной информации бренда, если появится в @qco/validators
type BrandFormValues = z.infer<typeof brandSchema>;

interface BrandContactInfoProps {
    form: UseFormReturn<BrandFormValues>;
}

export function BrandContactInfo({ form }: BrandContactInfoProps) {
    return (
        <div className="mt-4 space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Email */}
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-medium">Email</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                    <Input
                                        placeholder="contact@brand.com"
                                        type="email"
                                        className="h-10 pl-10"
                                        {...field}
                                    />
                                </div>
                            </FormControl>
                            <FormDescription className="mt-1 text-xs">
                                Контактный email бренда
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Phone */}
                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-medium">Телефон</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Phone className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                    <Input
                                        placeholder="+7 (999) 123-45-67"
                                        type="tel"
                                        className="h-10 pl-10"
                                        {...field}
                                    />
                                </div>
                            </FormControl>
                            <FormDescription className="mt-1 text-xs">
                                Контактный телефон бренда
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );
} 