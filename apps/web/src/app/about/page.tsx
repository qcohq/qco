import AboutPage from "@/components/about-page";
import Breadcrumbs from "@/components/breadcrumbs";
export default function About() {
  const breadcrumbItems = [
    { label: "Главная", href: "/" },
    { label: "О компании", href: "/about" },
  ];

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbItems} />
        <AboutPage />
      </main></div>
  );
}
