import { supabase } from '@/lib/supabase';

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  description: string;
  is_active: boolean;
  created_at: string;
}

export const categoriesService = {
  mapCategoryRow(categoryRow: any): Category {
    return {
      color: categoryRow?.color ?? '#6B7280',
      created_at: categoryRow?.created_at ?? new Date().toISOString(),
      description: categoryRow?.description ?? '',
      icon: categoryRow?.icon ?? 'help-circle',
      id: categoryRow?.id ?? '',
      is_active: Boolean(categoryRow?.is_active ?? true),
      name: categoryRow?.name ?? '',
      slug: categoryRow?.slug ?? '',
    };
  },

  /**
   * Tüm aktif kategorileri getir
   */
  async getActiveCategories(): Promise<{ data: Category[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });

      // Kategorileri istediğimiz sıraya göre düzenle
      if (data) {
        const categoryOrder = ['spor', 'eglence', 'finans', 'magazin', 'sosyal-medya', 'politika', 'teknoloji', 'sinema', 'global'];
        data.sort((a, b) => {
          const indexA = categoryOrder.indexOf(a.slug);
          const indexB = categoryOrder.indexOf(b.slug);
          if (indexA === -1) return 1;
          if (indexB === -1) return -1;
          return indexA - indexB;
        });
      }

      if (error) {
        console.error('Get categories error:', error);
        return { data: null, error };
      }

      return { data: (data || []).map(row => this.mapCategoryRow(row)), error: null };
    } catch (error) {
      console.error('Get categories error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Kategori ID'sine göre kategori getir
   */
  async getCategoryById(categoryId: string): Promise<{ data: Category | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', categoryId)
        .single();

      if (error) {
        console.error('Get category error:', error);
        return { data: null, error };
      }

      return { data: data ? this.mapCategoryRow(data) : null, error: null };
    } catch (error) {
      console.error('Get category error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Slug'a göre kategori getir
   */
  async getCategoryBySlug(slug: string): Promise<{ data: Category | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        console.error('Get category by slug error:', error);
        return { data: null, error };
      }

      return { data: data ? this.mapCategoryRow(data) : null, error: null };
    } catch (error) {
      console.error('Get category by slug error:', error);
      return { data: null, error: error as Error };
    }
  },
};
