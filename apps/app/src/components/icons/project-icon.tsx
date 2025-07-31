import type { LucideProps } from "lucide-react";

export function ProjectIcon({ className, ...props }: LucideProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Дом с корзиной покупок */}
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9,22 9,12 15,12 15,22" />
      {/* Корзина покупок */}
      <path d="M6 5h12l-1 4H7L6 5z" />
      <circle cx="9" cy="9" r="1" />
    </svg>
  );
}
