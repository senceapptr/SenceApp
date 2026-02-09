-- Add is_claimed column to coupons table
-- This prevents double-claiming of won coupon rewards

ALTER TABLE coupons ADD COLUMN IF NOT EXISTS is_claimed BOOLEAN DEFAULT FALSE;

-- Add index for faster lookup of unclaimed won coupons
CREATE INDEX IF NOT EXISTS idx_coupons_is_claimed ON coupons(is_claimed) WHERE status = 'won';

COMMENT ON COLUMN coupons.is_claimed IS 'Kazanan kuponun ödülü alınmış mı?';
