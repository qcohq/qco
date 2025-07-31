"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@qco/ui/components/alert-dialog";
import { Input } from "@qco/ui/components/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@qco/ui/components/tooltip";
import { toast } from "@qco/ui/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HelpCircle } from "lucide-react";
import { useState } from "react";

import { useTRPC } from "~/trpc/react";

interface BulkPriceEditProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
}

export function BulkPriceEdit({
  isOpen,
  onOpenChange,
  productId,
}: BulkPriceEditProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [priceValue, setPriceValue] = useState<string>("");
  const [compareAtPriceValue, setCompareAtPriceValue] = useState<string>("");
  const [salePriceValue, setSalePriceValue] = useState<string>("");
  const [_priceType, _setPriceType] = useState<"fixed" | "percentage">("fixed");

  const bulkUpdatePricesMutation = useMutation(
    trpc.productVariants.updatePrices.mutationOptions({
      onSuccess: () => {
        onOpenChange(false);
        setPriceValue("");
        setCompareAtPriceValue("");
        setSalePriceValue("");
        toast({
          title: "Успех",
          description: "Цены успешно обновлены",
        });

        queryClient.invalidateQueries({
          queryKey: trpc.productVariants.getVariants.queryKey({ productId }),
        });
      },
      onError: (error) => {
        toast({
          title: "Ошибка",
          description: `${error.message || "Не удалось обновить цены"}`,
          variant: "destructive",
        });
      },
    }),
  );

  const handleSubmit = () => {
    const price = priceValue ? Number.parseFloat(priceValue) : null;
    const compareAtPrice = compareAtPriceValue
      ? Number.parseFloat(compareAtPriceValue)
      : null;
    const salePrice = salePriceValue ? Number.parseFloat(salePriceValue) : null;

    if (price !== null && Number.isNaN(price)) {
      toast({
        title: "Ошибка",
        description:
          "Пожалуйста, введите корректное числовое значение для базовой цены",
        variant: "destructive",
      });
      return;
    }

    if (compareAtPrice !== null && Number.isNaN(compareAtPrice)) {
      toast({
        title: "Ошибка",
        description:
          "Пожалуйста, введите корректное числовое значение для цены до скидки",
        variant: "destructive",
      });
      return;
    }

    if (salePrice !== null && Number.isNaN(salePrice)) {
      toast({
        title: "Ошибка",
        description:
          "Пожалуйста, введите корректное числовое значение для цены со скидкой",
        variant: "destructive",
      });
      return;
    }

    bulkUpdatePricesMutation.mutate({
      productId,
      price,
      compareAtPrice,
      salePrice,
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Массовое редактирование цен</AlertDialogTitle>
          <AlertDialogDescription>
            Установите новую цену для всех вариантов товара
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <label className="text-sm font-medium">Базовая цена</label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Текущая цена товара, по которой он продается. Это
                        основная цена без учета скидок
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={priceValue}
                  onChange={(e) => setPriceValue(e.target.value)}
                  placeholder="Базовая цена"
                  step="0.01"
                  min="0"
                />
                <span className="text-sm text-muted-foreground">₽</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <label className="text-sm font-medium">Цена до скидки</label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Изначальная цена товара до скидки. Показывается
                        зачеркнутой рядом с текущей ценой, чтобы покупатели
                        видели размер экономии
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={compareAtPriceValue}
                  onChange={(e) => setCompareAtPriceValue(e.target.value)}
                  placeholder="Цена до скидки"
                  step="0.01"
                  min="0"
                />
                <span className="text-sm text-muted-foreground">₽</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <label className="text-sm font-medium">Цена со скидкой</label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Специальная цена со скидкой. Если указана, то именно она
                        будет показана покупателям вместо базовой цены
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={salePriceValue}
                  onChange={(e) => setSalePriceValue(e.target.value)}
                  placeholder="Цена со скидкой"
                  step="0.01"
                  min="0"
                />
                <span className="text-sm text-muted-foreground">₽</span>
              </div>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            Оставьте поле пустым, чтобы не изменять соответствующую цену
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit}>
            Применить
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
