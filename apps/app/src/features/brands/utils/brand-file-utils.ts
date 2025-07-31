import type { BrandFormValues } from "@qco/validators";

// TODO: Использовать тип из схемы данных файлов бренда, если появится в @qco/validators
export interface BrandFileData {
  fileId: string;
  type: string;
  order: number;
  meta?: { name?: string; mimeType?: string; size?: number };
}

/**
 * Получает URL логотипа из файлов бренда
 */
export function getBrandLogoUrl(files?: Array<{
  type: string;
  url: string | null;
  file: {
    path: string;
  };
}>) {
  if (!files || files.length === 0) {
    return "/generic-brand-logo.png";
  }

  // Ищем файл с типом "logo"
  const logoFile = files.find(file => file.type === "logo");
  if (logoFile) {
    return logoFile.url || "/generic-brand-logo.png";
  }

  // Если логотипа нет, возвращаем первый файл или заглушку
  return files[0]?.url || "/generic-brand-logo.png";
}

/**
 * Получает URL баннера из файлов бренда
 */
export function getBrandBannerUrl(files?: Array<{
  type: string;
  url: string | null;
  file: {
    path: string;
  };
}>) {
  if (!files || files.length === 0) {
    return "/placeholder.svg?height=300&width=1200&query=brand banner";
  }

  // Ищем файл с типом "banner"
  const bannerFile = files.find(file => file.type === "banner");
  if (bannerFile) {
    return bannerFile.url || "/placeholder.svg?height=300&width=1200&query=brand banner";
  }

  // Если баннера нет, возвращаем заглушку
  return "/placeholder.svg?height=300&width=1200&query=brand banner";
}

/**
 * Формирует массив файлов для API из данных формы бренда
 */
export function prepareBrandFiles(values: BrandFormValues): BrandFileData[] {
  const files: BrandFileData[] = [];

  // Обрабатываем логотип
  if (values.logoKey && values.logoMeta) {
    files.push({
      fileId: values.logoKey,
      type: "logo",
      order: 0,
      meta: {
        name: values.logoMeta.name,
        mimeType: values.logoMeta.mimeType,
        size: values.logoMeta.size,
      },
    });
  } else if (values.logoKey) {
    files.push({ fileId: values.logoKey, type: "logo", order: 0 });
  }

  // Обрабатываем баннер
  if (values.bannerKey && values.bannerMeta) {
    files.push({
      fileId: values.bannerKey,
      type: "banner",
      order: 1,
      meta: {
        name: values.bannerMeta.name,
        mimeType: values.bannerMeta.mimeType,
        size: values.bannerMeta.size,
      },
    });
  } else if (values.bannerKey) {
    files.push({ fileId: values.bannerKey, type: "banner", order: 1 });
  }

  return files;
}
