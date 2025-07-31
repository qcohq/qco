// Варианты бейджей для статуса заказа и оплаты

export function getStatusVariant(
  status: string,
): "default" | "secondary" | "destructive" | "outline" | "success" | "warning" {
  switch (status) {
    case "PENDING":
      return "warning";
    case "PROCESSING":
      return "secondary";
    case "SHIPPED":
      return "default";
    case "DELIVERED":
      return "success";
    case "CANCELLED":
      return "destructive";
    case "REFUNDED":
      return "outline";
    default:
      return "default";
  }
}

export function getPaymentStatusVariant(
  status: string,
): "default" | "secondary" | "destructive" | "outline" | "success" | "warning" {
  switch (status) {
    case "PENDING":
      return "warning";
    case "PROCESSING":
      return "secondary";
    case "COMPLETED":
      return "success";
    case "FAILED":
      return "destructive";
    case "REFUNDED":
      return "outline";
    default:
      return "default";
  }
}
