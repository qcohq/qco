"use client";

import { Alert, AlertDescription, AlertTitle } from "@qco/ui/components/alert";
import { AlertCircle } from "lucide-react";

interface ProductTypeErrorProps {
  error: Error;
}

export function ProductTypeError({ error }: ProductTypeErrorProps) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Ошибка</AlertTitle>
      <AlertDescription>
        Не удалось загрузить типы продуктов: {error.message}
      </AlertDescription>
    </Alert>
  );
}
