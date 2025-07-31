import { createId } from "@paralleldrive/cuid2";
import { files } from "../../schemas/file";
import { productFiles } from "../../schemas/products";
import { uploadImageToS3 } from "./images";

/**
 * Создает запись о файле и связывает его с продуктом
 */
export async function createProductFile(
  tx: any,
  productId: string,
  productXmlId: string,
  productName: string,
  imagePath: string,
  index: number,
  adminId: string
) {
  try {
    // Загружаем изображение в S3
    const fileInfo = await uploadImageToS3(
      imagePath,
      productXmlId,
      index,
    );

    if (!fileInfo) {
      console.warn(
        `⚠️ Не удалось загрузить изображение ${imagePath} для продукта ${productXmlId}`,
      );
      return null;
    }

    // Создаем запись о файле в БД
    const [fileRecord] = await tx
      .insert(files)
      .values({
        id: fileInfo.fileId,
        name: fileInfo.name,
        mimeType: fileInfo.mimeType,
        size: fileInfo.size,
        path: fileInfo.url,
        type: "product_image",
        uploadedBy: adminId,
      })
      .returning();

    if (!fileRecord) {
      console.warn(
        `⚠️ Не удалось создать запись о файле для продукта ${productXmlId}`,
      );
      return null;
    }

    // Связываем файл с продуктом
    await tx.insert(productFiles).values({
      id: createId(),
      productId: productId,
      fileId: fileRecord.id,
      type: index === 0 ? "main" : "gallery", // Первое изображение - главное, остальные - галерея
      order: index,
      url: fileInfo.url,
      alt: productName,
    });

    console.log(
      `✅ Изображение ${index + 1} успешно добавлено для продукта ${productName}`,
    );

    return fileRecord;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`❌ Ошибка при создании файла: ${errorMessage}`);
    return null;
  }
}

/**
 * Обрабатывает изображения продукта из массива путей
 */
export async function processProductImages(
  tx: any,
  productId: string,
  productXmlId: string,
  productName: string,
  images: string[],
  adminId: string
) {
  if (!images || !Array.isArray(images) || images.length === 0) {
    return [];
  }

  console.log(
    `🖼️ Обработка ${images.length} изображений для продукта ${productName}`,
  );

  const createdFiles = [];

  // Загружаем изображения в S3 и создаем записи в БД
  for (let i = 0; i < images.length; i++) {
    const imagePath = images[i];

    if (!imagePath) {
      console.warn(
        `⚠️ Отсутствует путь к изображению для продукта ${productXmlId}`,
      );
      continue;
    }

    const fileRecord = await createProductFile(
      tx,
      productId,
      productXmlId,
      productName,
      imagePath,
      i,
      adminId
    );

    if (fileRecord) {
      createdFiles.push(fileRecord);
    }
  }

  return createdFiles;
}
