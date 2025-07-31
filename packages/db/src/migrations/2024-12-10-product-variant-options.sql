-- Создание таблицы опций вариантов продукта
CREATE TABLE product_variant_options (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'select',
    metadata JSONB,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Создание таблицы значений опций вариантов
CREATE TABLE product_variant_option_values (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    option_id TEXT NOT NULL REFERENCES product_variant_options(id) ON DELETE CASCADE,
    value VARCHAR(255) NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    metadata JSONB,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Создание таблицы комбинаций опций вариантов
CREATE TABLE product_variant_option_combinations (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    variant_id TEXT NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
    option_id TEXT NOT NULL REFERENCES product_variant_options(id) ON DELETE CASCADE,
    option_value_id TEXT NOT NULL REFERENCES product_variant_option_values(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Создание индексов для оптимизации запросов
CREATE INDEX product_variant_options_product_idx ON product_variant_options(product_id);
CREATE INDEX product_variant_options_slug_idx ON product_variant_options(slug);

CREATE INDEX product_variant_option_values_option_idx ON product_variant_option_values(option_id);
CREATE INDEX product_variant_option_values_value_idx ON product_variant_option_values(value);

CREATE INDEX product_variant_option_combinations_variant_idx ON product_variant_option_combinations(variant_id);
CREATE INDEX product_variant_option_combinations_option_idx ON product_variant_option_combinations(option_id);
CREATE INDEX product_variant_option_combinations_unique_idx ON product_variant_option_combinations(variant_id, option_id);

-- Добавляем комментарии для документации
COMMENT ON TABLE product_variant_options IS 'Опции вариантов продукта (размер, цвет, вкус и т.д.)';
COMMENT ON TABLE product_variant_option_values IS 'Значения опций вариантов (S, M, L для размера; красный, синий для цвета)';
COMMENT ON TABLE product_variant_option_combinations IS 'Связь между вариантами и их опциями';

-- Комментарии к важным полям
COMMENT ON COLUMN product_variant_options.type IS 'Тип опции: select, color, text, number';
COMMENT ON COLUMN product_variant_options.metadata IS 'Дополнительные метаданные для опции';
COMMENT ON COLUMN product_variant_option_values.metadata IS 'Метаданные значения (hex код для цвета, размерная таблица для размера)'; 