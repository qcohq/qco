"use client";

import { Button } from "@qco/ui/components/button";
import { Card } from "@qco/ui/components/card";
import { Separator } from "@qco/ui/components/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@qco/ui/components/tabs";
import { toast } from "@qco/ui/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { useTRPC } from "~/trpc/react";
import { useProductOptions, useProductVariants } from "../api";
import { GenerateVariantsDialog } from "./generate-variants-dialog";
import { VariantsExcel } from "./variants-excel";
import { VariantsTable } from "./variants-table";

interface VariantsListSectionProps {
  productId: string;
}

export function VariantsListSection({ productId }: VariantsListSectionProps) {
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "excel">("table");
  const [isSettingOutOfStock, setIsSettingOutOfStock] = useState(false);

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // Используем кастомные хуки для получения данных
  const { variants, isLoading: isLoadingVariants } =
    useProductVariants(productId);
  const { options } = useProductOptions(productId);

  // Проверяем возможность генерации вариантов
  // Определяем интерфейс для типа option
  interface ProductOption {
    values?: { id: string; value: string }[];
  }

  const canGenerateVariants =
    options.length > 0 &&
    options.every(
      (option: ProductOption) =>
        Array.isArray(option.values) && option.values.length > 0,
    );

  // Мутация для обнуления остатков
  const setOutOfStockMutation = useMutation(
    trpc.products.setOutOfStock.mutationOptions({
      onSuccess: (data) => {
        setIsSettingOutOfStock(false);
        toast({
          title: "Успех",
          description: `Остатки обнулены. Обновлено ${data.variantsUpdated} вариантов.`,
        });

        // Инвалидируем запросы для обновления данных
        queryClient.invalidateQueries({
          queryKey: trpc.productVariants.getVariants.queryKey({ productId }),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.products.getById.queryKey({ id: productId }),
        });
      },
      onError: (error) => {
        setIsSettingOutOfStock(false);
        toast({
          title: "Ошибка",
          description: error.message || "Не удалось обнулить остатки",
          variant: "destructive",
        });
      },
    }),
  );

  // Обработчик обнуления остатков
  const handleSetOutOfStock = () => {
    setIsSettingOutOfStock(true);
    setOutOfStockMutation.mutate({ productId });
  };

  return (
    <section id="variants-list" className="mt-6">
      <Card className="p-4 md:p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Список вариантов</h2>
          <div className="flex space-x-2">
            <Tabs
              value={viewMode}
              onValueChange={(value) => setViewMode(value as "table" | "excel")}
              className="mr-2"
            >
              <TabsList className="grid h-8 w-32 grid-cols-2">
                <TabsTrigger value="table">Таблица</TabsTrigger>
                <TabsTrigger value="excel">Excel</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button
              variant="destructive"
              onClick={handleSetOutOfStock}
              disabled={isSettingOutOfStock || variants.length === 0}
              className="flex items-center gap-2"
            >
              {isSettingOutOfStock ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Обнуление...
                </>
              ) : (
                "Нет в наличии"
              )}
            </Button>
            <Button
              onClick={() => setIsGenerateDialogOpen(true)}
              disabled={!canGenerateVariants}
            >
              Генерировать варианты
            </Button>
          </div>
        </div>

        <p className="text-muted-foreground text-sm mt-1 mb-4">
          Управляйте вариантами товара на основе опций и их значений
        </p>

        <Separator className="my-4" />

        <Tabs value={viewMode} className="w-full">
          <TabsContent value="table" className="mt-0">
            <VariantsTable
              productId={productId}
              variants={variants}
              isLoading={isLoadingVariants}
            />
          </TabsContent>
          <TabsContent value="excel" className="mt-0">
            <VariantsExcel
              productId={productId}
              variants={variants}
              isLoading={isLoadingVariants}
            />
          </TabsContent>
        </Tabs>

        <GenerateVariantsDialog
          open={isGenerateDialogOpen}
          onOpenChange={setIsGenerateDialogOpen}
          productId={productId}
          options={options}
        />
      </Card>
    </section>
  );
}
