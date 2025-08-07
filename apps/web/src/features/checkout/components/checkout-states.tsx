"use client";

import { Button } from "@qco/ui/components/button";
import { Loader2 } from "lucide-react";
import { CheckoutSkeleton } from "./checkout-skeleton";

interface CheckoutStatesProps {
  type: "no-cart" | "empty-cart" | "loading" | "error";
  errorMessage?: string;
}

export function CheckoutStates({ type, errorMessage }: CheckoutStatesProps) {
  const states = {
    "no-cart": {
      title: "Корзина не найдена",
      description: "Добавьте товары в корзину для оформления заказа",
      action: "Перейти к каталогу",
      actionHandler: () => (window.location.href = "/catalog"),
    },
    "empty-cart": {
      title: "Корзина пуста",
      description: "Добавьте товары в корзину для оформления заказа",
      action: "Перейти к каталогу",
      actionHandler: () => (window.location.href = "/catalog"),
    },
    loading: {
      title: "",
      description: "Загрузка корзины...",
      action: "",
      actionHandler: () => {},
    },
    error: {
      title: "Ошибка загрузки корзины",
      description: errorMessage || "Не удалось загрузить корзину",
      action: "Попробовать снова",
      actionHandler: () => window.location.reload(),
    },
  };

  const state = states[type];

  if (type === "loading") {
    return <CheckoutSkeleton />;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">{state.title}</h1>
        <p className="text-muted-foreground mb-6">{state.description}</p>
        {state.action && (
          <Button onClick={state.actionHandler}>{state.action}</Button>
        )}
      </div>
    </div>
  );
}
