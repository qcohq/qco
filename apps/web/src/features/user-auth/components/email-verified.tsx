"use client";

import { Button } from "@qco/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@qco/ui/components/card";
import { ArrowRight, CheckCircle, Mail, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { useTRPC } from "@/trpc/react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

function EmailVerifiedContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const trpc = useTRPC();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const token = searchParams.get('token');

  // Мутация для подтверждения email
  const verifyEmailMutationOptions = trpc.auth.verifyEmail.mutationOptions({
    onSuccess: (data) => {
      setVerificationStatus('success');
      toast.success(data.message);
    },
    onError: (error) => {
      setVerificationStatus('error');
      setErrorMessage(error.message || "Не удалось подтвердить email");
      toast.error(error.message || "Не удалось подтвердить email");
    },
  });

  const { mutate: verifyEmail, isPending } = useMutation(verifyEmailMutationOptions);

  useEffect(() => {
    if (!token) {
      setVerificationStatus('error');
      setErrorMessage('Токен подтверждения отсутствует');
      return;
    }

    // Выполняем подтверждение email
    verifyEmail({ token });
  }, [token, verifyEmail]);

  if (verificationStatus === 'loading' || isPending) {
    return (
      <div className="flex min-h-screen-content items-center justify-center bg-white px-2 py-12 flex-col">
        <Card className="w-full max-w-md shadow-lg border border-slate-200 rounded-2xl bg-white">
          <CardHeader className="space-y-2 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
            <CardTitle className="text-2xl font-bold text-blue-700">
              Подтверждение email
            </CardTitle>
            <CardDescription className="text-base">
              Проверяем токен подтверждения...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (verificationStatus === 'error') {
    return (
      <div className="flex min-h-screen-content items-center justify-center bg-white px-2 py-12 flex-col">
        <Card className="w-full max-w-md shadow-lg border border-slate-200 rounded-2xl bg-white">
          <CardHeader className="space-y-2 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-red-700">
              Ошибка подтверждения
            </CardTitle>
            <CardDescription className="text-base">
              {errorMessage}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="text-xs sm:text-sm text-muted-foreground space-y-2">
                <p>
                  Возможно, ссылка устарела или была уже использована.
                  Попробуйте запросить новое письмо с подтверждением.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <Button className="w-full h-11 text-base font-semibold" asChild>
                <Link href="/auth/login">
                  <ArrowRight className="mr-2 h-5 w-5" />
                  Войти в систему
                </Link>
              </Button>
              <Button variant="outline" className="w-full h-11 text-base" asChild>
                <Link href="/auth/register">Зарегистрироваться заново</Link>
              </Button>
            </div>
            <div className="text-center">
              <div className="text-xs sm:text-sm text-muted-foreground">
                Нужна помощь?{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto text-xs sm:text-sm"
                  asChild
                >
                  <Link href="/help">Обратитесь в поддержку</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen-content items-center justify-center bg-white px-2 py-12 flex-col">
      <Card className="w-full max-w-md shadow-lg border border-slate-200 rounded-2xl bg-white">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-700">
            Почта подтверждена
          </CardTitle>
          <CardDescription className="text-base">
            Ваш email успешно подтверждён. Теперь вы можете войти в аккаунт.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>Подтверждение завершено</span>
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground space-y-2">
              <p>
                Отлично! Ваш аккаунт теперь полностью активирован. Вы можете
                войти в систему, используя ваш email и пароль.
              </p>
              <p>Спасибо за регистрацию в нашем сервисе!</p>
            </div>
          </div>
          <div className="space-y-4">
            <Button className="w-full h-11 text-base font-semibold" asChild>
              <Link href="/auth/login">
                <ArrowRight className="mr-2 h-5 w-5" />
                Войти в систему
              </Link>
            </Button>
            <Button variant="outline" className="w-full h-11 text-base" asChild>
              <Link href="/">Перейти на главную</Link>
            </Button>
          </div>
          <div className="text-center">
            <div className="text-xs sm:text-sm text-muted-foreground">
              Нужна помощь?{" "}
              <Button
                variant="link"
                className="p-0 h-auto text-xs sm:text-sm"
                asChild
              >
                <Link href="/help">Обратитесь в поддержку</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Footer */}
      <div className="text-center mt-8 px-4">
        <p className="text-xs sm:text-sm text-muted-foreground">
          Добро пожаловать в наше сообщество! 🎉
        </p>
      </div>
    </div>
  );
}

function EmailVerifiedFallback() {
  return (
    <div className="flex min-h-screen-content items-center justify-center bg-white px-2 py-12 flex-col">
      <Card className="w-full max-w-md shadow-lg border border-slate-200 rounded-2xl bg-white">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
          </div>
          <CardTitle className="text-2xl font-bold text-blue-700">
            Загрузка
          </CardTitle>
          <CardDescription className="text-base">
            Подготавливаем страницу подтверждения...
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}

export function EmailVerified() {
  return (
    <Suspense fallback={<EmailVerifiedFallback />}>
      <EmailVerifiedContent />
    </Suspense>
  );
}
