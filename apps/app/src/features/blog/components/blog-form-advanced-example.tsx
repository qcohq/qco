"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { BlogEditor } from "./editor/blog-editor";

// Расширенная схема валидации
const AdvancedFormSchema = z.object({
  title: z
    .string()
    .min(2, {
      message: "Заголовок должен содержать минимум 2 символа.",
    })
    .max(100, {
      message: "Заголовок не должен превышать 100 символов.",
    }),
  slug: z
    .string()
    .min(1, "URL обязателен")
    .regex(/^[a-z0-9-]+$/, {
      message: "URL может содержать только латинские буквы, цифры и дефисы.",
    }),
  excerpt: z
    .string()
    .max(200, {
      message: "Описание не должно превышать 200 символов.",
    })
    .optional(),
  content: z.any().refine((val) => {
    if (!val) return false;
    if (Array.isArray(val)) {
      return val.some((node) =>
        node.children?.some((child) => child.text && child.text.trim() !== ""),
      );
    }
    return true;
  }, "Содержание обязательно"),
  category: z.string().min(1, "Выберите категорию"),
  tags: z.string().optional(),
  isPublished: z.boolean(),
  allowComments: z.boolean(),
  isFeatured: z.boolean(),
});

type AdvancedFormValues = z.infer<typeof AdvancedFormSchema>;

export function BlogFormAdvancedExample() {
  // Настройка формы
  const form = useForm<AdvancedFormValues>({
    resolver: zodResolver(AdvancedFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: [{ type: "p", children: [{ text: "Начните писать здесь..." }] }],
      category: "",
      tags: "",
      isPublished: false,
      allowComments: true,
      isFeatured: false,
    },
  });

  // Обработчик отправки
  function onSubmit(data: AdvancedFormValues) {
    console.log("Отправленные данные:", data);
    alert("Форма отправлена! Проверьте консоль для деталей.");
  }

  // Генерация slug из заголовка
  const generateSlug = () => {
    const title = form.getValues("title");
    const slug = title
      .toLowerCase()
      .replace(/[^а-яёa-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    form.setValue("slug", slug);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Основной контент */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Основная информация</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Заголовок записи</FormLabel>
                      <FormControl>
                        <Input placeholder="Введите заголовок..." {...field} />
                      </FormControl>
                      <FormDescription>
                        Это будет отображаться как основной заголовок записи.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL записи</FormLabel>
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
                      <FormDescription>
                        URL для доступа к записи. Используйте только латинские
                        буквы, цифры и дефисы.
                      </FormDescription>
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
                          placeholder="Краткое описание записи..."
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Краткое описание, которое будет показано в превью и SEO.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Содержание записи</FormLabel>
                      <FormControl>
                        <BlogEditor
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Напишите содержание записи..."
                        />
                      </FormControl>
                      <FormDescription>
                        Используйте панель инструментов для форматирования
                        текста.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Боковая панель */}
          <div className="space-y-6">
            {/* Категории и теги */}
            <Card>
              <CardHeader>
                <CardTitle>Классификация</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Категория</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите категорию" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="technology">Технологии</SelectItem>
                          <SelectItem value="design">Дизайн</SelectItem>
                          <SelectItem value="business">Бизнес</SelectItem>
                          <SelectItem value="lifestyle">Образ жизни</SelectItem>
                          <SelectItem value="tutorial">Обучение</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Теги</FormLabel>
                      <FormControl>
                        <Input placeholder="тег1, тег2, тег3" {...field} />
                      </FormControl>
                      <FormDescription>
                        Разделяйте теги запятыми.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
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
                  name="isPublished"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Опубликовать
                        </FormLabel>
                        <FormDescription>
                          Сделать запись доступной для просмотра
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
                          Пользователи смогут комментировать запись
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
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline">
            Предварительный просмотр
          </Button>
          <Button type="submit">Сохранить запись</Button>
        </div>
      </form>
    </Form>
  );
}
