-- Safe fix for coupon display_id to start from 100
-- This approach preserves existing data and ensures new coupons start from 100

-- Check if display_id column exists, if not create it
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'coupons' AND column_name = 'display_id') THEN
        ALTER TABLE public.coupons ADD COLUMN display_id SERIAL;
    END IF;
END $$;

-- Get the current maximum display_id or set to 99 if no records exist
DO $$
DECLARE
    max_id INTEGER;
BEGIN
    SELECT COALESCE(MAX(display_id), 0) INTO max_id FROM public.coupons;
    
    -- If max_id is less than 100, set sequence to start from 100
    IF max_id < 100 THEN
        -- Drop existing sequence
        DROP SEQUENCE IF EXISTS public.coupons_display_id_seq;
        
        -- Create new sequence starting from 100
        CREATE SEQUENCE public.coupons_display_id_seq START WITH 100;
        
        -- Update the column to use the new sequence
        ALTER TABLE public.coupons 
        ALTER COLUMN display_id SET DEFAULT nextval('public.coupons_display_id_seq');
        
        -- Update existing records to have sequential IDs starting from 100
        UPDATE public.coupons 
        SET display_id = nextval('public.coupons_display_id_seq')
        WHERE display_id IS NULL OR display_id < 100;
    END IF;
END $$;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_coupons_display_id ON public.coupons(display_id);

-- Add comment for documentation
COMMENT ON COLUMN public.coupons.display_id IS 'Sequential display ID for coupons starting from 100 (Kupon #100, #101, etc.)';
