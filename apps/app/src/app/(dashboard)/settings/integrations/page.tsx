import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@qco/ui/components/card";

export default function IntegrationsSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Настройки интеграций</h2>
        <p className="text-muted-foreground">
          Управление внешними интеграциями и API
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Внешние сервисы</CardTitle>
          <CardDescription>
            Настройте интеграции с внешними сервисами
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
