-- Update existing payment_status values to uppercase
UPDATE "orders" SET "payment_status" = 'PENDING' WHERE "payment_status" = 'pending';
UPDATE "orders" SET "payment_status" = 'PROCESSING' WHERE "payment_status" = 'processing';
UPDATE "orders" SET "payment_status" = 'COMPLETED' WHERE "payment_status" = 'completed';
UPDATE "orders" SET "payment_status" = 'FAILED' WHERE "payment_status" = 'failed';
UPDATE "orders" SET "payment_status" = 'REFUNDED' WHERE "payment_status" = 'refunded';
UPDATE "orders" SET "payment_status" = 'PARTIALLY_REFUNDED' WHERE "payment_status" = 'partially_refunded'; 