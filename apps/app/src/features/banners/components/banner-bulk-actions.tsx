"use client";

import { Badge } from "@qco/ui/components/badge";

import { Button } from "@qco/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@qco/ui/components/dropdown-menu";
import { Copy, Download, Eye, EyeOff, Star, Trash2 } from "lucide-react";

interface BannerBulkActionsProps {
  selectedCount: number;
  onAction: (action: string) => void;
  onClearSelection: () => void;
}

export function BannerBulkActions({
  selectedCount,
  onAction,
  onClearSelection,
}: BannerBulkActionsProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-4">
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="text-sm">
          Выбрано: {selectedCount}
        </Badge>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          className="h-8 px-2 text-muted-foreground hover:text-foreground"
        >
          Снять выделение
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Массовые действия
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onAction("activate")}>
              <Eye className="mr-2 h-4 w-4" />
              Активировать
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAction("deactivate")}>
              <EyeOff className="mr-2 h-4 w-4" />
              Деактивировать
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onAction("feature")}>
              <Star className="mr-2 h-4 w-4" />
              Добавить в избранное
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAction("unfeature")}>
              <Star className="mr-2 h-4 w-4" />
              Убрать из избранного
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onAction("duplicate")}>
              <Copy className="mr-2 h-4 w-4" />
              Дублировать
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAction("export")}>
              <Download className="mr-2 h-4 w-4" />
              Экспортировать
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onAction("delete")}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Удалить
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
