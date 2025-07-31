"use client";

import { Label } from "@qco/ui/components/label";
import type { brandSchema } from "@qco/validators";
import { useEffect, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { z } from "zod";
import { FileUpload } from "@/components/file-upload";

// TODO: Использовать тип из схемы пропсов визуалов бренда, если появится в @qco/validators
type BrandFormValues = z.infer<typeof brandSchema>;

interface BrandVisualsProps {
  form: UseFormReturn<BrandFormValues>;
  initialLogo?: {
    key: string;
    url: string;
    name?: string;
    mimeType?: string;
    size?: number;
  } | null;
  initialBanner?: {
    key: string;
    url: string;
    name?: string;
    mimeType?: string;
    size?: number;
  } | null;
}

export function BrandVisuals({
  form,
  initialLogo,
  initialBanner,
}: BrandVisualsProps) {
  const [logo, setLogo] = useState(initialLogo ?? null);
  const [banner, setBanner] = useState(initialBanner ?? null);

  useEffect(() => {
    setLogo(initialLogo ?? null);
    if (initialLogo) {
      form.setValue("logoKey", initialLogo.key);
      form.setValue("logoMeta", {
        name: initialLogo.name,
        mimeType: initialLogo.mimeType,
        size: initialLogo.size,
      });
    } else {
      form.setValue("logoKey", null);
      form.setValue("logoMeta", undefined);
    }
  }, [initialLogo, form.setValue]);

  useEffect(() => {
    setBanner(initialBanner ?? null);
    if (initialBanner) {
      form.setValue("bannerKey", initialBanner.key);
      form.setValue("bannerMeta", {
        name: initialBanner.name,
        mimeType: initialBanner.mimeType,
        size: initialBanner.size,
      });
    } else {
      form.setValue("bannerKey", null);
      form.setValue("bannerMeta", undefined);
    }
  }, [initialBanner, form.setValue]);

  return (
    <div className="flex flex-col gap-6 md:flex-row">
      <div className="flex-1">
        <Label className="mb-2 block">Логотип бренда</Label>
        <FileUpload
          value={logo}
          onChange={(file) => {
            setLogo(file);
            form.setValue("logoKey", file?.key ?? null);
            form.setValue(
              "logoMeta",
              file
                ? { name: file.name, mimeType: file.mimeType, size: file.size }
                : undefined,
            );
          }}
          label="Загрузить логотип"
          recommended="Рекомендуемый размер: 512x512px, PNG или SVG"
          previewRatio={1}
        />
      </div>
      <div className="flex-1">
        <Label className="mb-2 block">Баннер бренда</Label>
        <FileUpload
          value={banner}
          onChange={(file) => {
            setBanner(file);
            form.setValue("bannerKey", file?.key ?? null);
            form.setValue(
              "bannerMeta",
              file
                ? { name: file.name, mimeType: file.mimeType, size: file.size }
                : undefined,
            );
          }}
          label="Загрузить баннер"
          recommended="Рекомендуемый размер: 1200x400px, JPG или PNG"
          previewRatio={2.66}
        />
      </div>
    </div>
  );
}
