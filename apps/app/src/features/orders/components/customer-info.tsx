import type { OrderOutput } from "@qco/validators";

export function CustomerInfo({ order }: { order: OrderOutput }) {
  return (
    <section>
      <h2 className="text-lg font-semibold mb-2">Клиент</h2>
      <div>
        <div className="font-medium">
          {order.customerName || order.customer_name || "—"}
        </div>
        <div className="text-muted-foreground text-sm">
          ID: {order.customerId || "—"}
        </div>
        {order.customerEmail && (
          <div className="text-muted-foreground text-sm">
            Email: {order.customerEmail}
          </div>
        )}
        {order.customer_email && (
          <div className="text-muted-foreground text-sm">
            Email: {order.customer_email}
          </div>
        )}
        {order.customerPhone && (
          <div className="text-muted-foreground text-sm">
            Телефон: {order.customerPhone}
          </div>
        )}
        {order.customer_phone && (
          <div className="text-muted-foreground text-sm">
            Телефон: {order.customer_phone}
          </div>
        )}
      </div>
    </section>
  );
}
