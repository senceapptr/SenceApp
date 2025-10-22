-- Add sample notification data for testing
-- Bu migration dosyası test bildirimlerini ekler

-- Önce mevcut kullanıcıları kontrol et ve onlara bildirimler ekle
INSERT INTO notifications (user_id, type, title, message, is_read, data) VALUES
-- Test kullanıcısı için bildirimler (user_id'yi gerçek kullanıcı ID'si ile değiştirin)
(
  (SELECT id FROM auth.users LIMIT 1), -- İlk kullanıcıyı al
  'prediction',
  'Tahmin Sonuçlandı',
  '"Galatasaray şampiyonluk yaşayacak mı?" tahminin doğru çıktı!',
  false,
  '{"questionTitle": "Galatasaray şampiyonluk yaşayacak mı?", "isCorrect": true, "reward": 250}'::jsonb
),
(
  (SELECT id FROM auth.users LIMIT 1),
  'league',
  'Liga Sıralaması',
  'Spor liginde 3. sıraya yükseldin!',
  false,
  '{"leagueName": "Spor Ligi", "action": "rank_up", "rank": 3}'::jsonb
),
(
  (SELECT id FROM auth.users LIMIT 1),
  'friend',
  'Yeni Takipçi',
  'ahmet_bey seni takip etmeye başladı',
  false,
  '{"action": "follow", "friendUsername": "ahmet_bey", "friendId": "friend-uuid-123"}'::jsonb
),
(
  (SELECT id FROM auth.users LIMIT 1),
  'system',
  'Günlük Bonus',
  'Günlük giriş bonusun hazır! 100 kredi kazandın',
  false,
  '{"type": "daily_bonus", "reward": 100}'::jsonb
),
(
  (SELECT id FROM auth.users LIMIT 1),
  'prediction',
  'Tahmin Hatırlatması',
  '"Bitcoin 100K doları geçecek mi?" tahmin süresi bitiyor',
  true,
  '{"questionTitle": "Bitcoin 100K doları geçecek mi?", "action": "reminder"}'::jsonb
),
(
  (SELECT id FROM auth.users LIMIT 1),
  'league',
  'Lig Tamamlandı',
  'Teknoloji liginde 1. oldun! Ödülün hazır',
  false,
  '{"leagueName": "Teknoloji Ligi", "action": "league_completed", "rank": 1, "reward": 500}'::jsonb
),
(
  (SELECT id FROM auth.users LIMIT 1),
  'system',
  'Hesap Güvenliği',
  'Şifren 30 günden uzun süredir değiştirilmedi',
  true,
  '{"type": "security_warning", "action": "password_expired"}'::jsonb
);

-- Eğer birden fazla kullanıcı varsa, onlara da bildirimler ekle
DO $$
DECLARE
    user_record RECORD;
    notification_count INTEGER := 0;
BEGIN
    -- Her kullanıcı için 2-3 bildirim ekle
    FOR user_record IN 
        SELECT id FROM auth.users 
        WHERE id != (SELECT id FROM auth.users LIMIT 1) -- İlk kullanıcıyı hariç tut
        LIMIT 5
    LOOP
        -- Her kullanıcı için rastgele bildirimler ekle
        INSERT INTO notifications (user_id, type, title, message, is_read, data) VALUES
        (
            user_record.id,
            'prediction',
            'Yeni Tahmin Fırsatı',
            'Yeni bir tahmin sorusu yayınlandı! Hemen katıl.',
            false,
            '{"questionTitle": "Yeni Tahmin Sorusu", "action": "new_question"}'::jsonb
        ),
        (
            user_record.id,
            'league',
            'Lig Daveti',
            'Yeni bir lig kuruldu! Katılmak ister misin?',
            false,
            '{"leagueName": "Yeni Lig", "action": "league_invite"}'::jsonb
        ),
        (
            user_record.id,
            'system',
            'Hoş Geldin!',
            'Uygulamaya hoş geldin! İlk tahminini yap ve kredi kazan.',
            false,
            '{"type": "welcome", "action": "first_time_user"}'::jsonb
        );
        
        notification_count := notification_count + 1;
    END LOOP;
    
    RAISE NOTICE 'Added notifications for % users', notification_count;
END $$;

-- Toplam bildirim sayısını kontrol et
SELECT 
    COUNT(*) as total_notifications,
    COUNT(CASE WHEN is_read = false THEN 1 END) as unread_notifications,
    COUNT(CASE WHEN type = 'prediction' THEN 1 END) as prediction_notifications,
    COUNT(CASE WHEN type = 'league' THEN 1 END) as league_notifications,
    COUNT(CASE WHEN type = 'friend' THEN 1 END) as friend_notifications,
    COUNT(CASE WHEN type = 'system' THEN 1 END) as system_notifications
FROM notifications;



