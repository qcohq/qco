-- Изменение типа поля metadata в таблице orders с text на jsonb
ALTER TABLE orders ALTER COLUMN metadata TYPE jsonb USING metadata::jsonb;

-- Изменение типа поля attributes в таблице order_items с text на jsonb
ALTER TABLE order_items ALTER COLUMN attributes TYPE jsonb USING attributes::jsonb;

-- Изменение типа поля metadata в таблице carts с text на jsonb (если существует)
ALTER TABLE carts ALTER COLUMN metadata TYPE jsonb USING metadata::jsonb;

-- Изменение типа поля attributes в таблице cart_items с text на jsonb (если существует)
ALTER TABLE cart_items ALTER COLUMN attributes TYPE jsonb USING attributes::jsonb; 