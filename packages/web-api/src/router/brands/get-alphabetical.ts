import type { brands, brandFiles, files } from "@qco/db/schema";
import { categories, brandCategories } from "@qco/db/schema";
import { getFileUrl } from "@qco/lib";
import { eq, and, asc } from "@qco/db";
import { publicProcedure } from "../../trpc";
import {
    getBrandsAlphabeticalInputSchema,
    getBrandsAlphabeticalResponseSchema
} from "@qco/web-validators";
import type { AlphabeticalBrand, BrandWithFiles } from "@qco/web-validators";

// Русский алфавит
const RUSSIAN_ALPHABET = [
    'А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ё', 'Ж', 'З', 'И', 'Й', 'К', 'Л', 'М',
    'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Э', 'Ю', 'Я'
];

// Английский алфавит
const ENGLISH_ALPHABET = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
];

// Цифры
const NUMBERS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

// Функция для определения группы буквы
function getLetterGroup(firstLetter: string): string {
    if (RUSSIAN_ALPHABET.includes(firstLetter)) {
        return firstLetter;
    } if (ENGLISH_ALPHABET.includes(firstLetter)) {
        return firstLetter;
    } if (NUMBERS.includes(firstLetter)) {
        return '#';
    }
    return '#';
}

export const getBrandsAlphabetical = publicProcedure
    .input(getBrandsAlphabeticalInputSchema)
    .output(getBrandsAlphabeticalResponseSchema)
    .query(async ({ ctx, input }) => {
        const { categorySlug, limit } = input;

        let brands: BrandWithFiles[] = [];

        if (categorySlug) {
            // Получаем бренды по категории
            const category = await ctx.db.query.categories.findFirst({
                where: eq(categories.slug, categorySlug),
            });

            if (!category) {
                // Если категория не найдена, возвращаем пустой результат
                console.warn(`Category with slug "${categorySlug}" not found`);
                return {
                    groupedBrands: {},
                    availableLetters: [],
                    totalBrands: 0
                };
            }

            const brandCategoriesData = await ctx.db.query.brandCategories.findMany({
                where: eq(brandCategories.categoryId, category.id),
                with: {
                    brand: {
                        with: {
                            files: {
                                with: {
                                    file: true,
                                },
                            },
                        },
                    },
                },
            });

            brands = brandCategoriesData
                .filter((bc: any) => bc.brand)
                .slice(0, limit)
                .map((bc: any) => bc.brand as BrandWithFiles);
        } else {
            // Получаем все бренды
            brands = await ctx.db.query.brands.findMany({
                with: {
                    files: {
                        with: {
                            file: true,
                        },
                    },
                },
                limit,
            }) as BrandWithFiles[];
        }

        // Группируем бренды по алфавиту на сервере
        const groupedBrands: Record<string, AlphabeticalBrand[]> = {};

        brands.forEach((brand) => {
            const firstLetter = brand.name.charAt(0).toUpperCase();
            const groupKey = getLetterGroup(firstLetter);

            if (!groupedBrands[groupKey]) {
                groupedBrands[groupKey] = [];
            }

            const logoFile = brand.files?.find((f) => f.type === "logo");

            groupedBrands[groupKey].push({
                id: brand.id,
                name: brand.name,
                slug: brand.slug,
                logo: logoFile?.file?.path ? getFileUrl(logoFile.file.path) : null,
                countryOfOrigin: brand.countryOfOrigin,
                isFeatured: brand.isFeatured,
            });
        });

        // Получаем доступные буквы, отсортированные по алфавиту
        const availableLetters = Object.keys(groupedBrands).sort();

        return {
            groupedBrands,
            availableLetters,
            totalBrands: brands.length
        };
    }); 