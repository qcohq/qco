"use client";

import { Label } from "@qco/ui/components/label";
import type { bannerFormSchema } from "@qco/validators";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import type { z } from "zod";
import { FileUpload } from "@/components/file-upload";

type BannerFile = {
  key: string;
  url: string;
  name?: string;
  mimeType?: string;
  size?: number;
};

// TODO: Использовать тип из схемы пропсов визуалов баннера, если появится в @qco/validators
interface BannerVisualsProps {
  initialDesktop?: BannerFile | null;
  initialMobile?: BannerFile | null;
  initialTablet?: BannerFile | null;
}

type BannerFormData = z.infer<typeof bannerFormSchema>;
type FileType = "desktop" | "mobile" | "tablet";

export function BannerVisuals({
  initialDesktop,
  initialMobile,
  initialTablet,
}: BannerVisualsProps = {}) {
  const { setValue, watch, register } = useFormContext<BannerFormData>();
  const [desktop, setDesktop] = useState<BannerFile | null>(
    initialDesktop ?? null,
  );
  const [mobile, setMobile] = useState<BannerFile | null>(
    initialMobile ?? null,
  );
  const [tablet, setTablet] = useState<BannerFile | null>(
    initialTablet ?? null,
  );
  const [isUploading, setIsUploading] = useState(false);

  // Обновляем состояние при изменении начальных данных
  useEffect(() => {
    setDesktop(initialDesktop ?? null);
  }, [initialDesktop]);

  useEffect(() => {
    setMobile(initialMobile ?? null);
  }, [initialMobile]);

  useEffect(() => {
    setTablet(initialTablet ?? null);
  }, [initialTablet]);

  // Получаем текущие файлы из формы
  const files = watch("files") || [];

  const updateFiles = (type: FileType, file: BannerFile | null) => {
    const newFiles = files.filter((f: { type: string }) => f.type !== type);
    if (file) {
      newFiles.push({
        fileId: file.key, // key - это путь в S3, который используется как fileId
        type,
        order: type === "desktop" ? 0 : type === "mobile" ? 1 : 2,
        meta: {
          name: file.name,
          mimeType: file.mimeType,
          size: file.size,
        },
      });
    }
    setValue("files", newFiles);
  };

  // Функция для обработки изменения файла с отслеживанием состояния загрузки
  const handleFileChange = (type: FileType, file: BannerFile | null) => {
    switch (type) {
      case "desktop":
        setDesktop(file);
        break;
      case "mobile":
        setMobile(file);
        break;
      case "tablet":
        setTablet(file);
        break;
    }
    updateFiles(type, file);
  };

  const handleUploadStart = () => {
    setIsUploading(true);
    setValue("isUploading", true);
  };

  const handleUploadEnd = () => {
    setIsUploading(false);
    setValue("isUploading", false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex-1">
        <Label className="mb-2 block">Desktop изображение</Label>
        <FileUpload
          value={desktop}
          onChange={(file) => handleFileChange("desktop", file)}
          onUploadStart={handleUploadStart}
          onUploadEnd={handleUploadEnd}
          label="Загрузить desktop изображение"
          recommended="Рекомендуемый размер: 1920x600px, JPG или PNG"
          previewRatio={3.2}
          accept={{ "image/*": [] }}
        />
      </div>

      <div className="flex-1">
        <Label className="mb-2 block">Mobile изображение</Label>
        <FileUpload
          value={mobile}
          onChange={(file) => handleFileChange("mobile", file)}
          onUploadStart={handleUploadStart}
          onUploadEnd={handleUploadEnd}
          label="Загрузить mobile изображение"
          recommended="Рекомендуемый размер: 768x400px, JPG или PNG"
          previewRatio={1.92}
          accept={{ "image/*": [] }}
        />
      </div>

      <div className="flex-1">
        <Label className="mb-2 block">Tablet изображение</Label>
        <FileUpload
          value={tablet}
          onChange={(file) => handleFileChange("tablet", file)}
          onUploadStart={handleUploadStart}
          onUploadEnd={handleUploadEnd}
          label="Загрузить tablet изображение"
          recommended="Рекомендуемый размер: 1024x500px, JPG или PNG"
          previewRatio={2.05}
          accept={{ "image/*": [] }}
        />
      </div>

      {/* Скрытое поле для отслеживания состояния загрузки */}
      <input
        type="hidden"
        {...register("isUploading")}
        value={isUploading ? "true" : "false"}
      />
    </div>
  );
}
