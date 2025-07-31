-- Создание enum для статуса продукта
CREATE TYPE IF NOT EXISTS product_status AS ENUM ('draft', 'published', 'archived');

-- Добавление поля status в таблицу products
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS status product_status NOT NULL DEFAULT 'draft';

-- Обновление существующих продуктов на статус 'published' если они активны
UPDATE products 
SET status = 'published' 
WHERE is_active = true AND status IS NULL;

-- Обновление существующих продуктов на статус 'archived' если они неактивны
UPDATE products 
SET status = 'archived' 
WHERE is_active = false AND status IS NULL; 