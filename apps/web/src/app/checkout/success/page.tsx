"use client";

import { Badge } from "@qco/ui/components/badge";
import { Button } from "@qco/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@qco/ui/components/card";
import { Separator } from "@qco/ui/components/separator";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import {
  ArrowRight,
  CheckCircle,
  CreditCard,
  MapPin,
  Package,
  Truck,
  UserPlus,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import React from "react";
import Breadcrumbs from "@/components/breadcrumbs";
import { useTRPC } from "@/trpc/react";


function CheckoutSuccessFallback() {
  const breadcrumbItems = [
    { label: "Главная", href: "/" },
    { label: "Корзина", href: "/cart" },
    { label: "Оформление заказа", href: "/checkout" },
    { label: "Заказ оформлен", href: "/checkout/success" },
  ];

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="flex flex-col items-center justify-center py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Загрузка...
            </h1>
            <p className="text-gray-600">Получаем информацию о заказе</p>
          </div>
        </div>
      </main></div>
  );
}

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const trpc = useTRPC();

  const breadcrumbItems = [
    { label: "Главная", href: "/" },
    { label: "Корзина", href: "/cart" },
    { label: "Оформление заказа", href: "/checkout" },
    { label: "Заказ оформлен", href: "/checkout/success" },
  ];

  // Получаем данные заказа
  const {
    data: order,
    isLoading,
    error,
  } = useQuery({
    ...trpc.orders.getOrder.queryOptions({ orderId: orderId as string }),
    enabled: !!orderId,
  });


  if (!orderId || orderId.trim() === "") {
    return (
      <div className="min-h-screen">
        <main className="container mx-auto px-4 py-8">
          <Breadcrumbs items={breadcrumbItems} />
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Номер заказа не указан
              </h1>
              <p className="text-gray-600 mb-8">
                В URL отсутствует номер заказа. Пожалуйста, проверьте ссылку или перейдите в раздел "Мои заказы".
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/">
                  <Button>Вернуться на главную</Button>
                </Link>
                <Link href="/profile/orders">
                  <Button variant="outline">Мои заказы</Button>
                </Link>
              </div>
            </div>
          </div>
        </main></div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <main className="container mx-auto px-4 py-8">
          <Breadcrumbs items={breadcrumbItems} />
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Загрузка...
              </h1>
              <p className="text-gray-600">Получаем информацию о заказе</p>
            </div>
          </div>
        </main></div>
    );
  }

  if (error || !order) {
    const errorMessage = error?.message || "Не удалось загрузить информацию о заказе";
    const isNotFound = error?.data?.code === "NOT_FOUND";
    const isBadRequest = error?.data?.code === "BAD_REQUEST";

    return (
      <div className="min-h-screen">
        <main className="container mx-auto px-4 py-8">
          <Breadcrumbs items={breadcrumbItems} />
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {isNotFound ? "Заказ не найден" : "Ошибка загрузки"}
              </h1>
              <p className="text-gray-600 mb-8">
                {isNotFound
                  ? "Заказ с указанным номером не найден в системе. Возможно, заказ был удален или номер указан неверно."
                  : isBadRequest
                    ? "Неверный номер заказа. Пожалуйста, проверьте ссылку."
                    : errorMessage
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/">
                  <Button>Вернуться на главную</Button>
                </Link>
                <Link href="/profile/orders">
                  <Button variant="outline">Мои заказы</Button>
                </Link>
              </div>
            </div>
          </div>
        </main></div>
    );
  }

  // Функция для получения статуса заказа
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "pending":
        return {
          label: "Ожидает оплаты",
          color: "bg-yellow-100 text-yellow-800",
        };
      case "processing":
        return { label: "В обработке", color: "bg-blue-100 text-blue-800" };
      case "shipped":
        return { label: "Отправлен", color: "bg-purple-100 text-purple-800" };
      case "delivered":
        return { label: "Доставлен", color: "bg-green-100 text-green-800" };
      case "cancelled":
        return { label: "Отменен", color: "bg-red-100 text-red-800" };
      default:
        return { label: "Неизвестно", color: "bg-gray-100 text-gray-800" };
    }
  };

  // Функция для перевода статуса оплаты
  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "Оплачено";
      case "PENDING":
        return "Ожидает оплаты";
      case "PROCESSING":
        return "Обрабатывается";
      case "FAILED":
        return "Ошибка оплаты";
      case "REFUNDED":
        return "Возвращено";
      case "PARTIALLY_REFUNDED":
        return "Частичный возврат";
      default:
        return "Неизвестно";
    }
  };

  // Функция для перевода способа оплаты
  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case "credit_card":
        return "Банковская карта";
      case "bank_transfer":
        return "Банковский перевод";
      case "cash_on_delivery":
        return "Наличными при получении";
      case "digital_wallet":
        return "Электронный кошелек";
      default:
        return method || "Не указан";
    }
  };

  // Функция для перевода способа доставки
  const getShippingMethodText = (method: string) => {
    switch (method) {
      case "standard":
        return "Стандартная доставка";
      case "express":
        return "Экспресс доставка";
      case "pickup":
        return "Самовывоз";
      case "same_day":
        return "Доставка в тот же день";
      default:
        return method || "Не указан";
    }
  };

  const statusInfo = getStatusInfo(order.status);

  // Функция для форматирования цены
  const formatPrice = (price: string | number) => {
    const numPrice =
      typeof price === "string" ? Number.parseFloat(price) : price;
    return numPrice.toLocaleString("ru-RU");
  };

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbItems} />

        {/* Заголовок успеха */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Заказ успешно оформлен!
          </h1>
          <p className="text-gray-600">
            Спасибо за ваш заказ. Мы отправили подтверждение на ваш email.
          </p>
        </div>

        {/* Информация о созданном профиле */}
        {order.metadata?.createProfile && (
          <Card className="mb-8 border-green-200 bg-green-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <UserPlus className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-green-900 mb-2">
                    Профиль создан!
                  </h3>
                  <p className="text-green-800 mb-4">
                    На основе данных вашего заказа был создан профиль. Теперь вы можете:
                  </p>
                  <ul className="text-sm text-green-700 space-y-1 mb-4">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Быстрее оформлять заказы в будущем
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Отслеживать статус заказов
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Сохранять избранные товары
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Получать персональные предложения
                    </li>
                  </ul>
                  <div className="flex gap-3">
                    <Button size="sm" variant="outline" asChild>
                      <Link href="/profile">
                        Перейти в профиль
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link href="/auth/login">
                        Войти в аккаунт
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Основная информация о заказе */}
          <div className="lg:col-span-2 space-y-6">
            {/* Детали заказа */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Детали заказа
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Номер заказа:</span>
                    <span className="font-medium">{order.orderNumber}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Дата заказа:</span>
                    <span className="font-medium">
                      {format(
                        new Date(order.createdAt),
                        "dd MMMM yyyy, HH:mm",
                        { locale: ru },
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Статус:</span>
                    <Badge className={statusInfo.color}>
                      {statusInfo.label}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Товары в заказе */}
            <Card>
              <CardHeader>
                <CardTitle>Товары в заказе</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.cart.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 border rounded-lg"
                    >
                      {item.product?.mainImage && (
                        <div className="relative w-16 h-16 flex-shrink-0">
                          <Image
                            src={item.product.mainImage}
                            alt={item.product.name}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">
                          {item.product?.name || "Товар"}
                        </h4>
                        {item.variant && (
                          <p className="text-sm text-gray-500">
                            Артикул: {item.variant.sku}
                          </p>
                        )}
                        <p className="text-sm text-gray-500">
                          Количество: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          {formatPrice(item.price)} ₽
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Информация о доставке */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Информация о доставке
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Способ доставки:</span>
                    <span className="font-medium">
                      {getShippingMethodText(order.shippingMethod.name)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Ожидаемая доставка:</span>
                    <span className="font-medium">
                      {order.shippingMethod.estimatedDelivery || "Уточняется"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Стоимость доставки:</span>
                    <span className="font-medium">
                      {order.shippingCost.toLocaleString("ru-RU")} ₽
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Боковая панель */}
          <div className="space-y-6">
            {/* Итоговая стоимость */}
            <Card>
              <CardHeader>
                <CardTitle>Итоговая стоимость</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Товары:</span>
                    <span>{order.subtotal.toLocaleString("ru-RU")} ₽</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Доставка:</span>
                    <span>{order.shippingCost.toLocaleString("ru-RU")} ₽</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Итого:</span>
                    <span>{order.total.toLocaleString("ru-RU")} ₽</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Информация о клиенте */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Адрес доставки
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p className="font-medium">
                    {order.customerInfo.firstName} {order.customerInfo.lastName}
                  </p>
                  <p className="text-gray-600">{order.customerInfo.address}</p>
                  {order.customerInfo.apartment && (
                    <p className="text-gray-600">
                      Кв. {order.customerInfo.apartment}
                    </p>
                  )}
                  <p className="text-gray-600">
                    {order.customerInfo.city}, {order.customerInfo.state}{" "}
                    {order.customerInfo.postalCode}
                  </p>
                  <p className="text-gray-600">{order.customerInfo.phone}</p>
                  <p className="text-gray-600">{order.customerInfo.email}</p>
                </div>
              </CardContent>
            </Card>

            {/* Способ оплаты */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Способ оплаты
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">{getPaymentMethodText(order.paymentMethod.name)}</p>
                  <p className="text-sm text-gray-600">
                    {order.paymentMethod.description || "Способ оплаты выбран при оформлении заказа"}
                  </p>
                  <Badge
                    variant={
                      order.paymentStatus === "COMPLETED" ? "default" : "secondary"
                    }
                  >
                    {getPaymentStatusText(order.paymentStatus)}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Действия */}
            <Card>
              <CardContent className="pt-6">
                <div className="grid gap-4">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/">
                      Продолжить покупки
                    </Link>
                  </Button>
                  <Button className="w-full" asChild>
                    <Link href="/profile/orders">
                      Мои заказы
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main></div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<CheckoutSuccessFallback />}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
