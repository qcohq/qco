-- Создание таблицы типов продуктов
CREATE TABLE product_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Создание таблицы атрибутов типа продукта
CREATE TABLE product_type_attributes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_type_id UUID NOT NULL REFERENCES product_types(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    type VARCHAR(32) NOT NULL, -- text, number, select, boolean, color, multiselect, range
    options JSONB DEFAULT '[]', -- для select/multiselect
    is_filterable BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    is_required BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Значения атрибутов для конкретного продукта
CREATE TABLE product_type_attribute_values (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    attribute_id UUID NOT NULL REFERENCES product_type_attributes(id) ON DELETE CASCADE,
    value TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Связь Product → ProductType
ALTER TABLE products
ADD COLUMN product_type_id UUID REFERENCES product_types(id) ON DELETE SET NULL; 