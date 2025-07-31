-- Добавляем поле is_featured в таблицу categories
ALTER TABLE categories ADD COLUMN is_featured BOOLEAN NOT NULL DEFAULT false;

-- Создаем индекс для оптимизации запросов по featured категориям
CREATE INDEX categories_featured_idx ON categories(is_featured); 