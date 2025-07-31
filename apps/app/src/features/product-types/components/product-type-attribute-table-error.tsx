import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductTypeAttributeTableErrorProps {
  error: Error;
}

export function ProductTypeAttributeTableError({
  error,
}: ProductTypeAttributeTableErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 space-y-4">
      <AlertCircle className="h-12 w-12 text-destructive" />
      <div className="text-center">
        <h3 className="text-lg font-semibold">Failed to load attributes</h3>
        <p className="text-muted-foreground">{error.message}</p>
      </div>
      <Button variant="outline" onClick={() => window.location.reload()}>
        <RefreshCw className="mr-2 h-4 w-4" />
        Try Again
      </Button>
    </div>
  );
}
