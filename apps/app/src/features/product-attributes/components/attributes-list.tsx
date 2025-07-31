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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@qco/ui/components/dropdown-menu";
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
import type { ProductTypeAttribute } from "../types/attribute";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Filter,
  MoreHorizontal,
  Pencil,
  Search,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useTRPC } from "~/trpc/react";

interface AttributesListProps {
  productTypeId: string;
}

type SortField = "name" | "type" | "sortOrder" | "isRequired" | "isFilterable" | "isActive";
type SortDirection = "asc" | "desc";

export function AttributesList({ productTypeId }: AttributesListProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // Состояния для управления диалогом удаления
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAttribute, setSelectedAttribute] =
    useState<ProductTypeAttribute | null>(null);

  // Состояния для фильтрации и сортировки
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("sortOrder");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  // Запрос на получение атрибутов
  const attributesQueryOptions =
    trpc.productTypeAttributes.getByProductType.queryOptions({
      productTypeId,
    });

  const { data, isPending, error } = useQuery(attributesQueryOptions);

  // Мутация для удаления атрибута
  const deleteMutationOptions =
    trpc.productTypeAttributes.delete.mutationOptions({
      onSuccess: () => {
        toast.success("Атрибут успешно удален");
        // Инвалидируем запросы для конкретного типа продукта
        queryClient.invalidateQueries({
          queryKey: trpc.productTypeAttributes.getByProductType.queryKey({
            productTypeId,
          }),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.productTypeAttributes.getAll.queryKey({
            productTypeId,
          }),
        });
        // Также инвалидируем общий список атрибутов
        queryClient.invalidateQueries({
          queryKey: trpc.productTypeAttributes.getAll.queryKey(),
        });
        setIsDeleteDialogOpen(false);
      },
      onError: (error) => {
        toast.error(`Ошибка: ${error.message || "Не удалось удалить атрибут"}`);
      },
    });

  const { mutate: deleteAttribute, isPending: isDeleting } = useMutation(
    deleteMutationOptions,
  );

  // Мутация для переключения активности
  const toggleActiveMutationOptions =
    trpc.productTypeAttributes.toggleActive.mutationOptions({
      onSuccess: (data) => {
        toast.success(
          `Атрибут "${data?.name}" ${data?.isActive ? "активирован" : "деактивирован"}`
        );
        // Инвалидируем запросы
        queryClient.invalidateQueries({
          queryKey: trpc.productTypeAttributes.getByProductType.queryKey({
            productTypeId,
          }),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.productTypeAttributes.getAll.queryKey({
            productTypeId,
          }),
        });
      },
      onError: (error) => {
        toast.error(`Ошибка: ${error.message || "Не удалось изменить статус атрибута"}`);
      },
    });

  const { mutate: toggleActive, isPending: isToggling } = useMutation(
    toggleActiveMutationOptions,
  );

  // Обработчики для диалогов
  const handleDelete = (attribute: ProductTypeAttribute) => {
    setSelectedAttribute(attribute);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedAttribute) {
      deleteAttribute({ id: selectedAttribute.id });
    }
  };

  // Обработчик переключения активности
  const handleToggleActive = (attribute: ProductTypeAttribute) => {
    toggleActive({
      id: attribute.id,
      isActive: !attribute.isActive,
    });
  };

  // Функция для отображения типа атрибута на русском
  const getAttributeTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      text: "Текст",
      number: "Число",
      boolean: "Да/Нет",
      select: "Выбор",
      multiselect: "Множественный выбор",
    };
    return types[type] || type;
  };

  // Функция для обработки сортировки
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Фильтрация и сортировка данных
  const filteredAndSortedData = useMemo(() => {
    if (!data?.items) return [];

    const filtered = data.items.filter((attribute) => {
      const matchesSearch =
        attribute.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        attribute.slug.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === "all" || attribute.type === typeFilter;
      const matchesActive =
        activeFilter === "all" ||
        (activeFilter === "active" && attribute.isActive) ||
        (activeFilter === "inactive" && !attribute.isActive);

      return matchesSearch && matchesType && matchesActive;
    });

    // Сортировка
    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      // Специальная обработка для boolean значений
      if (typeof aValue === "boolean") {
        aValue = aValue ? 1 : 0;
        bValue = bValue ? 1 : 0;
      }

      // Специальная обработка для строк
      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [data?.items, searchQuery, typeFilter, activeFilter, sortField, sortDirection]);

  // Компонент для заголовка с сортировкой
  const SortableHeader = ({
    field,
    children,
  }: {
    field: SortField;
    children: React.ReactNode;
  }) => (
    <Button
      variant="ghost"
      onClick={() => handleSort(field)}
      className="h-auto p-0 font-medium hover:bg-transparent"
    >
      {children}
      {sortField === field ? (
        sortDirection === "asc" ? (
          <ArrowUp className="ml-1 h-4 w-4" />
        ) : (
          <ArrowDown className="ml-1 h-4 w-4" />
        )
      ) : (
        <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />
      )}
    </Button>
  );

  if (isPending)
    return <div className="py-10 text-center">Загрузка атрибутов...</div>;

  if (error)
    return (
      <div className="py-10 text-center text-red-500">
        Ошибка: {error.message || "Не удалось загрузить атрибуты"}
      </div>
    );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Атрибуты типа продукта</h2>
        <Button asChild>
          <Link href={`/product-types/${productTypeId}/attributes/new`}>
            Добавить атрибут
          </Link>
        </Button>
      </div>

      {/* Фильтры и поиск */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск по названию или slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Фильтр по типу" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все типы</SelectItem>
            <SelectItem value="text">Текст</SelectItem>
            <SelectItem value="number">Число</SelectItem>
            <SelectItem value="boolean">Да/Нет</SelectItem>
            <SelectItem value="select">Выбор</SelectItem>
            <SelectItem value="multiselect">Множественный выбор</SelectItem>
          </SelectContent>
        </Select>
        <Select value={activeFilter} onValueChange={setActiveFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Фильтр по активности" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все статусы</SelectItem>
            <SelectItem value="active">Активные</SelectItem>
            <SelectItem value="inactive">Неактивные</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredAndSortedData.length > 0 ? (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <SortableHeader field="name">Название</SortableHeader>
                </TableHead>
                <TableHead>
                  <SortableHeader field="type">Тип</SortableHeader>
                </TableHead>
                <TableHead>
                  <SortableHeader field="isRequired">
                    Обязательный
                  </SortableHeader>
                </TableHead>
                <TableHead>
                  <SortableHeader field="isFilterable">
                    Фильтруемый
                  </SortableHeader>
                </TableHead>
                <TableHead>
                  <SortableHeader field="isActive">Активность</SortableHeader>
                </TableHead>
                <TableHead>
                  <SortableHeader field="sortOrder">Порядок</SortableHeader>
                </TableHead>
                <TableHead>Опции</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedData.map((attribute) => (
                <TableRow key={attribute.id}>
                  <TableCell className="font-medium">
                    <Button
                      variant="link"
                      className="h-auto p-0 font-medium text-left hover:underline"
                      asChild
                    >
                      <Link href={`/product-types/${productTypeId}/attributes/${attribute.id}/edit`}>
                        <div>
                          <div>{attribute.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {attribute.slug}
                          </div>
                        </div>
                      </Link>
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getAttributeTypeLabel(attribute.type)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {attribute.isRequired ? (
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        Да
                      </Badge>
                    ) : (
                      <Badge variant="outline">Нет</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {attribute.isFilterable ? (
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                        Да
                      </Badge>
                    ) : (
                      <Badge variant="outline">Нет</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={attribute.isActive}
                        onCheckedChange={() => handleToggleActive(attribute)}
                        disabled={isToggling}
                        size="sm"
                      />
                      <span className="text-sm text-muted-foreground">
                        {attribute.isActive ? "Активен" : "Неактивен"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {attribute.sortOrder}
                    </span>
                  </TableCell>
                  <TableCell>
                    {attribute.options && attribute.options.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {attribute.options.slice(0, 3).map((option, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {option}
                          </Badge>
                        ))}
                        {attribute.options.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{attribute.options.length - 3}
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Открыть меню</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/product-types/${productTypeId}/attributes/${attribute.id}/edit`}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Редактировать
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(attribute)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Удалить
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="py-10 text-center text-muted-foreground">
          {searchQuery || typeFilter !== "all" || activeFilter !== "all" ? (
            <div>
              <p>Атрибуты не найдены по заданным критериям</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setTypeFilter("all");
                  setActiveFilter("all");
                }}
                className="mt-2"
              >
                Сбросить фильтры
              </Button>
            </div>
          ) : (
            <div>
              <p>
                Атрибуты не найдены. Создайте первый атрибут, нажав кнопку
                "Добавить атрибут".
              </p>
              <Button asChild className="mt-2">
                <Link href={`/product-types/${productTypeId}/attributes/new`}>
                  Добавить первый атрибут
                </Link>
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Диалог подтверждения удаления */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Подтверждение удаления</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить атрибут "{selectedAttribute?.name}
              "? Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Удаление..." : "Удалить"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
