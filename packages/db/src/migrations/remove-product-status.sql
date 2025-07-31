-- Удаление поля status из таблицы products
ALTER TABLE products DROP COLUMN IF EXISTS status;

-- Удаление enum типа product_status
DROP TYPE IF EXISTS product_status; 