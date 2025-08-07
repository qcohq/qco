"use client";

import { Checkbox } from "@qco/ui/components/checkbox";
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@qco/ui/components/form";
import { Card, CardContent } from "@qco/ui/components/card";
import { Save } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

interface SaveToProfileCheckboxProps {
    form: UseFormReturn<any>;
    isAuthenticated: boolean;
    dataMode: "profile" | "manual";
    className?: string;
}

export function SaveToProfileCheckbox({
    form,
    isAuthenticated,
    dataMode,
    className,
}: SaveToProfileCheckboxProps) {
    // Показываем компонент только для авторизованных пользователей
    if (!isAuthenticated) {
        return null;
    }

    return (
        <Card className={className}>
            <CardContent className="p-4">
                <FormField
                    control={form.control}
                    name="saveToProfile"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel className="flex items-center gap-2 cursor-pointer">
                                    <Save className="h-4 w-4 text-muted-foreground" />
                                    {dataMode === "profile" ? "Обновить данные в профиле" : "Сохранить данные в профиль"}
                                </FormLabel>
                                <FormDescription className="text-xs">
                                    {dataMode === "profile"
                                        ? "Обновить контактные данные и адрес в вашем профиле на основе изменений в форме"
                                        : "Ваши контактные данные и адрес будут сохранены в профиле для быстрого оформления следующих заказов"
                                    }
                                </FormDescription>
                            </div>
                        </FormItem>
                    )}
                />
            </CardContent>
        </Card>
    );
}