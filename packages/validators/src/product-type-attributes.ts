import { z } from "zod";

// Схема для атрибута типа продукта (соответствует данным из API)
export const productTypeAttributeSchema = z.object({
    id: z.string(),
    name: z.string().min(2, "Название атрибута должно содержать минимум 2 символа"),
    slug: z.string().min(1, "Slug обязателен"),
    type: z.string(), // API возвращает string, не enum
    isRequired: z.boolean().default(false),
    isFilterable: z.boolean().default(false),
    options: z.array(z.string()).default([]).optional(),
    sortOrder: z.number().default(0),
    isActive: z.boolean().default(true),
    productTypeId: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

// Схема для создания атрибута типа продукта
export const createProductTypeAttributeSchema = z.object({
    name: z.string()
        .min(2, "Название атрибута должно содержать минимум 2 символа")
        .max(100, "Название атрибута не может быть длиннее 100 символов")
        .trim(),
    slug: z.string()
        .min(1, "Slug обязателен")
        .max(100, "Slug не может быть длиннее 100 символов")
        .regex(/^[a-z0-9-]+$/, "Slug может содержать только латинские буквы, цифры и дефисы")
        .trim(),
    type: z.enum(["text", "number", "boolean", "select", "multiselect"], {
        error: "Выберите корректный тип атрибута",
    }),
    options: z.array(
        z.string()
            .min(1, "Опция не может быть пустой")
            .max(50, "Опция не должна превышать 50 символов")
            .trim()
    ).default([]).optional(),
    isFilterable: z.boolean().default(false),
    isRequired: z.boolean().default(false),
    sortOrder: z.number().int().min(0, "Порядок сортировки должен быть не меньше 0").default(0),
    isActive: z.boolean().default(true).optional(),
    productTypeId: z.string().min(1, "Необходимо указать тип продукта"),
})
    .transform((data) => {
        // Для типов, которые не используют опции, очищаем поле options
        if (data.type !== "select" && data.type !== "multiselect") {
            return {
                ...data,
                options: [],
            };
        }
        return data;
    })
    .refine((data) => {
        // Проверяем, что для select и multiselect есть минимум 2 опции
        if ((data.type === "select" || data.type === "multiselect") && (!data.options || data.options.length < 2)) {
            return false;
        }
        return true;
    }, {
        error: "Для типов 'Выбор из списка' и 'Множественный выбор' необходимо минимум 2 опции",
        path: ["options"],
    });

// Схема для обновления атрибута типа продукта
export const updateProductTypeAttributeSchema = z.object({
    name: z.string()
        .min(2, "Название атрибута должно содержать минимум 2 символа")
        .max(100, "Название атрибута не может быть длиннее 100 символов")
        .trim()
        .optional(),
    slug: z.string()
        .min(1, "Slug обязателен")
        .max(100, "Slug не может быть длиннее 100 символов")
        .regex(/^[a-z0-9-]+$/, "Slug может содержать только латинские буквы, цифры и дефисы")
        .trim()
        .optional(),
    type: z.enum(["text", "number", "boolean", "select", "multiselect"], {
        error: "Выберите корректный тип атрибута",
    }).optional(),
    options: z.array(
        z.string()
            .min(1, "Опция не может быть пустой")
            .max(50, "Опция не должна превышать 50 символов")
            .trim()
    ).default([]).optional(),
    isFilterable: z.boolean().default(false).optional(),
    isRequired: z.boolean().default(false).optional(),
    sortOrder: z.number().int().min(0, "Порядок сортировки должен быть не меньше 0").default(0).optional(),
    isActive: z.boolean().default(true).optional(),
    productTypeId: z.string().min(1, "Необходимо указать тип продукта").optional(),
    id: z.string().min(1, "Идентификатор атрибута обязателен"),
})
    .transform((data) => {
        // Для типов, которые не используют опции, очищаем поле options
        if (data.type && data.type !== "select" && data.type !== "multiselect") {
            return {
                ...data,
                options: [],
            };
        }
        return data;
    })
    .refine((data) => {
        // Проверяем, что для select и multiselect есть минимум 2 опции
        if (data.type && (data.type === "select" || data.type === "multiselect") && (!data.options || data.options.length < 2)) {
            return false;
        }
        return true;
    }, {
        error: "Для типов 'Выбор из списка' и 'Множественный выбор' необходимо минимум 2 опции",
        path: ["options"],
    });

// Схема для получения атрибута по ID
export const getProductTypeAttributeByIdSchema = z.object({
    id: z.string().min(1, "Идентификатор атрибута обязателен"),
});

// Схема для удаления атрибута типа продукта
export const deleteProductTypeAttributeSchema = z.object({
    id: z.string().min(1, "Идентификатор атрибута обязателен"),
});

// Схема для получения атрибутов по типу продукта
export const getProductTypeAttributesByTypeSchema = z.object({
    productTypeId: z.string().min(1, "Идентификатор типа продукта обязателен"),
});

// Схема для ответа с атрибутами (с пагинацией)
export const productTypeAttributesResponseSchema = z.object({
    items: z.array(productTypeAttributeSchema),
    count: z.number(),
});

// Типы для экспорта
export type ProductTypeAttribute = z.infer<typeof productTypeAttributeSchema>;
export type CreateProductTypeAttributeInput = z.infer<typeof createProductTypeAttributeSchema>;
export type UpdateProductTypeAttributeInput = z.infer<typeof updateProductTypeAttributeSchema>;
export type DeleteProductTypeAttributeInput = z.infer<typeof deleteProductTypeAttributeSchema>;
export type GetProductTypeAttributesByTypeInput = z.infer<typeof getProductTypeAttributesByTypeSchema>;
export type ProductTypeAttributesResponse = z.infer<typeof productTypeAttributesResponseSchema>; 