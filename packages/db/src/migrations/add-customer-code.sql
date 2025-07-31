-- Добавление поля customer_code в таблицу customers
ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS customer_code VARCHAR(20) UNIQUE NOT NULL;

-- Создание индекса для быстрого поиска по customer_code
CREATE INDEX IF NOT EXISTS idx_customers_customer_code ON customers(customer_code);

-- Обновление существующих записей с уникальными кодами
-- Используем формат CUST-XXXXX где XXXXX - это 5-значный номер
UPDATE customers 
SET customer_code = 'CUST-' || LPAD(ROW_NUMBER() OVER (ORDER BY created_at)::TEXT, 5, '0')
WHERE customer_code IS NULL OR customer_code = ''; 