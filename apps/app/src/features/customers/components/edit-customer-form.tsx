"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@qco/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@qco/ui/components/form";
import { Input } from "@qco/ui/components/input";
import { Textarea } from "@qco/ui/components/textarea";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// TODO: Использовать схему из @qco/validators, если появится editCustomerSchema
// Схема валидации для формы редактирования клиента
const editCustomerSchema = z.object({
  firstName: z.string().min(2, "Имя обязательно").optional(),
  lastName: z.string().min(2, "Фамилия обязательна").optional(),
  email: z.string().email("Введите корректный email").optional(),
  phone: z.string().min(10, "Телефон обязателен").optional(),
  address: z.string().min(5, "Адрес обязателен").optional(),
  notes: z.string().optional(),
});

type EditCustomerFormValues = z.infer<typeof editCustomerSchema>;

// TODO: Использовать тип из схемы пропсов формы редактирования клиента, если появится в @qco/validators
interface EditCustomerFormProps {
  initialValues: EditCustomerFormValues;
  isUpdating?: boolean;
  onSubmit: (data: EditCustomerFormValues) => void;
}

export function EditCustomerForm({
  initialValues,
  isUpdating = false,
  onSubmit,
}: EditCustomerFormProps) {
  const form = useForm<EditCustomerFormValues>({
    resolver: zodResolver(editCustomerSchema),
    defaultValues: initialValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Имя</FormLabel>
                <FormControl>
                  <Input placeholder="Имя клиента" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Фамилия</FormLabel>
                <FormControl>
                  <Input placeholder="Фамилия клиента" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="example@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Телефон</FormLabel>
                <FormControl>
                  <Input placeholder="+7 (900) 123-45-67" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Адрес</FormLabel>
              <FormControl>
                <Input placeholder="Город, улица, дом" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Заметки</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Дополнительная информация о клиенте..."
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={isUpdating} className="min-w-[160px]">
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Сохранение...
              </>
            ) : (
              "Сохранить изменения"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
