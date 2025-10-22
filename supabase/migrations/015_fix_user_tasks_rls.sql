-- ================================================
-- FIX USER_TASKS RLS POLICIES
-- ================================================

-- user_tasks tablosu için eksik INSERT politikasını ekle
CREATE POLICY "Users can insert own tasks"
  ON public.user_tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- user_tasks tablosu için DELETE politikasını ekle (gerekirse)
CREATE POLICY "Users can delete own tasks"
  ON public.user_tasks FOR DELETE
  USING (auth.uid() = user_id);



