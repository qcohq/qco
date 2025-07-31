-- Add payment status enum type if it doesn't exist
DO $$ BEGIN
    CREATE TYPE "payment_status" AS ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add payment_status column to orders table
ALTER TABLE "orders" ADD COLUMN "payment_status" "payment_status" DEFAULT 'PENDING'; 