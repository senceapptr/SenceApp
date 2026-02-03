-- ================================================
-- SUPABASE CRON: resolve-expired-questions Edge Function
-- Migration: 071_supabase_cron_resolve_expired_questions.sql
-- ================================================
-- pg_cron ile her 10 dakikada bir resolve-expired-questions Edge Function tetiklenir.
-- URL ve anon key Vault'tan okunur; önce Vault secret'larını eklemeniz gerekir (aşağıdaki yorumlara bakın).
-- ================================================

-- 1) Extension'ları etkinleştir (Dashboard > Database > Extensions'dan da açılabilir)
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 2) Varsa eski job'ı kaldır (idempotent)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'resolve-expired-questions') THEN
    PERFORM cron.unschedule('resolve-expired-questions');
  END IF;
END $$;

-- 3) Her 10 dakikada bir Edge Function'ı tetikle
-- Vault'ta 'project_url' ve 'anon_key' secret'ları tanımlı olmalı:
--   SELECT vault.create_secret('https://PROJECT_REF.supabase.co', 'project_url');
--   SELECT vault.create_secret('ANON_KEY_BURAYA', 'anon_key');
SELECT cron.schedule(
  'resolve-expired-questions',
  '*/10 * * * *',
  $$
  SELECT net.http_post(
    url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'project_url') || '/functions/v1/resolve-expired-questions',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'anon_key')
    ),
    body := '{}'::jsonb
  ) AS request_id;
  $$
);
