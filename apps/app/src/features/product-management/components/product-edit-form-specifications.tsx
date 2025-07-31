import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@qco/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@qco/ui/components/card";
import { Input } from "@qco/ui/components/input";
import { Select, SelectContent, SelectItem } from "@qco/ui/components/select";
import { Switch } from "@qco/ui/components/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@qco/ui/components/table";
import { toast } from "@qco/ui/hooks/use-toast";
import { productSpecificationSchema } from "@qco/validators";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { useTRPC } from "~/trpc/react";

const SPEC_TYPES = [
  { label: "Текст", value: "text" },
  { label: "Число", value: "number" },
  { label: "Список", value: "select" },
  { label: "Логический", value: "boolean" },
  { label: "Цвет", value: "color" },
];

const ALLOWED_TYPES = ["text", "number", "select", "boolean", "color"] as const;

interface ProductSpecification {
  id?: string;
  productId?: string;
  name?: string;
  value?: string;
  type?: string;
  sortOrder?: number;
  isFilterable?: boolean;
  isSearchable?: boolean;
  metadata?: Record<string, any>;
}

export function ProductEditFormSpecifications({
  productId,
  disabled,
}: {
  productId: string;
  disabled?: boolean;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);

  // Получаем спецификации по productId
  const specificationsQuery = trpc.products.specifications.list.queryOptions({
    productId,
  });
  const {
    data: specifications = [],
    isLoading,
    isError,
    refetch,
  } = useQuery(specificationsQuery);

  const normalizeSpec = useCallback(
    (s: ProductSpecification) => {
      return {
        id: s.id ?? "",
        productId: s.productId ?? productId,
        name: s.name ?? "",
        value: s.value ?? "",
        type: ALLOWED_TYPES.includes(s.type) ? s.type : "text",
        sortOrder: typeof s.sortOrder === "number" ? s.sortOrder : 0,
        isFilterable: !!s.isFilterable,
        isSearchable: !!s.isSearchable,
        metadata: s.metadata ?? {},
      };
    },
    [productId],
  );

  const form = useForm({
    resolver: zodResolver(
      z.object({ specifications: productSpecificationSchema.array() }),
    ),
    defaultValues: {
      specifications: (specifications || []).map(normalizeSpec),
    },
    mode: "onChange",
  });
  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "specifications",
  });

  useEffect(() => {
    if (specifications) {
      replace(specifications.map(normalizeSpec));
    }
  }, [specifications, normalizeSpec, replace]);

  // Мутации
  const createSpecMutation = useMutation(
    trpc.products.specifications.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.products.specifications.list.queryKey({ productId }),
        });
        refetch();
      },
    }),
  );
  const updateSpecMutation = useMutation(
    trpc.products.specifications.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.products.specifications.list.queryKey({ productId }),
        });
        refetch();
      },
    }),
  );
  const removeSpecMutation = useMutation(
    trpc.products.specifications.remove.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.products.specifications.list.queryKey({ productId }),
        });
        refetch();
      },
    }),
  );

  async function handleSave() {
    setIsSaving(true);
    try {
      const specs = form.getValues("specifications"); // теперь это массив
      const createSpecs = specs
        .filter((s) => !s.id)
        .map((s) => ({ ...s, productId }));
      const updateSpecs = specs
        .filter((s) => s.id)
        .map((s) => ({ ...s, productId }));
      await Promise.all([
        ...createSpecs.map(
          (s) =>
            new Promise((resolve, reject) =>
              createSpecMutation.mutate(s, {
                onSuccess: resolve,
                onError: reject,
              }),
            ),
        ),
        ...updateSpecs.map(
          (s) =>
            new Promise((resolve, reject) =>
              updateSpecMutation.mutate(s, {
                onSuccess: resolve,
                onError: reject,
              }),
            ),
        ),
      ]);
      toast({
        title: "Спецификации сохранены",
        description: "Все изменения успешно сохранены.",
      });
      refetch();
    } catch (_e) {
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить спецификации",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }

  function handleRemove(idx: number, id?: string) {
    if (id) {
      removeSpecMutation.mutate({ id, productId });
    }
    remove(idx);
  }

  if (isLoading) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Спецификации товара</CardTitle>
        </CardHeader>
        <CardContent>Загрузка...</CardContent>
      </Card>
    );
  }
  if (isError) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Спецификации товара</CardTitle>
        </CardHeader>
        <CardContent>Ошибка загрузки спецификаций</CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Спецификации товара</CardTitle>
        <p className="text-muted-foreground text-sm mt-1">
          Добавьте характеристики, которые будут отображаться на странице товара
          и использоваться для фильтрации и поиска.
        </p>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Название</TableHead>
              <TableHead>Значение</TableHead>
              <TableHead>Тип</TableHead>
              <TableHead>Порядок</TableHead>
              <TableHead>Фильтр</TableHead>
              <TableHead>Поиск</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((field, index) => (
              <TableRow key={field.id}>
                <TableCell>
                  <Input
                    {...form.register(`specifications.${index}.name` as const)}
                    placeholder="Например, Материал"
                    disabled={disabled}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    {...form.register(`specifications.${index}.value` as const)}
                    placeholder="Например, Хлопок"
                    disabled={disabled}
                  />
                </TableCell>
                <TableCell>
                  <Select
                    value={
                      form.watch(`specifications.${index}.type`) as
                        | "text"
                        | "number"
                        | "select"
                        | "boolean"
                        | "color"
                    }
                    onValueChange={(v) =>
                      form.setValue(
                        `specifications.${index}.type`,
                        v as "text" | "number" | "select" | "boolean" | "color",
                      )
                    }
                    disabled={disabled}
                  >
                    <SelectContent>
                      {SPEC_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    {...form.register(
                      `specifications.${index}.sortOrder` as const,
                      { valueAsNumber: true },
                    )}
                    disabled={disabled}
                    min={0}
                    style={{ width: 60 }}
                  />
                </TableCell>
                <TableCell>
                  <Switch
                    checked={form.watch(`specifications.${index}.isFilterable`)}
                    onCheckedChange={(v) =>
                      form.setValue(`specifications.${index}.isFilterable`, v)
                    }
                    disabled={disabled}
                  />
                </TableCell>
                <TableCell>
                  <Switch
                    checked={form.watch(`specifications.${index}.isSearchable`)}
                    onCheckedChange={(v) =>
                      form.setValue(`specifications.${index}.isSearchable`, v)
                    }
                    disabled={disabled}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      handleRemove(
                        index,
                        form.watch(`specifications.${index}.id`),
                      )
                    }
                    disabled={disabled}
                    className="text-destructive"
                    title="Удалить спецификацию"
                  >
                    <Trash2 size={18} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between mt-4 gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              append({
                id: "",
                name: "",
                value: "",
                type: "text",
                sortOrder: fields.length,
                isFilterable: false,
                isSearchable: false,
                metadata: {},
                productId,
              })
            }
            disabled={disabled}
          >
            <Plus className="mr-2" size={18} /> Добавить спецификацию
          </Button>
          <Button
            type="button"
            variant="default"
            onClick={handleSave}
            disabled={disabled || isSaving}
          >
            {isSaving ? "Сохранение..." : "Сохранить спецификации"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
