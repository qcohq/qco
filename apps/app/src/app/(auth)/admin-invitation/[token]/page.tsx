"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription } from "@qco/ui/components/alert";
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
import { acceptAdminInvitationSchema } from "@qco/validators";
import { useMutation, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { CheckCircle, Eye, EyeOff, Loader2, XCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { useTRPC } from "~/trpc/react";

const formSchema = acceptAdminInvitationSchema;

interface InvitationData {
  id: string;
  email: string;
  name: string | null;
  role: "admin" | "moderator" | "editor";
  expiresAt: string;
  invitedBy: string;
}

export default function AdminInvitationPage() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;
  const trpc = useTRPC();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      token: token,
      password: "",
      name: "",
    },
  });

  // Получаем данные приглашения
  const invitationQueryOptions =
    trpc.admins.invitations.getByToken.queryOptions({
      token,
    });

  const {
    data: invitation,
    isLoading,
    error,
  } = useQuery(invitationQueryOptions);

  // Мутация для принятия приглашения
  const acceptInvitationMutationOptions =
    trpc.admins.invitations.accept.mutationOptions({
      onSuccess: () => {
        toast.success(
          "Приглашение успешно принято! Теперь вы можете войти в систему.",
        );
        router.push("/login");
      },
      onError: (error) => {
        toast.error(error.message || "Не удалось принять приглашение");
      },
    });

  const { mutate: acceptInvitation, isPending } = useMutation(
    acceptInvitationMutationOptions,
  );

  function handleSubmit(values: z.infer<typeof formSchema>) {
    acceptInvitation(values);
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Загрузка...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-red-600 mb-4">
              <XCircle className="h-6 w-6" />
              <span className="font-semibold">Ошибка</span>
            </div>
            <Alert>
              <AlertDescription>
                {error.message || "Недействительное приглашение"}
              </AlertDescription>
            </Alert>
            <Button
              className="w-full mt-4"
              onClick={() => router.push("/login")}
            >
              Вернуться к входу
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-red-600 mb-4">
              <XCircle className="h-6 w-6" />
              <span className="font-semibold">Приглашение не найдено</span>
            </div>
            <Alert>
              <AlertDescription>
                Приглашение не найдено или уже недействительно
              </AlertDescription>
            </Alert>
            <Button
              className="w-full mt-4"
              onClick={() => router.push("/login")}
            >
              Вернуться к входу
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const invitationData = invitation as InvitationData;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Приглашение администратора
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-2" />
            <p className="text-gray-600">
              Вас пригласил <strong>{invitationData.invitedBy}</strong> стать
              администратором системы.
            </p>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Email:</strong> {invitationData.email}
              </p>
              <p className="text-sm text-blue-800">
                <strong>Роль:</strong>{" "}
                {invitationData.role === "admin"
                  ? "Администратор"
                  : "Супер-администратор"}
              </p>
              <p className="text-sm text-blue-800">
                <strong>Действительно до:</strong>{" "}
                {format(
                  new Date(invitationData.expiresAt),
                  "dd MMMM yyyy 'в' HH:mm",
                  { locale: ru },
                )}
              </p>
            </div>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Имя</FormLabel>
                    <FormControl>
                      <Input placeholder="Введите ваше имя" {...field} />
                    </FormControl>
                    <FormDescription>
                      Ваше полное имя для отображения в системе
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Пароль</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Создайте пароль"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-500" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription>Минимум 8 символов</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Принятие приглашения...
                  </>
                ) : (
                  "Принять приглашение"
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/login")}
            >
              Вернуться к входу
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
