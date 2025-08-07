"use client";

import { Alert, AlertDescription } from "@qco/ui/components/alert";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

interface AuthErrorProps {
  error: string | null;
  className?: string;
}

export function AuthError({ error, className = "" }: AuthErrorProps) {
  return (
    <AnimatePresence>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -10, height: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <Alert variant="destructive" className={className}>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
