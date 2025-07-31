-- Добавление поля is_new в таблицу products
ALTER TABLE products ADD COLUMN is_new BOOLEAN NOT NULL DEFAULT false;

-- Добавление индекса для оптимизации запросов по новинкам
CREATE INDEX idx_products_is_new ON products(is_new) WHERE is_new = true; 