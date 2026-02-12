import { supabase } from '@/lib/supabase';

export interface Comment {
  id: string;
  user_id: string;
  question_id: string;
  content: string;
  likes_count: number;
  created_at: string;
  updated_at: string;
}

export interface CreateCommentData {
  user_id: string;
  question_id: string;
  content: string;
  parent_id?: string;
}

/**
 * Comments Service
 * Yorum yönetimi işlemleri
 */
export const commentsService = {
  /**
   * Soruya ait yorumları getir
   */
  async getQuestionComments(questionId: string) {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profiles (
            username,
            profile_image
          )
        `)
        .eq('question_id', questionId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('getQuestionComments error:', error);
      return { data: null, error };
    }
  },

  /**
   * Kullanıcının beğendiği yorum id'lerini getir
   */
  async getUserLikedCommentIds(commentIds: string[], userId: string) {
    if (!commentIds.length || !userId) {
      return { data: [] as string[], error: null };
    }

    try {
      const { data, error } = await supabase
        .from('comment_likes')
        .select('comment_id')
        .eq('user_id', userId)
        .in('comment_id', commentIds);

      if (error) throw error;

      return {
        data: (data || [])
          .map((row: { comment_id: string | null }) => row.comment_id)
          .filter((commentId): commentId is string => Boolean(commentId)),
        error: null,
      };
    } catch (error) {
      console.error('getUserLikedCommentIds error:', error);
      return { data: [] as string[], error };
    }
  },

  /**
   * Yeni yorum oluştur
   */
  async createComment(commentData: CreateCommentData) {
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert([commentData])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('createComment error:', error);
      return { data: null, error };
    }
  },

  /**
   * Yorumu güncelle
   */
  async updateComment(commentId: string, content: string) {
    try {
      const { data, error } = await supabase
        .from('comments')
        .update({ content, updated_at: new Date().toISOString() })
        .eq('id', commentId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('updateComment error:', error);
      return { data: null, error };
    }
  },

  /**
   * Yorumu sil
   */
  async deleteComment(commentId: string) {
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;
      return { data: true, error: null };
    } catch (error) {
      console.error('deleteComment error:', error);
      return { data: null, error };
    }
  },

  /**
   * Yorumu beğen/beğenme
   */
  async toggleCommentLike(commentId: string, userId?: string) {
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;

      const authUserId = authData.user?.id || userId;
      if (!authUserId) {
        throw new Error('User not authenticated');
      }

      // Önce mevcut beğeniyi kontrol et
      const { data: existingLike, error: checkError } = await supabase
        .from('comment_likes')
        .select('id')
        .eq('comment_id', commentId)
        .eq('user_id', authUserId)
        .maybeSingle();

      if (checkError) throw checkError;

      let liked = false;

      if (existingLike) {
        // Beğeniyi kaldır
        const { error } = await supabase
          .from('comment_likes')
          .delete()
          .eq('comment_id', commentId)
          .eq('user_id', authUserId);

        if (error) throw error;
      } else {
        // Beğeniyi ekle
        const { error } = await supabase
          .from('comment_likes')
          .insert([{ comment_id: commentId, user_id: authUserId }]);

        if (error) throw error;
        liked = true;
      }

      const { count, error: countError } = await supabase
        .from('comment_likes')
        .select('id', { count: 'exact', head: true })
        .eq('comment_id', commentId);

      if (countError) throw countError;

      return {
        data: { liked, likesCount: count ?? null },
        error: null,
      };
    } catch (error) {
      console.error('toggleCommentLike error:', error);
      return { data: null, error };
    }
  }
};

