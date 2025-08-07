"use client";

import { Alert, AlertDescription } from "@qco/ui/components/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@qco/ui/components/card";
import { CheckCircle } from "lucide-react";

interface AuthSuccessProps {
  title: string;
  message: string;
  onAction?: () => void;
  actionText?: string;
}

export function AuthSuccess() {
  return (
    <div className="flex min-h-screen-content items-center justify-center bg-white px-2 py-12">
      <Card className="w-full max-w-md shadow-lg border border-slate-200 rounded-2xl bg-white">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold">Успешно!</CardTitle>
          <CardDescription>Вы успешно авторизованы.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900">
              {/* title */}
            </h2>
            <p className="text-sm text-gray-600">{/* message */}</p>
          </div>

          {/* onAction && actionText && ( */}
          <button
            onClick={() => {}} // Placeholder for onAction
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            {/* actionText */}
          </button>
          {/* ) */}
        </CardContent>
      </Card>
    </div>
  );
}
