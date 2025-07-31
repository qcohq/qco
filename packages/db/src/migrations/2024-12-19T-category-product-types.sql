-- Создание таблицы для связи категорий с типами продуктов
CREATE TABLE category_product_types (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    product_type_id TEXT NOT NULL REFERENCES product_types(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(category_id, product_type_id)
);

-- Создание индексов для производительности
CREATE INDEX idx_category_product_types_category_id ON category_product_types(category_id);
CREATE INDEX idx_category_product_types_product_type_id ON category_product_types(product_type_id);
CREATE INDEX idx_category_product_types_primary ON category_product_types(is_primary); 