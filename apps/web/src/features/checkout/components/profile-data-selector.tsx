"use client";

import { Button } from "@qco/ui/components/button";
import { Card, CardContent } from "@qco/ui/components/card";
import { Badge } from "@qco/ui/components/badge";
import { RadioGroup, RadioGroupItem } from "@qco/ui/components/radio-group";
import { Label } from "@qco/ui/components/label";
import { Separator } from "@qco/ui/components/separator";
import { User, Edit3, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProfileData } from "../hooks/use-profile-data";

interface ProfileDataSelectorProps {
    profile: ProfileData;
    hasProfileData: boolean;
    isAuthenticated: boolean;
    onUseProfileData: () => void;
    onUseManualInput: () => void;
    selectedMode: "profile" | "manual";
    className?: string;
}

export function ProfileDataSelector({
    profile,
    hasProfileData,
    isAuthenticated,
    onUseProfileData,
    onUseManualInput,
    selectedMode,
    className,
}: ProfileDataSelectorProps) {
    // Если пользователь не авторизован, не показываем компонент
    if (!isAuthenticated) {
        return null;
    }

    // Если у пользователя нет данных профиля, показываем только уведомление
    if (!hasProfileData) {
        return (
            <Card className={cn("border-amber-200 bg-amber-50", className)}>
                <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                                <AlertCircle className="h-5 w-5 text-amber-600" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm font-medium text-amber-900">
                                Заполните профиль для быстрого оформления
                            </h3>
                            <p className="text-xs text-amber-700 mt-1">
                                Добавьте имя, телефон и адрес в профиле, чтобы они автоматически подставлялись при заказе
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className={className}>
            <CardContent className="p-4">
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <h3 className="text-sm font-medium">Как заполнить контактные данные?</h3>
                    </div>

                    <RadioGroup
                        value={selectedMode}
                        onValueChange={(value: "profile" | "manual") => {
                            // Предотвращаем автоматическое переключение при инициализации
                            if (value !== selectedMode) {
                                if (value === "profile") {
                                    onUseProfileData();
                                } else {
                                    onUseManualInput();
                                }
                            }
                        }}
                        className="space-y-3"
                    >
                        {/* Опция использования данных из профиля */}
                        <div
                            className={cn(
                                "flex items-start space-x-3 p-3 border rounded-lg transition-colors cursor-pointer hover:bg-muted/50",
                                selectedMode === "profile" && "border-primary bg-primary/5"
                            )}
                        >
                            <RadioGroupItem value="profile" id="use-profile" className="mt-1 flex-shrink-0" />
                            <div className="flex-1 space-y-2">
                                <Label htmlFor="use-profile" className="cursor-pointer">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">Использовать данные из профиля</span>
                                        <Badge variant="secondary" className="text-xs">
                                            Рекомендуется
                                        </Badge>

                                    </div>
                                </Label>
                                <div className="text-sm text-muted-foreground space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Check className="h-3 w-3 text-green-600" />
                                        <span>
                                            {profile.firstName} {profile.lastName}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Check className="h-3 w-3 text-green-600" />
                                        <span>{profile.email}</span>
                                    </div>
                                    {profile.phone && (
                                        <div className="flex items-center gap-2">
                                            <Check className="h-3 w-3 text-green-600" />
                                            <span>{profile.phone}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <Separator />
                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2">
                                <span className="text-xs text-muted-foreground">или</span>
                            </div>
                        </div>

                        {/* Опция ручного ввода */}
                        <div
                            className={cn(
                                "flex items-start space-x-3 p-3 border rounded-lg transition-colors cursor-pointer hover:bg-muted/50",
                                selectedMode === "manual" && "border-primary bg-primary/5"
                            )}
                        >
                            <RadioGroupItem value="manual" id="use-manual" className="mt-1 flex-shrink-0" />
                            <div className="flex-1">
                                <Label htmlFor="use-manual" className="cursor-pointer">
                                    <div className="flex items-center gap-2">
                                        <Edit3 className="h-4 w-4" />
                                        <span className="font-medium">Заполнить вручную</span>
                                    </div>
                                </Label>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Введите данные для этого заказа отдельно
                                </p>
                            </div>
                        </div>
                    </RadioGroup>

                    {selectedMode === "profile" && (
                        <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
                            <strong>Подсказка:</strong> Вы можете изменить любое поле после автозаполнения.
                            Новые данные можно сохранить в профиль при оформлении заказа.
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
} 