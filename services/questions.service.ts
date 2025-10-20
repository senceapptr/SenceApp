import { supabase } from '@/lib/supabase';

export interface Question {
  id: string;
  title: string;
  description: string | null;
  category_id: string;
  image_url: string | null;
  yes_odds: number;
  no_odds: number;
  total_votes: number;
  yes_votes: number;
  no_votes: number;
  yes_percentage: number;
  no_percentage: number;
  total_amount: number;
  status: 'draft' | 'active' | 'closed' | 'resolved';
  result: 'yes' | 'no' | 'cancelled' | null;
  publish_date: string;
  end_date: string;
  resolved_at: string | null;
  is_featured: boolean;
  is_trending: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Questions Service
 * Soru yönetimi ve sorgulama işlemleri
 */
export const questionsService = {
  /**
   * Tüm aktif soruları getir
   */
  async getActiveQuestions() {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select(`
          *,
          categories (
            id,
            name,
            slug,
            icon,
            color
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Get active questions error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Öne çıkan soruları getir
   */
  async getFeaturedQuestions() {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select(`
          *,
          categories (
            id,
            name,
            slug,
            icon,
            color
          )
        `)
        .eq('status', 'active')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Get featured questions error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Trend soruları getir
   */
  async getTrendingQuestions() {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select(`
          *,
          categories (
            id,
            name,
            slug,
            icon,
            color
          )
        `)
        .eq('status', 'active')
        .eq('is_trending', true)
        .order('total_votes', { ascending: false })
        .limit(20);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Get trending questions error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Kategoriye göre soruları getir
   */
  async getQuestionsByCategory(categoryId: string) {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select(`
          *,
          categories (
            id,
            name,
            slug,
            icon,
            color
          )
        `)
        .eq('status', 'active')
        .eq('category_id', categoryId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Get questions by category error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Soru detayını getir
   */
  async getQuestionById(questionId: string) {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select(`
          *,
          categories (
            id,
            name,
            slug,
            icon,
            color
          ),
          question_statistics (
            total_predictions,
            total_amount,
            yes_amount,
            no_amount,
            unique_users
          )
        `)
        .eq('id', questionId)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Get question by id error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Soru ara
   */
  async searchQuestions(searchTerm: string) {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select(`
          *,
          categories (
            id,
            name,
            slug,
            icon,
            color
          )
        `)
        .eq('status', 'active')
        .ilike('title', `%${searchTerm}%`)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Search questions error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Yeni soru oluştur
   */
  async createQuestion(question: Partial<Question>) {
    try {
      const { data, error } = await supabase
        .from('questions')
        .insert(question)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Create question error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Kategorileri getir
   */
  async getCategories() {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Get categories error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Real-time soru güncellemelerini dinle
   */
  subscribeToQuestion(questionId: string, callback: (payload: any) => void) {
    const channel = supabase
      .channel(`question-${questionId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'questions',
          filter: `id=eq.${questionId}`,
        },
        callback
      )
      .subscribe();

    return channel;
  },
};

