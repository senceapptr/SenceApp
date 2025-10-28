-- Add sequential display_id to coupons table starting from 100
-- This will make coupon names appear as "Kupon #100", "Kupon #101", etc.

-- Add display_id column to coupons table
ALTER TABLE public.coupons 
ADD COLUMN display_id SERIAL;

-- Set the starting value to 100
ALTER SEQUENCE public.coupons_display_id_seq RESTART WITH 100;

-- Create index for better performance
CREATE INDEX idx_coupons_display_id ON public.coupons(display_id);

-- Update existing coupons to have sequential display_ids
-- This will assign display_id starting from 100 to existing coupons
UPDATE public.coupons 
SET display_id = nextval('public.coupons_display_id_seq')
WHERE display_id IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN public.coupons.display_id IS 'Sequential display ID for coupons starting from 100 (Kupon #100, #101, etc.)';
