-- Fix coupon display_id to start from 100
-- This migration ensures display_id starts from 100, not 1

-- First, check if display_id column exists, if not create it
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'coupons' AND column_name = 'display_id') THEN
        ALTER TABLE public.coupons ADD COLUMN display_id SERIAL;
    END IF;
END $$;

-- Drop the existing sequence if it exists and create a new one starting from 100
DROP SEQUENCE IF EXISTS public.coupons_display_id_seq;

-- Create new sequence starting from 100
CREATE SEQUENCE public.coupons_display_id_seq START WITH 100;

-- Update the column to use the new sequence
ALTER TABLE public.coupons 
ALTER COLUMN display_id SET DEFAULT nextval('public.coupons_display_id_seq');

-- Update existing records to have sequential IDs starting from 100
-- This will assign display_id starting from 100 to existing coupons
UPDATE public.coupons 
SET display_id = nextval('public.coupons_display_id_seq')
WHERE display_id IS NULL OR display_id < 100;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_coupons_display_id ON public.coupons(display_id);

-- Add comment for documentation
COMMENT ON COLUMN public.coupons.display_id IS 'Sequential display ID for coupons starting from 100 (Kupon #100, #101, etc.)';
