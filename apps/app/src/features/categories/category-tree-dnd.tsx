"use client";

import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
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
import { Button } from "@qco/ui/components/button";
import { useToast } from "@qco/ui/hooks/use-toast";
import { cn } from "@qco/ui/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ChevronRight,
  Folder,
  FolderOpen,
  GripVertical,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { useTRPC } from "~/trpc/react";

// TODO: Использовать тип из схемы данных дерева категорий, если появится в @qco/validators
export interface CategoryTreeItem {
  id: string;
  name: string;
  parentCategoryId: string | null;
  order: number;
  children: CategoryTreeItem[];
  isActive: boolean;
  isFeatured: boolean;
  imageUrl?: string | null;
  [key: string]: unknown;
}

// TODO: Использовать тип из схемы данных плоской категории, если появится в @qco/validators
interface FlattenedCategory {
  id: string;
  name: string;
  parentId: string | null;
  order: number;
  depth: number;
  isActive: boolean;
  isFeatured: boolean;
  imageUrl?: string | null;
  isExpanded?: boolean;
  hasChildren?: boolean;
}

// TODO: Использовать тип из схемы пропсов дерева категорий с drag-n-drop, если появится в @qco/validators
interface CategoryTreeDndProps {
  categories: CategoryTreeItem[];
  onCategorySelect?: (category: CategoryTreeItem) => void;
  selectedCategoryId?: string;
}

export function CategoryTreeDnd({
  categories,
  onCategorySelect,
  selectedCategoryId,
}: CategoryTreeDndProps) {
  const [flattenedCategories, setFlattenedCategories] = useState<
    FlattenedCategory[]
  >([]);
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Создаем опции мутации для удаления категории
  const deleteCategoryMutationOptions = trpc.categories.delete.mutationOptions({
    onSuccess: () => {
      // Инвалидируем кеш запросов категорий
      void queryClient.invalidateQueries({
        queryKey: trpc.categories.tree.queryKey(),
      });
      void queryClient.invalidateQueries({
        queryKey: trpc.categories.list.queryKey(),
      });

      toast({
        title: "Категория удалена",
        variant: "default",
      });
    },
    onError: (error) => {
      console.error("Ошибка при удалении категории:", error);
      toast({
        title: "Ошибка при удалении категории",
        description: error.message || "Не удалось удалить категорию",
        variant: "destructive",
      });
    },
  });

  // Используем опции с хуком useMutation для удаления
  const { mutate: deleteCategory, isPending: isDeleting } = useMutation(
    deleteCategoryMutationOptions,
  );

  // Создаем опции мутации с помощью mutationOptions для обновления порядка
  const updateOrderMutationOptions =
    trpc.categories.updateOrder.mutationOptions({
      onSuccess: () => {
        // Инвалидируем кеш запросов категорий
        void queryClient.invalidateQueries({
          queryKey: trpc.categories.tree.queryKey(),
        });
        void queryClient.invalidateQueries({
          queryKey: trpc.categories.list.queryKey(),
        });

        toast({
          title: "Порядок категорий обновлен",
          variant: "default",
        });
      },
      onError: (error) => {
        console.error("Ошибка при обновлении порядка категорий:", error);
        toast({
          title: "Ошибка при обновлении порядка категорий",
          variant: "destructive",
        });
      },
    });

  // Используем опции с хуком useMutation
  const { mutate: updateOrder } = useMutation(updateOrderMutationOptions);

  // Состояние для диалога подтверждения удаления
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  // Функция для обработки подтверждения удаления
  const handleDeleteConfirm = () => {
    if (categoryToDelete) {
      deleteCategory({ id: categoryToDelete });
      setCategoryToDelete(null);
    }
  };

  // Функция для отмены удаления
  const handleDeleteCancel = () => {
    setCategoryToDelete(null);
  };

  // Датчики для drag-and-drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Функция для преобразования дерева категорий в плоский список
  const flattenCategories = useCallback(
    (
      categories: CategoryTreeItem[],
      depth = 0,
      parentId: string | null = null,
    ): FlattenedCategory[] => {
      let result: FlattenedCategory[] = [];

      categories.forEach((category, index) => {
        const isExpanded = expandedCategories[category.id] ?? true; // По умолчанию развернуто
        const hasChildren = category.children && category.children.length > 0;

        result.push({
          id: category.id,
          name: category.name,
          parentId,
          order: index,
          depth,
          isActive: category.isActive,
          isFeatured: category.isFeatured,
          imageUrl: category.imageUrl,
          isExpanded,
          hasChildren,
        });

        // Если категория развернута и имеет дочерние элементы, добавляем их
        if (isExpanded && hasChildren) {
          result = result.concat(
            flattenCategories(category.children, depth + 1, category.id),
          );
        }
      });

      return result;
    },
    [expandedCategories],
  );

  // Обновляем плоский список при изменении категорий или состояния развернутости
  useEffect(() => {
    setFlattenedCategories(flattenCategories(categories));
  }, [categories, flattenCategories]);

  // Обработчик переключения состояния развернутости категории
  const toggleExpand = (categoryId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !(prev[categoryId] ?? true), // Инвертируем текущее состояние
    }));
  };

  // Находим активный элемент для отображения при перетаскивании
  const activeCategory = flattenedCategories.find((c) => c.id === activeId);

  // Обработчик начала перетаскивания
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    setIsDragging(true);
  };

  // Обработчик завершения перетаскивания
  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    setIsDragging(false);

    const { active, over } = event;
    if (!over || active.id === over.id) return;

    // Находим перетаскиваемую категорию и категорию, над которой она была отпущена
    const activeCategory = flattenedCategories.find((c) => c.id === active.id);
    const overCategory = flattenedCategories.find((c) => c.id === over.id);

    if (!activeCategory || !overCategory) return;

    // Определяем новый parentId и order для перетаскиваемой категории
    const newParentId = overCategory.parentId;

    // Создаем обновленный список категорий с новыми порядковыми номерами
    const updatedCategories = flattenedCategories
      .filter((c) => c.parentId === newParentId)
      .map((c, index) => ({
        id: c.id,
        parentId: c.parentId,
        order: index,
      }));

    // Находим индекс активной категории и категории, над которой она была отпущена
    const activeIndex = updatedCategories.findIndex((c) => c.id === active.id);
    const overIndex = updatedCategories.findIndex((c) => c.id === over.id);

    // Если индексы найдены, меняем порядок
    if (activeIndex !== -1 && overIndex !== -1) {
      // Удаляем активную категорию из списка
      const [movedCategory] = updatedCategories.splice(activeIndex, 1);
      // Вставляем ее на новую позицию
      updatedCategories.splice(overIndex, 0, movedCategory);

      // Обновляем порядковые номера
      const finalCategories = updatedCategories.map((c, index) => ({
        id: c.id,
        parentId: newParentId,
        order: index,
      }));

      // Отправляем обновленные данные на сервер
      Promise.all(
        finalCategories.map((cat) =>
          updateOrder({
            categoryId: cat.id,
            newOrder: cat.order,
          })
        )
      ).catch((err) => {
        console.error("Ошибка при обновлении порядка категорий:", err);
      });
    }
  };

  return (
    <div className="space-y-1">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext
          items={flattenedCategories.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {flattenedCategories.map((category) => (
            <SortableCategoryItem
              key={category.id}
              category={category}
              onToggleExpand={toggleExpand}
              onSelect={
                onCategorySelect
                  ? () => {
                    const originalCategory = findCategoryById(
                      categories,
                      category.id,
                    );
                    if (originalCategory) {
                      onCategorySelect(originalCategory);
                    }
                  }
                  : undefined
              }
              onDelete={() => setCategoryToDelete(category.id)}
              isSelected={category.id === selectedCategoryId}
              isDragging={isDragging}
              isDeleting={isDeleting && categoryToDelete === category.id}
            />
          ))}
        </SortableContext>

        <DragOverlay>
          {activeId && activeCategory ? (
            <div
              className={cn(
                "bg-primary/5 border-primary/20 flex items-center rounded-md border px-2 py-1",
                "transition-colors",
              )}
            >
              <div style={{ width: `${activeCategory.depth * 16}px` }} />
              <div className="w-7" />
              {activeCategory.hasChildren ? (
                <Folder className="text-muted-foreground mr-2 h-4 w-4" />
              ) : (
                <div className="w-6" />
              )}
              <span className="flex-1 text-left text-sm">
                {activeCategory.name}
              </span>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Диалог подтверждения удаления */}
      <AlertDialog
        open={!!categoryToDelete}
        onOpenChange={(open) => !open && setCategoryToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить категорию?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Категория будет удалена вместе со
              всеми связанными данными.
              {categoryToDelete &&
                findCategoryById(categories, categoryToDelete)?.children
                  ?.length > 0 && (
                  <strong className="text-destructive mt-2 block">
                    Внимание! Эта категория содержит подкатегории, которые также
                    будут удалены.
                  </strong>
                )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={handleDeleteCancel}
              disabled={isDeleting}
            >
              Отмена
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90 text-white"
            >
              {isDeleting ? "Удаление..." : "Удалить"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Компонент элемента категории с поддержкой сортировки
function SortableCategoryItem({
  category,
  onToggleExpand,
  onSelect,
  onDelete,
  isSelected,
  isDragging,
  isDeleting,
}: {
  category: FlattenedCategory;
  onToggleExpand: (id: string) => void;
  onSelect?: () => void;
  onDelete: () => void;
  isSelected: boolean;
  isDragging: boolean;
  isDeleting?: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isItemDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
    opacity: isItemDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "mb-1 flex items-center rounded-md px-2 py-1",
        isSelected ? "bg-primary/10" : "hover:bg-muted",
        "transition-colors",
        isItemDragging ? "z-10" : "",
      )}
      {...attributes}
    >
      <div style={{ width: `${category.depth * 16}px` }} />

      {category.hasChildren ? (
        <Button
          variant="ghost"
          size="icon"
          className="mr-1 h-6 w-6"
          onClick={() => onToggleExpand(category.id)}
        >
          <ChevronRight
            className={`h-4 w-4 transition-transform ${category.isExpanded ? "rotate-90" : ""
              }`}
          />
        </Button>
      ) : (
        <div className="w-7" />
      )}

      {category.hasChildren ? (
        category.isExpanded ? (
          <FolderOpen className="text-muted-foreground mr-2 h-4 w-4" />
        ) : (
          <Folder className="text-muted-foreground mr-2 h-4 w-4" />
        )
      ) : (
        <div className="w-6" />
      )}

      <div className="group flex flex-1 items-center">
        <div
          {...listeners}
          className={cn(
            "text-muted-foreground/50 hover:text-muted-foreground mr-2 cursor-grab",
            isDragging ? "cursor-grabbing" : "",
            "opacity-0 transition-opacity group-hover:opacity-100",
          )}
        >
          <GripVertical className="h-4 w-4" />
        </div>

        <button
          className={cn(
            "flex-1 text-left text-sm",
            isSelected ? "font-medium" : "font-normal",
            !category.isActive ? "text-muted-foreground" : "",
          )}
          onClick={onSelect}
          type="button"
        >
          {category.name}
          {category.isFeatured && (
            <span className="text-primary ml-2 text-xs">★</span>
          )}
        </button>

        {/* Кнопка удаления */}
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground/50 hover:text-destructive ml-2 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          disabled={isDeleting}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// Вспомогательная функция для поиска категории по ID в дереве
function findCategoryById(
  categories: CategoryTreeItem[],
  id: string,
): CategoryTreeItem | null {
  for (const category of categories) {
    if (category.id === id) {
      return category;
    }
    if (category.children && category.children.length > 0) {
      const found = findCategoryById(category.children, id);
      if (found) {
        return found;
      }
    }
  }
  return null;
}
