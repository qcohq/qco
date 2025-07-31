"use client";

import type { Value } from "platejs";
import * as React from "react";
import {
  type Control,
  type FieldPath,
  type FieldValues,
  useController,
} from "react-hook-form";
import { BlogEditor } from "./blog-editor";
import { stringToValue, valueToString } from "./editor-utils";

interface BlogEditorFormProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  name: TName;
  control: Control<TFieldValues>;
  placeholder?: string;
  label?: string;
  error?: string;
}

export function BlogEditorForm<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  placeholder,
  label,
  error,
}: BlogEditorFormProps<TFieldValues, TName>) {
  const {
    field: { value, onChange },
  } = useController({
    name,
    control,
  });

  // Конвертируем строку в Value для редактора
  const plateValue = React.useMemo(() => {
    return stringToValue(value);
  }, [value]);

  // Обработчик изменений
  const handleChange = React.useCallback(
    (newValue: Value) => {
      // Конвертируем Value обратно в строку для формы
      const stringValue = valueToString(newValue);
      onChange(stringValue);
    },
    [onChange],
  );

  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={`editor-${name}`}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
      )}
      <BlogEditor
        id={`editor-${name}`}
        value={plateValue}
        onChange={handleChange}
        placeholder={placeholder}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
