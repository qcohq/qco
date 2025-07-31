import { Avatar, AvatarFallback, AvatarImage } from "@qco/ui/components/avatar";
import type { OrderOutput } from "@qco/validators";
import { env } from "~/env";

export function OrderItemsTable({ order }: { order: OrderOutput }) {
  const getProductUrl = (slug: string) => {
    if (!env.NEXT_PUBLIC_WEB_APP_URL || !slug) return null;
    return `${env.NEXT_PUBLIC_WEB_APP_URL}/products/${slug}`;
  };

  const getProductInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };
  return (
    <section>
      <h2 className="text-lg font-semibold mb-2">Товары</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="px-2 py-1 text-left">Фото</th>
              <th className="px-2 py-1 text-left">Наименование</th>
              <th className="px-2 py-1 text-left">SKU</th>
              <th className="px-2 py-1 text-left">Кол-во</th>
              <th className="px-2 py-1 text-left">Цена</th>
            </tr>
          </thead>
          <tbody>
            {order.items?.map((item, idx) => (
              <tr
                key={`order-item-${item.productName}-${item.productSku}-${idx}`}
                className="border-b"
              >
                <td className="px-2 py-1">
                  {item.slug && getProductUrl(item.slug) ? (
                    <a
                      href={getProductUrl(item.slug)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Avatar className="h-8 w-8 hover:ring-2 hover:ring-primary/20 transition-all cursor-pointer">
                        {item.image ? (
                          <AvatarImage
                            src={item.image}
                            alt={item.productName}
                            className="object-cover"
                          />
                        ) : null}
                        <AvatarFallback className="text-xs font-semibold">
                          {getProductInitials(item.productName)}
                        </AvatarFallback>
                      </Avatar>
                    </a>
                  ) : (
                    <Avatar className="h-8 w-8">
                      {item.image ? (
                        <AvatarImage
                          src={item.image}
                          alt={item.productName}
                          className="object-cover"
                        />
                      ) : null}
                      <AvatarFallback className="text-xs font-semibold">
                        {getProductInitials(item.productName)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </td>
                <td className="px-2 py-1">
                  {item.slug && getProductUrl(item.slug) ? (
                    <a
                      href={getProductUrl(item.slug)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline hover:text-primary/80 transition-colors"
                    >
                      {item.productName}
                    </a>
                  ) : (
                    item.productName
                  )}
                </td>
                <td className="px-2 py-1">{item.productSku || "N/A"}</td>
                <td className="px-2 py-1">{item.quantity}</td>
                <td className="px-2 py-1">
                  {Number.parseFloat(item.unitPrice).toLocaleString("ru-RU")} ₽
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
