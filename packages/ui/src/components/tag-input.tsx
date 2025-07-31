"use client";

import * as React from "react";
import { X, AlertCircle } from "lucide-react";

import { cn } from "../lib/utils";
import { Badge } from "./badge";
import { Button } from "./button";

interface TagInputProps extends Omit<React.ComponentProps<"div">, "onChange"> {
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
  maxTags?: number;
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  allowDuplicates?: boolean;
  validateTag?: (tag: string) => string | null; // Возвращает ошибку или null
  onValidationError?: (error: string) => void;
}

function TagInput({
  className,
  value = [],
  onChange,
  disabled = false,
  maxTags,
  placeholder,
  minLength = 1,
  maxLength = 50,
  allowDuplicates = false,
  validateTag,
  onValidationError,
  ...props
}: TagInputProps) {
  const [inputValue, setInputValue] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const validateAndAddTag = (tag: string) => {
    const trimmedTag = tag.trim();

    // Проверка минимальной длины
    if (trimmedTag.length < minLength) {
      const errorMsg = `Минимальная длина тега: ${minLength} символов`;
      setError(errorMsg);
      onValidationError?.(errorMsg);
      return false;
    }

    // Проверка максимальной длины
    if (trimmedTag.length > maxLength) {
      const errorMsg = `Максимальная длина тега: ${maxLength} символов`;
      setError(errorMsg);
      onValidationError?.(errorMsg);
      return false;
    }

    // Проверка на дубликаты
    if (!allowDuplicates && value.includes(trimmedTag)) {
      const errorMsg = "Такой тег уже существует";
      setError(errorMsg);
      onValidationError?.(errorMsg);
      return false;
    }

    // Пользовательская валидация
    if (validateTag) {
      const validationError = validateTag(trimmedTag);
      if (validationError) {
        setError(validationError);
        onValidationError?.(validationError);
        return false;
      }
    }

    // Проверка максимального количества тегов
    if (maxTags && value.length >= maxTags) {
      const errorMsg = `Максимальное количество тегов: ${maxTags}`;
      setError(errorMsg);
      onValidationError?.(errorMsg);
      return false;
    }

    // Все проверки пройдены
    setError(null);
    onChange([...value, trimmedTag]);
    return true;
  };

  const addTag = (tag: string) => {
    if (validateAndAddTag(tag)) {
      setInputValue("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
    setError(null); // Сбрасываем ошибку при удалении тега
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (inputValue.trim()) {
        addTag(inputValue);
      }
    } else if (
      e.key === "Backspace" &&
      inputValue === "" &&
      value.length > 0
    ) {
      const lastTag = value[value.length - 1];
      if (lastTag) {
        removeTag(lastTag);
      }
    } else if (e.key === "Escape") {
      setInputValue("");
      setError(null);
      inputRef.current?.blur();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    // Сбрасываем ошибку при вводе
    if (error) {
      setError(null);
    }
  };

  const handleBlur = () => {
    if (inputValue.trim()) {
      addTag(inputValue);
    }
    // Сбрасываем ошибку при потере фокуса
    setTimeout(() => setError(null), 200);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const tags = pastedText
      .split(/[,\n]/)
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    tags.forEach(tag => {
      if (maxTags && value.length >= maxTags) return;
      validateAndAddTag(tag);
    });
  };

  return (
    <div className="space-y-2">
      <div
        className={cn(
          "border-input focus-within:border-ring focus-within:ring-ring/50 flex min-h-9 w-full flex-wrap items-center gap-2 rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] focus-within:ring-[3px]",
          disabled && "pointer-events-none opacity-50",
          error && "border-destructive focus-within:border-destructive",
          className,
        )}
        {...props}
      >
        {value.map((tag, index) => (
          <Badge
            key={`${tag}-${index}`}
            variant="secondary"
            className="gap-1 pr-1"
          >
            {tag}
            {!disabled && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground h-auto p-0"
                onClick={() => removeTag(tag)}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove {tag}</span>
              </Button>
            )}
          </Badge>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onPaste={handlePaste}
          disabled={disabled || (maxTags ? value.length >= maxTags : false)}
          placeholder={
            maxTags && value.length >= maxTags
              ? `Максимум ${maxTags} тегов`
              : placeholder || "Введите тег и нажмите Enter"
          }
          className="placeholder:text-muted-foreground flex-1 bg-transparent outline-none disabled:cursor-not-allowed"
        />
      </div>

      {/* Отображение ошибки */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Информация о лимитах */}
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>
          {value.length} {maxTags ? `из ${maxTags}` : ""} тегов
        </span>
        <span>
          {minLength}-{maxLength} символов
        </span>
      </div>
    </div>
  );
}

export { TagInput };
