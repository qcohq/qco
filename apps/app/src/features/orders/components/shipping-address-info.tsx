import type { OrderOutput } from "@qco/validators";

function _renderShippingAddress(shippingAddress: unknown) {
  if (!shippingAddress) return "—";
  if (typeof shippingAddress === "string") return shippingAddress;
  if (typeof shippingAddress === "object") {
    const { street, city, region, postalCode, country } = shippingAddress;
    return (
      [street, city, region, postalCode, country].filter(Boolean).join(", ") ||
      JSON.stringify(shippingAddress)
    );
  }
  return String(shippingAddress);
}

export function ShippingAddressInfo({ order }: { order: OrderOutput }) {
  return (
    <section>
      <h2 className="text-lg font-semibold mb-2">Доставка</h2>
      <div>
        <div>
          <span className="text-muted-foreground">Адрес ID:</span>{" "}
          {order.shippingAddressId || "—"}
        </div>
        <div>
          <span className="text-muted-foreground">Способ:</span>{" "}
          {order.shippingMethod || "—"}
        </div>
      </div>
    </section>
  );
}
