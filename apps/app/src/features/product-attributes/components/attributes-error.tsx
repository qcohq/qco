"use client";

import { Alert, AlertDescription, AlertTitle } from "@qco/ui/components/alert";
import { AlertCircle } from "lucide-react";

interface AttributesErrorProps {
  error: Error;
}

export function AttributesError({ error }: AttributesErrorProps) {
  return (
    <Alert variant="destructive" className="my-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Ошибка</AlertTitle>
      <AlertDescription>
        {error.message || "Произошла ошибка при загрузке атрибутов"}
      </AlertDescription>
    </Alert>
  );
}
