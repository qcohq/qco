import Breadcrumbs from "@/components/breadcrumbs";
import FavoritesPage from "@/features/favorites/components/favorites-page";

export default function Favorites() {
  const breadcrumbItems = [
    { label: "Главная", href: "/" },
    { label: "Избранное", href: "/favorites" },
  ];

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
        <Breadcrumbs items={breadcrumbItems} />
        <FavoritesPage />
      </main></div>
  );
}
