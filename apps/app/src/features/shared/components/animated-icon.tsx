"use client";

import type { ReactNode } from "react";

type AnimationType = "pulse" | "bounce" | "spin" | "float" | "shake" | "none";

interface AnimatedIconProps {
  children: ReactNode;
  animation?: AnimationType;
  duration?: number;
  delay?: number;
  className?: string;
}

export function AnimatedIcon({
  children,
  animation = "none",
  duration = 2000,
  delay = 0,
  className = "",
}: AnimatedIconProps) {
  // Базовые классы для всех анимаций
  const baseClasses =
    "inline-flex items-center justify-center transition-opacity opacity-0 animate-fade-in";

  // Определяем классы анимации в зависимости от типа
  const getAnimationClasses = () => {
    switch (animation) {
      case "pulse":
        return "animate-pulse-subtle";
      case "bounce":
        return "animate-bounce";
      case "spin":
        return "animate-spin";
      case "float":
        return "animate-float";
      case "shake":
        return "animate-shake";
      default:
        return "";
    }
  };

  // Стили для длительности и задержки анимации
  const animationStyle = {
    animationDuration: `${duration}ms`,
    animationDelay: `${delay}ms`,
  };

  return (
    <div
      className={`${baseClasses} ${getAnimationClasses()} ${className}`}
      style={animationStyle}
    >
      {children}
    </div>
  );
}
