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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, Plus, Trash } from "lucide-react";
import { useState } from "react";

import { useTRPC } from "~/trpc/react";
import { OptionEditDialog } from "./option-edit-dialog";
import { OptionValueEditDialog } from "./option-value-edit-dialog";
import { OptionValuesDialog } from "./option-values-dialog";

interface VariantOptionsTableProps {
  productId: string;
}

export function VariantOptionsTable({ productId }: VariantOptionsTableProps) {
  const trpc = useTRPC();
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [selectedValue, setSelectedValue] = useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isValuesDialogOpen, setIsValuesDialogOpen] = useState(false);
  const [isValueEditDialogOpen, setIsValueEditDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  // Запрос на получение опций и значений продукта
  const optionsQueryOptions = trpc.productVariants.getOptions.queryOptions({
    productId,
  });

  const { data: optionsData, isLoading } = useQuery(optionsQueryOptions);

  // Преобразуем values в массив объектов, если приходит строка
  const parsedOptions =
    optionsData?.map((option) => ({
      ...option,
      values: (option.values ?? []).map((v, _i) => ({
        id: v.id,
        value: v.value,
        name: v.value, // Для совместимости с существующим кодом
        metadata: v.metadata,
      })),
    })) ?? [];

  // Мутация для удаления опции
  const deleteOptionMutation =
    trpc.productVariants.deleteOption.mutationOptions({
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        toast("Опция успешно удалена");
        queryClient.invalidateQueries(optionsQueryOptions);
      },
      onError: (error) => {
        toast(`Ошибка: ${error.message || "Не удалось удалить опцию"}`);
      },
    });
  const deleteOption = useMutation(deleteOptionMutation);

  const handleDeleteOption = () => {
    if (selectedOption) {
      deleteOption.mutate({
        attributeId: selectedOption.id,
      });
    }
  };

  return (
    <div>
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : parsedOptions && parsedOptions.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Название</TableHead>
              <TableHead>Значения</TableHead>
              <TableHead className="w-[120px]">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {parsedOptions.map((option) => (
              <TableRow key={option.id}>
                <TableCell className="font-medium">{option.name}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {option.values && option.values.length > 0 ? (
                      option.values.map((value) => {
                        const isColorOption =
                          option.name.toLowerCase().includes("цвет") ||
                          option.name.toLowerCase().includes("color");
                        return (
                          <Badge
                            key={value.id}
                            variant="outline"
                            className="flex items-center gap-1 cursor-pointer hover:bg-accent"
                            onClick={() => {
                              setSelectedOption(option);
                              setSelectedValue(value);
                              setIsValueEditDialogOpen(true);
                            }}
                          >
                            {isColorOption && value.metadata?.hex && (
                              <div
                                className="h-3 w-3 rounded-full border border-gray-300"
                                style={{ backgroundColor: value.metadata.hex }}
                              />
                            )}
                            {value.value || value.name}
                          </Badge>
                        );
                      })
                    ) : (
                      <span className="text-muted-foreground">
                        Нет значений
                      </span>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 rounded-full"
                      onClick={() => {
                        setSelectedOption(option);
                        setIsValuesDialogOpen(true);
                      }}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      type="button"
                      onClick={() => {
                        setSelectedOption(option);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => {
                        setSelectedOption(option);
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
            Добавьте опции, например "Размер" или "Цвет", чтобы создать варианты
            товара
          </p>
        </div>
      )}

      {/* Диалог редактирования опции */}
      {selectedOption && (
        <OptionEditDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          option={selectedOption}
          productId={productId}
        />
      )}

      {/* Диалог добавления значений */}
      {selectedOption && (
        <OptionValuesDialog
          open={isValuesDialogOpen}
          onOpenChange={setIsValuesDialogOpen}
          option={selectedOption}
          productId={productId}
        />
      )}

      {/* Диалог редактирования значения */}
      {selectedOption && selectedValue && (
        <OptionValueEditDialog
          open={isValueEditDialogOpen}
          onOpenChange={setIsValueEditDialogOpen}
          option={selectedOption}
          value={selectedValue}
        />
      )}

      {/* Диалог подтверждения удаления */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить опцию?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие удалит опцию "{selectedOption?.name}" и все её
              значения. Данное действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteOption}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
