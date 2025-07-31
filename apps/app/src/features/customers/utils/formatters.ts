export const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
  }).format(amount);
};

export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString("ru-RU");
};
