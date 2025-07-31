"use client";

import { Input } from "@qco/ui/components/input";
import { Search } from "lucide-react";

// TODO: Использовать тип из схемы поиска админов, если появится в @qco/validators

export function AdminSearch({
  value,
  onChange,
  placeholder = "Поиск администраторов...",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative w-full sm:flex-1 sm:max-w-sm">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-8 w-full"
      />
    </div>
  );
}
