import { supabase } from '@/lib/supabase';

export interface MarketItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  image_url: string | null;
  category_id: string | null;
  featured: boolean;
  badge: string | null;
  status: 'active' | 'inactive' | 'out_of_stock';
  created_at: string;
  updated_at: string;
  categories?: {
    id: string;
    name: string;
    slug: string;
    icon: string;
  };
}

export interface MarketCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string | null;
  created_at: string;
}

export interface PurchaseItemData {
  item_id: string;
  user_id: string;
  quantity?: number;
}

export interface UserPurchase {
  id: string;
  user_id: string;
  item_id: string;
  quantity: number;
  total_price: number;
  status: 'pending' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  market_items?: MarketItem;
}

/**
 * Market Service
 * Market işlemleri
 */
export const marketService = {
  /**
   * Tüm aktif market ürünlerini getir
   */
  async getMarketItems() {
    try {
      const { data, error } = await supabase
        .from('market_items')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Eğer image_url yoksa varsayılan resim ekle
      const itemsWithImages = data?.map(item => ({
        ...item,
        image_url: item.image_url || 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop&q=80'
      })) || [];

      return { data: itemsWithImages, error: null };
    } catch (error) {
      console.error('Get market items error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Kategoriye göre market ürünlerini getir
   */
  async getMarketItemsByCategory(categoryId: string) {
    try {
      const { data, error } = await supabase
        .from('market_items')
        .select('*')
        .eq('is_active', true)
        .eq('type', categoryId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Eğer image_url yoksa varsayılan resim ekle
      const itemsWithImages = data?.map(item => ({
        ...item,
        image_url: item.image_url || 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop&q=80'
      })) || [];

      return { data: itemsWithImages, error: null };
    } catch (error) {
      console.error('Get market items by category error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Market kategorilerini getir
   */
  async getMarketCategories() {
    try {
      // Market items tablosundaki farklı type değerlerini kullan
      const { data, error } = await supabase
        .from('market_items')
        .select('type')
        .eq('is_active', true);

      if (error) throw error;
      
      // Unique type'ları al ve kategorilere dönüştür
      const uniqueTypes = [...new Set(data?.map(item => item.type) || [])];
      const categories = uniqueTypes.map(type => ({
        id: type,
        name: this.getCategoryDisplayName(type),
        slug: type,
        icon: this.getCategoryIcon(type),
      }));

      return { data: categories, error: null };
    } catch (error) {
      console.error('Get market categories error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Kategori görüntüleme adını getir
   */
  getCategoryDisplayName(type: string): string {
    const categoryNames: { [key: string]: string } = {
      'boost': 'Boostlar',
      'avatar': 'Avatarlar', 
      'theme': 'Temalar',
      'badge': 'Rozetler',
      'powerup': 'Güçlendirmeler'
    };
    return categoryNames[type] || type;
  },

  /**
   * Kategori ikonunu getir
   */
  getCategoryIcon(type: string): string {
    const categoryIcons: { [key: string]: string } = {
      'boost': '⚡',
      'avatar': '👤',
      'theme': '🎨',
      'badge': '🏅',
      'powerup': '🛡️'
    };
    return categoryIcons[type] || '🛍️';
  },

  /**
   * Ürün detayını getir
   */
  async getMarketItemById(itemId: string) {
    try {
      const { data, error } = await supabase
        .from('market_items')
        .select('*')
        .eq('id', itemId)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Get market item by id error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Ürün satın al
   */
  async purchaseItem(purchaseData: PurchaseItemData) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User not authenticated');
      }

      // Ürün bilgilerini al
      const { data: item, error: itemError } = await supabase
        .from('market_items')
        .select('*')
        .eq('id', purchaseData.item_id)
        .single();

      if (itemError) throw itemError;

      if (!item.is_active) {
        throw new Error('Item is not available for purchase');
      }

      // Kullanıcının kredi bilgilerini al
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      const totalPrice = item.price * (purchaseData.quantity || 1);

      if (profile.credits < totalPrice) {
        throw new Error('Insufficient credits');
      }

      // Transaction başlat
      const { data: purchase, error: purchaseError } = await supabase
        .from('user_purchases')
        .insert({
          user_id: user.id,
          item_id: purchaseData.item_id,
          quantity: purchaseData.quantity || 1,
          total_price: totalPrice,
          status: 'completed',
        })
        .select()
        .single();

      if (purchaseError) throw purchaseError;

      // Kullanıcının kredilerini güncelle
      const { error: creditError } = await supabase
        .from('profiles')
        .update({ 
          credits: profile.credits - totalPrice 
        })
        .eq('id', user.id);

      if (creditError) throw creditError;

      return { data: purchase, error: null };
    } catch (error) {
      console.error('Purchase item error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Kullanıcının satın alımlarını getir
   */
  async getUserPurchases(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_purchases')
        .select(`
          *,
          market_items (*)
        `)
        .eq('user_id', userId)
        .eq('status', 'completed')
        .order('purchased_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Get user purchases error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Öne çıkan ürünleri getir
   */
  async getFeaturedItems() {
    try {
      const { data, error } = await supabase
        .from('market_items')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      
      // Eğer image_url yoksa varsayılan resim ekle
      const itemsWithImages = data?.map(item => ({
        ...item,
        image_url: item.image_url || 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop&q=80'
      })) || [];

      return { data: itemsWithImages, error: null };
    } catch (error) {
      console.error('Get featured items error:', error);
      return { data: null, error: error as Error };
    }
  },
};