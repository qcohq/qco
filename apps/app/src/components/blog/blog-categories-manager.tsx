"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription } from "@qco/ui/components/alert";
import { Badge } from "@qco/ui/components/badge";
import { Button } from "@qco/ui/components/button";
import { Card, CardContent, CardHeader } from "@qco/ui/components/card";
import { Checkbox } from "@qco/ui/components/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@qco/ui/components/dialog";
import { Input } from "@qco/ui/components/input";
import { Label } from "@qco/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@qco/ui/components/select";
import { Skeleton } from "@qco/ui/components/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@qco/ui/components/table";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Edit, Folder, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useTRPC } from "~/trpc/react";

const categorySchema = z.object({
  name: z.string().min(1, "Название категории обязательно"),
  slug: z.string().min(1, "URL категории обязателен"),
  description: z.string().optional(),
  parentId: z.string().optional(),
  isActive: z.boolean(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  isActive: boolean;
}

export function BlogCategoriesManager() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(
    null,
  );
  const trpc = useTRPC();

  const categoriesQuery = useQuery(trpc.blog.getCategories.queryOptions({}));
  const createCategoryMutation = useMutation(
    trpc.blog.createCategory.mutationOptions(),
  );
  const updateCategoryMutation = useMutation(
    trpc.blog.updateCategory.mutationOptions(),
  );
  const deleteCategoryMutation = useMutation(
    trpc.blog.deleteCategory.mutationOptions(),
  );

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      parentId: "",
      isActive: true,
    },
  });

  const handleSubmit = async (data: CategoryFormData) => {
    try {
      if (editingCategory) {
        await updateCategoryMutation.mutateAsync({
          id: editingCategory.id,
          ...data,
        });
        setEditingCategory(null);
      } else {
        await createCategoryMutation.mutateAsync(data);
        setIsCreateDialogOpen(false);
      }
      form.reset();
      categoriesQuery.refetch();
    } catch (error) {
      console.error("Ошибка сохранения категории:", error);
      alert("Ошибка сохранения категории. Попробуйте еще раз.");
    }
  };

  const handleEdit = (category: BlogCategory) => {
    setEditingCategory(category);
    form.reset({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      parentId: category.parentId || "",
      isActive: category.isActive,
    });
  };

  const handleDelete = async (categoryId: string) => {
    if (confirm("Вы уверены, что хотите удалить эту категорию?")) {
      try {
        await deleteCategoryMutation.mutateAsync({ id: categoryId });
        categoriesQuery.refetch();
      } catch (error) {
        console.error("Ошибка удаления категории:", error);
        alert("Ошибка удаления категории. Попробуйте еще раз.");
      }
    }
  };

  const generateSlug = () => {
    const name = form.getValues("name");
    const slug = name
      .toLowerCase()
      .replace(/[^а-яёa-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    form.setValue("slug", slug);
  };

  const handleNameBlur = () => {
    const name = form.getValues("name");
    const currentSlug = form.getValues("slug");

    if (
      name &&
      name.length >= 2 &&
      (!currentSlug || currentSlug.trim() === "")
    ) {
      const slug = name
        .toLowerCase()
        .replace(/[^а-яёa-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      form.setValue("slug", slug);
    }
  };

  if (categoriesQuery.isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/4" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={`blog-category-skeleton-${i}-${Date.now()}`}
              className="flex items-center space-x-4"
            >
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (categoriesQuery.isError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Не удалось загрузить категории. Попробуйте еще раз.
        </AlertDescription>
      </Alert>
    );
  }

  const categories = categoriesQuery.data?.categories || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Категории</h2>
          <p className="text-muted-foreground">
            Управляйте категориями для организации записей
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Добавить категорию
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Создать новую категорию</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="name">Название</Label>
                <Input
                  id="name"
                  placeholder="Введите название категории"
                  {...form.register("name")}
                  onBlur={handleNameBlur}
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="slug"
                    placeholder="url-kategorii"
                    {...form.register("slug")}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={generateSlug}
                  >
                    Сгенерировать
                  </Button>
                </div>
                {form.formState.errors.slug && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.slug.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Описание</Label>
                <Input
                  id="description"
                  placeholder="Краткое описание категории"
                  {...form.register("description")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="parentId">Родительская категория</Label>
                <Select
                  value={form.watch("parentId")}
                  onValueChange={(value) => form.setValue("parentId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите родительскую категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Без родительской категории</SelectItem>
                    {categories.map((category: BlogCategory) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  checked={form.watch("isActive")}
                  onCheckedChange={(checked) =>
                    form.setValue("isActive", checked as boolean)
                  }
                />
                <Label htmlFor="isActive" className="text-sm font-normal">
                  Активная категория
                </Label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="submit"
                  disabled={createCategoryMutation.isPending}
                >
                  {createCategoryMutation.isPending
                    ? "Создание..."
                    : "Создать категорию"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Отмена
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Категория</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Родительская</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Записей</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Категории не найдены
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category: BlogCategory) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Folder className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{category.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {category.slug}
                      </code>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {category.parent?.name || "—"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={category.isActive ? "default" : "secondary"}
                      >
                        {category.isActive ? "Активна" : "Неактивна"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {category.postCategories?.length || 0}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(category.id)}
                          disabled={deleteCategoryMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      {editingCategory && (
        <Dialog
          open={!!editingCategory}
          onOpenChange={() => setEditingCategory(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Редактировать категорию</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="edit-name">Название</Label>
                <Input
                  id="edit-name"
                  placeholder="Введите название категории"
                  {...form.register("name")}
                  onBlur={handleNameBlur}
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-slug">URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="edit-slug"
                    placeholder="url-kategorii"
                    {...form.register("slug")}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={generateSlug}
                  >
                    Сгенерировать
                  </Button>
                </div>
                {form.formState.errors.slug && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.slug.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Описание</Label>
                <Input
                  id="edit-description"
                  placeholder="Краткое описание категории"
                  {...form.register("description")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-parentId">Родительская категория</Label>
                <Select
                  value={form.watch("parentId")}
                  onValueChange={(value) => form.setValue("parentId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите родительскую категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Без родительской категории</SelectItem>
                    {categories
                      .filter(
                        (cat: BlogCategory) => cat.id !== editingCategory.id,
                      )
                      .map((category: BlogCategory) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-isActive"
                  checked={form.watch("isActive")}
                  onCheckedChange={(checked) =>
                    form.setValue("isActive", checked as boolean)
                  }
                />
                <Label htmlFor="edit-isActive" className="text-sm font-normal">
                  Активная категория
                </Label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="submit"
                  disabled={updateCategoryMutation.isPending}
                >
                  {updateCategoryMutation.isPending
                    ? "Сохранение..."
                    : "Сохранить изменения"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingCategory(null)}
                >
                  Отмена
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
