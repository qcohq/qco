"use client";

import Image from "next/image";
import { useState } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
}

export function OptimizedImage({
  src,
  alt,
  width = 500,
  height = 500,
  className = "",
  priority = false,
  objectFit = "cover",
}: OptimizedImageProps) {
  const [isError, setIsError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Проверяем, является ли источник заполнителем
  const isPlaceholder = src.includes("/placeholder.svg");

  // Если это заполнитель, заменяем на реальное изображение
  const actualSrc = isPlaceholder
    ? `/images/products/${alt.toLowerCase().replace(/\s+/g, "-")}.jpg`
    : src;

  // Обработка внешних URL
  const isExternal = actualSrc.startsWith("http");

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ width: width || "100%", height: height || "auto" }}
    >
      {!isLoaded && (
        <div className="absolute inset-0 flex animate-pulse items-center justify-center bg-gray-100">
          <svg
            className="h-10 w-10 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      )}

      {isExternal ? (
        <img
          src={actualSrc || "/placeholder.svg"}
          alt={alt}
          className={`h-full w-full object-${objectFit} transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setIsLoaded(true)}
          onError={() => setIsError(true)}
        />
      ) : (
        <Image
          src={isError ? "/placeholder.jpg" : actualSrc}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          className={`object-${objectFit} transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"}`}
          onLoadingComplete={() => setIsLoaded(true)}
          onError={() => setIsError(true)}
        />
      )}
    </div>
  );
}
