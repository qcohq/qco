import Breadcrumbs from "@/components/breadcrumbs";
import HelpPage from "@/components/help-page";

export default function Help() {
  const breadcrumbItems = [
    { label: "Главная", href: "/" },
    { label: "Помощь", href: "/help" },
  ];

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbItems} />
        <HelpPage />
      </main></div>
  );
}
