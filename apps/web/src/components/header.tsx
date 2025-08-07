"use client";

import { Button } from "@qco/ui/components/button";
import { Heart, Search, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CartBadge } from "@/features/cart/components";
import { CategoryDropdown } from "@/features/categories/components/category-dropdown";
import { useActiveRootCategory } from "@/hooks/use-active-root-category";
import { SearchOverlay } from "@/features/search/components/search-overlay";
import { FavoritesBadge } from "@/features/favorites/components";

export default function Header() {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Определяем slug товара, если мы находимся на странице товара
  let productSlug: string | undefined;
  const productMatch = pathname.match(/^\/products\/([^/]+)/);
  if (productMatch) {
    productSlug = productMatch[1];
  }

  // Получаем активную корневую категорию для меню
  // Хук всегда вызывается, но может вернуть null если productSlug не определен
  const activeRoot = useActiveRootCategory(productSlug);

  // Определяем активный пункт меню на основе pathname (для обычных страниц)
  const getActiveFromPathname = () => {
    if (
      pathname === "/" ||
      pathname.startsWith("/women") ||
      pathname.startsWith("/catalog/women") ||
      pathname.startsWith("/catalog/zhenschinam")
    ) {
      return "women";
    }
    if (
      pathname.startsWith("/men") ||
      pathname.startsWith("/catalog/men") ||
      pathname.startsWith("/catalog/muzhchinam")
    ) {
      return "men";
    }
    if (
      pathname.startsWith("/kids") ||
      pathname.startsWith("/catalog/kids") ||
      pathname.startsWith("/catalog/detyam")
    ) {
      return "kids";
    }
    return null;
  };

  // Используем активную категорию из товара или из pathname
  const activeCategory = activeRoot || getActiveFromPathname();

  return (
    <header className="sticky top-0 z-[100] w-full bg-white">
      {/* Top Bar - Desktop Only */}
      <div className="hidden md:block bg-black text-white text-xs">
        <div className="container mx-auto px-4 py-2 flex flex-row justify-between items-center gap-2 md:gap-0">
          <div className="flex items-center gap-4">
            <span className="ml-4">8 800 333 49 29</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://t.me/yourtelegram"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Telegram"
            >
              {/* Lucide Telegram icon, fallback to SVG if not present */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M22 4L12 20l-3-7-7-3z" />
              </svg>
            </a>
            <a
              href="https://instagram.com/yourinstagram"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              {/* Lucide Instagram icon, fallback to SVG if not present */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="5" />
                <circle cx="17" cy="7" r="1.5" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="w-full">
        {/* Main Categories - Level 1 */}
        <div className="flex items-center justify-between h-16 px-4 border-b max-w-[1168px] mx-auto">
          <div className="flex items-center space-x-8">
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className={`text-sm font-medium transition-colors ${activeCategory === "women" ? "text-primary font-semibold underline underline-offset-4" : "hover:text-primary"}`}
              >
                ЖЕНСКОЕ
              </Link>
              <Link
                href="/men"
                className={`text-sm font-medium transition-colors ${activeCategory === "men" ? "text-primary font-semibold underline underline-offset-4" : "hover:text-primary"}`}
              >
                МУЖСКОЕ
              </Link>
              <Link
                href="/kids"
                className={`text-sm font-medium transition-colors ${activeCategory === "kids" ? "text-primary font-semibold underline underline-offset-4" : "hover:text-primary"}`}
              >
                ДЕТСКОЕ
              </Link>
            </nav>

            {/* Mobile Search Button - Left of Logo */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden"
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>

          {/* Center - Logo */}
          <Link href="/" className="flex items-center">
            <svg
              width="180"
              height="50"
              viewBox="0 0 203 45"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-auto"
            >
              <path
                d="M0 34.0186H17.0412V31.3913H2.65335V21.8882H15.4031V19.236H2.65335V3.6646H17.0412V1.00621H0V34.0186Z"
                fill="black"
              />
              <path
                d="M29.3675 1.00621H26.6892V34.0186H29.3675V1.00621Z"
                fill="black"
              />
              <path
                d="M57.1342 12.7143C55.602 11.3478 53.7023 10.3478 51.5659 9.87578C45.6115 8.57143 39.5947 11.7764 37.4085 17.4162C35.2223 23.0559 37.5331 29.4286 42.8336 32.4037C48.1278 35.3789 54.8172 34.0683 58.5793 29.3354C58.3924 29.1863 56.6173 27.7826 56.5052 27.6957C54.0574 30.7826 49.959 32.0807 46.1596 30.9627C42.3602 29.8447 39.6321 26.5466 39.2833 22.6335H61.189C61.4631 18.764 59.8748 15.1491 57.1342 12.7019V12.7143ZM39.4141 20.0186C40.2736 15.4907 44.2599 12.2174 48.9064 12.2174C53.5528 12.2174 55.2159 13.8944 56.9598 16.4969C57.6574 17.5404 58.1557 18.7267 58.3986 20.0186H39.4141Z"
                fill="black"
              />
              <path
                d="M115.857 14.2298C112.811 10.4099 107.766 8.75155 103.02 10.0062C98.2736 11.2609 94.7296 15.1988 94.0133 20.0186H89.8776V9.59006H87.1993V14.1925C83.9418 10.1366 78.4545 8.56521 73.5153 10.2671C68.5698 11.9752 65.25 16.5963 65.25 21.7888C65.25 26.9814 68.5636 31.6087 73.5153 33.3106C78.4545 35.0124 83.9418 33.441 87.1993 29.3851V33.3478C86.8505 37.1863 84.2034 40.3975 80.485 41.5217C76.7665 42.6398 72.7367 41.4161 70.2889 38.4224C70.2826 38.4286 70.2764 38.4348 70.2764 38.4348C70.2764 38.4348 68.4764 39.9006 68.2397 40.0932C71.3913 43.9379 76.5984 45.4907 81.3694 44C86.1592 42.5031 89.5412 38.2484 89.8776 33.2795V22.6398H93.9137C94.2687 27.6584 97.7006 31.9503 102.553 33.441C107.417 34.9379 112.705 33.3106 115.863 29.3478V34.0124H118.516V9.57764H115.863V14.2174L115.857 14.2298ZM77.3832 31.3665C72.3069 31.2733 68.1712 27.3043 67.9158 22.2795C67.6604 17.2547 71.3664 12.8882 76.4115 12.2857C81.4628 11.6832 86.1218 15.0621 87.0623 20.0186H74.5367V22.646H87.1931C86.7446 27.6522 82.4656 31.4596 77.3894 31.3665H77.3832ZM115.844 22.2795C115.589 27.3043 111.447 31.2733 106.377 31.3665C101.307 31.4596 97.0279 27.6522 96.5732 22.646H109.198V20.0186H96.704C97.6445 15.0621 102.303 11.6832 107.355 12.2857C112.394 12.8882 116.106 17.2547 115.844 22.2795Z"
                fill="black"
              />
              <path
                d="M175.377 9.65839C168.799 8.95031 162.826 13.5217 161.861 20.0124H154.505V1H151.826V20.0124H145.181C145.417 15.7205 142.845 11.795 138.846 10.2422C135.009 8.75156 130.643 9.74534 127.847 12.7453V9.58385H125.168V34.0186H127.847V19.5093C127.847 16.9193 129.267 14.5093 131.534 13.2112C133.801 11.913 136.592 11.913 138.852 13.2112C141.269 14.5901 142.695 17.2236 142.496 20.0124H134.505V22.6398H142.515V34.0186H145.168V22.6398H151.826V24.1056C151.826 26.7329 152.879 29.2547 154.754 31.118C156.629 32.9752 159.164 34.0186 161.811 34.0248V31.3975C161.811 31.3975 161.811 31.3851 161.811 31.3665C157.787 31.3416 154.536 28.1056 154.536 24.1118V22.646H161.761C162.116 27.6832 165.56 31.9752 170.431 33.4596C175.296 34.9379 180.571 33.3043 183.717 29.3416C183.523 29.1863 181.642 27.7019 181.642 27.7019C179.195 30.7888 175.096 32.087 171.297 30.9689C167.497 29.8509 164.769 26.5528 164.421 22.6398H186.326C186.787 16.0994 181.954 10.3665 175.377 9.65839ZM183.511 20.0124H164.551C165.411 15.4907 169.397 12.2112 174.044 12.2112C178.69 12.2112 180.353 13.8882 182.097 16.4969C182.795 17.5342 183.293 18.7205 183.536 20.0186H183.505H183.511Z"
                fill="black"
              />
              <path
                d="M203 9.55901C200.222 9.57143 197.575 10.7267 195.694 12.7515V9.59006H193.016V34.0248H195.694V19.5031C195.694 17.5776 196.466 15.7329 197.837 14.3727C199.207 13.0124 201.063 12.2484 203 12.2484V9.59006C203 9.59006 203 9.57764 203 9.56522V9.55901Z"
                fill="black"
              />
            </svg>
          </Link>

          {/* Right - Actions */}
          <div className="flex items-center space-x-2">
            {/* Desktop Search Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="hidden md:flex"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Mobile Cart Button */}
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="md:hidden relative"
            >
              <Link href="/cart">
                <ShoppingBag className="h-5 w-5" />
                <CartBadge />
              </Link>
            </Button>

            <div className="hidden md:flex items-center space-x-2">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/favorites" className="relative">
                  <Heart className="h-5 w-5" />
                  <FavoritesBadge />
                </Link>
              </Button>

              <Button variant="ghost" size="icon" asChild>
                <Link href="/profile">
                  <User className="h-5 w-5" />
                </Link>
              </Button>

              <Button variant="ghost" size="icon" asChild>
                <Link href="/cart" className="relative">
                  <ShoppingBag className="h-5 w-5" />
                  <CartBadge />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Search Overlay */}
        <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

        {/* Secondary Navigation - Level 2 - Desktop Only */}
        <CategoryDropdown />

        {/* Mobile Navigation - Original Simple Version */}
        <div className="block md:hidden">
          <div className="px-4 py-2 max-w-[1168px] mx-auto">
            <div className="flex justify-between gap-2">
              <Link
                href="/"
                className={`flex-1 text-center p-3 text-sm font-medium rounded-lg transition-colors hover:bg-gray-50 border ${activeCategory === "women" ? "border-black" : "border-transparent"}`}
              >
                ЖЕНСКОЕ
              </Link>
              <Link
                href="/men"
                className={`flex-1 text-center p-3 text-sm font-medium rounded-lg transition-colors hover:bg-gray-50 border ${activeCategory === "men" ? "border-black" : "border-transparent"}`}
              >
                МУЖСКОЕ
              </Link>
              <Link
                href="/kids"
                className={`flex-1 text-center p-3 text-sm font-medium rounded-lg transition-colors hover:bg-gray-50 border ${activeCategory === "kids" ? "border-black" : "border-transparent"}`}
              >
                ДЕТСКОЕ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
