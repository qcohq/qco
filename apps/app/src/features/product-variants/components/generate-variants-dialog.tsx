"use client";

import { Badge } from "@qco/ui/components/badge";
import { Button } from "@qco/ui/components/button";
import { Checkbox } from "@qco/ui/components/checkbox";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@qco/ui/components/dialog";
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
import { Check, Info, RefreshCw } from "lucide-react";
import { useState } from "react";

import { useTRPC } from "~/trpc/react";

interface GenerateVariantsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
  options: any[];
}

export function GenerateVariantsDialog({
  open,
  onOpenChange,
  productId,
  options,
}: GenerateVariantsDialogProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewVariants, setPreviewVariants] = useState<any[]>([]);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  // Мутация для генерации вариантов
  const generateVariantsMutation = useMutation(
    trpc.productVariants.generateVariants.mutationOptions({
      onSuccess: (data) => {
        // Инвалидируем запрос на получение вариантов
        queryClient.invalidateQueries({
          queryKey: trpc.productVariants.getVariants.queryKey({ productId }),
        });

        // Закрываем диалог
        onOpenChange(false);
        setIsGenerating(false);
        setSelectedOptions([]);
        setPreviewVariants([]);

        toast({
          title: "Успех",
          description: data.message || `Создано ${data.count} вариантов`,
        });
      },
      onError: (error) => {
        toast({
          title: "Ошибка",
          description: error.message || "Не удалось сгенерировать варианты",
          variant: "destructive",
        });
        setIsGenerating(false);
      },
    }),
  );

  // Мутация для получения предпросмотра вариантов
  const previewVariantsMutation = useMutation(
    trpc.productVariants.previewVariants.mutationOptions({
      onSuccess: (data) => {
        setPreviewVariants(data.variants || []);

        setIsPreviewLoading(false);
      },
      onError: (error) => {
        toast({
          title: "Ошибка",
          description: `${error.message || "Не удалось получить предпросмотр вариантов"}`,
          variant: "destructive",
        });
        setIsPreviewLoading(false);
      },
    }),
  );

  // Обработчик переключения опции
  const handleOptionToggle = (optionId: string) => {
    setSelectedOptions((prev) => {
      if (prev.includes(optionId)) {
        return prev.filter((id) => id !== optionId);
      }
      return [...prev, optionId];
    });
  };

  // Обработчик генерации предпросмотра
  const handlePreviewVariants = () => {
    if (selectedOptions.length === 0) {
      toast({
        title: "Ошибка",
        description: "Выберите хотя бы одну опцию для генерации вариантов",
        variant: "destructive",
      });
      return;
    }

    setIsPreviewLoading(true);
    setPreviewVariants([]);

    // Запрашиваем предпросмотр вариантов
    previewVariantsMutation.mutate({
      productId,
      optionIds: selectedOptions,
    });
  };

  // Обработчик генерации вариантов
  const handleGenerateVariants = () => {
    if (selectedOptions.length === 0) {
      toast({
        title: "Ошибка",
        description: "Выберите хотя бы одну опцию для генерации вариантов",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    // Генерируем варианты
    generateVariantsMutation.mutate({
      productId,
      optionIds: selectedOptions,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Умная генерация вариантов</DialogTitle>
          <DialogDescription>
            Выберите опции для создания вариантов с умными названиями и SKU.
            Система автоматически сгруппирует опции и создаст понятные названия.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Информация о группировке */}
          <div className="rounded-lg border bg-muted/50 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Info className="h-4 w-4 text-blue-600" />
              <h4 className="font-medium">Как работает умная генерация</h4>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium mb-2">Группировка опций:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Размеры (приоритет 1)</li>
                  <li>• Цвета (приоритет 2)</li>
                  <li>• Материалы (приоритет 3)</li>
                  <li>• Стили (приоритет 4)</li>
                </ul>
              </div>
              <div>
                <p className="font-medium mb-2">Автоматическое создание:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Умные названия</li>
                  <li>• Уникальные SKU</li>
                  <li>• Наследование всех цен</li>
                  <li>• Логическая сортировка</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Выбор опций */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Выбор</TableHead>
                  <TableHead>Опция</TableHead>
                  <TableHead>Значения</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {options.map((option) => (
                  <TableRow key={option.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedOptions.includes(option.id)}
                        onCheckedChange={() => handleOptionToggle(option.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{option.name}</TableCell>
                    <TableCell>
                      {option.values && option.values.length > 0
                        ? option.values.map((v: any) => v.value).join(", ")
                        : "Нет значений"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Кнопка предпросмотра */}
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={handlePreviewVariants}
              disabled={isPreviewLoading || selectedOptions.length === 0}
              className="flex items-center gap-2"
            >
              {isPreviewLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Предпросмотр вариантов
            </Button>
          </div>

          {/* Предпросмотр вариантов */}
          {previewVariants.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">
                  Предпросмотр вариантов ({previewVariants.length})
                </h4>
                <Badge variant="secondary">
                  {selectedOptions.length} выбранных опций
                </Badge>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Название</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Цены</TableHead>
                      <TableHead>Опции</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewVariants.map((variant) => (
                      <TableRow key={variant.id}>
                        <TableCell className="font-medium">
                          {variant.name}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {variant.sku}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {variant.price && (
                              <div className="text-sm">
                                <span className="text-gray-500">Базовая:</span>{" "}
                                <span className="font-medium">
                                  {Number(variant.price).toLocaleString(
                                    "ru-RU",
                                  )}{" "}
                                  ₽
                                </span>
                              </div>
                            )}
                            {variant.salePrice &&
                              variant.salePrice !== variant.price && (
                                <div className="text-sm">
                                  <span className="text-green-600 font-medium">
                                    {Number(variant.salePrice).toLocaleString(
                                      "ru-RU",
                                    )}{" "}
                                    ₽
                                  </span>
                                  {variant.compareAtPrice && (
                                    <span className="text-gray-400 line-through ml-2">
                                      {Number(
                                        variant.compareAtPrice,
                                      ).toLocaleString("ru-RU")}{" "}
                                      ₽
                                    </span>
                                  )}
                                </div>
                              )}
                            {!variant.price && !variant.salePrice && (
                              <span className="text-gray-400 text-sm">
                                Цена не указана
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {variant.attributes &&
                              Object.entries(variant.attributes).map(
                                ([key, value]: [string, any]) => (
                                  <Badge
                                    key={key}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {key}: {value}
                                  </Badge>
                                ),
                              )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Отмена
          </Button>
          <Button
            onClick={handleGenerateVariants}
            disabled={isGenerating || selectedOptions.length === 0}
            className="flex items-center gap-2"
          >
            {isGenerating ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            {isGenerating ? "Генерация..." : "Сгенерировать варианты"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
