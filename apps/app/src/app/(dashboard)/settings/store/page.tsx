import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@qco/ui/components/card";

export default function StoreSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Настройки магазина</h2>
        <p className="text-muted-foreground">
          Конфигурация параметров магазина
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Параметры магазина</CardTitle>
          <CardDescription>
            Настройте основные параметры работы магазина
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
