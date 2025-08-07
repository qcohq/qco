"use client";

import { ZoomIn, X } from "lucide-react";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductImageGallery({
  images,
  productName,
}: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  // Handle scroll to update active thumbnail
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const containerTop = container.scrollTop;
    const containerHeight = container.clientHeight;
    const centerPoint = containerTop + containerHeight / 2;

    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    imageRefs.current.forEach((ref, index) => {
      if (ref) {
        const rect = ref.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const imageCenter = rect.top - containerRect.top + container.scrollTop + rect.height / 2;
        const distance = Math.abs(imageCenter - centerPoint);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      }
    });

    setActiveImageIndex(closestIndex);
  };

  // Scroll to specific image when thumbnail is clicked
  const scrollToImage = (index: number) => {
    const imageRef = imageRefs.current[index];
    if (imageRef && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const containerRect = container.getBoundingClientRect();
      const imageRect = imageRef.getBoundingClientRect();
      const scrollTop = imageRef.offsetTop - container.clientHeight / 2 + imageRef.clientHeight / 2;

      container.scrollTo({
        top: scrollTop,
        behavior: "smooth",
      });
    }
  };

  // Handle touch events for swipe navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && selectedImage < images.length - 1) {
      setSelectedImage(selectedImage + 1);
    }
    if (isRightSwipe && selectedImage > 0) {
      setSelectedImage(selectedImage - 1);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [isZoomed]);

  return (
    <>
      <div className="space-y-3 sm:space-y-4">
        {/* Main Image Display */}
        <div
          className="relative aspect-[4/5] bg-gray-100 rounded-lg overflow-hidden group"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <Image
            src={images[selectedImage] || "/placeholder.svg"}
            alt={`${productName} - изображение ${selectedImage + 1}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority
          />

          {/* Zoom Button */}
          <button
            type="button"
            onClick={() => setIsZoomed(true)}
            className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white"
          >
            <ZoomIn className="w-5 h-5" />
          </button>

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-4 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
              {selectedImage + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnail Gallery - скрыто на мобильных */}
        {images.length > 1 && (
          <div className="hidden sm:grid grid-cols-4 gap-1.5 sm:gap-2">
            {images.map((image, index) => (
              <button
                key={`thumbnail-${index}`}
                type="button"
                onClick={() => setSelectedImage(index)}
                className={`relative aspect-square bg-gray-100 rounded-md overflow-hidden border-2 transition-all ${selectedImage === index ? "border-black shadow-md" : "border-gray-200 hover:border-gray-300"
                  }`}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${productName} - миниатюра ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Индикаторы точек для мобильных */}
        {images.length > 1 && (
          <div className="flex justify-center space-x-2 sm:hidden">
            {images.map((_, index) => (
              <button
                key={`dot-${index}`}
                type="button"
                onClick={() => setSelectedImage(index)}
                className={`w-2 h-2 rounded-full transition-all ${selectedImage === index ? "bg-black" : "bg-gray-300"
                  }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Scrollable Photo Gallery Modal */}
      {isZoomed && (
        <div className="fixed inset-0 bg-black/95 z-[9999] flex">
          {/* Close Button */}
          <button
            type="button"
            onClick={() => setIsZoomed(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-20 bg-black/50 rounded-full p-3 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Thumbnail Sidebar */}
          {images.length > 1 && (
            <div className="w-24 md:w-32 bg-black/80 flex flex-col py-6 px-3 gap-3 overflow-y-auto">
              {images.map((image, index) => (
                <button
                  key={`modal-thumb-${index}`}
                  type="button"
                  onClick={() => scrollToImage(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${activeImageIndex === index
                    ? "border-white shadow-lg scale-105"
                    : "border-gray-500 hover:border-gray-300 opacity-70 hover:opacity-100"
                    }`}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${productName} - фото ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute bottom-1 right-1 bg-black/60 text-white text-xs px-1 rounded">
                    {index + 1}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Main Scrollable Photo Area */}
          <div className="flex-1 flex flex-col">
            <div
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto px-4 md:px-8 py-4 space-y-6"
              style={{ scrollBehavior: "smooth" }}
            >
              {images.map((image, index) => (
                <div
                  key={`modal-image-${index}`}
                  ref={(el) => {
                    imageRefs.current[index] = el;
                  }}
                  className="relative w-full max-w-4xl mx-auto"
                >
                  <div className="relative aspect-square md:aspect-[4/5] bg-white rounded-lg overflow-hidden shadow-2xl">
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${productName} - фото ${index + 1}`}
                      fill
                      className="object-contain"
                      priority={index === 0}
                    />
                  </div>

                </div>
              ))}

              {/* Bottom spacing */}
              <div className="h-20" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
