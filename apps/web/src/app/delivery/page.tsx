import Breadcrumbs from "@/components/breadcrumbs";
import DeliveryPage from "@/components/delivery-page";
export default function Delivery() {
  const breadcrumbItems = [
    { label: "Главная", href: "/" },
    { label: "Доставка и оплата", href: "/delivery" },
  ];

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbItems} />
        <DeliveryPage />
      </main></div>
  );
}
