import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@qco/ui/components/card";

export default function PaymentSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Настройки оплаты</h2>
        <p className="text-muted-foreground">Конфигурация способов оплаты</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Способы оплаты</CardTitle>
          <CardDescription>
            Настройте доступные способы оплаты для клиентов
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
