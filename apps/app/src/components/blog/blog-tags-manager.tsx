"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription } from "@qco/ui/components/alert";
import { Badge } from "@qco/ui/components/badge";
import { Button } from "@qco/ui/components/button";
import { Card, CardContent, CardHeader } from "@qco/ui/components/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@qco/ui/components/dialog";
import { Input } from "@qco/ui/components/input";
import { Label } from "@qco/ui/components/label";
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
import { Edit, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useTRPC } from "~/trpc/react";

const tagSchema = z.object({
  name: z.string().min(1, "Название тега обязательно"),
  slug: z.string().min(1, "URL тега обязателен"),
  description: z.string().optional(),
  color: z.string().optional(),
});

type TagFormData = z.infer<typeof tagSchema>;

interface BlogTag {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string | null;
  postTags?: Array<{ id: string }>;
}

export function BlogTagsManager() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<BlogTag | null>(null);
  const trpc = useTRPC();

  const tagsQuery = useQuery(trpc.blog.getTags.queryOptions({}));
  const createTagMutation = useMutation(trpc.blog.createTag.mutationOptions());
  const updateTagMutation = useMutation(trpc.blog.updateTag.mutationOptions());
  const deleteTagMutation = useMutation(trpc.blog.deleteTag.mutationOptions());

  const form = useForm<TagFormData>({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      color: "#3B82F6",
    },
  });

  const handleSubmit = async (data: TagFormData) => {
    try {
      if (editingTag) {
        await updateTagMutation.mutateAsync({ id: editingTag.id, ...data });
        setEditingTag(null);
      } else {
        await createTagMutation.mutateAsync(data);
        setIsCreateDialogOpen(false);
      }
      form.reset();
      tagsQuery.refetch();
    } catch (error) {
      console.error("Ошибка сохранения тега:", error);
      alert("Ошибка сохранения тега. Попробуйте еще раз.");
    }
  };

  const handleEdit = (tag: BlogTag) => {
    setEditingTag(tag);
    form.reset({
      name: tag.name,
      slug: tag.slug,
      description: tag.description || "",
      color: tag.color || "#3B82F6",
    });
  };

  const handleDelete = async (tagId: string) => {
    if (confirm("Вы уверены, что хотите удалить этот тег?")) {
      try {
        await deleteTagMutation.mutateAsync({ id: tagId });
        tagsQuery.refetch();
      } catch (error) {
        console.error("Ошибка удаления тега:", error);
        alert("Ошибка удаления тега. Попробуйте еще раз.");
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

  if (tagsQuery.isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/4" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={`blog-tag-skeleton-${i}-${Date.now()}`}
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

  if (tagsQuery.isError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Не удалось загрузить теги. Попробуйте еще раз.
        </AlertDescription>
      </Alert>
    );
  }

  const tags = (tagsQuery.data?.tags || []) as BlogTag[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Теги</h2>
          <p className="text-muted-foreground">
            Управляйте тегами для категоризации записей
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Добавить тег
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Создать новый тег</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="name">Название</Label>
                <Input
                  id="name"
                  placeholder="Введите название тега"
                  {...form.register("name")}
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
                    placeholder="url-tega"
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
                  placeholder="Краткое описание тега"
                  {...form.register("description")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Цвет</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="color"
                    type="color"
                    {...form.register("color")}
                    className="w-16 h-10 p-1"
                  />
                  <Input {...form.register("color")} placeholder="#3B82F6" />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={createTagMutation.isPending}>
                  {createTagMutation.isPending ? "Создание..." : "Создать тег"}
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
                <TableHead>Тег</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Описание</TableHead>
                <TableHead>Записей</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tags.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Теги не найдены
                  </TableCell>
                </TableRow>
              ) : (
                tags.map((tag: BlogTag) => (
                  <TableRow key={tag.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: tag.color || "#3B82F6" }}
                        />
                        <span className="font-medium">{tag.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {tag.slug}
                      </code>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {tag.description || "Без описания"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {tag.postTags?.length || 0}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(tag)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(tag.id)}
                          disabled={deleteTagMutation.isPending}
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
      {editingTag && (
        <Dialog open={!!editingTag} onOpenChange={() => setEditingTag(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Редактировать тег</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="edit-name">Название</Label>
                <Input
                  id="edit-name"
                  placeholder="Введите название тега"
                  {...form.register("name")}
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
                    placeholder="url-tega"
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
                  placeholder="Краткое описание тега"
                  {...form.register("description")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-color">Цвет</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="edit-color"
                    type="color"
                    {...form.register("color")}
                    className="w-16 h-10 p-1"
                  />
                  <Input {...form.register("color")} placeholder="#3B82F6" />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={updateTagMutation.isPending}>
                  {updateTagMutation.isPending
                    ? "Сохранение..."
                    : "Сохранить изменения"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingTag(null)}
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
