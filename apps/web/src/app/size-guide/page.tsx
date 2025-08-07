import Breadcrumbs from "@/components/breadcrumbs";
import SizeGuidePage from "@/components/size-guide-page";

export default function SizeGuide() {
  const breadcrumbItems = [
    { label: "Главная", href: "/" },
    { label: "Размерная сетка", href: "/size-guide" },
  ];

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbItems} />
        <SizeGuidePage />
      </main></div>
  );
}
