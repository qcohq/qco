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
import { createAdminInvitationSchema } from "@qco/validators";

import type { CreateInvitationFormData } from "@qco/validators";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useTRPC } from "~/trpc/react";

const formSchema = createAdminInvitationSchema;

// TODO: Использовать тип из схемы пропсов формы приглашения админа, если появится в @qco/validators
interface InviteAdminFormProps {
  onSuccess: () => void;
}

export function InviteAdminForm({ onSuccess }: InviteAdminFormProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const form = useForm<CreateInvitationFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
      role: "admin",
      expiresInDays: 7,
    },
  });

  // Создаем опции мутации для создания приглашения
  const createInvitationMutationOptions =
    trpc.admins.invitations.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.admins.invitations.list.queryKey(),
        });
        onSuccess();
        toast.success("Приглашение успешно отправлено на указанный email");
      },
      onError: (error) => {
        toast.error(error.message || "Не удалось отправить приглашение");
      },
    });

  // Используем опции с хуком useMutation
  const { mutate: createInvitation, isPending } = useMutation(
    createInvitationMutationOptions,
  );

  function handleSubmit(values: CreateInvitationFormData) {
    createInvitation(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
              <FormDescription>
                Email адрес для отправки приглашения
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Имя (необязательно)</FormLabel>
              <FormControl>
                <Input placeholder="Введите имя администратора" {...field} />
              </FormControl>
              <FormDescription>
                Имя можно будет указать при принятии приглашения
              </FormDescription>
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
          name="expiresInDays"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Срок действия приглашения</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                defaultValue={field.value.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите срок" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">1 день</SelectItem>
                  <SelectItem value="3">3 дня</SelectItem>
                  <SelectItem value="7">7 дней</SelectItem>
                  <SelectItem value="14">14 дней</SelectItem>
                  <SelectItem value="30">30 дней</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Время, в течение которого приглашение будет активно
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Отправка..." : "Отправить приглашение"}
        </Button>
      </form>
    </Form>
  );
}
