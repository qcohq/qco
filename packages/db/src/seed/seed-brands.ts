import { createId } from "@paralleldrive/cuid2";
import { db } from "../client";
import { brands, brandFiles } from "../schemas/brands";
import { files } from "../schemas/file";
import { admins } from "../schemas/admin";
import { promises as fs } from "node:fs";
import path from "node:path";
import { uploadFile } from "@qco/lib";
import { generateS3Key } from "@qco/lib";

interface BrandData {
	id: number;
	slug: string;
	title: string;
	logoUrl: string;
}

interface UploadedLogo {
	fileId: string;
	s3Key: string;
}

/**
 * Загружает изображение по URL в S3
 */
async function uploadLogoFromUrl(
	logoUrl: string,
	brandSlug: string,
	adminId: string,
	now: Date
): Promise<UploadedLogo | null> {
	if (!logoUrl || logoUrl.trim() === "") {
		return null;
	}

	try {
		console.log(`📥 Загрузка логотипа для бренда ${brandSlug}...`);

		// Загружаем изображение по URL
		const response = await fetch(logoUrl);
		if (!response.ok) {
			console.warn(`⚠️ Не удалось загрузить изображение по URL: ${logoUrl}`);
			return null;
		}

		const buffer = await response.arrayBuffer();
		const fileBuffer = Buffer.from(buffer);

		// Определяем тип файла из URL
		const url = new URL(logoUrl);
		const pathname = url.pathname;
		const extension = path.extname(pathname) || ".png";
		const mimeType = response.headers.get("content-type") || "image/png";

		// Генерируем имя файла и ключ S3
		const fileName = `${brandSlug}-logo${extension}`;
		const s3Key = generateS3Key(fileName, false, extension);
		const finalS3Key = `brands/logos/${s3Key}`;

		// Загружаем файл в S3
		await uploadFile(finalS3Key, mimeType, fileBuffer);

		// Создаем запись о файле в БД
		const fileId = createId();
		const fileRecord = {
			id: fileId,
			name: fileName,
			mimeType,
			size: fileBuffer.length,
			path: finalS3Key,
			type: "brand_logo" as const,
			uploadedBy: adminId,
			createdAt: now,
			updatedAt: now,
		};

		await db
			.insert(files)
			.values(fileRecord)
			.onConflictDoUpdate({
				target: files.id,
				set: { ...fileRecord, updatedAt: now },
			});

		console.log(`✅ Логотип загружен для бренда ${brandSlug}`);
		return { fileId, s3Key: finalS3Key };
	} catch (error) {
		console.error(`❌ Ошибка при загрузке логотипа для ${brandSlug}:`, error);
		return null;
	}
}

/**
 * Создает связь между брендом и файлом логотипа
 */
async function createBrandLogoRelation(
	brandId: string,
	fileId: string,
): Promise<void> {
	try {
		await db
			.insert(brandFiles)
			.values({
				id: createId(),
				brandId,
				fileId,
				type: "logo",
				order: 0,
			})

	} catch (error) {
		console.error("❌ Ошибка при создании связи бренд-логотип:", error);
	}
}

// Список знаменитых брендов (можно расширять)
const featuredBrands = [
	"gucci",
	"prada",
	"armani",
	"nike",
	"adidas",
	"balenciaga",
	"burberry",
	"dior",
	"chanel",
	"versace",
	"hermes",
	"fendi",
	"celine",
	"saint-laurent",
	"valentino",
	"loewe",
	"moncler",
	"off-white",
	"givenchy",
	"marni",
	"boss",
	"lacoste",
	"tommy-hilfiger",
	"ralph-lauren",
	"kenzo",
	"moschino",
	"dsquared2",
	"stone-island",
	"zara",
	"hugo",
	"calvin-klein"
];

export async function seedBrands(
	now: Date,
	adminId: string,
): Promise<Record<string, string>> {
	console.log("Seeding brands...");

	// Очищаем таблицы брендов и связанных файлов
	await db.delete(brandFiles);
	await db.delete(brands);

	// Пути к файлам с брендами
	const brandsWomanPath = path.resolve(__dirname, "./brands-woman.json");
	const brandsManPath = path.resolve(__dirname, "./brands-man.json");
	const brandsKidsPath = path.resolve(__dirname, "./brands-kids.json");

	// Читаем данные из всех файлов
	const [womanRaw, manRaw, kidsRaw] = await Promise.all([
		fs.readFile(brandsWomanPath, "utf-8"),
		fs.readFile(brandsManPath, "utf-8"),
		fs.readFile(brandsKidsPath, "utf-8"),
	]);

	const womanBrands: BrandData[] = JSON.parse(womanRaw);
	const manBrands: BrandData[] = JSON.parse(manRaw);
	const kidsBrands: BrandData[] = JSON.parse(kidsRaw);

	// Объединяем все бренды, убирая дубликаты по slug
	const allBrandsMap = new Map<string, BrandData>();

	// Добавляем бренды из всех файлов, приоритет по порядку: woman, man, kids
	[...womanBrands, ...manBrands, ...kidsBrands].forEach((brand) => {
		if (!allBrandsMap.has(brand.slug)) {
			allBrandsMap.set(brand.slug, brand);
		}
	});

	const allBrands = Array.from(allBrandsMap.values());
	const slugToId: Record<string, string> = {};

	console.log(`📊 Найдено ${allBrands.length} уникальных брендов`);

	// Обрабатываем каждый бренд
	for (const brand of allBrands) {
		try {
			// Формируем объект для вставки бренда
			const brandToInsert = {
				name: brand.title,
				slug: brand.slug,
				description: null,
				shortDescription: null,
				website: null,
				email: null,
				phone: null,
				isActive: true,
				isFeatured: featuredBrands.includes(brand.slug.toLowerCase()),
				foundedYear: null,
				countryOfOrigin: null,
				brandColor: null,
				metaTitle: brand.title,
				metaDescription: null,
				metaKeywords: null,
				createdBy: adminId,
				updatedBy: adminId,
			};

			// Вставляем или обновляем бренд
			const [inserted] = await db
				.insert(brands)
				.values(brandToInsert)
				.onConflictDoUpdate({
					target: brands.slug,
					set: { ...brandToInsert },
				})
				.returning();

			if (inserted) {
				slugToId[brand.slug] = inserted.id;

				// Загружаем логотип если есть URL
				if (brand.logoUrl && brand.logoUrl.trim() !== "") {
					const uploadedLogo = await uploadLogoFromUrl(
						brand.logoUrl,
						brand.slug,
						adminId,
						now
					);

					if (uploadedLogo) {
						// Создаем связь между брендом и логотипом
						await createBrandLogoRelation(
							inserted.id,
							uploadedLogo.fileId,
						);
					}
				}
			}
		} catch (error) {
			console.error(`❌ Ошибка при обработке бренда ${brand.slug}:`, error);
		}
	}

	console.log("✅ Seeded brands:", allBrands.map((b) => b.title).join(", "));
	return slugToId;
}
