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
  name: string;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  link: string | null;
  buttonText: string | null;
  buttonLink: string | null;
  isActive: boolean;
  isFeatured: boolean;
  position: string;
  page: string | null;
  categoryId: string | null;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
  files: BannerFile[];
}

interface Slide {
  id: string;
  desktopImage: string | null;
  mobileImage: string | null;
  title: string | null;
  subtitle: string;
  description: string;
  primaryButton: string | null;
  secondaryButton: string | null;
  primaryLink: string | null;
  secondaryLink: string | null;
}

// Fallback слайды на случай, если баннеры не загружены
const fallbackSlides: Slide[] = [
  {
    id: "1",
    desktopImage:
      "/placeholder.svg?height=800&width=1200&text=Новая+коллекция+CHANEL",
    mobileImage:
      "/placeholder.svg?height=400&width=768&text=Новая+коллекция+CHANEL",
    title: "Новая коллекция CHANEL",
    subtitle: "ВЕСНА-ЛЕТО 2024",
    description:
      "Откройте для себя изысканные творения от легендарного французского дома моды",
    primaryButton: "Смотреть коллекцию",
    secondaryButton: "Узнать больше",
    primaryLink: "/women/new",
    secondaryLink: "/brands/chanel",
  },
  {
    id: "2",
    desktopImage:
      "/placeholder.svg?height=800&width=1200&text=Эксклюзивные+сумки+HERMÈS",
    mobileImage:
      "/placeholder.svg?height=400&width=768&text=Эксклюзивные+сумки+HERMÈS",
    title: "Эксклюзивные сумки HERMÈS",
    subtitle: "РУЧНАЯ РАБОТА",
    description:
      "Легендарные модели Birkin и Kelly от мастеров французского дома",
    primaryButton: "Посмотреть сумки",
    secondaryButton: "Записаться на консультацию",
    primaryLink: "/women/bags",
    secondaryLink: "/contact",
  },
  {
    id: "3",
    desktopImage:
      "/placeholder.svg?height=800&width=1200&text=Мужская+коллекция+GUCCI",
    mobileImage:
      "/placeholder.svg?height=400&width=768&text=Мужская+коллекция+GUCCI",
    title: "Мужская коллекция GUCCI",
    subtitle: "ИТАЛЬЯНСКИЙ СТИЛЬ",
    description:
      "Современная элегантность и традиционное мастерство в каждой детали",
    primaryButton: "Мужская коллекция",
    secondaryButton: "Все бренды",
    primaryLink: "/men",
    secondaryLink: "/brands",
  },
];

interface HeroSectionProps {
  categorySlug?: string; // Заменяем categoryId на categorySlug
}

// Функция для получения изображения по типу устройства
const getImageByType = (files: BannerFile[], type: string) => {
  const file = files.find((f: BannerFile) => f.type === type);
  return file?.file?.url || null;
};

// Функция для получения лучшего изображения для устройства
const getBestImage = (files: BannerFile[]) => {
  // Приоритет: desktop -> mobile -> primary -> первое доступное
  return (
    getImageByType(files, "desktop") ||
    getImageByType(files, "mobile") ||
    getImageByType(files, "primary") ||
    files[0]?.file?.url ||
    null
  );
};

export default function HeroSection({ categorySlug }: HeroSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Интеграция с tRPC для получения баннеров из БД
  const trpc = useTRPC();

  // Создаем опции запроса с помощью queryOptions
  const bannersQueryOptions = trpc.banners.getByPosition.queryOptions({
    position: "hero",
    page: "home",
    categorySlug: categorySlug || undefined, // Передаем categorySlug напрямую
    limit: 10,
  });

  // Используем опции с хуком useQuery
  const { data: banners, isPending, error } = useQuery(bannersQueryOptions);

  // Используем баннеры из БД или fallback слайды
  const slides =
    banners && Array.isArray(banners) && banners.length > 0
      ? banners.map((banner: Banner) => ({
        id: banner.id,
        desktopImage:
          getImageByType(banner.files, "desktop") ||
          getBestImage(banner.files),
        mobileImage:
          getImageByType(banner.files, "mobile") ||
          getBestImage(banner.files),
        title: banner.title || "",
        subtitle: banner.description || "",
        description: banner.description || "",
        primaryButton:
          banner.link && banner.buttonText ? banner.buttonText : null,
        secondaryButton: null,
        primaryLink: banner.link || null,
        secondaryLink: null,
      }))
      : fallbackSlides;

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
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="relative aspect-square md:aspect-[16/9] overflow-hidden rounded-none md:rounded-lg bg-gray-200 animate-pulse flex items-center justify-center -mx-4 md:mx-0">
            <div className="text-gray-500">Загрузка баннеров...</div>
          </div>
        </div>
      </section>
    );
  }

  // Показываем ошибку если что-то пошло не так
  if (error) {
    console.error("Ошибка загрузки баннеров:", error);
  }

  return (
    <section className="py-8">
      <div className="container mx-auto px-4 md:px-4">
        <div className="relative aspect-square md:aspect-[16/9] overflow-hidden rounded-none md:rounded-lg -mx-4 md:mx-0">
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
                <div className="absolute inset-0 z-0 bg-gray-100">
                  {/* Desktop изображение */}
                  <Image
                    src={slide.desktopImage || "/placeholder.svg"}
                    alt={slide.title || "Banner image"}
                    fill
                    className="object-cover object-center hidden md:block"
                    priority={index === 0}
                    sizes="(max-width: 768px) 0vw, 100vw"
                  />

                  {/* Mobile изображение */}
                  <Image
                    src={
                      slide.mobileImage ||
                      slide.desktopImage ||
                      "/placeholder.svg"
                    }
                    alt={slide.title || "Banner image"}
                    fill
                    className="object-cover object-center md:hidden"
                    priority={index === 0}
                    sizes="100vw"
                  />
                </div>

                {/* Контент слайда */}
                <div className="relative z-10 text-center text-white px-4 md:px-8">
                  {/* Убираем отображение заголовка */}
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

        {/* Contact Section */}
        <div className="mt-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 md:p-6 border border-gray-200 shadow-sm">
          <div className="text-center">
            <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 md:mb-2">
              Персональная консультация
            </h3>
            <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6">
              Нужна помощь с выбором? Наши стилисты готовы помочь вам
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 md:gap-3">
              <div className="flex flex-row gap-2 md:gap-3 w-full sm:w-auto">
                <a
                  href="https://wa.me/79991234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none sm:w-auto flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 hover:shadow-md font-medium text-sm md:text-base"
                >
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                  </svg>
                  WhatsApp
                </a>

                <a
                  href="https://t.me/eleganter_support"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none sm:w-auto flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 hover:shadow-md font-medium text-sm md:text-base"
                >
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                  </svg>
                  Telegram
                </a>
              </div>

              <a
                href="tel:+74951234567"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-all duration-200 hover:shadow-md font-medium text-sm md:text-base"
              >
                <svg
                  className="w-4 h-4 md:w-5 md:h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
                +7 (495) 123-45-67
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
