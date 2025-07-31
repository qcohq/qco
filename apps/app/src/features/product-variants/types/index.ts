// Импорт схем и типов из пакета валидаторов
export {
    // Схемы для атрибутов и вариантов продуктов
    productAttributeSchema,
    productVariantSchema,
    variantEditSchema,
    optionEditSchema,
    optionValueSchema,
    bulkPriceEditSchema,
    bulkStockEditSchema,
    generateVariantsSchema,

    // Схемы для форм
    variantFormSchema,
    createVariantOptionSchema,
    addVariantOptionValueSchema,
    updateVariantOptionSchema,
    updateVariantOptionValueSchema,
    deleteVariantOptionSchema,
    deleteVariantOptionValueSchema,
    getVariantOptionsSchema,
    previewVariantsSchema,
    duplicateVariantSchema,

    // Схемы для форм (старые)
    optionFormSchema,
    optionFormInputSchema,
    optionEditFormSchema,
    valueFormSchema,
} from "@qco/validators";

// Экспорт типов
export type {
    // Типы для атрибутов и вариантов
    ProductAttribute,
    ProductVariant,
    VariantEditData,
    OptionEditData,
    OptionValueData,
    BulkPriceEditData,
    BulkStockEditData,
    GenerateVariantsData,

    // Типы для форм
    VariantFormValues,
    CreateVariantOptionValues,
    AddVariantOptionValueValues,
    UpdateVariantOptionValues,
    UpdateVariantOptionValueValues,
    DeleteVariantOptionValues,
    DeleteVariantOptionValueValues,
    GetVariantOptionsValues,
    GenerateVariantsValues,
    PreviewVariantsValues,
    DuplicateVariantValues,

    // Типы для форм (старые)
    CreateOptionValues,
    AddOptionValueValues,
    OptionFormValues,
    OptionFormInputValues,
    OptionEditFormValues,
    ValueFormValues,
} from "@qco/validators"; 