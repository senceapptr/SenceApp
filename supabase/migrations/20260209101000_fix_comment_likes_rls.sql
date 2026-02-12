-- Ensure comment likes can be inserted/deleted by the authenticated owner
ALTER TABLE IF EXISTS public.comment_likes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "comment_likes_select_all" ON public.comment_likes;
DROP POLICY IF EXISTS "comment_likes_insert_own" ON public.comment_likes;
DROP POLICY IF EXISTS "comment_likes_delete_own" ON public.comment_likes;
DROP POLICY IF EXISTS "Comment likes are viewable by everyone" ON public.comment_likes;
DROP POLICY IF EXISTS "Users can insert their own comment likes" ON public.comment_likes;
DROP POLICY IF EXISTS "Users can delete their own comment likes" ON public.comment_likes;

CREATE POLICY "comment_likes_select_all" ON public.comment_likes
  FOR SELECT
  USING (true);

CREATE POLICY "comment_likes_insert_own" ON public.comment_likes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "comment_likes_delete_own" ON public.comment_likes
  FOR DELETE
  USING (auth.uid() = user_id);
