import { Alert, AlertDescription, AlertTitle } from "@qco/ui/components/alert";
import { Button } from "@qco/ui/components/button";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

type ErrorMessageProps = {
  error: Error | { message: string };
  showBackButton?: boolean;
  className?: string;
};

export function ErrorMessage({
  error,
  showBackButton = true,
  className = "",
}: ErrorMessageProps) {
  const router = useRouter();

  return (
    <div
      className={`flex min-h-[400px] items-center justify-center p-4 ${className}`}
    >
      <div className="w-full max-w-md space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Ошибка</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : error.message}
          </AlertDescription>
        </Alert>

        {showBackButton && (
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="w-full sm:w-auto"
            >
              Вернуться назад
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
