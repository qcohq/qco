import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@qco/ui/components/card";

export default function UsersSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Настройки пользователей</h2>
        <p className="text-muted-foreground">
          Управление пользователями и правами доступа
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Права доступа</CardTitle>
          <CardDescription>
            Настройте роли и права доступа для пользователей
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Эта страница находится в разработке.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
