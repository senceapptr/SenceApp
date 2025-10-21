-- ================================================
-- ROW LEVEL SECURITY (RLS) POLİTİKALARI
-- ================================================

-- RLS'i tüm tablolar için aktif et
-- NOT: Profiles için RLS devre dışı (trigger ile otomatik oluşturma için)
-- ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_selections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leagues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.league_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.league_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.league_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- ================================================
-- PROFILES
-- ================================================
-- NOT: Profiles için RLS policy'leri migration 006'da oluşturulacak

-- ================================================
-- USER STATS
-- ================================================

CREATE POLICY "Users can view own stats"
  ON public.user_stats FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view other stats"
  ON public.user_stats FOR SELECT
  USING (true);

-- ================================================
-- CATEGORIES
-- ================================================

-- Kategoriler herkes tarafından okunabilir
CREATE POLICY "Categories are viewable by everyone"
  ON public.categories FOR SELECT
  USING (true);

-- ================================================
-- QUESTIONS
-- ================================================

-- Aktif sorular herkes tarafından okunabilir
CREATE POLICY "Active questions are viewable by everyone"
  ON public.questions FOR SELECT
  USING (status IN ('active', 'closed', 'resolved'));

-- Kullanıcılar soru oluşturabilir
CREATE POLICY "Authenticated users can create questions"
  ON public.questions FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- Kullanıcılar kendi sorularını güncelleyebilir
CREATE POLICY "Users can update own questions"
  ON public.questions FOR UPDATE
  USING (auth.uid() = created_by);

-- ================================================
-- QUESTION STATISTICS
-- ================================================

CREATE POLICY "Question stats are viewable by everyone"
  ON public.question_statistics FOR SELECT
  USING (true);

-- ================================================
-- PREDICTIONS
-- ================================================

-- Kullanıcılar kendi tahminlerini görebilir
CREATE POLICY "Users can view own predictions"
  ON public.predictions FOR SELECT
  USING (auth.uid() = user_id);

-- Kullanıcılar tahmin yapabilir
CREATE POLICY "Authenticated users can create predictions"
  ON public.predictions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ================================================
-- COUPONS
-- ================================================

-- Kullanıcılar kendi kuponlarını görebilir
CREATE POLICY "Users can view own coupons"
  ON public.coupons FOR SELECT
  USING (auth.uid() = user_id);

-- Kullanıcılar kupon oluşturabilir
CREATE POLICY "Authenticated users can create coupons"
  ON public.coupons FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ================================================
-- COUPON SELECTIONS
-- ================================================

CREATE POLICY "Users can view own coupon selections"
  ON public.coupon_selections FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.coupons
      WHERE coupons.id = coupon_selections.coupon_id
      AND coupons.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own coupon selections"
  ON public.coupon_selections FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.coupons
      WHERE coupons.id = coupon_selections.coupon_id
      AND coupons.user_id = auth.uid()
    )
  );

-- ================================================
-- LEAGUES
-- ================================================

-- Public ligler herkes tarafından görülebilir
CREATE POLICY "Public leagues are viewable by everyone"
  ON public.leagues FOR SELECT
  USING (type = 'public' OR creator_id = auth.uid());

-- Üye olunan ligler görülebilir
CREATE POLICY "Members can view their leagues"
  ON public.leagues FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.league_members
      WHERE league_members.league_id = leagues.id
      AND league_members.user_id = auth.uid()
      AND league_members.status = 'active'
    )
  );

-- Kullanıcılar lig oluşturabilir
CREATE POLICY "Authenticated users can create leagues"
  ON public.leagues FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

-- Lig sahibi liği güncelleyebilir
CREATE POLICY "League creators can update their leagues"
  ON public.leagues FOR UPDATE
  USING (auth.uid() = creator_id);

-- ================================================
-- LEAGUE MEMBERS
-- ================================================

CREATE POLICY "Users can view league members"
  ON public.league_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.leagues
      WHERE leagues.id = league_members.league_id
      AND (leagues.type = 'public' OR leagues.creator_id = auth.uid())
    )
    OR user_id = auth.uid()
  );

CREATE POLICY "Users can join leagues"
  ON public.league_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ================================================
-- LEAGUE INVITATIONS
-- ================================================

CREATE POLICY "Users can view their invitations"
  ON public.league_invitations FOR SELECT
  USING (auth.uid() = invitee_id OR auth.uid() = inviter_id);

CREATE POLICY "Users can create invitations"
  ON public.league_invitations FOR INSERT
  WITH CHECK (auth.uid() = inviter_id);

CREATE POLICY "Users can update their invitations"
  ON public.league_invitations FOR UPDATE
  USING (auth.uid() = invitee_id);

-- ================================================
-- TASKS
-- ================================================

-- Görevler herkes tarafından okunabilir
CREATE POLICY "Tasks are viewable by everyone"
  ON public.tasks FOR SELECT
  USING (is_active = true);

-- ================================================
-- USER TASKS
-- ================================================

CREATE POLICY "Users can view own tasks"
  ON public.user_tasks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks"
  ON public.user_tasks FOR UPDATE
  USING (auth.uid() = user_id);

-- ================================================
-- NOTIFICATIONS
-- ================================================

CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notifications"
  ON public.notifications FOR DELETE
  USING (auth.uid() = user_id);

-- ================================================
-- MARKET ITEMS
-- ================================================

CREATE POLICY "Market items are viewable by everyone"
  ON public.market_items FOR SELECT
  USING (is_active = true);

-- ================================================
-- USER PURCHASES
-- ================================================

CREATE POLICY "Users can view own purchases"
  ON public.user_purchases FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create purchases"
  ON public.user_purchases FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ================================================
-- ACTIVITIES
-- ================================================

CREATE POLICY "Users can view public activities"
  ON public.activities FOR SELECT
  USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can create own activities"
  ON public.activities FOR INSERT
  WITH CHECK (auth.uid() = user_id);

