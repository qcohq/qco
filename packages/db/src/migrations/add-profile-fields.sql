-- Добавление полей dateOfBirth и gender в таблицу customers
ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS date_of_birth TIMESTAMP,
ADD COLUMN IF NOT EXISTS gender VARCHAR(20); 