import { Badge } from "@qco/ui/components/badge";
import { Button } from "@qco/ui/components/button";
import type { OrderOutput } from "@qco/validators";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getStatusVariant } from "./status-variants";

interface OrderDetailsHeaderProps {
  order: OrderOutput;
}

export function OrderDetailsHeader({ order }: OrderDetailsHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center border-b px-4 md:px-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/orders">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Назад</span>
          </Link>
        </Button>
        <h1 className="truncate text-xl font-semibold">
          Заказ {order.orderNumber}
        </h1>
        <Badge
          variant={
            getStatusVariant(order.status) as
              | "default"
              | "secondary"
              | "destructive"
              | "outline"
          }
        >
          {order.status}
        </Badge>
      </div>
    </header>
  );
}
