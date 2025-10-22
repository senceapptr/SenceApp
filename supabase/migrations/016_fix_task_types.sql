-- ================================================
-- FIX TASK TYPES
-- ================================================

-- Weekly taskleri monthly'e çevir
UPDATE public.tasks 
SET type = 'monthly', reset_period = 'monthly'
WHERE type = 'weekly';

-- Achievement taskleri kaldır (bunlar ayrı bir sistem olmalı)
DELETE FROM public.tasks 
WHERE type = 'achievement';

-- Aylık görevler ekle (eğer yoksa)
INSERT INTO public.tasks (title, description, type, requirement_type, requirement_value, reward_credits, reward_experience, icon, reset_period) VALUES
  ('Aylık Uzman', '50 tahmin yap', 'monthly', 'prediction_count', 50, 25000, 500, '🏆', 'monthly'),
  ('Aylık Kupon Ustası', '10 kupon oluştur', 'monthly', 'coupon_count', 10, 20000, 400, '🎫', 'monthly'),
  ('Aylık Lig Kahramanı', '5 lige katıl', 'monthly', 'custom', 5, 15000, 300, '👥', 'monthly'),
  ('Aylık Doğruluk Ustası', '25 doğru tahmin yap', 'monthly', 'correct_predictions', 25, 30000, 600, '🎯', 'monthly');



