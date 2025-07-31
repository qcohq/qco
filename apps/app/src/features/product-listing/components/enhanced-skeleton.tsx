import { cn } from "@qco/ui/lib/utils";

interface EnhancedSkeletonProps extends React.ComponentProps<"div"> {
  variant?: "default" | "text" | "circular" | "rectangular";
  animation?: "pulse" | "shimmer" | "wave";
}

function EnhancedSkeleton({
  className,
  variant = "default",
  animation = "pulse",
  ...props
}: EnhancedSkeletonProps) {
  const baseClasses = "bg-muted";

  const variantClasses = {
    default: "rounded-md",
    text: "rounded",
    circular: "rounded-full",
    rectangular: "rounded-none",
  };

  const animationClasses = {
    pulse: "animate-pulse",
    shimmer:
      "animate-shimmer bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%]",
    wave: "animate-wave",
  };

  return (
    <div
      data-slot="enhanced-skeleton"
      className={cn(
        baseClasses,
        variantClasses[variant],
        animationClasses[animation],
        className,
      )}
      {...props}
    />
  );
}

// Специализированные скелетоны для разных элементов
export function TextSkeleton({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <EnhancedSkeleton
      variant="text"
      className={cn("h-4 w-full", className)}
      {...props}
    />
  );
}

export function AvatarSkeleton({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <EnhancedSkeleton
      variant="circular"
      className={cn("h-12 w-12", className)}
      {...props}
    />
  );
}

export function ImageSkeleton({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <EnhancedSkeleton
      variant="rectangular"
      className={cn("h-32 w-full", className)}
      {...props}
    />
  );
}

export function ButtonSkeleton({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <EnhancedSkeleton
      variant="default"
      className={cn("h-10 w-20", className)}
      {...props}
    />
  );
}

export { EnhancedSkeleton };
