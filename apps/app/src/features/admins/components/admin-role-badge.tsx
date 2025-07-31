"use client";

import { Badge } from "@qco/ui/components/badge";
import type { AdminRole } from "@qco/validators";

// TODO: Использовать тип из схемы пропсов роли админа, если появится в @qco/validators
interface AdminRoleBadgeProps {
  role: AdminRole;
  className?: string;
}

const roleConfig = {
  super_admin: {
    label: "Супер-админ",
    variant: "destructive" as const,
  },
  admin: {
    label: "Администратор",
    variant: "default" as const,
  },
  moderator: {
    label: "Модератор",
    variant: "secondary" as const,
  },
  editor: {
    label: "Редактор",
    variant: "outline" as const,
  },
} as const;

export function AdminRoleBadge({ role, className }: AdminRoleBadgeProps) {
  const config = roleConfig[role];

  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
}
