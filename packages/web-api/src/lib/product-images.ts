import { eq, inArray } from '@qco/db';
import { productFiles, files } from '@qco/db/schema';
import { getFileUrl } from '@qco/lib';

/**
 * Получает главные изображения товаров
 * @param db - Экземпляр базы данных
 * @param productIds - Массив ID товаров
 * @returns Объект с URL изображений, где ключ - ID товара, значение - URL изображения или null
 */
export async function getProductMainImages(
    db: any,
    productIds: string[]
): Promise<Record<string, string | null>> {
    const productMainImages: Record<string, string | null> = {};

    if (productIds.length === 0) {
        return productMainImages;
    }

    try {
        const mainFiles = await db
            .select({
                productId: productFiles.productId,
                filePath: files.path,
                fileType: productFiles.type,
                fileOrder: productFiles.order,
            })
            .from(productFiles)
            .innerJoin(files, eq(productFiles.fileId, files.id))
            .where(inArray(productFiles.productId, productIds))
            .orderBy(productFiles.productId, productFiles.type, productFiles.order);

        // Группируем по productId, берем type: 'main', иначе первый
        for (const pid of productIds) {
            const files = mainFiles.filter((f: any) => f.productId === pid);
            const main = files.find((f: any) => f.fileType === "main") || files[0];
            productMainImages[pid] = main ? getFileUrl(main.filePath) : null;
        }

        return productMainImages;
    } catch (error) {
        console.warn("Failed to fetch product images:", error);
        return productMainImages;
    }
} 