import { motion } from "framer-motion";

type LoadingSpinnerProps = {
  size?: "sm" | "md" | "lg";
};

export function LoadingSpinner({ size = "md" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} border-4 border-primary border-t-transparent rounded-full`}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Number.POSITIVE_INFINITY,
        ease: "linear",
      }}
    />
  );
}
