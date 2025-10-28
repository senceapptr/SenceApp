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

export interface CreateQuestionData {
  title: string;
  description?: string;
  category_ids: string[];
  end_date: string;
  image_url?: string;
}

// QuestionCategoryData interface'i artık gerekli değil

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
          categories!questions_category_id_fkey (
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
          categories!questions_category_id_fkey (
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
          categories!questions_category_id_fkey (
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

  /**
   * ID'ye göre soru detayını getir
   */
  async getQuestionById(questionId: string) {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select(`
          *,
          categories!questions_category_id_fkey (
            id,
            name,
            slug,
            icon,
            color
          ),
          secondary_category:categories!questions_secondary_category_id_fkey (
            id,
            name,
            slug,
            icon,
            color
          ),
          third_category:categories!questions_third_category_id_fkey (
            id,
            name,
            slug,
            icon,
            color
          ),
          profiles (
            id,
            username,
            full_name,
            profile_image
          )
        `)
        .eq('id', questionId)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('getQuestionById error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * İlgili soruları getir
   */
  async getRelatedQuestions(questionId: string) {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select(`
          id,
          title,
          image_url,
          end_date,
          yes_odds,
          no_odds,
          total_votes,
          categories!questions_category_id_fkey (
            name
          )
        `)
        .eq('status', 'active')
        .neq('id', questionId)
        .limit(5);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('getRelatedQuestions error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Soruya en çok yatırım yapanları getir
   */
  async getTopInvestors(questionId: string) {
    try {
      const { data, error } = await supabase
        .from('predictions')
        .select(`
          amount,
          vote,
          profiles (
            username,
            profile_image
          )
        `)
        .eq('question_id', questionId)
        .order('amount', { ascending: false })
        .limit(10);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('getTopInvestors error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Yeni soru oluştur
   */
  async createQuestion(questionData: CreateQuestionData, userId: string) {
    try {
      // Soruyu oluştur (primary kategori ile birlikte)
      const questionInsertData: any = {
        title: questionData.title,
        description: questionData.description || null,
        end_date: questionData.end_date,
        image_url: questionData.image_url || null,
        created_by: userId,
        status: 'draft', // Başlangıçta draft olarak oluştur
        yes_odds: 2.0,
        no_odds: 2.0,
        total_votes: 0,
        yes_votes: 0,
        no_votes: 0,
        yes_percentage: 0,
        no_percentage: 0,
        total_amount: 0,
        is_featured: false,
        is_trending: false,
      };

      // Primary kategori ekle (ilk seçilen)
      if (questionData.category_ids && questionData.category_ids.length > 0) {
        questionInsertData.category_id = questionData.category_ids[0];
      }

      // Secondary kategori ekle (ikinci seçilen)
      if (questionData.category_ids && questionData.category_ids.length > 1) {
        questionInsertData.secondary_category_id = questionData.category_ids[1];
      }

      // Third kategori ekle (üçüncü seçilen)
      if (questionData.category_ids && questionData.category_ids.length > 2) {
        questionInsertData.third_category_id = questionData.category_ids[2];
      }

      const { data: question, error: questionError } = await supabase
        .from('questions')
        .insert(questionInsertData)
        .select()
        .single();

      if (questionError) throw questionError;

      return { data: question, error: null };
    } catch (error) {
      console.error('createQuestion error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Kullanıcının oluşturduğu soruları getir
   */
  async getUserQuestions(userId: string) {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select(`
          *,
          categories!questions_category_id_fkey (
            id,
            name,
            slug,
            icon,
            color
          )
        `)
        .eq('created_by', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('getUserQuestions error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Soruyu güncelle
   */
  async updateQuestion(questionId: string, updates: Partial<CreateQuestionData>) {
    try {
      const { data, error } = await supabase
        .from('questions')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', questionId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('updateQuestion error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Soruyu sil
   */
  async deleteQuestion(questionId: string) {
    try {
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', questionId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('deleteQuestion error:', error);
      return { error: error as Error };
    }
  },

  /**
   * Kategoriye göre soruları getir
   */
  async getQuestionsByCategory(categoryId: string, limit: number = 20, offset: number = 0) {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select(`
          *,
          categories!questions_category_id_fkey (
            id,
            name,
            slug,
            icon,
            color
          ),
          secondary_category:categories!questions_secondary_category_id_fkey (
            id,
            name,
            slug,
            icon,
            color
          ),
          third_category:categories!questions_third_category_id_fkey (
            id,
            name,
            slug,
            icon,
            color
          )
        `)
        .or(`category_id.eq.${categoryId},secondary_category_id.eq.${categoryId},third_category_id.eq.${categoryId}`)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('getQuestionsByCategory error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Tüm aktif soruları getir (filtrelerle)
   */
  async getAllQuestions(filters: {
    trending?: boolean;
    highOdds?: boolean;
    endingSoon?: boolean;
    limit?: number;
    offset?: number;
  } = {}) {
    try {
      let query = supabase
        .from('questions')
        .select(`
          *,
          categories!questions_category_id_fkey (
            id,
            name,
            slug,
            icon,
            color
          ),
          secondary_category:categories!questions_secondary_category_id_fkey (
            id,
            name,
            slug,
            icon,
            color
          ),
          third_category:categories!questions_third_category_id_fkey (
            id,
            name,
            slug,
            icon,
            color
          )
        `)
        .eq('status', 'active');

      // Trending filter
      if (filters.trending) {
        query = query.eq('is_trending', true);
      }

      // High odds filter
      if (filters.highOdds) {
        query = query.or('yes_odds.gte.2.0,no_odds.gte.2.0');
      }

      // Ending soon filter (next 24 hours)
      if (filters.endingSoon) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        query = query.lte('end_date', tomorrow.toISOString());
      }

      query = query.order('created_at', { ascending: false });

      if (filters.limit) {
        query = query.range(filters.offset || 0, (filters.offset || 0) + filters.limit - 1);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('getAllQuestions error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Soru arama
   */
  async searchQuestions(searchQuery: string, limit: number = 20, offset: number = 0) {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select(`
          *,
          categories!questions_category_id_fkey (
            id,
            name,
            slug,
            icon,
            color
          ),
          secondary_category:categories!questions_secondary_category_id_fkey (
            id,
            name,
            slug,
            icon,
            color
          ),
          third_category:categories!questions_third_category_id_fkey (
            id,
            name,
            slug,
            icon,
            color
          )
        `)
        .eq('status', 'active')
        .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('searchQuestions error:', error);
      return { data: null, error: error as Error };
    }
  },
};

