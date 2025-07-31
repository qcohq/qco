import type { OrderOutput } from "@qco/validators";

export function OrderTabs({ order: _ }: { order: OrderOutput }) {
  return (
    <section>
      <h2 className="text-lg font-semibold mb-2">Дополнительно</h2>
      <div className="mt-2">
        {/* Здесь могут быть ваши вкладки/заметки/документы */}
        <div className="text-muted-foreground text-sm">
          Документы и заметки по заказу будут тут.
        </div>
      </div>
    </section>
  );
}
