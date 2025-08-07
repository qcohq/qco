import { Button } from "@qco/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@qco/ui/components/card";
import { ArrowLeft, CheckCircle, Mail } from "lucide-react";
import Link from "next/link";

export default function VerifyRequestPage() {
  return (
    <div className="flex min-h-screen-content items-center justify-center bg-white px-2 py-12 flex-col">
      <Card className="w-full max-w-md shadow-lg border border-slate-200 rounded-2xl bg-white">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Проверьте ваш email
          </CardTitle>
          <CardDescription className="text-base">
            Мы отправили ссылку для подтверждения на ваш email адрес
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2 text-sm text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span>Ссылка отправлена успешно</span>
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground space-y-2">
              <p>
                Перейдите по ссылке в письме, чтобы подтвердить ваш email адрес
                и завершить регистрацию.
              </p>
              <p>
                Если вы не видите письмо, проверьте папку "Спам" или
                "Нежелательная почта".
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <Button className="w-full h-11 text-base font-semibold" asChild>
              <Link href="/auth/login">Перейти к входу</Link>
            </Button>
            <Button variant="outline" className="w-full h-11 text-base" asChild>
              <Link href="/auth/register">
                Зарегистрироваться с другим email
              </Link>
            </Button>
          </div>
          <div className="text-center">
            <div className="text-xs sm:text-sm text-muted-foreground">
              Не получили письмо?{" "}
              <Button
                variant="link"
                className="p-0 h-auto text-xs sm:text-sm"
                asChild
              >
                <Link href="/auth/register">
                  Попробуйте зарегистрироваться снова
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Footer */}
      <div className="flex justify-center mt-8">
        <Button asChild variant="outline" className="h-11 text-base px-6 gap-2">
          <Link href="/">
            <ArrowLeft className="h-5 w-5" />
            Вернуться на главную
          </Link>
        </Button>
      </div>
    </div>
  );
}
