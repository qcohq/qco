"use client";

import { Alert, AlertDescription } from "@qco/ui/components/alert";
import { Button } from "@qco/ui/components/button";
import { Mail, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../hooks/use-auth";

interface EmailVerificationBannerProps {
    email: string;
    onDismiss?: () => void;
}

export function EmailVerificationBanner({
    email,
    onDismiss
}: EmailVerificationBannerProps) {
    const [isDismissed, setIsDismissed] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const { requestEmailVerification } = useAuth();

    const handleDismiss = () => {
        setIsDismissed(true);
        onDismiss?.();
    };

    const handleResendEmail = async () => {
        setIsResending(true);
        try {
            const result = await requestEmailVerification(email);
            if (!result.success) {
                console.error("Failed to resend verification email:", result.error);
            }
        } catch (error) {
            console.error("Failed to resend verification email:", error);
        } finally {
            setIsResending(false);
        }
    };

    if (isDismissed) {
        return null;
    }

    return (
        <Alert className="border-yellow-200 bg-yellow-50 text-yellow-800 mb-6 shadow-sm">
            <Mail className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
                <AlertDescription className="text-sm leading-relaxed !col-start-1">
                    <strong className="block mb-1 text-yellow-900">Подтвердите ваш email адрес</strong>
                    <span className="block text-yellow-800">
                        Мы отправили письмо с подтверждением на <span className="font-medium break-all text-yellow-900">{email}</span>.
                        Пожалуйста, проверьте вашу почту и перейдите по ссылке для подтверждения.
                    </span>
                </AlertDescription>
                <div className="flex flex-col sm:flex-row gap-2 mt-3 !col-start-1">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleResendEmail}
                        disabled={isResending}
                        className="border-yellow-300 text-yellow-700 hover:bg-yellow-100 hover:border-yellow-400 transition-colors w-full sm:w-auto"
                    >
                        {isResending ? "Отправка..." : "Отправить повторно"}
                    </Button>
                </div>
            </div>
            <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100 p-1 h-auto flex-shrink-0 absolute top-2 right-2"
                aria-label="Закрыть уведомление"
            >
                <X className="h-4 w-4" />
            </Button>
        </Alert>
    );
} 