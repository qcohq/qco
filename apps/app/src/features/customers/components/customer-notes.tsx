import type { RouterOutputs } from "@qco/api";
import { Button } from "@qco/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@qco/ui/components/card";
import { Separator } from "@qco/ui/components/separator";
import { Textarea } from "@qco/ui/components/textarea";
import { useState } from "react";

// TODO: Использовать тип из схемы пропсов заметок клиента, если появится в @qco/validators
type CustomerNotesProps = {
  customerId: string;
  onUpdateCustomer: (
    data: RouterOutputs["customers"]["update"]["customer"],
  ) => void;
  isUpdating: boolean;
};

export function CustomerNotes({
  customerId: _,
  onUpdateCustomer,
  isUpdating,
}: CustomerNotesProps) {
  const [note, setNote] = useState("");

  const handleSaveNote = () => {
    onUpdateCustomer({ notes: note });
    setNote("");
  };

  return (
    <Card>
      <CardHeader className="p-3 sm:p-4 md:p-6">
        <CardTitle className="text-lg">Заметки о клиенте</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Добавляйте важную информацию о клиенте
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 p-3 sm:space-y-4 sm:p-4 md:p-6">
        <div className="space-y-3 sm:space-y-4">
          {/* Здесь будет список заметок */}
        </div>
        <Separator />
        <div>
          <p className="mb-1 text-xs font-medium sm:mb-2 sm:text-sm">
            Добавить заметку
          </p>
          <Textarea
            placeholder="Введите текст заметки..."
            className="min-h-[80px] text-xs sm:min-h-[100px] sm:text-sm"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <Button
            className="mt-2 w-full sm:w-auto"
            onClick={handleSaveNote}
            disabled={isUpdating || !note.trim()}
          >
            {isUpdating ? "Сохранение..." : "Сохранить"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
