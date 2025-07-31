"use client";

import {
    DropdownMenuItem,
} from "@qco/ui/components/dropdown-menu";
import { Printer } from "lucide-react";
import { toast } from "@qco/ui/hooks/use-toast";

interface PrintOrderButtonProps {
    orderId: string;
    orderNumber: string;
    disabled?: boolean;
}

export function PrintOrderButton({
    orderId,
    orderNumber: _orderNumber,
    disabled = false
}: PrintOrderButtonProps) {
    const handlePrint = () => {
        try {
            // Открываем новое окно для печати
            const printWindow = window.open(`/orders/${orderId}/print`, '_blank');

            if (printWindow) {
                printWindow.onload = () => {
                    printWindow.print();
                };
            } else {
                toast({
                    title: "Ошибка",
                    description: "Не удалось открыть окно печати. Проверьте блокировщик рекламы.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Ошибка при печати:", error);
            toast({
                title: "Ошибка",
                description: "Не удалось распечатать заказ",
                variant: "destructive",
            });
        }
    };

    return (
        <DropdownMenuItem
            onClick={handlePrint}
            disabled={disabled}
            className="flex items-center"
        >
            <Printer className="mr-2 h-4 w-4" />
            Печать заказа
        </DropdownMenuItem>
    );
} 