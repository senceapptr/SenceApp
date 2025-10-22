-- Test bildirimleri eklemek için SQL
-- Bu SQL'i Supabase Dashboard > SQL Editor'de çalıştırın

-- Önce mevcut kullanıcıları kontrol et
SELECT id, email FROM auth.users LIMIT 5;

-- Test bildirimleri ekle (user_id'yi yukarıdaki sorgudan aldığınız ID ile değiştirin)
-- Örnek: '12345678-1234-1234-1234-123456789012' yerine gerçek user ID'sini yazın

INSERT INTO notifications (user_id, type, title, message, is_read, data) VALUES
(
  'YOUR_USER_ID_HERE', -- Buraya gerçek user ID'sini yazın
  'prediction',
  'Tahmin Sonuçlandı',
  '"Galatasaray şampiyonluk yaşayacak mı?" tahminin doğru çıktı!',
  false,
  '{"questionTitle": "Galatasaray şampiyonluk yaşayacak mı?", "isCorrect": true, "reward": 250}'::jsonb
),
(
  'YOUR_USER_ID_HERE', -- Buraya gerçek user ID'sini yazın
  'league',
  'Liga Sıralaması',
  'Spor liginde 3. sıraya yükseldin!',
  false,
  '{"leagueName": "Spor Ligi", "action": "rank_up", "rank": 3}'::jsonb
),
(
  'YOUR_USER_ID_HERE', -- Buraya gerçek user ID'sini yazın
  'friend',
  'Yeni Takipçi',
  'ahmet_bey seni takip etmeye başladı',
  false,
  '{"action": "follow", "friendUsername": "ahmet_bey", "friendId": "friend-uuid-123"}'::jsonb
),
(
  'YOUR_USER_ID_HERE', -- Buraya gerçek user ID'sini yazın
  'system',
  'Günlük Bonus',
  'Günlük giriş bonusun hazır! 100 kredi kazandın',
  false,
  '{"type": "daily_bonus", "reward": 100}'::jsonb
),
(
  'YOUR_USER_ID_HERE', -- Buraya gerçek user ID'sini yazın
  'prediction',
  'Tahmin Hatırlatması',
  '"Bitcoin 100K doları geçecek mi?" tahmin süresi bitiyor',
  true,
  '{"questionTitle": "Bitcoin 100K doları geçecek mi?", "action": "reminder"}'::jsonb
),
(
  'YOUR_USER_ID_HERE', -- Buraya gerçek user ID'sini yazın
  'league',
  'Lig Tamamlandı',
  'Teknoloji liginde 1. oldun! Ödülün hazır',
  false,
  '{"leagueName": "Teknoloji Ligi", "action": "league_completed", "rank": 1, "reward": 500}'::jsonb
),
(
  'YOUR_USER_ID_HERE', -- Buraya gerçek user ID'sini yazın
  'system',
  'Hesap Güvenliği',
  'Şifren 30 günden uzun süredir değiştirilmedi',
  true,
  '{"type": "security_warning", "action": "password_expired"}'::jsonb
);

-- Bildirimleri kontrol et
SELECT 
    id,
    type,
    title,
    message,
    is_read,
    created_at
FROM notifications 
WHERE user_id = 'YOUR_USER_ID_HERE' -- Buraya gerçek user ID'sini yazın
ORDER BY created_at DESC;



