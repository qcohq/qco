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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@qco/ui/components/select";
import { Switch } from "@qco/ui/components/switch";
import { createAdminSchema } from "@qco/validators";
import { useForm } from "react-hook-form";
import type { z } from "zod";

const formSchema = createAdminSchema;

// TODO: Использовать тип из схемы пропсов формы создания админа, если появится в @qco/validators
type CreateAdminFormProps = {
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  isPending?: boolean;
};

export function CreateAdminForm({
  onSubmit,
  isPending = false,
}: CreateAdminFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "admin",
      isActive: true,
    },
  });

  function handleSubmit(values: z.infer<typeof formSchema>) {
    onSubmit(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Имя</FormLabel>
              <FormControl>
                <Input placeholder="Введите имя администратора" {...field} />
              </FormControl>
              <FormDescription>Полное имя администратора</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="admin@example.com"
                  {...field}
                />
              </FormControl>
              <FormDescription>Email адрес для входа в систему</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Роль</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите роль" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="super_admin">Супер-админ</SelectItem>
                  <SelectItem value="admin">Администратор</SelectItem>
                  <SelectItem value="moderator">Модератор</SelectItem>
                  <SelectItem value="editor">Редактор</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Уровень доступа в системе</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Активен</FormLabel>
                <FormDescription>
                  Администратор может войти в систему
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

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Создание..." : "Создать администратора"}
        </Button>
      </form>
    </Form>
  );
}
