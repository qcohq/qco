"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { Card } from "@qco/ui/components/card";
import { Input } from "@qco/ui/components/input";
import { Progress } from "@qco/ui/components/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@qco/ui/components/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@qco/ui/components/tooltip";
import { useQueryClient } from "@tanstack/react-query";
import { AlertCircle, HelpCircle, Loader2, Save, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useTRPC } from "~/trpc/react";
import { useUpdateVariant } from "../api";
import { variantEditSchema, type VariantEditData, type ProductVariant } from "../types";

interface VariantsExcelProps {
  productId: string;
  variants: ProductVariant[];
  isLoading: boolean;
}

export function VariantsExcel({
  productId,
  variants,
  isLoading,
}: VariantsExcelProps) {
  const [editingVariantId, setEditingVariantId] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [pendingVariantId, setPendingVariantId] = useState<string | null>(null);
  const [pendingField, setPendingField] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveProgress, setSaveProgress] = useState(0);
  const [lastSavedVariant, setLastSavedVariant] = useState<string | null>(null);
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );

  const { updateVariant, isLoading: isUpdating } = useUpdateVariant();
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const _inputRefs = useRef<Record<string, HTMLInputElement>>({});

  // Форма для редактирования
  const form = useForm<VariantEditData>({
    resolver: zodResolver(variantEditSchema),
    defaultValues: {
      name: "",
      sku: "",
      price: 0,
      salePrice: undefined as number | undefined,
      costPrice: undefined as number | undefined,
      stock: 0,
      minStock: undefined as number | undefined,
    },
  });

  // Очистка таймаута при размонтировании
  useEffect(() => {
    return () => {
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }
    };
  }, [autoSaveTimeout]);

  // Начать редактирование варианта
  const startEditing = useCallback(
    (variant: ProductVariant, field?: string) => {
      if (editingVariantId && editingVariantId !== variant.id) {
        setPendingVariantId(variant.id);
        setPendingField(field || null);
        setShowDiscardDialog(true);
        return;
      }

      setEditingVariantId(variant.id);
      setEditingField(field || null);
      setHasUnsavedChanges(false);

      form.reset({
        name: variant.name || "",
        sku: variant.sku || "",
        price: Number(variant.price) || 0,
        salePrice: variant.salePrice ? Number(variant.salePrice) : undefined,
        costPrice: variant.costPrice ? Number(variant.costPrice) : undefined,
        stock: Number(variant.stock) || 0,
        minStock: variant.minStock ? Number(variant.minStock) : undefined,
      });

      // Автоматически фокусируемся на указанном поле или первом поле
      setTimeout(() => {
        const targetField = field || "name";
        const input = document.querySelector(
          `[data-variant-id="${variant.id}"][data-field="${targetField}"]`,
        ) as HTMLInputElement;
        if (input) {
          input.focus();
          input.select();
        }
      }, 10);
    },
    [editingVariantId, form],
  );

  // Отменить редактирование
  const cancelEditing = useCallback(() => {
    if (hasUnsavedChanges) {
      setShowDiscardDialog(true);
    } else {
      setEditingVariantId(null);
      setEditingField(null);
      form.reset();
    }
  }, [hasUnsavedChanges, form]);

  // Сохранить изменения с анимацией прогресса
  const saveChanges = useCallback(
    async (data: VariantEditData, showToast = true, keepEditing = false) => {
      if (!editingVariantId) return false;

      setIsSaving(true);
      setSaveProgress(0);

      // Анимация прогресса
      const progressInterval = setInterval(() => {
        setSaveProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 15;
        });
      }, 100);

      try {
        await updateVariant({
          variantId: editingVariantId,
          productId,
          data: {
            name: data.name,
            sku: data.sku,
            price: Number(data.price),
            costPrice:
              data.costPrice === null || data.costPrice === undefined
                ? undefined
                : Number(data.costPrice),
            minStock:
              data.minStock === null || data.minStock === undefined
                ? undefined
                : Number(data.minStock),
            salePrice:
              data.salePrice === null || data.salePrice === undefined
                ? undefined
                : Number(data.salePrice),
            stock: Number(data.stock),
          },
        });

        setSaveProgress(100);
        setLastSavedVariant(editingVariantId);

        // Инвалидируем запрос на получение вариантов
        queryClient.invalidateQueries({
          queryKey: trpc.productVariants.getVariants.queryKey({ productId }),
        });

        if (showToast) {
          toast.success("Вариант сохранен", {
            description: `"${data.name}" успешно обновлен`,
            duration: 2000,
          });
        }

        // Если не нужно оставаться в режиме редактирования, выходим
        if (!keepEditing) {
          setEditingVariantId(null);
          setEditingField(null);
          form.reset();
        }

        setHasUnsavedChanges(false);

        // Сброс прогресса через небольшую задержку
        setTimeout(() => {
          setSaveProgress(0);
          setLastSavedVariant(null);
        }, 1000);

        return true;
      } catch (error) {
        console.error("Ошибка при обновлении варианта:", error);

        if (showToast) {
          toast.error("Ошибка сохранения", {
            description: "Не удалось сохранить изменения",
            duration: 4000,
          });
        }

        return false;
      } finally {
        clearInterval(progressInterval);
        setIsSaving(false);
      }
    },
    [editingVariantId, updateVariant, productId, form, queryClient, trpc],
  );

  // Автосохранение при изменении поля
  const handleFieldChange = useCallback(
    (fieldName: string, value: any) => {
      form.setValue(fieldName as keyof VariantEditData, value);
      setHasUnsavedChanges(true);

      // Очищаем предыдущий таймаут
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }

      // Устанавливаем новый таймаут для автосохранения через 2 секунды
      const timeout = setTimeout(async () => {
        const formData = form.getValues();
        const isValid = await form.trigger();

        if (isValid && hasUnsavedChanges) {
          await saveChanges(formData, false, true); // Не показываем toast и остаемся в режиме редактирования
        }
      }, 2000);

      setAutoSaveTimeout(timeout);
    },
    [form, autoSaveTimeout, hasUnsavedChanges, saveChanges],
  );

  // Обработка подтверждения отмены изменений
  const handleDiscardConfirm = useCallback(() => {
    setShowDiscardDialog(false);
    setEditingVariantId(null);
    setEditingField(null);
    setHasUnsavedChanges(false);
    form.reset();

    if (pendingVariantId) {
      const variant = variants.find((v) => v.id === pendingVariantId);
      if (variant) {
        startEditing(variant, pendingField || undefined);
      }
      setPendingVariantId(null);
      setPendingField(null);
    }
  }, [form, variants, pendingVariantId, pendingField, startEditing]);

  // Обработка отмены диалога
  const handleDiscardCancel = useCallback(() => {
    setShowDiscardDialog(false);
    setPendingVariantId(null);
    setPendingField(null);
  }, []);

  // Обработка нажатия клавиш в полях ввода
  const handleKeyDown = useCallback(
    async (e: React.KeyboardEvent, fieldName: string, variantIndex: number) => {
      if (e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();

        // Если это последнее поле в строке, сохраняем и переходим к следующей строке
        const fieldOrder = [
          "name",
          "sku",
          "price",
          "costPrice",
          "salePrice",
          "stock",
        ];
        const currentFieldIndex = fieldOrder.indexOf(fieldName);

        if (currentFieldIndex === fieldOrder.length - 1) {
          // Последнее поле в строке - сохраняем и переходим к следующей строке
          const formData = form.getValues();
          const isValid = await form.trigger();

          if (isValid) {
            const success = await saveChanges(formData, true, false);

            if (success) {
              // Переходим к следующей строке
              const nextVariantIndex = variantIndex + 1;
              if (nextVariantIndex < variants.length) {
                const nextVariant = variants[nextVariantIndex];
                if (nextVariant) {
                  setTimeout(() => {
                    startEditing(nextVariant, "name");
                  }, 100);
                }
              }
            }
          }
        } else {
          // Не последнее поле - переходим к следующему полю
          const nextFieldName = fieldOrder[currentFieldIndex + 1];
          const nextInput = document.querySelector(
            `[data-variant-id="${editingVariantId}"][data-field="${nextFieldName}"]`,
          ) as HTMLInputElement;
          if (nextInput) {
            nextInput.focus();
            nextInput.select();
          }
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        cancelEditing();
      } else if (e.key === "Tab") {
        // Tab работает как обычно для навигации между полями
        // Не предотвращаем стандартное поведение
      } else if (e.key === "ArrowDown" && e.ctrlKey) {
        // Ctrl + Down - перейти к следующей строке
        e.preventDefault();
        e.stopPropagation();
        const formData = form.getValues();
        const isValid = await form.trigger();

        if (isValid) {
          const success = await saveChanges(formData, true, false);
          if (success) {
            const nextVariantIndex = variantIndex + 1;
            if (nextVariantIndex < variants.length) {
              const nextVariant = variants[nextVariantIndex];
              if (nextVariant) {
                setTimeout(() => {
                  startEditing(nextVariant, editingField || undefined);
                }, 100);
              }
            }
          }
        }
      } else if (e.key === "ArrowUp" && e.ctrlKey) {
        // Ctrl + Up - перейти к предыдущей строке
        e.preventDefault();
        e.stopPropagation();
        const formData = form.getValues();
        const isValid = await form.trigger();

        if (isValid) {
          const success = await saveChanges(formData, true, false);
          if (success) {
            const prevVariantIndex = variantIndex - 1;
            if (prevVariantIndex >= 0) {
              const prevVariant = variants[prevVariantIndex];
              if (prevVariant) {
                setTimeout(() => {
                  startEditing(prevVariant, editingField || undefined);
                }, 100);
              }
            }
          }
        }
      }
    },
    [
      form,
      saveChanges,
      cancelEditing,
      editingVariantId,
      editingField,
      variants,
      startEditing,
    ],
  );

  // Обработка клика по ячейке
  const handleCellClick = useCallback(
    (variant: ProductVariant, fieldName: string) => {
      if (editingVariantId !== variant.id) {
        startEditing(variant, fieldName);
      } else if (editingField !== fieldName) {
        setEditingField(fieldName);
        const input = document.querySelector(
          `[data-variant-id="${variant.id}"][data-field="${fieldName}"]`,
        ) as HTMLInputElement;
        if (input) {
          input.focus();
          input.select();
        }
      }
    },
    [editingVariantId, editingField, startEditing],
  );

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-32">
          <div className="text-muted-foreground">Загрузка вариантов...</div>
        </div>
      </Card>
    );
  }

  if (variants.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <div className="text-muted-foreground mb-2">
              Варианты не найдены
            </div>
            <div className="text-sm text-muted-foreground">
              Создайте варианты товара для их редактирования
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Режим Excel</h3>
            <p className="text-sm text-muted-foreground">
              Редактируйте варианты прямо в таблице. Кликните на ячейку для
              мгновенного редактирования.
              <br />
              <span className="text-xs">
                <strong>Навигация:</strong> Enter - перейти к следующему полю, в
                последнем поле - сохранить и перейти к следующей строке
              </span>
              <br />
              <span className="text-xs">
                <strong>Дополнительно:</strong> Tab - перейти к следующему полю,
                Escape - отменить редактирование, Ctrl+↑/↓ - перейти к
                предыдущей/следующей строке
              </span>
              <br />
              <span className="text-xs">
                <strong>Автосохранение:</strong> Изменения автоматически
                сохраняются через 2 секунды после редактирования
              </span>
            </p>
          </div>
          {editingVariantId && (
            <div className="flex items-center space-x-2">
              <Badge
                variant="secondary"
                className="flex items-center space-x-1"
              >
                <AlertCircle className="h-3 w-3" />
                <span>Режим редактирования</span>
              </Badge>
              <Badge variant="outline" className="text-xs">
                {variants.indexOf(
                  variants.find((v) => v.id === editingVariantId)!,
                ) + 1}{" "}
                из {variants.length}
              </Badge>
              {hasUnsavedChanges && (
                <Badge variant="destructive" className="text-xs animate-pulse">
                  Не сохранено
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Индикатор прогресса сохранения */}
        {isSaving && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Сохранение изменений...
              </span>
              <span className="text-muted-foreground">
                {Math.round(saveProgress)}%
              </span>
            </div>
            <Progress value={saveProgress} className="h-1" />
          </div>
        )}

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Название</TableHead>
                <TableHead className="w-[150px]">SKU</TableHead>
                <TableHead className="w-[100px]">
                  <div className="flex items-center gap-1">
                    Базовая цена
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
                </TableHead>
                <TableHead className="w-[100px]">
                  <div className="flex items-center gap-1">
                    Себестоимость
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Себестоимость товара для расчета прибыли. Не отображается
                            покупателям, используется только для внутренних расчетов
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableHead>
                <TableHead className="w-[100px]">
                  <div className="flex items-center gap-1">
                    Цена со скидкой
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Специальная цена со скидкой. Если указана, то именно
                            она будет показана покупателям вместо базовой цены
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableHead>
                <TableHead className="w-[100px]">Наличие</TableHead>
                <TableHead>Опции</TableHead>
                <TableHead className="w-[100px]">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {variants.map((variant) => {
                const isEditing = editingVariantId === variant.id;
                const isLastSaved = lastSavedVariant === variant.id;

                return (
                  <TableRow
                    key={variant.id}
                    data-variant-id={variant.id}
                    className={`transition-all duration-200 ${isEditing
                      ? "bg-accent/50 ring-1 ring-primary/20"
                      : isLastSaved
                        ? "bg-green-50/50 dark:bg-green-950/20"
                        : "hover:bg-muted/30"
                      }`}
                  >
                    <TableCell>
                      {isEditing ? (
                        <div className="space-y-2">
                          <Input
                            {...form.register("name")}
                            data-variant-id={variant.id}
                            data-field="name"
                            onChange={(e) =>
                              handleFieldChange("name", e.target.value)
                            }
                            onKeyDown={(e) =>
                              handleKeyDown(
                                e,
                                "name",
                                variants.indexOf(variant),
                              )
                            }
                            className="h-8 transition-all duration-200 focus:ring-2 focus:ring-primary/50"
                          />
                          {form.formState.errors.name && (
                            <div className="text-xs text-destructive animate-in fade-in-0">
                              {form.formState.errors.name.message}
                            </div>
                          )}
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="w-full text-left cursor-pointer hover:bg-muted/50 p-1 rounded min-h-[32px] flex items-center border-none bg-transparent transition-all duration-200"
                          onClick={() => handleCellClick(variant, "name")}
                        >
                          {variant.name || "—"}
                        </button>
                      )}
                    </TableCell>

                    <TableCell>
                      {isEditing ? (
                        <div className="space-y-2">
                          <Input
                            {...form.register("sku")}
                            data-variant-id={variant.id}
                            data-field="sku"
                            onChange={(e) =>
                              handleFieldChange("sku", e.target.value)
                            }
                            onKeyDown={(e) =>
                              handleKeyDown(e, "sku", variants.indexOf(variant))
                            }
                            className="h-8 transition-all duration-200 focus:ring-2 focus:ring-primary/50"
                          />
                          {form.formState.errors.sku && (
                            <div className="text-xs text-destructive animate-in fade-in-0">
                              {form.formState.errors.sku.message}
                            </div>
                          )}
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="w-full text-left cursor-pointer hover:bg-muted/50 p-1 rounded min-h-[32px] flex items-center border-none bg-transparent transition-all duration-200"
                          onClick={() => handleCellClick(variant, "sku")}
                        >
                          {variant.sku || "—"}
                        </button>
                      )}
                    </TableCell>

                    <TableCell>
                      {isEditing ? (
                        <div className="space-y-2">
                          <Input
                            {...form.register("price", { valueAsNumber: true })}
                            data-variant-id={variant.id}
                            data-field="price"
                            type="number"
                            step="0.01"
                            min="0"
                            onChange={(e) => {
                              const value = e.target.value;
                              handleFieldChange(
                                "price",
                                value === ""
                                  ? 0
                                  : Number.parseFloat(value) || 0,
                              );
                            }}
                            onKeyDown={(e) =>
                              handleKeyDown(
                                e,
                                "price",
                                variants.indexOf(variant),
                              )
                            }
                            className="h-8 transition-all duration-200 focus:ring-2 focus:ring-primary/50"
                          />
                          {form.formState.errors.price && (
                            <div className="text-xs text-destructive animate-in fade-in-0">
                              {form.formState.errors.price.message}
                            </div>
                          )}
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="w-full text-left cursor-pointer hover:bg-muted/50 p-1 rounded min-h-[32px] flex items-center border-none bg-transparent transition-all duration-200"
                          onClick={() => handleCellClick(variant, "price")}
                        >
                          {variant.price
                            ? `${Number(variant.price).toFixed(2)} ₽`
                            : "—"}
                        </button>
                      )}
                    </TableCell>

                    <TableCell>
                      {isEditing ? (
                        <div className="space-y-2">
                          <Input
                            value={
                              form.watch("costPrice") === null ||
                                form.watch("costPrice") === undefined
                                ? ""
                                : String(form.watch("costPrice"))
                            }
                            data-variant-id={variant.id}
                            data-field="costPrice"
                            type="number"
                            step="0.01"
                            min="0"
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === "") {
                                handleFieldChange("costPrice", undefined);
                              } else {
                                const numValue = Number.parseFloat(value);
                                handleFieldChange(
                                  "costPrice",
                                  Number.isNaN(numValue) ? undefined : numValue,
                                );
                              }
                            }}
                            onKeyDown={(e) =>
                              handleKeyDown(
                                e,
                                "costPrice",
                                variants.indexOf(variant),
                              )
                            }
                            className="h-8 transition-all duration-200 focus:ring-2 focus:ring-primary/50"
                          />
                          {form.formState.errors.costPrice && (
                            <div className="text-xs text-destructive animate-in fade-in-0">
                              {form.formState.errors.costPrice.message}
                            </div>
                          )}
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="w-full text-left cursor-pointer hover:bg-muted/50 p-1 rounded min-h-[32px] flex items-center border-none bg-transparent transition-all duration-200"
                          onClick={() =>
                            handleCellClick(variant, "costPrice")
                          }
                        >
                          {variant.costPrice
                            ? `${Number(variant.costPrice).toFixed(2)} ₽`
                            : "—"}
                        </button>
                      )}
                    </TableCell>

                    <TableCell>
                      {isEditing ? (
                        <div className="space-y-2">
                          <Input
                            value={
                              form.watch("salePrice") === null ||
                                form.watch("salePrice") === undefined
                                ? ""
                                : String(form.watch("salePrice"))
                            }
                            data-variant-id={variant.id}
                            data-field="salePrice"
                            type="number"
                            step="0.01"
                            min="0"
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === "") {
                                handleFieldChange("salePrice", undefined);
                              } else {
                                const numValue = Number.parseFloat(value);
                                handleFieldChange(
                                  "salePrice",
                                  Number.isNaN(numValue) ? undefined : numValue,
                                );
                              }
                            }}
                            onKeyDown={(e) =>
                              handleKeyDown(
                                e,
                                "salePrice",
                                variants.indexOf(variant),
                              )
                            }
                            className="h-8 transition-all duration-200 focus:ring-2 focus:ring-primary/50"
                          />
                          {form.formState.errors.salePrice && (
                            <div className="text-xs text-destructive animate-in fade-in-0">
                              {form.formState.errors.salePrice.message}
                            </div>
                          )}
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="w-full text-left cursor-pointer hover:bg-muted/50 p-1 rounded min-h-[32px] flex items-center border-none bg-transparent transition-all duration-200"
                          onClick={() => handleCellClick(variant, "salePrice")}
                        >
                          {variant.salePrice ? (
                            <span className="text-green-600 font-medium">
                              {Number(variant.salePrice).toFixed(2)} ₽
                            </span>
                          ) : (
                            "—"
                          )}
                        </button>
                      )}
                    </TableCell>

                    <TableCell>
                      {isEditing ? (
                        <div className="space-y-2">
                          <Input
                            {...form.register("stock", { valueAsNumber: true })}
                            data-variant-id={variant.id}
                            data-field="stock"
                            type="number"
                            min="0"
                            onChange={(e) => {
                              const value = e.target.value;
                              handleFieldChange(
                                "stock",
                                value === "" ? 0 : Number.parseInt(value) || 0,
                              );
                            }}
                            onKeyDown={(e) =>
                              handleKeyDown(
                                e,
                                "stock",
                                variants.indexOf(variant),
                              )
                            }
                            className="h-8 transition-all duration-200 focus:ring-2 focus:ring-primary/50"
                          />
                          {form.formState.errors.stock && (
                            <div className="text-xs text-destructive animate-in fade-in-0">
                              {form.formState.errors.stock.message}
                            </div>
                          )}
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="w-full text-left cursor-pointer hover:bg-muted/50 p-1 rounded min-h-[32px] flex items-center border-none bg-transparent transition-all duration-200"
                          onClick={() => handleCellClick(variant, "stock")}
                        >
                          {variant.stock !== null ? Number(variant.stock) : "—"}
                        </button>
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {variant.attributes.map((attr) => (
                          <Badge
                            key={attr.option}
                            variant="outline"
                            className="text-xs"
                          >
                            {attr.option}: {attr.value}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>

                    <TableCell>
                      {isEditing ? (
                        <div className="flex items-center space-x-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={async () => {
                                  const formData = form.getValues();
                                  const isValid = await form.trigger();
                                  if (isValid) {
                                    await saveChanges(formData, true, false);
                                  }
                                }}
                                disabled={isUpdating}
                                className="transition-all duration-200 hover:bg-green-100 hover:text-green-700"
                              >
                                {isUpdating ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Save className="h-4 w-4" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Сохранить</TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={cancelEditing}
                                disabled={isUpdating}
                                className="transition-all duration-200 hover:bg-red-100 hover:text-red-700"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Отменить</TooltipContent>
                          </Tooltip>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => startEditing(variant)}
                          className="transition-all duration-200"
                        >
                          Редактировать
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>

        {/* Диалог подтверждения отмены изменений */}
        <AlertDialog
          open={showDiscardDialog}
          onOpenChange={setShowDiscardDialog}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Отменить изменения?</AlertDialogTitle>
              <AlertDialogDescription>
                У вас есть несохраненные изменения. Вы уверены, что хотите их
                отменить?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleDiscardCancel}>
                Продолжить редактирование
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleDiscardConfirm}>
                Отменить изменения
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  );
}
