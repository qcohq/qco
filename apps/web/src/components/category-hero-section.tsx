"use client";

import { Button } from "@qco/ui/components/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";

// Типы для баннеров
interface BannerFile {
  id: string;
  type: string;
  order: number;
  file: {
    id: string;
    url: string;
    filename: string;
    mimeType: string;
    size: number;
  };
}

interface Banner {
  id: string;
  title: string;
  description: string | null;
  link: string | null;
  linkText?: string;
  isActive: boolean;
  isFeatured: boolean;
  position: string;
  categoryId?: string | null;
  createdAt: Date;
  updatedAt: Date;
  files: BannerFile[];
}

interface Slide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  description: string;
  primaryButton: string | null;
  secondaryButton: string | null;
  primaryLink: string | null;
  secondaryLink: string | null;
}

// Fallback слайды для категорий
const categoryFallbackSlides = [
  {
    id: 1,
    image: "/placeholder.svg?height=600&width=1200&text=Коллекция+категории",
    title: "Коллекция категории",
    subtitle: "НОВИНКИ СЕЗОНА",
    description: "Откройте для себя лучшие товары в этой категории",
    primaryButton: "Смотреть все",
    secondaryButton: "Фильтры",
    primaryLink: "#",
    secondaryLink: "#",
  },
];

interface CategoryHeroSectionProps {
  categorySlug: string; // Заменяем categoryId на categorySlug
  categoryName?: string; // Название категории для fallback
}

export default function CategoryHeroSection({
  categorySlug,
  categoryName,
}: CategoryHeroSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Интеграция с tRPC для получения баннеров из БД
  const trpc = useTRPC();

  // Создаем опции запроса с помощью queryOptions
  const bannersQueryOptions = trpc.banners.getByPosition.queryOptions({
    position: "hero",
    section: "category",
    categorySlug: categorySlug, // Передаем categorySlug
    limit: 10,
  });

  // Используем опции с хуком useQuery
  const { data: banners, isPending, error } = useQuery(bannersQueryOptions);

  // Используем баннеры из БД или fallback слайды
  const slides =
    banners && Array.isArray(banners) && banners.length > 0
      ? banners.map((banner: Banner) => ({
        id: banner.id,
        image:
          banner.files && banner.files.length > 0
            ? banner.files[0].file.url
            : "/placeholder.svg",
        title: "",
        subtitle: banner.description || "",
        description: banner.description || "",
        primaryButton:
          banner.link && banner.linkText ? banner.linkText : null,
        secondaryButton: null,
        primaryLink: banner.link || null,
        secondaryLink: null,
      }))
      : categoryFallbackSlides.map((slide) => ({
        ...slide,
        subtitle: categoryName
          ? `${categoryName.toUpperCase()}`
          : slide.subtitle,
        description: categoryName
          ? `Откройте для себя лучшие товары в категории "${categoryName}"`
          : slide.description,
      }));

  // Автоматическое переключение слайдов
  useEffect(() => {
    if (!isAutoPlaying || slides.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  // Показываем индикатор загрузки если данные загружаются
  if (isPending) {
    return (
      <section className="py-6">
        <div className="container mx-auto px-4">
          <div className="relative h-[30vh] md:h-[40vh] min-h-[250px] md:min-h-[300px] overflow-hidden rounded-lg bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="text-gray-500">Загрузка баннеров категории...</div>
          </div>
        </div>
      </section>
    );
  }

  // Показываем ошибку если что-то пошло не так
  if (error) {
    console.error("Ошибка загрузки баннеров категории:", error);
  }

  return (
    <section className="py-6">
      <div className="container mx-auto px-4">
        <div className="relative h-[30vh] md:h-[40vh] min-h-[250px] md:min-h-[300px] overflow-hidden rounded-lg">
          {/* Слайды */}
          {slides.map((slide: Slide, index: number) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-transform duration-700 ease-in-out ${index === currentSlide
                ? "translate-x-0"
                : index < currentSlide
                  ? "-translate-x-full"
                  : "translate-x-full"
                }`}
            >
              <div className="relative h-full flex items-center justify-center">
                <div className="absolute inset-0 z-0">
                  <Image
                    src={slide.image || "/placeholder.svg"}
                    alt={slide.title}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>

                {/* Контент слайда */}
                <div className="relative z-10 text-center text-white px-4 md:px-8">
                  {slide.subtitle && (
                    <p className="text-lg md:text-xl mb-2 md:mb-4 font-medium">
                      {slide.subtitle}
                    </p>
                  )}
                  {slide.description && (
                    <p className="text-sm md:text-base mb-4 md:mb-6 max-w-2xl mx-auto">
                      {slide.description}
                    </p>
                  )}
                  {/* Показываем кнопку только если есть ссылка */}
                  {slide.primaryButton && slide.primaryLink && (
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <a
                        href={slide.primaryLink}
                        className="inline-flex items-center justify-center px-6 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        {slide.primaryButton}
                      </a>
                      {slide.secondaryButton && slide.secondaryLink && (
                        <a
                          href={slide.secondaryLink}
                          className="inline-flex items-center justify-center px-6 py-3 border border-white text-white font-medium rounded-lg hover:bg-white hover:text-black transition-colors"
                        >
                          {slide.secondaryButton}
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Стрелки навигации */}
          {slides.length > 1 && (
            <>
              <Button
                variant="secondary"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
                onClick={prevSlide}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>

              <Button
                variant="secondary"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
                onClick={nextSlide}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}

          {/* Индикаторы слайдов */}
          {slides.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex space-x-2">
              {slides.map((slide: Slide, index: number) => (
                <button
                  type="button"
                  key={`slide-indicator-${slide.id}-${index}`}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide
                      ? "bg-white scale-110"
                      : "bg-white/50 hover:bg-white/70"
                    }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
