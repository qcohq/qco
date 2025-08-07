"use client";

import { Button } from "@qco/ui/components/button";
import { Card, CardContent } from "@qco/ui/components/card";
import { RadioGroup, RadioGroupItem } from "@qco/ui/components/radio-group";
import { Skeleton } from "@qco/ui/components/skeleton";
import { Badge } from "@qco/ui/components/badge";
import { Home, MapPin, Plus } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { AddressData } from "../hooks/use-profile-data";

interface SavedAddressesSelectorProps {
    addresses: AddressData[];
    isLoading: boolean;
    onAddressSelect: (address: AddressData) => void;
    onNewAddressClick: () => void;
    selectedAddressId?: string;
    className?: string;
}

export function SavedAddressesSelector({
    addresses,
    isLoading,
    onAddressSelect,
    onNewAddressClick,
    selectedAddressId,
    className,
}: SavedAddressesSelectorProps) {
    const [expandedAddresses, setExpandedAddresses] = useState<Set<string>>(new Set());

    const handleAddressSelect = (addressId: string) => {
        const selectedAddress = addresses.find((addr) => addr.id === addressId);
        if (selectedAddress) {
            onAddressSelect(selectedAddress);
        }
    };

    const toggleAddressExpanded = (addressId: string) => {
        setExpandedAddresses((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(addressId)) {
                newSet.delete(addressId);
            } else {
                newSet.add(addressId);
            }
            return newSet;
        });
    };

    if (isLoading) {
        return (
            <Card className={className}>
                <CardContent className="p-4">
                    <div className="space-y-3">
                        <Skeleton className="h-4 w-48" />
                        {[1, 2].map((i) => (
                            <div key={i} className="flex items-start space-x-3 p-3 border rounded-lg">
                                <Skeleton className="h-4 w-4 rounded-full mt-1" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-3 w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (addresses.length === 0) {
        return null;
    }

    return (
        <Card className={className}>
            <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Home className="h-5 w-5 text-muted-foreground" />
                        <h3 className="text-sm font-medium">Сохранённые адреса</h3>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={onNewAddressClick}
                        className="h-8"
                    >
                        <Plus className="h-4 w-4 mr-1" />
                        Новый адрес
                    </Button>
                </div>

                <RadioGroup
                    value={selectedAddressId}
                    onValueChange={handleAddressSelect}
                    className="space-y-3"
                >
                    {addresses.map((address) => {
                        const isExpanded = expandedAddresses.has(address.id);
                        const isSelected = selectedAddressId === address.id;

                        return (
                            <div
                                key={address.id}
                                className={cn(
                                    "flex items-start space-x-3 p-3 border rounded-lg transition-colors cursor-pointer hover:bg-muted/50",
                                    isSelected && "border-primary bg-primary/5"
                                )}
                                onClick={() => handleAddressSelect(address.id)}
                            >
                                <RadioGroupItem
                                    value={address.id}
                                    className="mt-1 flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {address.isPrimary && (
                                                <Badge variant="secondary" className="text-xs">
                                                    Основной
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    <div className="text-sm">
                                        <div className="font-medium text-foreground">
                                            {address.addressLine1}
                                            {address.addressLine2 && `, ${address.addressLine2}`}
                                        </div>
                                        <div className="text-muted-foreground mt-1">
                                            {address.city}, {address.postalCode}
                                            {address.country && `, ${address.country}`}
                                        </div>
                                    </div>

                                    {address.notes && isExpanded && (
                                        <div className="text-xs text-muted-foreground mt-2 p-2 bg-muted rounded">
                                            <strong>Примечания:</strong> {address.notes}
                                        </div>
                                    )}

                                    {address.notes && !isExpanded && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground mt-1"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleAddressExpanded(address.id);
                                            }}
                                        >
                                            Показать примечания
                                        </Button>
                                    )}

                                    {address.notes && isExpanded && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground mt-1"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleAddressExpanded(address.id);
                                            }}
                                        >
                                            Скрыть примечания
                                        </Button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </RadioGroup>

                <div className="mt-3 text-xs text-muted-foreground">
                    Выберите адрес для автозаполнения формы доставки
                </div>
            </CardContent>
        </Card>
    );
} 