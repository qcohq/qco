import { Button } from "@qco/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@qco/ui/components/card";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorBoundaryProps {
  error: string;
  onRetry?: () => void;
  title?: string;
  description?: string;
}

export function ErrorBoundary({
  error,
  onRetry,
  title = "Произошла ошибка",
  description = "Что-то пошло не так при загрузке данных",
}: ErrorBoundaryProps) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="h-12 w-12 text-red-500" />
        </div>
        <CardTitle className="text-red-600">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
          {error}
        </div>
        {onRetry && (
          <Button onClick={onRetry} className="w-full" variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Попробовать снова
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
