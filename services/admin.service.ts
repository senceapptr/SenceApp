import { supabase } from '@/lib/supabase';

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalQuestions: number;
  pendingQuestions: number;
  approvedQuestions: number;
  rejectedQuestions: number;
  totalPredictions: number;
  totalCoupons: number;
}

export interface PendingQuestion {
  id: string;
  title: string;
  description: string;
  created_at: string;
  user_id: string;
  username: string;
  full_name: string;
  categories: string[];
  category_id?: string;
  category_name?: string;
  secondary_category_id?: string;
  secondary_category_name?: string;
  third_category_id?: string;
  third_category_name?: string;
  image_url?: string;
  end_date?: string;
  yes_odds?: number;
  no_odds?: number;
}

export interface User {
  id: string;
  email: string;
  username: string;
  full_name: string;
  created_at: string;
  last_sign_in_at: string;
  is_banned: boolean;
  questions_count: number;
  predictions_count: number;
}

export class AdminService {
  /**
   * Admin istatistiklerini getir
   */
  async getStats(): Promise<{ data: AdminStats | null; error: Error | null }> {
    try {
      // Basit istatistikler - sadece mevcut tablolar
      const { count: totalUsers, error: usersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (usersError) throw usersError;

      const { count: totalQuestions, error: questionsError } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true });

      if (questionsError) throw questionsError;

      // Draft soruları say
      const { count: pendingQuestions, error: pendingError } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'draft');

      if (pendingError) throw pendingError;

      const { count: totalPredictions, error: predictionsError } = await supabase
        .from('predictions')
        .select('*', { count: 'exact', head: true });

      if (predictionsError) throw predictionsError;

      const { count: totalCoupons, error: couponsError } = await supabase
        .from('coupons')
        .select('*', { count: 'exact', head: true });

      if (couponsError) throw couponsError;

      const stats: AdminStats = {
        totalUsers: totalUsers || 0,
        activeUsers: totalUsers || 0, // Basit olarak toplam kullanıcı
        totalQuestions: totalQuestions || 0,
        pendingQuestions: pendingQuestions || 0, // Gerçek draft sayısı
        approvedQuestions: (totalQuestions || 0) - (pendingQuestions || 0), // Toplam - draft
        rejectedQuestions: 0, // Şimdilik 0
        totalPredictions: totalPredictions || 0,
        totalCoupons: totalCoupons || 0,
      };

      return { data: stats, error: null };
    } catch (error) {
      console.error('Get admin stats error:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Bekleyen soruları getir
   */
  async getPendingQuestions(): Promise<{ data: PendingQuestion[] | null; error: Error | null }> {
    try {
      // Draft soruları getir - tüm kategori sütunları
      const { data, error } = await supabase
        .from('questions')
        .select(`
          id,
          title,
          description,
          created_at,
          created_by,
          category_id,
          secondary_category_id,
          third_category_id,
          image_url,
          end_date,
          yes_odds,
          no_odds
        `)
        .eq('status', 'draft') // Sadece draft sorular
        .order('created_at', { ascending: false })
        .limit(10); // İlk 10 soru

      if (error) throw error;

      // Tüm kategori ID'lerini topla
      const allCategoryIds = data?.flatMap(q => [
        q.category_id,
        q.secondary_category_id,
        q.third_category_id
      ]).filter(Boolean) || [];
      
      let categoryNames: { [key: string]: string } = {};
      
      if (allCategoryIds.length > 0) {
        const { data: categories } = await supabase
          .from('categories')
          .select('id, name')
          .in('id', allCategoryIds);
        
        categoryNames = categories?.reduce((acc, cat) => {
          acc[cat.id] = cat.name;
          return acc;
        }, {} as { [key: string]: string }) || {};
      }

      const pendingQuestions: PendingQuestion[] = data?.map((q: any) => ({
        id: q.id,
        title: q.title,
        description: q.description,
        created_at: q.created_at,
        user_id: q.created_by, // created_by'ı user_id olarak kullan
        username: 'Kullanıcı', // Basit olarak
        full_name: 'Kullanıcı', // Basit olarak
        categories: [], // Şimdilik boş
        category_id: q.category_id,
        category_name: q.category_id ? categoryNames[q.category_id] || 'Kategori Yok' : 'Kategori Yok',
        secondary_category_id: q.secondary_category_id,
        secondary_category_name: q.secondary_category_id ? categoryNames[q.secondary_category_id] || 'Kategori Yok' : undefined,
        third_category_id: q.third_category_id,
        third_category_name: q.third_category_id ? categoryNames[q.third_category_id] || 'Kategori Yok' : undefined,
        image_url: q.image_url,
        end_date: q.end_date,
        yes_odds: q.yes_odds,
        no_odds: q.no_odds,
      })) || [];

      return { data: pendingQuestions, error: null };
    } catch (error) {
      console.error('Get pending questions error:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Soruyu onayla
   */
  async approveQuestion(questionId: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('questions')
        .update({ status: 'active' })
        .eq('id', questionId);

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error('Approve question error:', error);
      return { error: error as Error };
    }
  }

  /**
   * Soruyu reddet
   */
  async rejectQuestion(questionId: string, reason: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('questions')
        .update({ 
          status: 'rejected',
          rejection_reason: reason 
        })
        .eq('id', questionId);

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error('Reject question error:', error);
      return { error: error as Error };
    }
  }

  /**
   * Kullanıcıları getir
   */
  async getUsers(): Promise<{ data: User[] | null; error: Error | null }> {
    try {
      // Basit sorgu - sadece mevcut sütunlar
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          username,
          full_name,
          email,
          created_at
        `)
        .order('created_at', { ascending: false })
        .limit(20); // İlk 20 kullanıcı

      if (error) throw error;

      const users: User[] = data?.map((user: any) => ({
        id: user.id,
        email: user.email,
        username: user.username,
        full_name: user.full_name,
        created_at: user.created_at,
        last_sign_in_at: user.created_at, // Basit olarak
        is_banned: false, // Şimdilik false
        questions_count: 0, // Şimdilik 0
        predictions_count: 0, // Şimdilik 0
      })) || [];

      return { data: users, error: null };
    } catch (error) {
      console.error('Get users error:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Kullanıcıyı banla/aktifleştir
   */
  async toggleUserBan(userId: string, isBanned: boolean): Promise<{ error: Error | null }> {
    try {
      // Şimdilik sadece log - is_banned sütunu yok
      console.log(`User ${userId} ban status: ${isBanned}`);
      return { error: null };
    } catch (error) {
      console.error('Toggle user ban error:', error);
      return { error: error as Error };
    }
  }

  /**
   * Soru görseli güncelle
   */
  async updateQuestionImage(questionId: string, imageUrl: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('questions')
        .update({ image_url: imageUrl })
        .eq('id', questionId);

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error('Update question image error:', error);
      return { error: error as Error };
    }
  }

  /**
   * Soruyu düzenle
   */
  async updateQuestion(questionId: string, updateData: {
    title?: string;
    description?: string;
    category_id?: string;
    secondary_category_id?: string;
    third_category_id?: string;
    end_date?: string;
  }): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('questions')
        .update(updateData)
        .eq('id', questionId);

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error('Update question error:', error);
      return { error: error as Error };
    }
  }

  /**
   * Kategorileri getir
   */
  async getCategories(): Promise<{ data: { id: string; name: string }[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .order('name', { ascending: true });

      if (error) throw error;

      return { data: data || [], error: null };
    } catch (error) {
      console.error('Get categories error:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Admin yetkisi kontrolü
   */
  async isAdmin(userId: string): Promise<{ isAdmin: boolean; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', userId)
        .single();

      if (error) throw error;

      return { isAdmin: data?.is_admin || false, error: null };
    } catch (error) {
      console.error('Check admin status error:', error);
      return { isAdmin: false, error: error as Error };
    }
  }
}

export const adminService = new AdminService();
