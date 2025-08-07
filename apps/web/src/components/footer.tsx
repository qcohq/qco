"use client";

import { Button } from "@qco/ui/components/button";
import {
  ChevronDown,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Footer() {
  const [openSections, setOpenSections] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId],
    );
  };

  const footerSections = [
    {
      id: "shopping",
      title: "Покупки",
      links: [
        { label: "Женщинам", href: "/" },
        { label: "Мужчинам", href: "/men" },
        { label: "Красота", href: "/beauty" },
        { label: "Аксессуары", href: "/accessories" },
        { label: "Распродажа", href: "/sale" },
      ],
    },
    {
      id: "service",
      title: "Обслуживание",
      links: [
        { label: "Контакты", href: "/contact" },
        { label: "Доставка", href: "/delivery" },
        { label: "Возврат", href: "/returns" },
        { label: "Размерная сетка", href: "/size-guide" },
        { label: "Помощь", href: "/help" },
      ],
    },
  ];

  return (
    <footer className="bg-black text-white w-full">
      <div className="px-4 py-16 max-w-[1168px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Image
              src="/eleganter-logo.svg"
              alt="Eleganter"
              width={240}
              height={80}
              className="h-20 w-auto brightness-0 invert"
            />
            <p className="text-gray-400 text-sm leading-relaxed">
              Роскошный универмаг с более чем 160-летней историей. Эксклюзивные
              коллекции от ведущих мировых брендов.
            </p>
            <div className="flex space-x-4">
              <Button
                size="icon"
                variant="ghost"
                className="text-gray-400 hover:text-white hover:bg-transparent"
              >
                <Instagram className="h-5 w-5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="text-gray-400 hover:text-white hover:bg-transparent"
              >
                <Facebook className="h-5 w-5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="text-gray-400 hover:text-white hover:bg-transparent"
              >
                <Twitter className="h-5 w-5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="text-gray-400 hover:text-white hover:bg-transparent"
              >
                <Youtube className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Mobile Accordion Sections */}
          {footerSections.map((section) => (
            <div key={section.id} className="md:space-y-4">
              {/* Mobile Accordion Header */}
              <button
                type="button"
                onClick={() => toggleSection(section.id)}
                className="flex items-center justify-between w-full py-3 md:py-0 md:pointer-events-none border-b border-gray-700 md:border-0"
              >
                <h3 className="font-semibold text-left">{section.title}</h3>
                <ChevronDown
                  className={`h-4 w-4 transition-transform md:hidden ${openSections.includes(section.id) ? "rotate-180" : ""
                    }`}
                />
              </button>

              {/* Links - Hidden on mobile unless expanded */}
              <div
                className={`space-y-2 text-sm overflow-hidden transition-all duration-300 ${openSections.includes(section.id) ||
                  (
                    isMounted &&
                    typeof window !== "undefined" &&
                    window.innerWidth >= 768
                  )
                  ? "max-h-96 opacity-100 pb-4 md:pb-0"
                  : "max-h-0 opacity-0 md:max-h-96 md:opacity-100"
                  }`}
              >
                {section.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block text-gray-400 hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © 2024 Eleganter. Все права защищены.
            </div>
            <div className="flex space-x-6 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-white">
                Политика конфиденциальности
              </Link>
              <Link href="/terms" className="hover:text-white">
                Условия использования
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
