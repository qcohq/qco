import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@qco/ui/components/navigation-menu";
import { Skeleton } from "@qco/ui/components/skeleton";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState, memo, useEffect, useRef } from "react";
import {
  useChildrenByParentSlug,
  useSubcategories,
} from "../hooks/use-categories";

// Функция для получения статических категорий с учетом раздела
function getStaticCategories(section: "women" | "men" | "kids") {
  const basePath =
    section === "women" ? "/women" : section === "men" ? "/men" : "/kids";
  return [
    {
      id: "new",
      name: "Новинки",
      slug: "new",
      href: `${basePath}/new`,
      hasDropdown: false,
    },
    {
      id: "sale",
      name: "Sale",
      slug: "sale",
      href: `${basePath}/sale`,
      hasDropdown: false,
    },
    {
      id: "brands",
      name: "Бренды",
      slug: "brands",
      href: `${basePath}/brands`,
      hasDropdown: false,
    },
  ];
}

// Маппинг родительских категорий для каждого раздела
const PARENT_CATEGORY_MAP = {
  women: "zhenschinam",
  men: "muzhchinam",
  kids: "detyam",
};

function getSectionByPath(pathname: string): "women" | "men" | "kids" {
  if (pathname.startsWith("/men")) return "men";
  if (pathname.startsWith("/kids")) return "kids";
  return "women";
}

// Мемоизируем компонент CategoryWithDropdown
const CategoryWithDropdown = memo(function CategoryWithDropdown({
  category,
  categoryId,
}: {
  category: {
    id: string;
    name: string;
    slug: string;
    href: string;
    hasDropdown: boolean;
  };
  categoryId: string;
}) {
  // Используем состояние для отслеживания, открыто ли меню
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Загружаем подкатегории только когда меню открыто
  const { data: subcategories, isLoading } = useSubcategories(
    isOpen ? categoryId : ""
  );

  // Очищаем таймер при размонтировании
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    // Очищаем предыдущий таймер
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    // Небольшая задержка перед закрытием, чтобы пользователь мог перейти к подкатегориям
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 100);
  };

  return (
    <>
      <NavigationMenuTrigger
        className={`${navigationMenuTriggerStyle()} [&>svg]:hidden`}
        onPointerEnter={handleMouseEnter}
        onPointerLeave={handleMouseLeave}
      >
        {category.name}
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <div
          className="w-[600px] p-6"
          onPointerEnter={handleMouseEnter}
          onPointerLeave={handleMouseLeave}
        >
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="font-medium text-base mb-4 uppercase tracking-wide">
                {category.name}
              </h3>
              <div className="mb-3">
                <NavigationMenuLink asChild>
                  <Link
                    href={`/catalog/${category.slug}`}
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
                  >
                    Все товары
                  </Link>
                </NavigationMenuLink>
              </div>
              <div className="space-y-1">
                {isLoading
                  ? // Скелетон для загрузки подкатегорий
                  Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-4 w-32" />
                  ))
                  : (subcategories || [])?.map((subcategory) => (
                    <NavigationMenuLink key={subcategory.id} asChild>
                      <Link
                        href={`/catalog/${subcategory.slug}`}
                        className="block text-sm text-foreground hover:text-primary transition-colors py-1"
                      >
                        {subcategory.name}
                      </Link>
                    </NavigationMenuLink>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </NavigationMenuContent>
    </>
  );
});

// Мемоизируем основной компонент CategoryDropdown
export const CategoryDropdown = memo(function CategoryDropdown() {
  const pathname = usePathname();
  const section = getSectionByPath(pathname);
  const parentCategorySlug = PARENT_CATEGORY_MAP[section];

  // Получаем динамические подкатегории из базы данных
  const { data: dynamicCategories, isLoading: isLoadingDynamic } =
    useChildrenByParentSlug(parentCategorySlug);

  // Мемоизируем вычисление allCategories
  const allCategories = useMemo(() => {
    if (isLoadingDynamic || !dynamicCategories) {
      return getStaticCategories(section);
    }

    const staticCategories = getStaticCategories(section);
    return [
      ...staticCategories,
      ...dynamicCategories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        href: cat.href,
        hasDropdown: true,
      })),
    ];
  }, [section, dynamicCategories, isLoadingDynamic]);

  if (isLoadingDynamic) {
    return (
      <div className="hidden md:block border-b bg-background w-full">
        <div className="px-4 max-w-[1168px] mx-auto">
          <div className="flex space-x-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-20" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hidden md:block bg-background w-full">
      <div className="px-4 max-w-[1168px] mx-auto border-b">
        <NavigationMenu>
          <NavigationMenuList className="space-x-8">
            {allCategories.map((category) => (
              <NavigationMenuItem key={category.id}>
                {category.hasDropdown ? (
                  <CategoryWithDropdown
                    category={category}
                    categoryId={category.id}
                  />
                ) : (
                  <NavigationMenuLink asChild>
                    <Link
                      href={category.href}
                      className={`text-sm font-medium transition-colors ${pathname === category.href
                        ? "text-primary font-semibold underline underline-offset-4"
                        : "hover:text-primary"
                        }`}
                    >
                      {category.name}
                    </Link>
                  </NavigationMenuLink>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
});