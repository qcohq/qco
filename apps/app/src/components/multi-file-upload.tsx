"use client";

import { Button } from "@qco/ui/components/button";
import { Card, CardContent } from "@qco/ui/components/card";
import { Progress } from "@qco/ui/components/progress";
import { cn } from "@qco/ui/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { Loader2, UploadCloud } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import type { Accept } from "react-dropzone";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

import { useTRPC } from "~/trpc/react";

interface FileInfo {
  key: string;
  url: string;
  name?: string;
  mimeType?: string;
  size?: number;
}

interface MultiFileUploadProps {
  onUploadComplete: (files: FileInfo[]) => void;
  disabled?: boolean;
  label?: string;
  accept?: Accept;
  previewRatio?: number;
  recommended?: string;
  maxFiles?: number;
}

export function MultiFileUpload({
  onUploadComplete,
  disabled,
  label = "Загрузить файлы",
  accept,
  previewRatio = 1,
  recommended,
  maxFiles = 10,
}: MultiFileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {},
  );
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [_uploadedFiles, setUploadedFiles] = useState<FileInfo[]>([]);

  const trpc = useTRPC();
  const createPresignedUrlMutationOptions =
    trpc.attachments.createPresignedUrl.mutationOptions();
  const { mutate: createPresignedUrl } = useMutation(
    createPresignedUrlMutationOptions,
  );

  // Вспомогательная функция для обработки ошибок загрузки
  const handleUploadError = useCallback((error: unknown, fileId?: string) => {
    if (fileId) {
      setUploadProgress((prev) => ({ ...prev, [fileId]: 0 }));
    }

    setUploadError(
      error instanceof Error ? error.message : "Ошибка загрузки файлов",
    );
  }, []);

  const uploadFile = useCallback(
    async (file: File): Promise<FileInfo> => {
      const fileId = `${file.name}-${Date.now()}`;
      setUploadProgress((prev) => ({ ...prev, [fileId]: 0 }));

      return new Promise<FileInfo>((resolveUpload, rejectUpload) => {
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
                        setUploadProgress((prev) => ({
                          ...prev,
                          [fileId]: Math.round(
                            (event.loaded / event.total) * 100,
                          ),
                        }));
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
                        new Error(
                          "Превышено время ожидания при загрузке файла",
                        ),
                      );
                    });
                    xhr.open("PUT", url);
                    xhr.setRequestHeader("Content-Type", file.type);
                    xhr.send(file);
                  });

                  setUploadProgress((prev) => ({ ...prev, [fileId]: 100 }));

                  const fileInfo = {
                    key,
                    url: URL.createObjectURL(file),
                    name: file.name,
                    mimeType: file.type,
                    size: file.size,
                  };

                  resolveUpload(fileInfo);
                } catch (error) {
                  handleUploadError(error, fileId);
                  rejectUpload(error);
                }
              },
              onError: (error) => {
                handleUploadError(error, fileId);
                rejectUpload(error);
              },
            },
          );
        } catch (error) {
          handleUploadError(error, fileId);
          rejectUpload(error);
        }
      });
    },
    [handleUploadError, createPresignedUrl],
  );

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      setUploadError(null);
      setUploading(true);

      // Создаем превью для всех файлов
      const newPreviews: Record<string, string> = {};
      acceptedFiles.forEach((file) => {
        const fileId = `${file.name}-${Date.now()}`;
        newPreviews[fileId] = URL.createObjectURL(file);
      });

      setPreviews((prev) => ({ ...prev, ...newPreviews }));

      try {
        // Загружаем все файлы параллельно
        const uploadPromises = acceptedFiles.map((file) => uploadFile(file));
        const uploadedFiles = await Promise.all(uploadPromises);

        setUploadedFiles((prev) => [...prev, ...uploadedFiles]);
        onUploadComplete(uploadedFiles);

        toast.success(`Успешно загружено ${uploadedFiles.length} файлов`);
      } catch (error) {
        setUploadError(
          error instanceof Error ? error.message : "Ошибка загрузки файлов",
        );
        toast.error("Ошибка загрузки файлов", {
          description:
            error instanceof Error
              ? error.message
              : "Не удалось загрузить файлы",
        });
      } finally {
        setUploading(false);
      }
    },
    [onUploadComplete, uploadFile],
  );

  const dropzoneAccept = typeof accept === "string" ? { [accept]: [] } : accept;

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    disabled,
    accept: dropzoneAccept,
    noClick: true,
    noKeyboard: true,
    maxFiles,
  });

  const totalProgress =
    Object.values(uploadProgress).reduce((sum, progress) => sum + progress, 0) /
    Math.max(1, Object.keys(uploadProgress).length);

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
            Перетащите файлы сюда или{" "}
            <Button
              variant="link"
              type="button"
              onClick={open}
              disabled={disabled || uploading}
            >
              выберите несколько файлов
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

          {uploading && (
            <div className="mt-4 w-full max-w-md">
              <Progress value={totalProgress} className="h-2" />
              <p className="text-muted-foreground mt-1 text-xs">
                Загрузка: {Math.round(totalProgress)}%
              </p>
            </div>
          )}

          {Object.keys(previews).length > 0 && (
            <div className="mt-4 grid w-full max-w-2xl grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
              {Object.entries(previews).map(([fileId, previewUrl]) => (
                <div key={fileId} className="relative">
                  <Image
                    src={previewUrl}
                    alt="preview"
                    width={120}
                    height={120}
                    className="rounded border bg-white object-cover"
                    style={{ aspectRatio: previewRatio }}
                  />
                  {uploadProgress[fileId] !== undefined &&
                    uploadProgress[fileId] < 100 && (
                      <div className="absolute inset-0 flex items-center justify-center rounded bg-black/50">
                        <Loader2 className="h-6 w-6 animate-spin text-white" />
                      </div>
                    )}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
