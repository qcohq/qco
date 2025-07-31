"use client";

import { Badge } from "@qco/ui/components/badge";

// TODO: Использовать тип из схемы пропсов статуса админа, если появится в @qco/validators
export function AdminStatusBadge({
  isActive,
  className,
}: {
  isActive: boolean;
  className?: string;
}) {
  return (
    <Badge variant={isActive ? "default" : "secondary"} className={className}>
      {isActive ? "Активен" : "Неактивен"}
    </Badge>
  );
}
