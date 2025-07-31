import { Card, type CardProps } from "@qco/ui/components/card";
import { motion } from "framer-motion";

// TODO: Использовать тип из схемы пропсов анимированной карточки, если появится в @qco/validators
type AnimatedCardProps = CardProps & {
  delay?: number;
};

export function AnimatedCard({
  children,
  delay = 0,
  ...props
}: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card {...props}>{children}</Card>
    </motion.div>
  );
}
