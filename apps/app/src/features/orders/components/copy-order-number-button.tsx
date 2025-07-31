"use client";

import {
    DropdownMenuItem,
} from "@qco/ui/components/dropdown-menu";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "@qco/ui/hooks/use-toast";

interface CopyOrderNumberButtonProps {
    orderNumber: string;
    disabled?: boolean;
}

export function CopyOrderNumberButton({
    orderNumber,
    disabled = false
}: CopyOrderNumberButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(orderNumber);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            toast({
                title: "Скопировано",
                description: "Номер заказа скопирован в буфер обмена",
            });
        } catch (error) {
            console.error("Ошибка при копировании:", error);
            toast({
                title: "Ошибка",
                description: "Не удалось скопировать номер заказа",
                variant: "destructive",
            });
        }
    };

    return (
        <DropdownMenuItem
            onClick={handleCopy}
            disabled={disabled}
            className="flex items-center"
        >
            {copied ? (
                <Check className="mr-2 h-4 w-4 text-green-600" />
            ) : (
                <Copy className="mr-2 h-4 w-4" />
            )}
            {copied ? "Скопировано!" : "Копировать номер заказа"}
        </DropdownMenuItem>
    );
} 