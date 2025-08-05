import { publicProcedure } from "../../trpc";
import {
	orders,
	products,
	productFiles,
	files,
	productVariants,
	productVariantOptions,
	productVariantOptionValues,
	productVariantOptionCombinations
} from "@qco/db/schema";
import { desc, inArray, eq } from "@qco/db";
import { orderListSchema, orderSchema } from "@qco/validators";
import { z } from "zod";

/**
 * Функция для получения опций варианта товара
 */
async function getVariantOptions(
	ctx: any,
	variantId: string
): Promise<Array<{ name: string; value: string; slug: string }>> {
	if (!variantId) return [];

	try {
		// Получаем комбинации опций для конкретного варианта
		const optionCombinations = await ctx.db.query.productVariantOptionCombinations.findMany({
			where: eq(productVariantOptionCombinations.variantId, variantId),
			with: {
				option: true,
				optionValue: true,
			},
		});

		// Форматируем опции варианта
		const variantOptions = optionCombinations
			.filter(combination => combination.option && combination.optionValue)
			.map(combination => ({
				name: combination.option!.name,
				value: combination.optionValue!.displayName || combination.optionValue!.value,
				slug: combination.option!.slug,
			}));

		return variantOptions;
	} catch (error) {
		console.error('Error getting variant options:', error);
		return [];
	}
}

/**
 * Returns a paginated list of orders with items and customer information.
 */
export const list = publicProcedure
	.input(orderListSchema)
	.output(z.array(orderSchema))
	.query(async ({ input, ctx }) => {
		const { limit = 20, offset = 0 } = input ?? {};

		const data = await ctx.db.query.orders.findMany({
			orderBy: desc(orders.createdAt),
			limit,
			offset,
			with: {
				items: true,
				customer: true,
			},
		});

		// Получаем все productId из всех заказов
		const allProductIds = data.flatMap(order =>
			order.items?.map(item => item.productId).filter((id): id is string => Boolean(id)) || []
		);

		// Получаем slug товаров
		let productSlugs: Record<string, string> = {};
		let productImages: Record<string, string> = {};
		if (allProductIds.length > 0) {
			const uniqueProductIds = Array.from(new Set(allProductIds));
			const productsData = await ctx.db.query.products.findMany({
				where: inArray(products.id, uniqueProductIds),
				columns: {
					id: true,
					slug: true,
				},
			});

			productSlugs = productsData.reduce((acc, product) => {
				acc[product.id] = product.slug;
				return acc;
			}, {} as Record<string, string>);

			// Получаем изображения товаров
			const fileIds = await ctx.db
				.select({ id: productFiles.fileId, productId: productFiles.productId })
				.from(productFiles)
				.where(inArray(productFiles.productId, uniqueProductIds));

			if (fileIds.length > 0) {
				const fileIdList = fileIds.map(f => f.id);
				const images = await ctx.db
					.select({ id: files.id, path: files.path })
					.from(files)
					.where(inArray(files.id, fileIdList));

				// Создаем мапу productId -> imagePath (берем первое изображение для каждого товара)
				const productFileMap = fileIds.reduce((acc, file) => {
					if (!acc[file.productId]) {
						acc[file.productId] = file.id;
					}
					return acc;
				}, {} as Record<string, string>);

				productImages = images.reduce((acc, image) => {
					// Находим productId для этого изображения
					const productId = Object.keys(productFileMap).find(key => productFileMap[key] === image.id);
					if (productId && !acc[productId]) {
						acc[productId] = image.path;
					}
					return acc;
				}, {} as Record<string, string>);
			}
		}

		// Получаем информацию о вариантах товаров
		const allVariantIds = data.flatMap(order =>
			order.items?.map(item => item.variantId).filter((id): id is string => Boolean(id)) || []
		);
		let variantsMap: Record<string, any> = {};
		if (allVariantIds.length > 0) {
			const uniqueVariantIds = Array.from(new Set(allVariantIds));
			const variantsData = await ctx.db.query.productVariants.findMany({
				where: inArray(productVariants.id, uniqueVariantIds),
			});

			variantsMap = variantsData.reduce((acc, variant) => {
				acc[variant.id] = variant;
				return acc;
			}, {} as Record<string, any>);
		}

		// Трансформируем данные для соответствия валидатору
		return await Promise.all(data.map(async (order) => ({
			...order,
			items: await Promise.all(order.items?.map(async (item) => {
				const variant = item.variantId ? variantsMap[item.variantId] : null;

				// Получаем опции варианта товара
				const variantOptions = item.variantId
					? await getVariantOptions(ctx, item.variantId)
					: [];

				return {
					...item,
					productSku: item.productSku || null,
					variantName: item.variantName || null,

					slug: productSlugs[item.productId] || null,
					image: productImages[item.productId] || null,
					// Дополнительная информация о варианте
					variantSku: variant?.sku || null,
					variantBarcode: variant?.barcode || null,
					variantPrice: variant?.price || null,
					variantSalePrice: variant?.salePrice || null,
					variantStock: variant?.stock || null,
					variantWeight: variant?.weight || null,
					variantDimensions: variant ? {
						width: variant.width || null,
						height: variant.height || null,
						depth: variant.depth || null,
					} : null,
					// Опции варианта товара
					variantOptions: variantOptions.length > 0 ? variantOptions : null,
				};
			}) || []),
			customer: order.customer ? {
				...order.customer,
				name: order.customer.name || null,
				firstName: order.customer.firstName || null,
				lastName: order.customer.lastName || null,
				phone: order.customer.phone || null,
				dateOfBirth: order.customer.dateOfBirth || null,
				gender: order.customer.gender || null,
				image: order.customer.image || null,
			} : undefined,
		})));
	});
