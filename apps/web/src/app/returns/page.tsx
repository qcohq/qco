import Breadcrumbs from "@/components/breadcrumbs";
import ReturnsPage from "@/components/returns-page";

export default function Returns() {
  const breadcrumbItems = [
    { label: "Главная", href: "/" },
    { label: "Возврат и обмен", href: "/returns" },
  ];

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbItems} />
        <ReturnsPage />
      </main></div>
  );
}
