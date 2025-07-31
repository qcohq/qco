"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@qco/ui/components/button";
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
import { Textarea } from "@qco/ui/components/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { BlogEditor } from "./editor/blog-editor";

// Схема валидации
const FormSchema = z.object({
  title: z.string().min(2, {
    message: "Заголовок должен содержать минимум 2 символа.",
  }),
  excerpt: z.string().optional(),
  content: z.any().refine((val) => {
    if (!val) return false;
    if (Array.isArray(val)) {
      return val.some((node) =>
        node.children?.some((child) => child.text && child.text.trim() !== ""),
      );
    }
    return true;
  }, "Содержание обязательно"),
});

type FormValues = z.infer<typeof FormSchema>;

export function BlogEditorExample() {
  // Настройка формы
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      excerpt: "",
      content: [{ type: "p", children: [{ text: "Начните писать здесь..." }] }],
    },
  });

  // Обработчик отправки
  function onSubmit(data: FormValues) {
    console.log("Отправленные данные:", data);
    alert("Форма отправлена! Проверьте консоль для деталей.");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                Краткое описание, которое будет показано в превью.
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
                Используйте панель инструментов для форматирования текста.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Отправить</Button>
      </form>
    </Form>
  );
}
