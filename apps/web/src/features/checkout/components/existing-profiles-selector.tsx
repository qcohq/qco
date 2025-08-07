"use client";

import { useState } from "react";
import { Button } from "@qco/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@qco/ui/components/card";
import { Badge } from "@qco/ui/components/badge";
import { RadioGroup, RadioGroupItem } from "@qco/ui/components/radio-group";
import { Label } from "@qco/ui/components/label";
import { Separator } from "@qco/ui/components/separator";
import { User, Plus, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UseFormReturn } from "react-hook-form";

interface ProfileData {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
}

interface ExistingProfilesSelectorProps {
    form: UseFormReturn<any>;
    profiles: ProfileData[];
    isLoading: boolean;
    onSelectProfile: (profile: ProfileData) => void;
    onUseNewData: () => void;
    selectedProfileId?: string;
    className?: string;
}

export function ExistingProfilesSelector({
    form,
    profiles,
    isLoading,
    onSelectProfile,
    onUseNewData,
    selectedProfileId,
    className,
}: ExistingProfilesSelectorProps) {
    const [showNewDataOption, setShowNewDataOption] = useState(false);

    if (isLoading) {
        return (
            <Card className={cn("border-blue-200 bg-blue-50", className)}>
                <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
                        <span className="text-sm text-blue-800">Загрузка профилей...</span>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (profiles.length === 0) {
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
                                Профили не найдены
                            </h3>
                            <p className="text-xs text-amber-700 mt-1">
                                Введите данные для оформления заказа
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className={className}>
            <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                    <User className="h-5 w-5 text-muted-foreground" />
                    Выберите профиль для оформления
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="space-y-4">
                    <RadioGroup
                        value={selectedProfileId || ""}
                        onValueChange={(value) => {
                            if (value === "new") {
                                setShowNewDataOption(true);
                                onUseNewData();
                            } else {
                                const profile = profiles.find(p => p.id === value);
                                if (profile) {
                                    onSelectProfile(profile);
                                }
                            }
                        }}
                        className="space-y-3"
                    >
                        {/* Существующие профили */}
                        {profiles.map((profile) => (
                            <div
                                key={profile.id}
                                className={cn(
                                    "flex items-start space-x-3 p-3 border rounded-lg transition-colors cursor-pointer hover:bg-muted/50",
                                    selectedProfileId === profile.id && "border-primary bg-primary/5"
                                )}
                                onClick={() => onSelectProfile(profile)}
                            >
                                <RadioGroupItem value={profile.id} id={`profile-${profile.id}`} className="mt-1 flex-shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <Label htmlFor={`profile-${profile.id}`} className="cursor-pointer">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">
                                                {profile.firstName} {profile.lastName}
                                            </span>
                                            <Badge variant="secondary" className="text-xs">
                                                {profile.email}
                                            </Badge>
                                        </div>
                                    </Label>
                                    <div className="text-sm text-muted-foreground space-y-1">
                                        {profile.phone && (
                                            <div className="flex items-center gap-2">
                                                <Check className="h-3 w-3 text-green-600" />
                                                <span>{profile.phone}</span>
                                            </div>
                                        )}
                                        {profile.address && profile.city && (
                                            <div className="flex items-center gap-2">
                                                <Check className="h-3 w-3 text-green-600" />
                                                <span>{profile.address}, {profile.city}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="relative">
                            <Separator />
                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2">
                                <span className="text-xs text-muted-foreground">или</span>
                            </div>
                        </div>

                        {/* Опция ввода новых данных */}
                        <div
                            className={cn(
                                "flex items-start space-x-3 p-3 border rounded-lg transition-colors cursor-pointer hover:bg-muted/50",
                                showNewDataOption && "border-primary bg-primary/5"
                            )}
                            onClick={() => {
                                setShowNewDataOption(true);
                                onUseNewData();
                            }}
                        >
                            <RadioGroupItem value="new" id="use-new-data" className="mt-1 flex-shrink-0" />
                            <div className="flex-1">
                                <Label htmlFor="use-new-data" className="cursor-pointer">
                                    <div className="flex items-center gap-2">
                                        <Plus className="h-4 w-4" />
                                        <span className="font-medium">Ввести новые данные</span>
                                    </div>
                                </Label>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Заполнить форму новыми данными
                                </p>
                            </div>
                        </div>
                    </RadioGroup>

                    {selectedProfileId && (
                        <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
                            <strong>Подсказка:</strong> Вы можете изменить любое поле после выбора профиля.
                            Новые данные можно сохранить в профиль при оформлении заказа.
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
} 