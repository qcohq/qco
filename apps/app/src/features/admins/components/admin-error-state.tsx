// TODO: Использовать тип из схемы пропсов состояния ошибки админов, если появится в @qco/validators
export function AdminErrorState({
  message = "Ошибка загрузки",
}: {
  message?: string;
}) {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-destructive">{message}</h2>
        <p className="text-muted-foreground">Попробуйте обновить страницу</p>
      </div>
    </div>
  );
}
