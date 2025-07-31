"use client";

import { Badge } from "@qco/ui/components/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@qco/ui/components/card";
import { Checkbox } from "@qco/ui/components/checkbox";
import { Input } from "@qco/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@qco/ui/components/select";
import { Switch } from "@qco/ui/components/switch";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface AttributePreviewProps {
  name: string;
  type: "text" | "number" | "boolean" | "select" | "multiselect";
  options: string[];
  isRequired: boolean;
  isFilterable: boolean;
}

export function AttributePreview({
  name,
  type,
  options,
  isRequired,
  isFilterable,
}: AttributePreviewProps) {
  const [showPreview, setShowPreview] = useState(true);

  if (!showPreview) {
    return (
      <Card className="border-dashed">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Предварительный просмотр
            </CardTitle>
            <button
              onClick={() => setShowPreview(true)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <Eye className="h-4 w-4" />
              Показать
            </button>
          </div>
        </CardHeader>
      </Card>
    );
  }

  const renderField = () => {
    switch (type) {
      case "text":
        return (
          <Input
            placeholder="Введите значение"
            disabled
            className="bg-muted/50"
          />
        );

      case "number":
        return (
          <Input
            type="number"
            placeholder="0"
            disabled
            className="bg-muted/50"
          />
        );

      case "boolean":
        return (
          <div className="flex items-center space-x-2">
            <Switch disabled />
            <span className="text-sm text-muted-foreground">Да/Нет</span>
          </div>
        );

      case "select":
        return (
          <Select disabled>
            <SelectTrigger className="bg-muted/50">
              <SelectValue placeholder="Выберите опцию" />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "multiselect":
        return (
          <div className="space-y-2">
            {options.slice(0, 3).map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox disabled />
                <span className="text-sm">{option}</span>
              </div>
            ))}
            {options.length > 3 && (
              <span className="text-xs text-muted-foreground">
                +{options.length - 3} еще
              </span>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="border-dashed">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-sm font-medium">
              {name}
              {isRequired && <span className="text-destructive ml-1">*</span>}
            </CardTitle>
          </div>
          <button
            onClick={() => setShowPreview(false)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <EyeOff className="h-4 w-4" />
            Скрыть
          </button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {type === "text" && "Текст"}
              {type === "number" && "Число"}
              {type === "boolean" && "Да/Нет"}
              {type === "select" && "Выбор"}
              {type === "multiselect" && "Множественный выбор"}
            </Badge>
            {isFilterable && (
              <Badge variant="outline" className="text-xs">
                Фильтр
              </Badge>
            )}
          </div>

          {renderField()}
        </div>
      </CardContent>
    </Card>
  );
}
