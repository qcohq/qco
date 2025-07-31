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
import { Badge } from "@qco/ui/components/badge";
import { Button } from "@qco/ui/components/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@qco/ui/components/table";
import { toast } from "@qco/ui/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Copy, DollarSign, Edit, Package, Trash } from "lucide-react";
import { useState } from "react";

import { useTRPC } from "~/trpc/react";
import { BulkPriceEdit } from "./bulk-price-edit";
import { BulkStockEdit } from "./bulk-stock-edit";
import { VariantEditDialog } from "./variant-edit-dialog";

interface VariantsTableProps {
  productId: string;
  variants: any[];
  isLoading: boolean;
}

export function VariantsTable({
  productId,
  variants,
  isLoading,
}: VariantsTableProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isBulkPriceEditOpen, setIsBulkPriceEditOpen] = useState(false);
  const [isBulkStockEditOpen, setIsBulkStockEditOpen] = useState(false);

  // Мутация для удаления варианта
  const deleteVariantMutation = useMutation(
    trpc.productVariants.deleteVariant.mutationOptions({
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        toast("Вариант успешно удален");

        // Инвалидируем запрос на получение вариантов
        queryClient.invalidateQueries({
          queryKey: trpc.productVariants.getVariants.queryKey({ productId }),
        });
      },
      onError: (error) => {
        toast(`Ошибка: ${error.message || "Не удалось удалить вариант"}`);
      },
    }),
  );

  // Мутация для дублирования варианта
  const duplicateVariantMutation = useMutation(
    trpc.productVariants.duplicateVariant.mutationOptions({
      onSuccess: () => {
        toast("Вариант успешно дублирован");

        // Инвалидируем запрос на получение вариантов
        queryClient.invalidateQueries({
          queryKey: trpc.productVariants.getVariants.queryKey({ productId }),
        });
      },
      onError: (error) => {
        toast({
          title: "Ошибка",
          description: `${error.message || "Не удалось дублировать вариант"}`,
          variant: "destructive",
        });
      },
    }),
  );

  // Обработчик удаления варианта
  const handleDeleteVariant = () => {
    if (selectedVariant) {
      deleteVariantMutation.mutate({
        variantId: selectedVariant.id,
        productId,
      });
    }
  };

  // Обработчик дублирования варианта
  const handleDuplicateVariant = (variantId: string) => {
    duplicateVariantMutation.mutate({
      variantId,
      productId,
    });
  };

  // Функция для форматирования цены
  const formatPrice = (price?: number) => {
    if (price === undefined || price === null) return "—";
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
    }).format(price);
  };

  return (
    <div>
      {!isLoading && variants.length > 0 && (
        <div className="mb-4 flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setIsBulkStockEditOpen(true)}
            className="flex items-center gap-2"
          >
            <Package className="h-4 w-4" />
            Массовое редактирование наличия
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsBulkPriceEditOpen(true)}
            className="flex items-center gap-2"
          >
            <DollarSign className="h-4 w-4" />
            Массовое редактирование цен
          </Button>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : variants.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Вариант</TableHead>
              <TableHead>Опции</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead className="text-right">Цена</TableHead>
              <TableHead className="text-center">Наличие</TableHead>
              <TableHead className="text-center">Статус</TableHead>
              <TableHead className="w-[120px]">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {variants.map((variant) => (
              <TableRow key={variant.id}>
                <TableCell className="font-medium">
                  {variant.name || "Без названия"}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {variant.attributes?.map((attr: any, index: number) => {
                      const isColorAttribute =
                        attr.option?.toLowerCase().includes("цвет") ||
                        attr.option?.toLowerCase().includes("color");
                      return (
                        <Badge
                          key={
                            attr.id ||
                            `${variant.id}-${attr.option}-${attr.value}-${index}`
                          }
                          variant="outline"
                          className="flex items-center gap-1"
                        >
                          {isColorAttribute && attr.metadata?.hex && (
                            <div
                              className="h-3 w-3 rounded-full border border-gray-300"
                              style={{ backgroundColor: attr.metadata.hex }}
                            />
                          )}
                          {attr.option}: {attr.value}
                        </Badge>
                      );
                    })}
                  </div>
                </TableCell>
                <TableCell>{variant.sku || "—"}</TableCell>
                <TableCell className="text-right">
                  <div className="space-y-1">
                    {variant.salePrice ? (
                      <>
                        <div className="font-medium text-green-600">
                          {formatPrice(variant.salePrice)}
                        </div>
                        {variant.price && (
                          <div className="text-muted-foreground text-xs line-through">
                            {formatPrice(variant.price)}
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div>{formatPrice(variant.price)}</div>
                        {variant.compareAtPrice && (
                          <div className="text-muted-foreground text-xs line-through">
                            {formatPrice(variant.compareAtPrice)}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  {variant.stock !== undefined && variant.stock !== null
                    ? variant.stock
                    : "—"}
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={variant.isActive ? "default" : "secondary"}>
                    {variant.isActive ? "Активен" : "Скрыт"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        setSelectedVariant(variant);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDuplicateVariant(variant.id)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => {
                        setSelectedVariant(variant);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">
            У этого товара еще нет вариантов
          </p>
          <p className="text-muted-foreground text-sm">
            Добавьте опции и сгенерируйте варианты или создайте их вручную
          </p>
        </div>
      )}

      {/* Диалог редактирования варианта */}
      {selectedVariant && (
        <VariantEditDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          variant={selectedVariant}
          productId={productId}
        />
      )}

      {/* Диалог подтверждения удаления */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить вариант?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие удалит вариант "
              {selectedVariant?.name || "Без названия"}". Данное действие нельзя
              отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteVariant}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Диалог массового редактирования цен */}
      <BulkPriceEdit
        isOpen={isBulkPriceEditOpen}
        onOpenChange={setIsBulkPriceEditOpen}
        productId={productId}
      />

      {/* Диалог массового редактирования наличия */}
      <BulkStockEdit
        isOpen={isBulkStockEditOpen}
        onOpenChange={setIsBulkStockEditOpen}
        productId={productId}
      />
    </div>
  );
}
