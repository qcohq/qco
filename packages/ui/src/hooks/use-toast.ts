"use client";

import type * as React from "react";
import { toast as sonnerToast } from "sonner";

// Типы для совместимости с существующим кодом
interface ToastProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: "default" | "destructive" | "success";
  duration?: number;
  action?: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
}

// Функция для безопасного преобразования в строку
const safeToString = (value: React.ReactNode): string => {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean")
    return String(value);
  return "";
};

// Адаптер для совместимости с существующим API
function toast(props: ToastProps | string) {
  if (typeof props === "string") {
    return sonnerToast(props);
  }

  const { title, description, variant, duration, action } = props;
  const titleString = safeToString(title);
  const descriptionString = description ? safeToString(description) : undefined;

  // Преобразование variant в тип, понятный для sonner
  if (variant === "destructive") {
    return sonnerToast.error(titleString, {
      description: descriptionString,
      duration: duration ?? 5000,
      action,
    });
  } else if (variant === "success") {
    return sonnerToast.success(titleString, {
      description: descriptionString,
      duration: duration ?? 5000,
      action,
    });
  }

  // Для варианта по умолчанию
  return sonnerToast(titleString, {
    description: descriptionString,
    duration: duration ?? 5000,
    action,
  });
}

// Хук для совместимости с существующим API
function useToast() {
  return {
    toast,
    dismiss: sonnerToast.dismiss,
  };
}

export { useToast, toast };
