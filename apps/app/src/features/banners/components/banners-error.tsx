import { Card, CardContent } from "@qco/ui/components/card";

export function BannersError({ message }: { message: string }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center text-destructive">
          Ошибка загрузки баннеров: {message}
        </div>
      </CardContent>
    </Card>
  );
}
