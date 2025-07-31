import { Badge } from "@qco/ui/components/badge";
import { cn } from "@qco/ui/lib/utils";
import type { BrandStatus } from "@/features/brands/types";

// TODO: Использовать тип из схемы пропсов бейджа статуса бренда, если появится в @qco/validators
interface BrandStatusBadgeProps {
  status: BrandStatus;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function BrandStatusBadge({
  status,
  size = "md",
  className,
}: BrandStatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "active":
        return {
          label: "Активен",
          variant: "success" as const,
        };
      case "inactive":
        return {
          label: "Неактивен",
          variant: "destructive" as const,
        };
      case "pending":
        return {
          label: "Ожидает",
          variant: "warning" as const,
        };
      case "draft":
        return {
          label: "Черновик",
          variant: "outline" as const,
        };
      case "archived":
        return {
          label: "Архив",
          variant: "secondary" as const,
        };
      default:
        return {
          label: "Неизвестно",
          variant: "outline" as const,
        };
    }
  };

  const { label, variant } = getStatusConfig();
  const sizeClasses = {
    sm: "text-xs py-0 px-2 h-5",
    md: "text-xs py-0.5 px-2.5",
    lg: "text-sm py-1 px-3",
  };

  return (
    <Badge variant={variant} className={cn(sizeClasses[size], className)}>
      {label}
    </Badge>
  );
}
