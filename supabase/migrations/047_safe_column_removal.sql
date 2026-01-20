-- ================================================
-- SAFE COLUMN REMOVAL WITH REPLACEMENTS
-- Migration: 047_safe_column_removal.sql
-- ================================================
-- Bu migration, kullanılan kolonları güvenli bir şekilde kaldırır
-- ve yerine trigger/view ekler
-- DİKKAT: Bu migration geri alınamaz! Backup alın!

-- ================================================
-- 1. leagues.current_members -> TRIGGER İLE OTOMATIK GÜNCELLEME
-- ================================================

-- 1.1. Trigger function oluştur
CREATE OR REPLACE FUNCTION update_league_member_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE leagues
  SET current_members = (
    SELECT COUNT(*) 
    FROM league_members
    WHERE league_id = COALESCE(NEW.league_id, OLD.league_id)
      AND status = 'active'
  )
  WHERE id = COALESCE(NEW.league_id, OLD.league_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- 1.2. Trigger'ları oluştur
DROP TRIGGER IF EXISTS update_league_member_count_insert ON league_members;
CREATE TRIGGER update_league_member_count_insert
  AFTER INSERT ON league_members
  FOR EACH ROW
  WHEN (NEW.status = 'active')
  EXECUTE FUNCTION update_league_member_count();

DROP TRIGGER IF EXISTS update_league_member_count_update ON league_members;
CREATE TRIGGER update_league_member_count_update
  AFTER UPDATE ON league_members
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION update_league_member_count();

DROP TRIGGER IF EXISTS update_league_member_count_delete ON league_members;
CREATE TRIGGER update_league_member_count_delete
  AFTER DELETE ON league_members
  FOR EACH ROW
  WHEN (OLD.status = 'active')
  EXECUTE FUNCTION update_league_member_count();

-- 1.3. Mevcut verileri güncelle
UPDATE leagues
SET current_members = (
  SELECT COUNT(*) 
  FROM league_members
  WHERE league_members.league_id = leagues.id
    AND league_members.status = 'active'
);

-- NOT: current_members kolonunu şimdilik kaldırmıyoruz
-- Çünkü kod tabanında kullanılıyor
-- İleride kod güncellendiğinde kaldırılabilir:
-- ALTER TABLE public.leagues DROP COLUMN IF EXISTS current_members;

-- ================================================
-- 2. comments.likes_count -> VIEW İLE HESAPLAMA
-- ================================================

-- 2.1. View oluştur (likes_count'u hesaplayan)
CREATE OR REPLACE VIEW comments_with_likes AS
SELECT 
  c.id,
  c.user_id,
  c.question_id,
  c.content,
  COALESCE(COUNT(cl.id), 0) as likes_count,
  c.created_at,
  c.updated_at
FROM comments c
LEFT JOIN comment_likes cl ON c.id = cl.comment_id
GROUP BY c.id, c.user_id, c.question_id, c.content, c.created_at, c.updated_at;

-- 2.2. Materialized view (daha hızlı, ama manuel refresh gerekir)
-- CREATE MATERIALIZED VIEW comments_with_likes_materialized AS
-- SELECT 
--   c.id,
--   c.user_id,
--   c.question_id,
--   c.content,
--   COALESCE(COUNT(cl.id), 0) as likes_count,
--   c.created_at,
--   c.updated_at
-- FROM comments c
-- LEFT JOIN comment_likes cl ON c.id = cl.comment_id
-- GROUP BY c.id, c.user_id, c.question_id, c.content, c.created_at, c.updated_at;
-- 
-- CREATE UNIQUE INDEX ON comments_with_likes_materialized(id);
-- 
-- -- Refresh function
-- CREATE OR REPLACE FUNCTION refresh_comments_likes()
-- RETURNS void AS $$
-- BEGIN
--   REFRESH MATERIALIZED VIEW CONCURRENTLY comments_with_likes_materialized;
-- END;
-- $$ LANGUAGE plpgsql;

-- NOT: likes_count kolonunu şimdilik kaldırmıyoruz
-- Çünkü kod tabanında kullanılıyor
-- İleride kod güncellendiğinde view kullanılabilir:
-- ALTER TABLE public.comments DROP COLUMN IF EXISTS likes_count;
-- DROP TRIGGER IF EXISTS update_comment_likes_count_trigger ON public.comment_likes;
-- DROP FUNCTION IF EXISTS update_comment_likes_count();

-- ================================================
-- 3. profiles.email -> KALDIRILABILIR (auth.users'da var)
-- ================================================

-- 3.1. Kontrol: Kod tabanında profile.email kullanımı yok
-- Sadece user.email kullanılıyor (auth.users'dan geliyor)
-- Bu yüzden güvenle kaldırılabilir

-- NOT: Email kolonunu şimdilik kaldırmıyoruz
-- Çünkü bazı migration'larda kullanılıyor olabilir
-- İleride kontrol edildikten sonra kaldırılabilir:
-- ALTER TABLE public.profiles DROP COLUMN IF EXISTS email;

-- ================================================
-- 4. PERFORMANS İYİLEŞTİRMELERİ
-- ================================================

-- 4.1. League members için index
CREATE INDEX IF NOT EXISTS idx_league_members_league_status 
ON league_members(league_id, status) 
WHERE status = 'active';

-- 4.2. Comment likes için index
CREATE INDEX IF NOT EXISTS idx_comment_likes_comment_id 
ON comment_likes(comment_id);

-- ================================================
-- SONUÇ
-- ================================================

-- Bu migration şu işlemleri yaptı:
-- ✅ leagues.current_members için otomatik güncelleme trigger'ı eklendi
-- ✅ comments.likes_count için view oluşturuldu
-- ✅ Performans için index'ler eklendi
-- ⚠️ Kolonlar şimdilik kaldırılmadı (kod uyumluluğu için)
-- ⚠️ İleride kod güncellendiğinde kolonlar kaldırılabilir

-- ÖNEMLİ NOTLAR:
-- 1. Trigger'lar otomatik çalışacak, current_members her zaman güncel olacak
-- 2. View kullanmak için kod tabanında comments_with_likes view'ini kullanın
-- 3. Email kolonunu kaldırmadan önce tüm migration'ları kontrol edin
