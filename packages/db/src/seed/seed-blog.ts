import { db } from "../client";
import {
	blogCategories,
	blogTags,
	blogPosts,
	blogPostCategories,
	blogPostTags
} from "../schemas/blog";
import { files } from "../schemas/file";
import { promises as fs } from "node:fs";
import path from "node:path";
import { createId } from "@paralleldrive/cuid2";
import { uploadFile, generateS3Key } from "@qco/lib";

interface BlogData {
	categories: {
		name: string;
		slug: string;
		description: string;
		color: string;
		sortOrder: number;
	}[];
	tags: {
		name: string;
		slug: string;
		description: string;
		color: string;
	}[];
	posts: {
		title: string;
		slug: string;
		excerpt: string;
		content: string;
		contentPlain: string;
		status: "draft" | "published" | "scheduled" | "archived";
		type: "post" | "page";
		visibility: "public" | "members" | "paid" | "private";
		metaTitle: string;
		metaDescription: string;
		metaKeywords: string[];
		isFeatured: boolean;
		isSticky: boolean;
		allowComments: boolean;
		viewCount: number;
		likeCount: number;
		commentCount: number;
		categorySlugs: string[];
		tagSlugs: string[];
		featuredImage?: string;
		ogImage?: string;
	}[];
}

// Создаем демо изображения для блога
async function createDemoImages(adminId: string, now: Date): Promise<Record<string, string>> {
	const imageMap: Record<string, string> = {};

	// Список изображений для постов
	const blogImages = [
		"summer-trends-2024.svg",
		"summer-trends-2024-og.svg",
		"capsule-wardrobe-guide.svg",
		"capsule-wardrobe-guide-og.svg",
		"sustainable-fashion-brands.svg",
		"sustainable-fashion-brands-og.svg",
		"accessorizing-guide.svg",
		"accessorizing-guide-og.svg",
		"street-style-photography.svg",
		"street-style-photography-og.svg"
	];

	// Путь к папке с изображениями блога
	const blogImagesDir = path.resolve(__dirname, "./blog-images");

	for (const imageName of blogImages) {
		const fileId = createId();

		try {
			// Читаем файл
			const imagePath = path.join(blogImagesDir, imageName);
			const fileBuffer = await fs.readFile(imagePath);

			// Генерируем ключ для S3
			const s3Key = generateS3Key(imageName, false, ".svg");
			const finalS3Key = `blog/${s3Key}`;

			// Загружаем файл в S3
			await uploadFile(finalS3Key, "image/svg+xml", fileBuffer);

			// Создаем запись о файле в БД
			const fileRecord = {
				id: fileId,
				name: imageName,
				mimeType: "image/svg+xml",
				size: fileBuffer.length,
				path: finalS3Key,
				type: "blog_image" as const,
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

			imageMap[imageName] = fileId;
			console.log(`✅ Uploaded ${imageName} to S3`);
		} catch (error) {
			console.error(`❌ Error uploading ${imageName}:`, error);
			// Создаем запись в БД даже если загрузка в S3 не удалась
			const fileRecord = {
				id: fileId,
				name: imageName,
				mimeType: "image/svg+xml",
				size: 512000, // fallback size
				path: `/blog/${imageName}`,
				type: "blog_image" as const,
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

			imageMap[imageName] = fileId;
		}
	}

	console.log("✅ Created demo images for blog posts");
	return imageMap;
}

export async function seedBlog(now: Date, adminId: string): Promise<void> {
	console.log("Seeding blog...");

	const blogDataPath = path.resolve(__dirname, "./blog-data.json");
	const raw = await fs.readFile(blogDataPath, "utf-8");
	const blogData: BlogData = JSON.parse(raw);

	// Создаем демо изображения
	const imageMap = await createDemoImages(adminId, now);

	// Создаем категории
	const categorySlugToId: Record<string, string> = {};
	for (const category of blogData.categories) {
		const categoryToInsert = {
			...category,
			createdAt: now,
			updatedAt: now,
			createdBy: adminId,
			updatedBy: adminId,
		};

		const [inserted] = await db
			.insert(blogCategories)
			.values(categoryToInsert)
			.onConflictDoUpdate({
				target: blogCategories.slug,
				set: { ...categoryToInsert, updatedAt: now },
			})
			.returning();

		if (inserted) {
			categorySlugToId[category.slug] = inserted.id;
		}
	}

	console.log("✅ Seeded categories:", blogData.categories.map((c) => c.name).join(", "));

	// Создаем теги
	const tagSlugToId: Record<string, string> = {};
	for (const tag of blogData.tags) {
		const tagToInsert = {
			...tag,
			createdAt: now,
			updatedAt: now,
			createdBy: adminId,
			updatedBy: adminId,
		};

		const [inserted] = await db
			.insert(blogTags)
			.values(tagToInsert)
			.onConflictDoUpdate({
				target: blogTags.slug,
				set: { ...tagToInsert, updatedAt: now },
			})
			.returning();

		if (inserted) {
			tagSlugToId[tag.slug] = inserted.id;
		}
	}

	console.log("✅ Seeded tags:", blogData.tags.map((t) => t.name).join(", "));

	// Создаем посты
	for (const post of blogData.posts) {
		const postToInsert = {
			title: post.title,
			slug: post.slug,
			excerpt: post.excerpt,
			content: post.content,
			contentHtml: post.content, // Используем content как HTML
			contentPlain: post.contentPlain,
			status: post.status,
			type: post.type,
			visibility: post.visibility,
			publishedAt: post.status === "published" ? now : null,
			metaTitle: post.metaTitle,
			metaDescription: post.metaDescription,
			metaKeywords: post.metaKeywords,
			authorId: adminId,
			isFeatured: post.isFeatured,
			isSticky: post.isSticky,
			allowComments: post.allowComments,
			viewCount: post.viewCount,
			likeCount: post.likeCount,
			commentCount: post.commentCount,
			featuredImageId: post.featuredImage ? imageMap[post.featuredImage] : null,
			ogImageId: post.ogImage ? imageMap[post.ogImage] : null,
			createdAt: now,
			updatedAt: now,
			createdBy: adminId,
			updatedBy: adminId,
		};

		const [insertedPost] = await db
			.insert(blogPosts)
			.values(postToInsert)
			.onConflictDoUpdate({
				target: blogPosts.slug,
				set: { ...postToInsert, updatedAt: now },
			})
			.returning();

		if (insertedPost) {
			// Связываем пост с категориями
			for (const categorySlug of post.categorySlugs) {
				const categoryId = categorySlugToId[categorySlug];
				if (categoryId) {
					await db
						.insert(blogPostCategories)
						.values({
							postId: insertedPost.id,
							categoryId: categoryId,
							createdAt: now,
						})
						.onConflictDoNothing();
				}
			}

			// Связываем пост с тегами
			for (const tagSlug of post.tagSlugs) {
				const tagId = tagSlugToId[tagSlug];
				if (tagId) {
					await db
						.insert(blogPostTags)
						.values({
							postId: insertedPost.id,
							tagId: tagId,
							createdAt: now,
						})
						.onConflictDoNothing();
				}
			}
		}
	}

	console.log("✅ Seeded posts:", blogData.posts.map((p) => p.title).join(", "));
	console.log("🎉 Blog seeding completed successfully!");
} 
