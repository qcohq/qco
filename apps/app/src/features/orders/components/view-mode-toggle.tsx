import { Button } from "@qco/ui/components/button";
import { Switch } from "@qco/ui/components/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@qco/ui/components/tooltip";
import { Eye, EyeOff } from "lucide-react";

// TODO: Использовать тип из схемы пропсов переключателя режима просмотра, если появится в @qco/validators
interface ViewModeToggleProps {
  compactMode: boolean;
  onToggle: (value: boolean) => void;
}

export function ViewModeToggle({ compactMode, onToggle }: ViewModeToggleProps) {
  return (
    <div className="flex items-center justify-end gap-2">
      <span className="text-muted-foreground text-sm">Компактный режим</span>
      <Switch checked={compactMode} onCheckedChange={onToggle} />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              {compactMode ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {compactMode
              ? "Переключить на полный режим"
              : "Переключить на компактный режим"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
