import type { OrderOutput } from "@qco/validators";

export function PaymentInfo({ order }: { order: OrderOutput }) {
  return (
    <section>
      <h2 className="text-lg font-semibold mb-2">Оплата</h2>
      <div>
        <div>
          <span className="text-muted-foreground">Способ оплаты:</span>{" "}
          {order.paymentMethod || order.payment_method || "—"}
        </div>
        <div>
          <span className="text-muted-foreground">Статус оплаты:</span>{" "}
          {order.paymentStatus || order.payment_status || "—"}
        </div>
      </div>
    </section>
  );
}
