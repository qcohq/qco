import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@qco/ui/components/card";

export default function GeneralSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Общие настройки</h2>
        <p className="text-muted-foreground">Основные настройки магазина</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Информация о магазине</CardTitle>
          <CardDescription>
            Настройте основную информацию о вашем магазине
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
