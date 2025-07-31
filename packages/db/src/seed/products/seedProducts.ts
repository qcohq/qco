import { generateAttributes, processProduct } from "./product-helpers";
import { getBrandNameToId } from "./brand-utils";
import { getCategoryXmlIdToId } from "./category-utils";
import fs from "node:fs/promises";
import path from "node:path";
import type { ProductData } from "./types";

const productsJsonPaths = [
	path.resolve(__dirname, "./output.json"),
	path.resolve(__dirname, "./output-man.json"),
	path.resolve(__dirname, "./output-woman.json"),
	path.resolve(__dirname, "./output-kids.json"),
];

/**
 * Импортирует продукты из JSON-файлов
 */
export async function seedProducts(): Promise<void> {
	console.log("🌱 Начинаем заполнение продуктов из JSON файлов...");
	let allProducts: ProductData[] = [];
	for (const jsonPath of productsJsonPaths) {
		try {
			const rawData = await fs.readFile(jsonPath, "utf-8");
			const productsData: ProductData[] = JSON.parse(rawData);
			console.log(
				`📊 Загружено ${productsData.length} продуктов из ${path.basename(jsonPath)}`,
			);
			allProducts = [...allProducts, ...productsData];
		} catch (err) {
			console.warn(
				`⚠️ Не удалось прочитать файл ${jsonPath}: ${err instanceof Error ? err.message : String(err)}`,
			);
		}
	}
	if (allProducts.length === 0) {
		console.log("⚠️ Нет продуктов для импорта, завершаем работу");
		return;
	}
	const brandNameToId = await getBrandNameToId();
	const xmlIdToCategoryId = await getCategoryXmlIdToId();
	let successCount = 0;
	let errorCount = 0;
	for (const product of allProducts) {
		try {
			const preparedProduct = generateAttributes(product);
			await processProduct(preparedProduct, brandNameToId, xmlIdToCategoryId);
			successCount++;
		} catch (error) {
			console.log(error);
			const errorMessage =
				error instanceof Error ? error.message : String(error);
			console.error(
				`❌ Ошибка при заполнении продукта ${product.name}: ${errorMessage}`,
			);
			errorCount++;
		}
	}
	console.log(`✅ Успешно создано/обновлено ${successCount} продуктов`);
	if (errorCount > 0) {
		console.warn(`⚠️ Не удалось создать ${errorCount} продуктов`);
	}
	console.log("✅ Заполнение продуктов завершено успешно");
}
