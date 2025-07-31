"use client";

import { Button } from "@qco/ui/components/button";
import { Card, CardContent } from "@qco/ui/components/card";
import { Progress } from "@qco/ui/components/progress";
import { cn } from "@qco/ui/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { Loader2, UploadCloud, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { Accept } from "react-dropzone";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

import { useTRPC } from "~/trpc/react";

interface FileUploadProps {
  value?: {
    key: string;
    url: string;
    name?: string;
    mimeType?: string;
    size?: number;
  } | null;
  onChange: (
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
  label?: string;
  accept?: Accept;
  previewRatio?: number;
  recommended?: string;
}

export function FileUpload({
  value,
  onChange,
  onUploadStart,
  onUploadEnd,
  disabled,
  label = "Загрузить файл",
  accept,
  previewRatio = 1,
  recommended,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(value?.url || null);

  const trpc = useTRPC();
  const createPresignedUrlMutationOptions =
    trpc.attachments.createPresignedUrl.mutationOptions();
  const { mutate: createPresignedUrl } = useMutation(
    createPresignedUrlMutationOptions,
  );

  // Вспомогательная функция для обработки ошибок загрузки
  const handleUploadError = useCallback(
    (error: unknown) => {
      setUploadError(
        error instanceof Error ? error.message : "Ошибка загрузки файла",
      );
      toast("Ошибка загрузки файла", {
        description:
          error instanceof Error ? error.message : "Не удалось загрузить файл",
        className: "bg-destructive text-destructive-foreground",
      });
      setPreview(null);
      onChange(null);
    },
    [onChange],
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      setUploading(true);
      setUploadError(null);
      setUploadProgress(0);
      setPreview(URL.createObjectURL(file));

      // Вызываем колбэк начала загрузки
      onUploadStart?.();

      try {
        // Получаем presigned url
        createPresignedUrl(
          {
            key: file.name,
            temporary: false,
          },
          {
            onSuccess: async ({ url, key }) => {
              try {
                // Загружаем файл на S3
                await new Promise<void>((resolve, reject) => {
                  const xhr = new XMLHttpRequest();
                  xhr.upload.addEventListener("progress", (event) => {
                    if (event.lengthComputable) {
                      setUploadProgress(
                        Math.round((event.loaded / event.total) * 100),
                      );
                    }
                  });
                  xhr.addEventListener("load", () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                      resolve();
                    } else {
                      reject(
                        new Error(
                          `Ошибка сервера: ${xhr.status} ${xhr.statusText}`,
                        ),
                      );
                    }
                  });
                  xhr.addEventListener("error", () => {
                    reject(new Error("Сетевая ошибка при загрузке файла"));
                  });
                  xhr.addEventListener("timeout", () => {
                    reject(
                      new Error("Превышено время ожидания при загрузке файла"),
                    );
                  });
                  xhr.open("PUT", url);
                  xhr.setRequestHeader("Content-Type", file.type);
                  xhr.send(file);
                });
                setUploadProgress(100);
                onChange({
                  key,
                  url: URL.createObjectURL(file),
                  name: file.name,
                  mimeType: file.type,
                  size: file.size,
                });
                toast("Файл успешно загружен", {
                  description: file.name,
                });
              } catch (uploadError) {
                handleUploadError(uploadError);
              }
            },
            onError: (error) => {
              handleUploadError(error);
            },
            onSettled: () => {
              setUploading(false);
              // Вызываем колбэк окончания загрузки
              onUploadEnd?.();
            },
          },
        );
      } catch (error) {
        handleUploadError(error);
        setUploading(false);
        // Вызываем колбэк окончания загрузки в случае ошибки
        onUploadEnd?.();
      }
    },
    [
      createPresignedUrl,
      onChange,
      onUploadStart,
      onUploadEnd,
      handleUploadError,
    ],
  );

  const dropzoneAccept = typeof accept === "string" ? { [accept]: [] } : accept;

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    multiple: false,
    disabled,
    accept: dropzoneAccept,
    noClick: true,
    noKeyboard: true,
  });

  const handleRemove = () => {
    setPreview(null);
    setUploadError(null);
    setUploadProgress(0);
    onChange(null);
  };

  useEffect(() => {
    if (value?.url) {
      setPreview(value.url);
    }
  }, [value]);

  return (
    <Card className="border-muted-foreground/40 bg-muted/50 w-full border-2 border-dashed p-0">
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
          <UploadCloud className="text-muted-foreground mb-2 h-8 w-8" />
          <p className="text-muted-foreground mb-2 text-sm">
            Перетащите файл сюда или{" "}
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
              <Image
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
