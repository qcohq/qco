import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@qco/ui/components/card";
import { Separator } from "@qco/ui/components/separator";
import { Skeleton } from "@qco/ui/components/skeleton";

const statsKeys = ["orders", "spent", "favorites", "bonus"];

export function ProfileSkeleton() {
  return (
    <Card className="border bg-white text-card-foreground shadow-sm">
      <CardHeader>
        <CardTitle>Обзор профиля</CardTitle>
        <CardDescription>Личная информация и статистика</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          {/* Аватар и имя */}
          <div className="flex flex-col items-center min-w-[180px]">
            <Skeleton className="w-20 h-20 rounded-full mb-4" />
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-24" />
          </div>
          {/* Информация о пользователе */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <span className="text-muted-foreground">Телефон:</span>
              <Skeleton className="h-4 w-32 mt-1" />
            </div>
            <div>
              <span className="text-muted-foreground">Дата регистрации:</span>
              <Skeleton className="h-4 w-32 mt-1" />
            </div>
            <div>
              <span className="text-muted-foreground">Пол:</span>
              <Skeleton className="h-4 w-20 mt-1" />
            </div>
            <div>
              <span className="text-muted-foreground">Дата рождения:</span>
              <Skeleton className="h-4 w-24 mt-1" />
            </div>
          </div>
        </div>
        <Separator className="my-8" />
        <div>
          <div className="font-semibold text-base mb-4">
            Статистика аккаунта
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statsKeys.map((key) => (
              <Card key={key}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-4 rounded-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-20 mb-2" />
                  <Skeleton className="h-3 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
