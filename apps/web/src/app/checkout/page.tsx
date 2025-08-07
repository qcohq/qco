import Breadcrumbs from "@/components/breadcrumbs";
import CheckoutPage from "@/features/checkout/components/checkout-page";

export default function Checkout() {
  const breadcrumbItems = [
    { label: "Главная", href: "/" },
    { label: "Корзина", href: "/cart" },
    { label: "Оформление заказа", href: "/checkout" },
  ];

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbItems} />
        <CheckoutPage />
      </main></div>
  );
}
