"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { RouterOutputs } from "@qco/api";
import { Button } from "@qco/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@qco/ui/components/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@qco/ui/components/form";
import { ImageUpload } from "@qco/ui/components/image-upload";
import { Input } from "@qco/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@qco/ui/components/select";
import { Switch } from "@qco/ui/components/switch";
import { Textarea } from "@qco/ui/components/textarea";
import { createBlogPostSchema } from "@qco/validators";
import slugify from "@sindresorhus/slugify";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { useFileUpload } from "~/hooks/use-file-upload";
import { useTRPC } from "~/trpc/react";
import { clientSlateToHtml, emptyValue } from "../utils/editor-utils";
import { BlogEditor } from "./editor/blog-editor";

// TODO: Использовать тип из схемы пропсов формы поста блога, если появится в @qco/validators
type BlogPostFormData = z.infer<typeof createBlogPostSchema>;

interface BlogPostFormProps {
  post?: RouterOutputs["blog"]["getBySlug"]; // Existing post data for editing
  mode: "create" | "edit";
}

export function BlogPostForm({ post, mode }: BlogPostFormProps) {
  const router = useRouter();
  const trpc = useTRPC();
  const { uploadFile } = useFileUpload();
  const [isUploading, setIsUploading] = useState(false);

  const createPostMutation = useMutation(trpc.blog.create.mutationOptions());
  const updatePostMutation = useMutation(trpc.blog.update.mutationOptions());

  const form = useForm<BlogPostFormData>({
    resolver: zodResolver(createBlogPostSchema),
    defaultValues: {
      title: post?.title || "",
      slug: post?.slug || "",
      excerpt: post?.excerpt || "",
      content: post?.content || emptyValue,
      contentHtml: post?.contentHtml || "",
      status: post?.status || "draft",
      type: post?.type || "post",
      visibility: post?.visibility || "public",
      metaTitle: post?.metaTitle || "",
      metaDescription: post?.metaDescription || "",
      isFeatured: post?.isFeatured || false,
      isSticky: post?.isSticky || false,
      allowComments: post?.allowComments || true,
      featuredImage: post?.featuredImage || null,
    },
  });
  const onSubmit = async (data: BlogPostFormData) => {
    const contentHtml = await clientSlateToHtml(data.content);
    const formData = {
      ...data,
      contentHtml,
    };
    if (mode === "create") {
      await createPostMutation.mutateAsync(formData);
      toast("Пост успешно создан");
    } else {
      await updatePostMutation.mutateAsync({ id: post.id, ...formData });
      toast("Пост успешно обновлён");
    }
    router.push("/blog");
  };

  const generateSlug = () => {
    const title = form.getValues("title");
    const slug = slugify(title);
    form.setValue("slug", slug);
  };

  const isLoading =
    createPostMutation.isPending || updatePostMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Основной контент */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Контент</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Заголовок</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Введите заголовок записи"
                          {...field}
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
                      <FormLabel>URL</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input placeholder="url-zapisi" {...field} />
                        </FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={generateSlug}
                        >
                          Сгенерировать
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Краткое описание</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Краткое описание записи"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Содержание</FormLabel>
                      <FormControl>
                        <BlogEditor
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Напишите содержание записи..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Боковая панель */}
          <div className="space-y-6">
            {/* Изображение записи */}
            <Card>
              <CardHeader>
                <CardTitle>Изображение записи</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  value={form.watch("featuredImage") ?? null}
                  onChange={(file) => form.setValue("featuredImage", file)}
                  onUploadStart={() => setIsUploading(true)}
                  onUploadEnd={() => setIsUploading(false)}
                  uploadFile={uploadFile}
                  label="Загрузить изображение"
                  recommended="Рекомендуемый размер: 1200x630px, JPG или PNG"
                  previewRatio={1.91}
                />
              </CardContent>
            </Card>

            {/* Настройки публикации */}
            <Card>
              <CardHeader>
                <CardTitle>Настройки публикации</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Статус</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите статус" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Черновик</SelectItem>
                          <SelectItem value="published">
                            Опубликовано
                          </SelectItem>
                          <SelectItem value="scheduled">
                            Запланировано
                          </SelectItem>
                          <SelectItem value="archived">В архиве</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Тип</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите тип" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="post">Запись</SelectItem>
                          <SelectItem value="page">Страница</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="visibility"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Видимость</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите видимость" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="public">Публичная</SelectItem>
                          <SelectItem value="members">
                            Только для участников
                          </SelectItem>
                          <SelectItem value="paid">Платная</SelectItem>
                          <SelectItem value="private">Приватная</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Дополнительные настройки */}
            <Card>
              <CardHeader>
                <CardTitle>Дополнительные настройки</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="isFeatured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Рекомендуемая запись
                        </FormLabel>
                        <FormDescription>
                          Показывать в рекомендуемых
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isSticky"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Закрепить запись
                        </FormLabel>
                        <FormDescription>
                          Показывать вверху списка
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="allowComments"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Разрешить комментарии
                        </FormLabel>
                        <FormDescription>
                          Пользователи смогут комментировать
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* SEO настройки */}
            <Card>
              <CardHeader>
                <CardTitle>SEO настройки</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="metaTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Title</FormLabel>
                      <FormControl>
                        <Input placeholder="SEO заголовок" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="metaDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="SEO описание"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/blog")}
          >
            Отмена
          </Button>
          <Button type="submit" disabled={isLoading || isUploading}>
            {isLoading
              ? "Сохранение..."
              : mode === "create"
                ? "Создать запись"
                : "Обновить запись"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
