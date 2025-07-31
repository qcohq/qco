"use client";

import { cn } from "@qco/ui/lib/utils";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number; // Расстояние анимации в пикселях
  mobileOptimized?: boolean; // Флаг для оптимизации на мобильных устройствах
}

export function FadeIn({
  children,
  className,
  delay = 0,
  duration = 500,
  direction = "up",
  distance = 8,
  mobileOptimized = true,
}: FadeInProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Проверка предпочтений пользователя по уменьшению движения
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    // Проверка мобильного устройства
    const mobileQuery = window.matchMedia("(max-width: 768px)");
    setIsMobile(mobileQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) =>
      setPrefersReducedMotion(e.matches);
    const handleMobileChange = (e: MediaQueryListEvent) =>
      setIsMobile(e.matches);

    mediaQuery.addEventListener("change", handleMotionChange);
    mobileQuery.addEventListener("change", handleMobileChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMotionChange);
      mobileQuery.removeEventListener("change", handleMobileChange);
    };
  }, []);

  useEffect(() => {
    // Уменьшаем задержку для мобильных устройств
    const adjustedDelay =
      isMobile && mobileOptimized ? Math.min(delay, 150) : delay;

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, adjustedDelay);

    return () => clearTimeout(timer);
  }, [delay, isMobile, mobileOptimized]);

  // Уменьшаем расстояние и длительность для мобильных устройств
  const adjustedDistance =
    isMobile && mobileOptimized ? Math.min(distance, 4) : distance;
  const adjustedDuration =
    isMobile && mobileOptimized ? Math.min(duration, 300) : duration;

  // Если пользователь предпочитает уменьшенное движение, отключаем анимацию
  if (prefersReducedMotion) {
    return <div className={cn("opacity-100", className)}>{children}</div>;
  }

  const getDirectionStyle = () => {
    if (direction === "none") return {};

    // Используем transform вместо translate-* классов для лучшей производительности
    const transform = isVisible
      ? "translate3d(0, 0, 0)"
      : direction === "up"
        ? `translate3d(0, ${adjustedDistance}px, 0)`
        : direction === "down"
          ? `translate3d(0, -${adjustedDistance}px, 0)`
          : direction === "left"
            ? `translate3d(${adjustedDistance}px, 0, 0)`
            : direction === "right"
              ? `translate3d(-${adjustedDistance}px, 0, 0)`
              : "translate3d(0, 0, 0)";

    return { transform };
  };

  return (
    <div
      className={cn(
        "will-change-opacity will-change-transform",
        isVisible ? "opacity-100" : "opacity-0",
        className,
      )}
      style={{
        transitionProperty: "opacity, transform",
        transitionDuration: `${adjustedDuration}ms`,
        transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
        ...getDirectionStyle(),
      }}
    >
      {children}
    </div>
  );
}
