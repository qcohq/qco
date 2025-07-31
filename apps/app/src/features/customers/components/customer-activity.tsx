import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@qco/ui/components/card";

// TODO: Использовать тип из схемы пропсов активности клиента, если появится в @qco/validators
type CustomerActivityProps = {
  customerId: string;
};

export function CustomerActivity({ customerId: _ }: CustomerActivityProps) {
  return (
    <Card>
      <CardHeader className="p-3 sm:p-4 md:p-6">
        <CardTitle className="text-lg">Активность клиента</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          История действий и взаимодействий с клиентом
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 md:p-6">
        <div className="space-y-3 sm:space-y-4">
          {/* Здесь будет список активностей */}
        </div>
      </CardContent>
    </Card>
  );
}
