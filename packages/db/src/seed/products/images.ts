import { createId } from "@paralleldrive/cuid2";
import fs from "node:fs/promises";
import path from "node:path";
import { fileTypeFromBuffer } from "file-type";
import { uploadFile } from "@qco/lib";
import type { FileInfo } from "./types";

// Путь к папке с изображениями
export const imagesDir = path.resolve(__dirname, "./");

/**
 * Загружает изображение из локального файла в S3 и возвращает информацию о файле
 */
export async function uploadImageToS3(
  imagePath: string,
  productXmlId: string,
  index: number,
): Promise<FileInfo | null> {
  try {
    console.log(
      `📥 Загрузка изображения ${index + 1} для продукта ${productXmlId}...`,
    );

    // Формируем полный путь к файлу
    const fullImagePath = path.resolve(
      imagesDir,
      imagePath.replace(/\\/g, path.sep),
    );

    // Проверяем существование файла
    try {
      await fs.access(fullImagePath);
    } catch (err) {
      console.warn(`⚠️ Файл не найден: ${fullImagePath}`);
      return null;
    }

    // Читаем файл
    const buffer = await fs.readFile(fullImagePath);

    // Определяем тип файла
    const fileTypeResult = await fileTypeFromBuffer(buffer);
    if (!fileTypeResult) {
      console.warn(`⚠️ Не удалось определить тип файла для ${imagePath}`);
      return null;
    }

    const { mime: mimeType, ext } = fileTypeResult;

    // Создаем уникальное имя файла
    const fileName = `${productXmlId}-${index + 1}.${ext}`;
    const s3Key = `products/${productXmlId}/${fileName}`;

    // Загружаем файл в S3 используя функцию из @qco/lib
    await uploadFile(s3Key, mimeType, buffer);

    // Создаем запись о файле в БД
    const fileId = createId();

    return {
      fileId,
      url: s3Key,
      size: buffer.length,
      mimeType,
      name: fileName,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`❌ Ошибка при загрузке изображения: ${errorMessage}`);
    return null;
  }
}
