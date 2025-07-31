-- Добавляем поле is_active в таблицу product_type_attributes
ALTER TABLE product_type_attributes 
ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT true;

-- Создаем индекс для оптимизации запросов по активности
CREATE INDEX idx_product_type_attributes_is_active ON product_type_attributes(is_active); 