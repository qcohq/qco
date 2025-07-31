import { cn } from "@qco/ui/lib/utils";

interface ErrorMessageProps {
  message: string;
  className?: string;
}

export function ErrorMessage({ message, className }: ErrorMessageProps) {
  return (
    <p
      className={cn("text-sm font-medium text-destructive mt-1", className)}
      role="alert"
    >
      {message}
    </p>
  );
}
