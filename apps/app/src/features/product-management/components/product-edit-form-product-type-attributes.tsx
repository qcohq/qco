"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@qco/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@qco/ui/components/card";
import { Input } from "@qco/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@qco/ui/components/select";
import { Switch } from "@qco/ui/components/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@qco/ui/components/table";
import { Textarea } from "@qco/ui/components/textarea";
import { toast } from "@qco/ui/hooks/use-toast";
import type { ProductUpdateInput } from "@qco/validators";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Save, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { z } from "zod";
import { useTRPC } from "~/trpc/react";

const attributeValueSchema = z.object({
  attributeId: z.string(),
  value: z.string(),
  isTemp: z.boolean().default(false),
});

const formSchema = z.object({
  values: z.array(attributeValueSchema),
});

type FormData = z.infer<typeof formSchema>;

interface ProductAttributeValue {
  id: string;
  productId: string;
  attributeId: string;
  value: string;
  attribute: {
    id: string;
    name: string;
    type: string;
    isRequired: boolean;
    options: string[];
  };
}

interface ProductTypeAttribute {
  id: string;
  name: string;
  type: string;
  isRequired: boolean;
  options: string[];
  sortOrder: number;
}

export function ProductEditFormProductTypeAttributes({
  productId,
  disabled,
}: {
  productId: string;
  disabled?: boolean;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);

  // Получаем productTypeId из родительской формы
  const parentForm = useFormContext<ProductUpdateInput>();
  const productTypeId = parentForm.watch("productTypeId");

  // Получаем атрибуты типа продукта
  const attributesQuery = trpc.productTypeAttributes.getAll.queryOptions({
    productTypeId: productTypeId || "",
  });
  const { data: attributes = [], isLoading: isAttributesLoading } = useQuery({
    ...attributesQuery,
    enabled: !!productTypeId,
  });

  // Получаем существующие значения атрибутов
  const valuesQuery =
    trpc.productAttributeValues.getByProductId.queryOptions({
      productId,
    });
  const {
    data: existingValues = [],
    isLoading: isValuesLoading,
    refetch: refetchValues,
  } = useQuery(valuesQuery);

  // Создаем map для быстрого поиска существующих значений
  const existingValuesMap = useMemo(() => {
    return existingValues.reduce(
      (acc, value) => {
        acc[value.attributeId] = value;
        return acc;
      },
      {} as Record<string, ProductAttributeValue>,
    );
  }, [existingValues]);

  // Формируем данные для формы с использованием useMemo
  const formData = useMemo(() => {
    return attributes.map((attr) => {
      const existingValue = existingValuesMap[attr.id];
      return {
        attributeId: attr.id,
        value: existingValue?.value || "",
        isTemp: !existingValue,
      };
    });
  }, [attributes, existingValuesMap]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      values: formData,
    },
  });

  // Обновляем форму при изменении данных
  useEffect(() => {
    if (!isAttributesLoading && !isValuesLoading) {
      form.reset({
        values: formData,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.reset, formData, isAttributesLoading, isValuesLoading]);

  // Мутация для создания/обновления значений
  const upsertMutation = useMutation(
    trpc.productAttributeValues.upsert.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.productAttributeValues.getByProductId.queryKey({
            productId,
          }),
        });
      },
    }),
  );

  // Мутация для удаления значений
  const deleteMutation = useMutation(
    trpc.productAttributeValues.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.productAttributeValues.getByProductId.queryKey({
            productId,
          }),
        });
      },
    }),
  );

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const values = form.getValues("values");

      // Сохраняем только непустые значения
      const valuesToSave = values.filter((v) => v.value.trim() !== "");

      await Promise.all(
        valuesToSave.map(({ attributeId, value }) =>
          upsertMutation.mutateAsync({
            productId,
            attributeId,
            value,
          }),
        ),
      );

      toast({
        title: "Атрибуты сохранены",
        description: "Все изменения успешно сохранены.",
      });

      refetchValues();
    } catch (_error) {
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить атрибуты",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (attributeId: string) => {
    const existingValue = existingValuesMap[attributeId];
    if (existingValue) {
      try {
        await deleteMutation.mutateAsync({ id: existingValue.id });

        // Очищаем значение в форме
        const currentValues = form.getValues("values");
        const updatedValues = currentValues.map((v) =>
          v.attributeId === attributeId ? { ...v, value: "", isTemp: true } : v,
        );
        form.setValue("values", updatedValues);

        toast({
          title: "Атрибут удален",
          description: "Значение атрибута успешно удалено.",
        });
      } catch (_error) {
        toast({
          title: "Ошибка",
          description: "Не удалось удалить атрибут",
          variant: "destructive",
        });
      }
    }
  };

  const renderAttributeInput = (
    attribute: ProductTypeAttribute,
    index: number,
  ) => {
    const fieldName = `values.${index}.value` as const;
    const currentValue = form.watch(fieldName);

    switch (attribute.type) {
      case "text":
        return (
          <Input
            {...form.register(fieldName)}
            placeholder={`Введите ${attribute.name.toLowerCase()}`}
            disabled={disabled}
          />
        );

      case "number":
        return (
          <Input
            {...form.register(fieldName)}
            type="number"
            placeholder={`Введите ${attribute.name.toLowerCase()}`}
            disabled={disabled}
          />
        );

      case "boolean":
        return (
          <Switch
            checked={currentValue === "true"}
            onCheckedChange={(checked) =>
              form.setValue(fieldName, checked ? "true" : "false")
            }
            disabled={disabled}
          />
        );

      case "select":
        return (
          <Select
            value={currentValue}
            onValueChange={(value) => form.setValue(fieldName, value)}
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={`Выберите ${attribute.name.toLowerCase()}`}
              />
            </SelectTrigger>
            <SelectContent>
              {attribute.options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "multiselect":
        return (
          <Textarea
            {...form.register(fieldName)}
            placeholder={`Выберите ${attribute.name.toLowerCase()} (через запятую)`}
            disabled={disabled}
            rows={2}
          />
        );

      default:
        return (
          <Input
            {...form.register(fieldName)}
            placeholder={`Введите ${attribute.name.toLowerCase()}`}
            disabled={disabled}
          />
        );
    }
  };

  if (!productTypeId) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Атрибуты товара</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Сначала выберите тип продукта, чтобы настроить атрибуты
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isAttributesLoading || isValuesLoading) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Атрибуты товара</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Загрузка атрибутов...</p>
        </CardContent>
      </Card>
    );
  }

  if (attributes.length === 0) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Атрибуты товара</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Для этого типа продукта не настроены атрибуты. Перейдите в настройки
            типа продукта, чтобы добавить атрибуты.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Атрибуты товара</CardTitle>
        <p className="text-muted-foreground text-sm mt-1">
          Заполните значения атрибутов для этого товара на основе выбранного
          типа продукта
        </p>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Атрибут</TableHead>
              <TableHead>Тип</TableHead>
              <TableHead>Значение</TableHead>
              <TableHead>Обязательный</TableHead>
              <TableHead>Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attributes.map((attribute, index) => {
              const currentValue = form.watch(`values.${index}.value`);
              const hasValue = currentValue && currentValue.trim() !== "";
              const existingValue = existingValuesMap[attribute.id];

              return (
                <TableRow key={attribute.id}>
                  <TableCell className="font-medium">
                    {attribute.name}
                    {attribute.isRequired && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-gray-100 rounded-md text-xs">
                      {attribute.type}
                    </span>
                  </TableCell>
                  <TableCell className="min-w-[200px]">
                    {renderAttributeInput(attribute, index)}
                  </TableCell>
                  <TableCell>
                    {attribute.isRequired ? (
                      <span className="text-green-600 text-sm">Да</span>
                    ) : (
                      <span className="text-gray-500 text-sm">Нет</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {hasValue && existingValue && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(attribute.id)}
                        disabled={disabled}
                        className="text-destructive"
                        title="Удалить значение"
                      >
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <div className="flex justify-end mt-4">
          <Button
            type="button"
            onClick={handleSave}
            disabled={disabled || isSaving}
            className="flex items-center gap-2"
          >
            <Save size={16} />
            {isSaving ? "Сохранение..." : "Сохранить атрибуты"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
