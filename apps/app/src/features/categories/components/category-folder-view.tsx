"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@qco/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@qco/ui/components/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@qco/ui/components/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@qco/ui/components/form";
import { Input } from "@qco/ui/components/input";
import { Skeleton } from "@qco/ui/components/skeleton";
import { Textarea } from "@qco/ui/components/textarea";
import { useToast } from "@qco/ui/hooks/use-toast";
import { cn } from "@qco/ui/lib/utils";
import slugify from "@sindresorhus/slugify";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  CheckCircle,
  ChevronRight,
  Edit,
  Folder,
  Loader2,
  MoreHorizontal,
  Plus,
  Trash2,
  Wand2,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { paths } from "~/routes/paths";
import { useTRPC } from "~/trpc/react";
import { useSlugValidation } from "../hooks/use-slug-validation";
import type { CategoryFolderItem } from "../types";
import { createCategorySchema } from "@qco/validators";

type CreateCategoryForm = z.infer<typeof createCategorySchema>;

// TODO: Использовать тип из схемы пропсов представления папок категорий, если появится в @qco/validators
interface CategoryFolderViewProps {
  isLoading?: boolean;
  onDelete?: (category: CategoryFolderItem) => void;
  onDataUpdate?: () => void;
}

// TODO: Использовать тип из схемы данных элемента хлебных крошек, если появится в @qco/validators
interface BreadcrumbItem {
  id: string;
  name: string;
}

export function CategoryFolderView({
  isLoading = false,
  onDelete,
  onDataUpdate,
}: CategoryFolderViewProps) {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [currentPath, setCurrentPath] = useState<BreadcrumbItem[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(),
  );
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [contextMenuCategory, setContextMenuCategory] =
    useState<CategoryFolderItem | null>(null);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFolderItem | null>(null);

  // Форма создания категории
  const form = useForm<CreateCategoryForm>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
      slug: "",
      description: null,
      isActive: true,
      isFeatured: false,
      xmlId: "",
      sortOrder: 0,
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
      parentId: null,
      imageId: null,
    },
  });

  // Следим за изменением названия и слага
  const nameValue = form.watch("name");
  const slugValue = form.watch("slug");

  // Валидация уникальности слага
  const slugValidation = useSlugValidation({
    slug: slugValue || "",
    enabled: !!slugValue && slugValue.length >= 2,
  });

  // Мутация для генерации уникального слага
  const generateUniqueSlugMutationOptions =
    trpc.categories.generateUniqueSlug.mutationOptions({
      onSuccess: (data) => {
        if (data.slug) {
          form.setValue("slug", data.slug, {
            shouldDirty: true,
            shouldValidate: true,
          });
          toast({
            title: "Уникальный URL сгенерирован",
            description: `URL "${data.slug}" создан автоматически`,
            variant: "success",
          });
        }
      },
      onError: (error) => {
        console.error("Error generating unique slug:", error);
        toast({
          title: "Ошибка",
          description: "Не удалось сгенерировать уникальный URL",
          variant: "destructive",
        });
      },
      onSettled: () => {
        setIsGeneratingUnique(false);
      },
    });

  const { mutate: generateUniqueSlug } = useMutation(
    generateUniqueSlugMutationOptions,
  );

  const [isGeneratingUnique, setIsGeneratingUnique] = useState(false);

  // Генерация слага при потере фокуса поля названия
  const handleNameBlur = () => {
    if (
      nameValue &&
      nameValue.length >= 2 &&
      (!slugValue || slugValue.trim() === "")
    ) {
      const generatedSlug = slugify(nameValue, {
        lowercase: true,
      });
      form.setValue("slug", generatedSlug, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  };

  // Функция для ручной генерации слага
  const generateSlug = () => {
    const currentName = form.getValues("name");
    if (currentName && currentName.length >= 2) {
      const slug = slugify(currentName, {
        lowercase: true,
      });
      form.setValue("slug", slug, {
        shouldDirty: true,
        shouldValidate: true,
      });
      toast({
        title: "URL сгенерирован",
        description: `URL "${slug}" создан из названия категории`,
        variant: "success",
      });
    } else {
      toast({
        title: "Ошибка",
        description: "Сначала введите название категории (минимум 2 символа)",
        variant: "destructive",
      });
    }
  };

  // Функция для генерации уникального слага
  const handleGenerateUniqueSlug = () => {
    if (slugValue && slugValue.length >= 2) {
      setIsGeneratingUnique(true);
      generateUniqueSlug({ baseSlug: slugValue });
    }
  };

  // Мутация для создания категории
  const createCategoryMutation = useMutation(
    trpc.categories.create.mutationOptions({
      onSuccess: () => {
        // Инвалидируем кэш для обновления дерева
        queryClient.invalidateQueries({
          queryKey: trpc.categories.tree.queryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.categories.list.queryKey(),
        });
        // Инвалидируем кэш папочного представления
        queryClient.invalidateQueries({
          queryKey: trpc.categories.getFolderView.queryKey(),
        });
        // Инвалидируем кэш подкатегорий
        queryClient.invalidateQueries({
          queryKey: trpc.categories.getChildren.queryKey(),
        });

        // Уведомляем родительский компонент об обновлении данных
        onDataUpdate?.();

        toast({
          title: "Категория создана",
          description: "Новая категория успешно создана",
          variant: "success",
        });

        setCreateDialogOpen(false);
        form.reset();
      },
      onError: (error) => {
        toast({
          title: "Ошибка",
          description: error.message || "Не удалось создать категорию",
          variant: "destructive",
        });
      },
    }),
  );

  // Получаем ID родительской категории
  const getParentCategoryId = (): string | null => {
    if (currentPath.length === 0) {
      return null; // Корневая категория
    }
    const lastItem = currentPath[currentPath.length - 1];
    return lastItem?.id || null;
  };

  // Обработчик создания категории
  const handleCreateCategory = (data: CreateCategoryForm) => {
    const parentId = getParentCategoryId();

    // Если slug не указан, генерируем его из названия
    if (!data.slug) {
      data.slug = slugify(data.name, { lowercase: true });
    }

    createCategoryMutation.mutate({
      name: data.name,
      slug: data.slug,
      description: data.description,
      isActive: data.isActive,
      isFeatured: data.isFeatured,
      parentId: parentId,
      xmlId: data.xmlId || undefined,
      sortOrder: data.sortOrder,
      metaTitle: data.metaTitle || undefined,
      metaDescription: data.metaDescription || undefined,
      metaKeywords: data.metaKeywords || undefined,
      imageId: data.imageId,
      image: data.image,
    });
  };

  // Запрос для получения подкатегорий текущей папки
  const currentFolderId =
    currentPath.length > 0 ? currentPath[currentPath.length - 1]?.id : null;
  const folderViewQueryOptions = trpc.categories.getFolderView.queryOptions({
    parentId: currentFolderId,
  });
  const { data: folderData, isLoading: isFolderLoading } = useQuery({
    ...folderViewQueryOptions,
    enabled: true, // Всегда включен, так как null parentId означает корневые категории
  });

  // Получаем актуальные категории для отображения
  const getCurrentCategories = (): CategoryFolderItem[] => {
    return folderData || [];
  };

  // Удаление категории
  const handleDeleteCategory = useCallback((category: CategoryFolderItem) => {
    onDelete?.(category);
  }, [onDelete]);

  // Редактирование категории
  const handleEditCategory = useCallback((category: CategoryFolderItem) => {
    router.push(paths.categories.edit(category.id));
  }, [router]);
  // Навигация в папку
  const navigateToFolder = useCallback(
    (category: CategoryFolderItem) => {
      setCurrentPath([
        ...currentPath,
        { id: category.id, name: category.name },
      ]);
      setExpandedFolders(new Set([...expandedFolders, category.id]));
    },
    [currentPath, expandedFolders],
  );

  // Обработчики горячих клавиш
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!selectedCategory) return;

      switch (e.key) {
        case "Enter":
          e.preventDefault();
          navigateToFolder(selectedCategory);
          break;
        case "F2":
          e.preventDefault();
          handleEditCategory(selectedCategory);
          break;
        case "Delete":
          e.preventDefault();
          handleDeleteCategory(selectedCategory);
          break;
        case "Escape":
          e.preventDefault();
          setSelectedCategory(null);
          break;
      }
    },
    [
      selectedCategory,
      handleDeleteCategory,
      handleEditCategory,
      navigateToFolder,
    ],
  );

  // Подключаем обработчики горячих клавиш
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  // Рекурсивный поиск категории по ID (оставляем для совместимости)
  const _findCategoryById = (
    cats: CategoryFolderItem[],
    id: string,
  ): CategoryFolderItem | null => {
    for (const cat of cats) {
      if (cat.id === id) return cat;
      if (cat.children.length > 0) {
        const found = _findCategoryById(cat.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  // Удаляем функцию buildCategoryTree, так как теперь сервер возвращает готовые данные

  // Навигация назад
  const navigateBack = () => {
    if (currentPath.length > 0) {
      const newPath = currentPath.slice(0, -1);
      setCurrentPath(newPath);
    }
  };

  // Навигация к корню
  const navigateToRoot = () => {
    setCurrentPath([]);
  };

  // Переключение состояния папки
  const toggleFolder = (categoryId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedFolders(newExpanded);
  };

  // Обработка клика по категории
  const handleCategoryClick = (category: CategoryFolderItem) => {
    // Всегда переходим в папку при клике
    navigateToFolder(category);
  };

  // Открытие контекстного меню
  const handleContextMenu = (category: CategoryFolderItem) => {
    setContextMenuCategory(category);
  };

  // Создание подпапки
  const handleCreateSubfolder = () => {
    setCreateDialogOpen(true);
    setContextMenuCategory(null);
  };

  const currentCategories = getCurrentCategories();

  if (isLoading || isFolderLoading) {
    return <CategoryFolderSkeleton />;
  }

  return (
    <div className="space-y-4">
      {/* Хлебные крошки */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Button
          variant="ghost"
          size="sm"
          onClick={navigateToRoot}
          className="h-6 px-2"
        >
          <Folder className="h-4 w-4 mr-1" />
          Корень
        </Button>
        {currentPath.map((item, index) => (
          <div key={item.id} className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPath(currentPath.slice(0, index + 1))}
              className="h-6 px-2"
            >
              {item.name}
            </Button>
          </div>
        ))}
      </div>

      {/* Панель инструментов */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {currentPath.length > 0 && (
            <Button variant="outline" size="sm" onClick={navigateBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад
            </Button>
          )}

          {selectedCategory && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEditCategory(selectedCategory)}
                className="text-blue-600 hover:text-blue-800"
              >
                <Edit className="h-4 w-4 mr-2" />
                Редактировать (F2)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeleteCategory(selectedCategory)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Удалить (Del)
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleCreateSubfolder}>
            <Plus className="h-4 w-4 mr-2" />
            Создать подпапку
          </Button>
        </div>
      </div>

      {/* Список категорий */}
      <div className="space-y-1">
        {currentCategories.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Folder className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Папка пуста</p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCreateSubfolder}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Создать подпапку
            </Button>
          </div>
        ) : (
          currentCategories.map((category) => (
            <CategoryFolderItemComponent
              key={category.id}
              category={category}
              isExpanded={expandedFolders.has(category.id)}
              isSelected={selectedCategory?.id === category.id}
              onToggle={() => toggleFolder(category.id)}
              onClick={() => handleCategoryClick(category)}
              onSelect={() => setSelectedCategory(category)}
              onContextMenu={() => handleContextMenu(category)}
              onEdit={() => handleEditCategory(category)}
              onDelete={() => handleDeleteCategory(category)}
            />
          ))
        )}
      </div>

      {/* Подсказки о горячих клавишах */}
      <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded border">
        <div className="flex items-center gap-4 flex-wrap">
          <span>💡 Подсказки:</span>
          <span>Двойной клик - открыть папку</span>
          <span>F2 - редактировать</span>
          <span>Del - удалить</span>
          <span>Enter - открыть выбранную папку</span>
          <span>Esc - снять выделение</span>
        </div>
      </div>

      {/* Контекстное меню */}
      {contextMenuCategory && (
        <DropdownMenu
          open={!!contextMenuCategory}
          onOpenChange={() => setContextMenuCategory(null)}
        >
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={() => handleEditCategory(contextMenuCategory)}
              className="cursor-pointer"
            >
              <Edit className="h-4 w-4 mr-2" />
              Редактировать
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                // Переходим в папку
                navigateToFolder(contextMenuCategory);
                setContextMenuCategory(null);
              }}
              className="cursor-pointer"
            >
              <Folder className="h-4 w-4 mr-2" />
              Открыть папку
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleCreateSubfolder}
              className="cursor-pointer"
            >
              <Plus className="h-4 w-4 mr-2" />
              Создать подпапку
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                // Переключаем статус активности
                // TODO: Добавить мутацию для изменения статуса
                toast({
                  title: "Функция в разработке",
                  description:
                    "Изменение статуса будет добавлено в следующей версии",
                });
                setContextMenuCategory(null);
              }}
              className="cursor-pointer"
            >
              {contextMenuCategory.isActive ? (
                <>
                  <XCircle className="h-4 w-4 mr-2" />
                  Деактивировать
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Активировать
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleDeleteCategory(contextMenuCategory)}
              className="text-destructive cursor-pointer focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Удалить
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Модальное окно создания категории */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Создать подпапку</DialogTitle>
            <DialogDescription>
              Создайте новую категорию в текущей папке
              {currentPath.length > 0 && (
                <span className="block text-sm text-muted-foreground mt-1">
                  Родительская папка:{" "}
                  {currentPath[currentPath.length - 1]?.name}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleCreateCategory)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Название</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Введите название категории"
                        {...field}
                        onBlur={(e) => {
                          field.onBlur(e);
                          handleNameBlur();
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL-адрес (слаг)</FormLabel>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <FormControl>
                          <Input
                            placeholder="url-kategorii"
                            {...field}
                            className={`h-10 pr-10 ${slugValidation.isAvailable === false ? "border-destructive" : slugValidation.isAvailable === true ? "border-green-500" : ""}`}
                          />
                        </FormControl>
                        {/* Индикатор статуса валидации */}
                        {slugValue && slugValue.length >= 2 && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            {slugValidation.isChecking ? (
                              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            ) : slugValidation.isAvailable === true ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : slugValidation.isAvailable === false ? (
                              <XCircle className="h-4 w-4 text-destructive" />
                            ) : null}
                          </div>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={generateSlug}
                        disabled={!nameValue}
                        className="h-10 w-10"
                      >
                        <Wand2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Уникальный URL-адрес для страницы категории. Генерируется
                      автоматически при потере фокуса поля названия или нажмите
                      кнопку для ручной генерации.
                    </p>
                    {/* Показываем ошибку дублирования слага */}
                    {slugValidation.isAvailable === false &&
                      slugValidation.existingCategory && (
                        <div className="space-y-2">
                          <p className="text-sm text-destructive">
                            URL уже используется категорией "
                            {slugValidation.existingCategory.name}"
                          </p>
                          <button
                            type="button"
                            onClick={handleGenerateUniqueSlug}
                            disabled={isGeneratingUnique}
                            className="text-sm text-blue-600 hover:text-blue-800 underline disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isGeneratingUnique ? (
                              <>
                                <Loader2 className="inline h-3 w-3 animate-spin mr-1" />
                                Генерируем уникальный URL...
                              </>
                            ) : (
                              "Сгенерировать уникальный URL"
                            )}
                          </button>
                        </div>
                      )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Описание</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Введите описание (необязательно)"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCreateDialogOpen(false)}
                >
                  Отмена
                </Button>
                <Button
                  type="submit"
                  disabled={createCategoryMutation.isPending}
                >
                  {createCategoryMutation.isPending ? "Создание..." : "Создать"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// TODO: Использовать тип из схемы пропсов элемента папки категории, если появится в @qco/validators
interface CategoryFolderItemProps {
  category: CategoryFolderItem;
  isExpanded: boolean;
  isSelected: boolean;
  onToggle: () => void;
  onClick: () => void;
  onSelect: () => void;
  onContextMenu: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function CategoryFolderItemComponent({
  category,
  isExpanded,
  isSelected,
  onToggle,
  onClick,
  onSelect,
  onContextMenu,
  onEdit,
  onDelete,
}: CategoryFolderItemProps) {
  const hasChildren = (category.childrenCount ?? 0) > 0;
  const isFolder = hasChildren;

  // Клик по элементу: выделяем и переходим в папку при двойном клике
  const handleItemClick = () => {
    onSelect(); // выделить элемент
  };

  const handleDoubleClick = () => {
    onClick(); // перейти внутрь папки
  };

  return (
    <div
      className={cn(
        "group cursor-pointer transition-all duration-200 hover:bg-accent flex items-center py-2 px-3 rounded-md w-full text-left relative",
        !category.isActive && "opacity-60",
        isSelected &&
        "bg-blue-50 border border-blue-200 ring-1 ring-blue-300 shadow-sm",
      )}
      onClick={handleItemClick}
      onDoubleClick={handleDoubleClick}
      onContextMenu={(e) => {
        e.preventDefault();
        onSelect(); // выделить при правом клике
        onContextMenu();
      }}
      role="button"
      tabIndex={0}
      // biome-ignore lint/a11y/useSemanticElements: Кастомный интерактивный элемент
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleItemClick();
        }
      }}
    >
      {/* Индикатор выделения */}
      {isSelected && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-md" />
      )}
      {/* Иконка */}
      <div className="flex items-center w-8 mr-3">
        {isFolder ? (
          <div
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            className="bg-transparent border-none outline-none cursor-pointer"
            tabIndex={-1}
            role="button"
            aria-label={isExpanded ? "Свернуть папку" : "Развернуть папку"}
            // biome-ignore lint/a11y/useSemanticElements: Кастомный интерактивный элемент
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                e.stopPropagation();
                onToggle();
              }
            }}
          >
            {/* Жёлтая папка (открытая/закрытая) */}
            {isExpanded ? (
              <svg
                width="20"
                height="16"
                viewBox="0 0 48 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="2"
                  y="12"
                  width="44"
                  height="24"
                  rx="3"
                  fill="#FFE082"
                  stroke="#FFB300"
                  strokeWidth="2"
                />
                <rect
                  x="2"
                  y="8"
                  width="18"
                  height="8"
                  rx="2"
                  fill="#FFD54F"
                  stroke="#FFB300"
                  strokeWidth="2"
                />
              </svg>
            ) : (
              <svg
                width="20"
                height="16"
                viewBox="0 0 48 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="2"
                  y="14"
                  width="44"
                  height="20"
                  rx="3"
                  fill="#FFE082"
                  stroke="#FFB300"
                  strokeWidth="2"
                />
                <rect
                  x="2"
                  y="8"
                  width="18"
                  height="10"
                  rx="2"
                  fill="#FFD54F"
                  stroke="#FFB300"
                  strokeWidth="2"
                />
              </svg>
            )}
          </div>
        ) : (
          // "Файл" — синий прямоугольник
          <svg
            width="16"
            height="16"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="6"
              y="8"
              width="28"
              height="24"
              rx="3"
              fill="#90CAF9"
              stroke="#1976D2"
              strokeWidth="2"
            />
            <rect
              x="10"
              y="12"
              width="20"
              height="4"
              rx="1"
              fill="#1976D2"
              opacity="0.3"
            />
            <rect
              x="10"
              y="18"
              width="16"
              height="2"
              rx="1"
              fill="#1976D2"
              opacity="0.2"
            />
            <rect
              x="10"
              y="22"
              width="12"
              height="2"
              rx="1"
              fill="#1976D2"
              opacity="0.2"
            />
          </svg>
        )}
      </div>

      {/* Название и описание */}
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm truncate">{category.name}</div>
        {category.description && (
          <div className="text-xs text-muted-foreground truncate">
            {category.description}
          </div>
        )}
        {hasChildren && (
          <div className="text-xs text-muted-foreground">
            {category.childrenCount} подкатегорий
          </div>
        )}
      </div>

      {/* Статус */}
      <div className="flex items-center gap-2 mr-3">
        <div
          className={cn(
            "w-2 h-2 rounded-full",
            category.isActive ? "bg-green-500" : "bg-gray-400",
          )}
        />
        <span className="text-xs text-muted-foreground">
          {category.isActive ? "Active" : "Inactive"}
        </span>
      </div>

      {/* Действия */}
      <div
        className={cn(
          "transition-all duration-200 flex items-center gap-1",
          isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100",
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          title="Редактировать категорию"
        >
          <Edit className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-red-600 hover:text-red-800 hover:bg-red-50"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          title="Удалить категорию"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={(e) => {
            e.stopPropagation();
            onContextMenu();
          }}
          title="Дополнительные действия"
        >
          <MoreHorizontal className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

// Константный массив для skeleton элементов
const SKELETON_ITEMS = Array.from(
  { length: 8 },
  (_, i) => `skeleton-item-${i}`,
);

function CategoryFolderSkeleton() {
  return (
    <div className="space-y-4">
      {/* Skeleton для хлебных крошек */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-6 w-20" />
      </div>

      {/* Skeleton для панели инструментов */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-32" />
      </div>

      {/* Skeleton для списка */}
      <div className="space-y-1">
        {SKELETON_ITEMS.map((key) => (
          <div key={key} className="flex items-center py-2 px-3 space-x-3">
            <Skeleton className="h-4 w-4" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-6 w-6" />
          </div>
        ))}
      </div>
    </div>
  );
}
