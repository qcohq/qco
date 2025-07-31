"use client";

import * as React from "react";
import { Badge } from "@qco/ui/components/badge";
import { useOrdersStats } from "~/hooks/use-orders-stats";

export const OrdersBadge = React.memo(function OrdersBadge() {
    const { newOrdersCount, isLoading } = useOrdersStats();

    if (isLoading || newOrdersCount === 0) {
        return null;
    }

    return (
        <Badge
            variant="destructive"
            className="ml-auto h-5 w-5 rounded-full p-0 text-xs font-medium"
        >
            {newOrdersCount > 99 ? "99+" : newOrdersCount}
        </Badge>
    );
}); 