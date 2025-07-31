"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription, AlertTitle } from "@qco/ui/components/alert";
import { Button } from "@qco/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@qco/ui/components/tabs";
import { Textarea } from "@qco/ui/components/textarea";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// TODO: Использовать схему из @qco/validators, если появится createCustomerSchema
// Определение схемы валидации формы на основе типов Drizzle
const formSchema = z.object({
  // Основная информация
  firstName: z.string().min(2, {
    message: "Имя должно содержать не менее 2 символов",
  }),
  lastName: z.string().min(2, {
    message: "Фамилия должна содержать не менее 2 символов",
  }),
  email: z.string().email({
    message: "Пожалуйста, введите корректный email",
  }),
  phone: z.string().min(10, {
    message: "Телефон должен содержать не менее 10 символов",
  }),

  // Адрес
  addressLine1: z.string().min(5, {
    message: "Улица должна содержать не менее 5 символов",
  }),
  city: z.string().min(2, {
    message: "Город должен содержать не менее 2 символов",
  }),
  postalCode: z.string().min(5, {
    message: "Почтовый индекс должен содержать не менее 5 символов",
  }),
  country: z.string().min(2, {
    message: "Страна должна содержать не менее 2 символов",
  }),

  // Дополнительная информация
  customerGroup: z.string().optional(),
  notes: z.string().optional(),
});

// Имитация серверного действия для создания клиента
async function createCustomer(values: z.infer<typeof formSchema>) {
  // Имитация задержки сети
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Имитация успешного создания клиента
  // В реальном приложении здесь был бы API-запрос
  return {
    success: true,
    data: {
      id: `cust-${Math.floor(Math.random() * 1000)}`,
      ...values,
      registrationDate: new Date().toISOString(),
      totalOrders: 0,
      totalSpent: 0,
    },
  };
}

export function CreateCustomerForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Инициализация формы с использованием react-hook-form, zod и типов Drizzle
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      addressLine1: "",
      city: "",
      postalCode: "",
      country: "Россия",
      customerGroup: "standard",
      notes: "",
    },
  });

  // Обработчик отправки формы
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      setError(null);

      const result = await createCustomer(values);

      if (result.success) {
        setSubmitSuccess(true);

        // Перенаправление на страницу клиентов через 2 секунды
        setTimeout(() => {
          router.push("/customers");
          router.refresh(); // Обновляем страницу, чтобы отобразить нового клиента
        }, 2000);
      } else {
        setError(
          "Произошла ошибка при создании клиента. Пожалуйста, попробуйте снова.",
        );
      }
    } catch (err) {
      setError(
        "Произошла ошибка при создании клиента. Пожалуйста, попробуйте снова.",
      );
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {submitSuccess ? (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600 sm:h-5 sm:w-5" />
          <AlertTitle className="text-sm text-green-800 sm:text-base">
            Клиент успешно создан
          </AlertTitle>
          <AlertDescription className="text-xs text-green-700 sm:text-sm">
            Новый клиент был успешно добавлен в систему. Вы будете
            перенаправлены на страницу клиентов.
          </AlertDescription>
        </Alert>
      ) : error ? (
        <Alert variant="destructive">
          <AlertTitle className="text-sm sm:text-base">Ошибка</AlertTitle>
          <AlertDescription className="text-xs sm:text-sm">
            {error}
          </AlertDescription>
        </Alert>
      ) : null}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 sm:space-y-6"
        >
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic" className="text-xs sm:text-sm">
                Основная информация
              </TabsTrigger>
              <TabsTrigger value="address" className="text-xs sm:text-sm">
                Адрес
              </TabsTrigger>
              <TabsTrigger value="additional" className="text-xs sm:text-sm">
                Дополнительно
              </TabsTrigger>
            </TabsList>

            {/* Вкладка с основной информацией */}
            <TabsContent value="basic">
              <Card>
                <CardHeader className="p-3 sm:p-4 md:p-6">
                  <CardTitle className="text-lg sm:text-xl">
                    Основная информация
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Введите основные данные нового клиента
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 p-3 sm:space-y-4 sm:p-4 md:p-6">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs sm:text-sm">
                          Имя
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Иван"
                            {...field}
                            className="text-xs sm:text-sm"
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Имя клиента
                        </FormDescription>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs sm:text-sm">
                          Фамилия
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Иванов"
                            {...field}
                            className="text-xs sm:text-sm"
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Фамилия клиента
                        </FormDescription>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs sm:text-sm">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="example@mail.ru"
                            {...field}
                            className="text-xs sm:text-sm"
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Электронная почта для связи с клиентом
                        </FormDescription>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs sm:text-sm">
                          Телефон
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="+7 (900) 123-45-67"
                            {...field}
                            className="text-xs sm:text-sm"
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Контактный телефон клиента
                        </FormDescription>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="flex flex-col justify-between gap-2 p-3 sm:flex-row sm:p-4 md:p-6">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => form.reset()}
                    className="w-full text-xs sm:w-auto sm:text-sm"
                  >
                    Сбросить
                  </Button>
                  <Button
                    type="button"
                    onClick={() =>
                      document.querySelector('[data-value="address"]')?.click()
                    }
                    className="w-full text-xs sm:w-auto sm:text-sm"
                  >
                    Далее
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Вкладка с адресом */}
            <TabsContent value="address">
              <Card>
                <CardHeader className="p-3 sm:p-4 md:p-6">
                  <CardTitle className="text-lg sm:text-xl">Адрес</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Укажите адрес доставки клиента
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 p-3 sm:space-y-4 sm:p-4 md:p-6">
                  <FormField
                    control={form.control}
                    name="addressLine1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs sm:text-sm">
                          Улица, дом, квартира
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="ул. Ленина, 15, кв. 45"
                            {...field}
                            className="text-xs sm:text-sm"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs sm:text-sm">
                          Город
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Москва"
                            {...field}
                            className="text-xs sm:text-sm"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs sm:text-sm">
                          Почтовый индекс
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="123456"
                            {...field}
                            className="text-xs sm:text-sm"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs sm:text-sm">
                          Страна
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Россия"
                            {...field}
                            className="text-xs sm:text-sm"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="flex flex-col justify-between gap-2 p-3 sm:flex-row sm:p-4 md:p-6">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() =>
                      document.querySelector('[data-value="basic"]')?.click()
                    }
                    className="w-full text-xs sm:w-auto sm:text-sm"
                  >
                    Назад
                  </Button>
                  <Button
                    type="button"
                    onClick={() =>
                      document
                        .querySelector('[data-value="additional"]')
                        ?.click()
                    }
                    className="w-full text-xs sm:w-auto sm:text-sm"
                  >
                    Далее
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Вкладка с дополнительной информацией */}
            <TabsContent value="additional">
              <Card>
                <CardHeader className="p-3 sm:p-4 md:p-6">
                  <CardTitle className="text-lg sm:text-xl">
                    Дополнительная информация
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Укажите дополнительные сведения о клиенте
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 p-3 sm:space-y-4 sm:p-4 md:p-6">
                  <FormField
                    control={form.control}
                    name="customerGroup"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs sm:text-sm">
                          Группа клиента
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="text-xs sm:text-sm">
                              <SelectValue placeholder="Выберите группу клиента" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem
                              value="standard"
                              className="text-xs sm:text-sm"
                            >
                              Стандартный
                            </SelectItem>
                            <SelectItem
                              value="vip"
                              className="text-xs sm:text-sm"
                            >
                              VIP
                            </SelectItem>
                            <SelectItem
                              value="wholesale"
                              className="text-xs sm:text-sm"
                            >
                              Оптовый
                            </SelectItem>
                            <SelectItem
                              value="corporate"
                              className="text-xs sm:text-sm"
                            >
                              Корпоративный
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription className="text-xs">
                          Группа определяет специальные условия для клиента
                        </FormDescription>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs sm:text-sm">
                          Заметки
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Дополнительная информация о клиенте..."
                            className="min-h-[80px] text-xs sm:min-h-[120px] sm:text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Внутренние заметки о клиенте (не видны клиенту)
                        </FormDescription>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="flex flex-col justify-between gap-2 p-3 sm:flex-row sm:p-4 md:p-6">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() =>
                      document.querySelector('[data-value="address"]')?.click()
                    }
                    className="w-full text-xs sm:w-auto sm:text-sm"
                  >
                    Назад
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full text-xs sm:w-auto sm:text-sm"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-3 w-3 animate-spin sm:h-4 sm:w-4" />
                        Создание...
                      </>
                    ) : (
                      "Создать клиента"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </div>
  );
}
