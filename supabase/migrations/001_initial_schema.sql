-- ================================================
-- SENCE APP - İlk Veritabanı Şeması
-- ================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================
-- 1. USERS & AUTH
-- ================================================

-- Kullanıcı profilleri (auth.users'a ek bilgiler)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  bio TEXT,
  email TEXT UNIQUE NOT NULL,
  profile_image TEXT,
  cover_image TEXT,
  credits BIGINT DEFAULT 0,
  level INTEGER DEFAULT 1,
  experience INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Kullanıcı istatistikleri
CREATE TABLE public.user_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  total_predictions INTEGER DEFAULT 0,
  correct_predictions INTEGER DEFAULT 0,
  total_coupons INTEGER DEFAULT 0,
  won_coupons INTEGER DEFAULT 0,
  total_earnings BIGINT DEFAULT 0,
  accuracy_rate DECIMAL(5,2) DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- 2. CATEGORIES
-- ================================================

CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  color TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- 3. QUESTIONS (SORULAR)
-- ================================================

CREATE TABLE public.questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES public.categories(id),
  image_url TEXT,
  yes_odds DECIMAL(10,2) DEFAULT 2.0,
  no_odds DECIMAL(10,2) DEFAULT 2.0,
  total_votes INTEGER DEFAULT 0,
  yes_votes INTEGER DEFAULT 0,
  no_votes INTEGER DEFAULT 0,
  yes_percentage DECIMAL(5,2) DEFAULT 0,
  no_percentage DECIMAL(5,2) DEFAULT 0,
  total_amount BIGINT DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'closed', 'resolved')),
  result TEXT CHECK (result IN ('yes', 'no', 'cancelled')),
  publish_date TIMESTAMPTZ DEFAULT NOW(),
  end_date TIMESTAMPTZ NOT NULL,
  resolved_at TIMESTAMPTZ,
  created_by UUID REFERENCES public.profiles(id),
  is_featured BOOLEAN DEFAULT false,
  is_trending BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Soru istatistikleri (real-time güncelleme için)
CREATE TABLE public.question_statistics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE UNIQUE,
  total_predictions INTEGER DEFAULT 0,
  total_amount BIGINT DEFAULT 0,
  yes_amount BIGINT DEFAULT 0,
  no_amount BIGINT DEFAULT 0,
  unique_users INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- 4. PREDICTIONS (TAHMİNLER)
-- ================================================

CREATE TABLE public.predictions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
  vote TEXT NOT NULL CHECK (vote IN ('yes', 'no')),
  odds DECIMAL(10,2) NOT NULL,
  amount BIGINT NOT NULL,
  potential_win BIGINT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'won', 'lost', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  UNIQUE(user_id, question_id)
);

-- ================================================
-- 5. COUPONS (KUPONLAR)
-- ================================================

CREATE TABLE public.coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  coupon_code TEXT UNIQUE NOT NULL,
  total_odds DECIMAL(10,2) NOT NULL,
  stake_amount BIGINT NOT NULL,
  potential_win BIGINT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'won', 'lost', 'partially_won', 'cancelled')),
  selections_count INTEGER NOT NULL,
  correct_selections INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- Kupon seçimleri
CREATE TABLE public.coupon_selections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coupon_id UUID REFERENCES public.coupons(id) ON DELETE CASCADE,
  question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
  vote TEXT NOT NULL CHECK (vote IN ('yes', 'no')),
  odds DECIMAL(10,2) NOT NULL,
  is_boosted BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'won', 'lost', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- 6. LEAGUES (LİGLER)
-- ================================================

CREATE TABLE public.leagues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  creator_id UUID REFERENCES public.profiles(id),
  league_code TEXT UNIQUE NOT NULL,
  type TEXT DEFAULT 'public' CHECK (type IN ('public', 'private', 'invite_only')),
  category_id UUID REFERENCES public.categories(id),
  max_members INTEGER DEFAULT 100,
  current_members INTEGER DEFAULT 0,
  entry_fee BIGINT DEFAULT 0,
  prize_pool BIGINT DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'completed', 'cancelled')),
  start_date TIMESTAMPTZ DEFAULT NOW(),
  end_date TIMESTAMPTZ,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lig üyeleri
CREATE TABLE public.league_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  league_id UUID REFERENCES public.leagues(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  rank INTEGER,
  points INTEGER DEFAULT 0,
  correct_predictions INTEGER DEFAULT 0,
  total_predictions INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('pending', 'active', 'left', 'kicked')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(league_id, user_id)
);

-- Lig davetleri
CREATE TABLE public.league_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  league_id UUID REFERENCES public.leagues(id) ON DELETE CASCADE,
  inviter_id UUID REFERENCES public.profiles(id),
  invitee_id UUID REFERENCES public.profiles(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'expired')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- Lig soruları
CREATE TABLE public.league_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  league_id UUID REFERENCES public.leagues(id) ON DELETE CASCADE,
  question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
  points INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(league_id, question_id)
);

-- ================================================
-- 7. TASKS (GÖREVLER)
-- ================================================

CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('daily', 'weekly', 'monthly', 'achievement')),
  requirement_type TEXT NOT NULL CHECK (requirement_type IN ('prediction_count', 'correct_predictions', 'coupon_count', 'login_streak', 'referral', 'custom')),
  requirement_value INTEGER NOT NULL,
  reward_credits BIGINT NOT NULL,
  reward_experience INTEGER DEFAULT 0,
  icon TEXT,
  is_active BOOLEAN DEFAULT true,
  reset_period TEXT CHECK (reset_period IN ('daily', 'weekly', 'monthly', 'never')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Kullanıcı görev durumları
CREATE TABLE public.user_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT false,
  is_claimed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  claimed_at TIMESTAMPTZ,
  reset_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, task_id)
);

-- ================================================
-- 8. NOTIFICATIONS (BİLDİRİMLER)
-- ================================================

CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('prediction_result', 'coupon_result', 'league_update', 'task_complete', 'system', 'achievement', 'social')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN DEFAULT false,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  action_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- 9. MARKET (MARKET)
-- ================================================

CREATE TABLE public.market_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('boost', 'avatar', 'theme', 'badge', 'powerup')),
  price BIGINT NOT NULL,
  icon TEXT,
  is_active BOOLEAN DEFAULT true,
  stock INTEGER,
  effect_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Kullanıcı satın almaları
CREATE TABLE public.user_purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  item_id UUID REFERENCES public.market_items(id),
  quantity INTEGER DEFAULT 1,
  total_price BIGINT NOT NULL,
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'refunded')),
  purchased_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- 10. ACTIVITY FEED (AKTİVİTE)
-- ================================================

CREATE TABLE public.activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('prediction', 'coupon', 'achievement', 'league_join', 'level_up')),
  title TEXT NOT NULL,
  description TEXT,
  data JSONB,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- INDEXES (Performans için)
-- ================================================

CREATE INDEX idx_profiles_username ON public.profiles(username);
CREATE INDEX idx_questions_status ON public.questions(status);
CREATE INDEX idx_questions_category ON public.questions(category_id);
CREATE INDEX idx_questions_end_date ON public.questions(end_date);
CREATE INDEX idx_predictions_user ON public.predictions(user_id);
CREATE INDEX idx_predictions_question ON public.predictions(question_id);
CREATE INDEX idx_coupons_user ON public.coupons(user_id);
CREATE INDEX idx_coupons_status ON public.coupons(status);
CREATE INDEX idx_league_members_league ON public.league_members(league_id);
CREATE INDEX idx_league_members_user ON public.league_members(user_id);
CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_notifications_unread ON public.notifications(user_id, is_read);
CREATE INDEX idx_activities_user ON public.activities(user_id);

-- ================================================
-- FUNCTIONS & TRIGGERS
-- ================================================

-- Updated_at otomatik güncelleme
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Tüm tablolara updated_at trigger'ı ekle
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON public.questions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leagues_updated_at BEFORE UPDATE ON public.leagues
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Profile oluşturulduğunda stats tablosunu da oluştur
CREATE OR REPLACE FUNCTION create_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_stats (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION create_user_stats();




