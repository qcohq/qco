"use client";

import * as React from "react";
import { useCallback, useState } from "react";
import { Image as ImageIcon, Loader2, Upload, X } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

import { cn } from "../lib/utils";
import { Button } from "./button";
import { Card, CardContent } from "./card";
import { Progress } from "./progress";

interface ImageUploadProps {
  value?: {
    key: string;
    url: string;
    name?: string;
    mimeType?: string;
    size?: number;
  } | null;
  onChange?: (
    file: {
      key: string;
      url: string;
      name?: string;
      mimeType?: string;
      size?: number;
    } | null,
  ) => void;
  onUploadStart?: () => void;
  onUploadEnd?: () => void;
  disabled?: boolean;
  className?: string;
  label?: string;
  recommended?: string;
  previewRatio?: number;
  // Для совместимости со старым API
  onRemove?: () => void;
  placeholder?: string;
  // Функция для загрузки файла (должна возвращать Promise с результатом)
  uploadFile?: (file: File) => Promise<{
    key: string;
    url: string;
    name?: string;
    mimeType?: string;
    size?: number;
  }>;
}

export function ImageUpload({
  value,
  onChange,
  onUploadStart,
  onUploadEnd,
  disabled,
  className,
  label = "Загрузить изображение",
  recommended,
  previewRatio = 1,
  onRemove,
  placeholder = "Перетащите изображение сюда или нажмите для выбора",
  uploadFile,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(value?.url || null);

  // Для совместимости со старым API (если передается просто строка URL)
  const isLegacyMode = typeof value === "string";

  // Если используется старый API, просто показываем изображение без загрузки
  if (isLegacyMode) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="rounded-lg border-2 border-dashed p-6 text-center">
          <div className="flex flex-col items-center space-y-2">
            {value ? (
              <div className="relative mx-auto h-32 w-32">
                <img
                  src={value}
                  alt="Preview"
                  className="h-full w-full rounded-lg object-cover"
                />
                {onRemove && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                    onClick={onRemove}
                    disabled={disabled}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ) : (
              <Upload className="text-muted-foreground h-8 w-8" />
            )}
            <div className="text-muted-foreground text-sm">
              {value ? "Изображение загружено" : placeholder}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Новый API с загрузкой файлов
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setUploadError(null);
      setUploading(true);
      setUploadProgress(0);
      setPreview(URL.createObjectURL(file));

      // Вызываем колбэк начала загрузки
      onUploadStart?.();

      try {
        if (uploadFile) {
          // Используем переданную функцию загрузки
          const result = await uploadFile(file);
          setUploadProgress(100);
          onChange?.(result);
          toast("Файл успешно загружен", {
            description: file.name,
          });
        } else {
          // Если функция загрузки не передана, используем локальный URL
          setUploadProgress(100);
          onChange?.({
            key: `temp-${Date.now()}`,
            url: URL.createObjectURL(file),
            name: file.name,
            mimeType: file.type,
            size: file.size,
          });
          toast("Файл загружен локально", {
            description: file.name,
          });
        }
      } catch (error) {
        handleUploadError(error);
      } finally {
        setUploading(false);
        onUploadEnd?.();
      }
    },
    [onChange, onUploadStart, onUploadEnd, uploadFile],
  );

  // Вспомогательная функция для обработки ошибок загрузки
  const handleUploadError = (error: unknown) => {
    setUploadError(
      error instanceof Error ? error.message : "Ошибка загрузки файла",
    );
    toast("Ошибка загрузки файла", {
      description:
        error instanceof Error ? error.message : "Не удалось загрузить файл",
    });
    setPreview(null);
    onChange?.(null);
  };

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    multiple: false,
    disabled,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
    },
    noClick: true,
    noKeyboard: true,
  });

  const handleRemove = () => {
    setPreview(null);
    setUploadError(null);
    setUploadProgress(0);
    onChange?.(null);
  };

  return (
    <Card
      className={cn(
        "border-muted-foreground/40 bg-muted/50 w-full border-2 border-dashed p-0",
        className,
      )}
    >
      <CardContent className="flex flex-col items-center justify-center gap-4 py-8">
        <div
          {...getRootProps({
            className: cn(
              "flex w-full cursor-pointer flex-col items-center justify-center transition-all",
              isDragActive && "bg-accent/30 border-primary",
            ),
          })}
        >
          <input {...getInputProps()} />
          <Upload className="text-muted-foreground mb-2 h-8 w-8" />
          <p className="text-muted-foreground mb-2 text-sm">
            Перетащите изображение сюда или{" "}
            <Button
              variant="link"
              type="button"
              onClick={open}
              disabled={disabled}
            >
              выберите
            </Button>
          </p>
          {label && <span className="mb-2 text-sm font-medium">{label}</span>}
          {recommended && (
            <span className="text-muted-foreground mb-2 text-xs">
              {recommended}
            </span>
          )}
          {uploadError && (
            <span className="text-destructive mb-2 text-xs">{uploadError}</span>
          )}
          {preview && (
            <div className="relative mt-2 flex flex-col items-center">
              <img
                src={preview}
                alt="preview"
                width={previewRatio === 1 ? 120 : 320}
                height={previewRatio === 1 ? 120 : 120}
                className="rounded border bg-white object-contain"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6"
                onClick={handleRemove}
                disabled={uploading}
              >
                <X className="h-4 w-4" />
              </Button>
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <div className="w-full p-4 text-center">
                    <Loader2 className="mx-auto mb-2 h-8 w-8 animate-spin text-white" />
                    <div className="mb-2 text-sm font-medium text-white">
                      {Math.round(uploadProgress)}%
                    </div>
                    <Progress
                      value={uploadProgress}
                      className="h-2 w-full bg-gray-600"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
