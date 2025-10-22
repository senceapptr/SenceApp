-- ================================================
-- MARKET ŞEMASI DÜZELTMELERİ
-- ================================================

-- Market items tablosuna eksik kolonları ekle
ALTER TABLE public.market_items 
ADD COLUMN IF NOT EXISTS original_price BIGINT,
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS badge TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'out_of_stock')),
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.categories(id),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Market items tablosuna trigger ekle
CREATE TRIGGER update_market_items_updated_at 
  BEFORE UPDATE ON public.market_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Market items için index'ler ekle
CREATE INDEX IF NOT EXISTS idx_market_items_status ON public.market_items(status);
CREATE INDEX IF NOT EXISTS idx_market_items_category ON public.market_items(category_id);
CREATE INDEX IF NOT EXISTS idx_market_items_featured ON public.market_items(featured);

-- User purchases tablosunu güncelle
ALTER TABLE public.user_purchases 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- User purchases için trigger ekle
CREATE TRIGGER update_user_purchases_updated_at 
  BEFORE UPDATE ON public.user_purchases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- User purchases için index'ler ekle
CREATE INDEX IF NOT EXISTS idx_user_purchases_user ON public.user_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_user_purchases_item ON public.user_purchases(item_id);
CREATE INDEX IF NOT EXISTS idx_user_purchases_status ON public.user_purchases(status);
