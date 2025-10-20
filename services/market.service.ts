import { supabase } from '@/lib/supabase';

export interface MarketItem {
  id: string;
  name: string;
  description: string | null;
  type: 'boost' | 'avatar' | 'theme' | 'badge' | 'powerup';
  price: number;
  icon: string | null;
  is_active: boolean;
  stock: number | null;
  effect_data: any;
  created_at: string;
}

export interface UserPurchase {
  id: string;
  user_id: string;
  item_id: string;
  quantity: number;
  total_price: number;
  status: 'pending' | 'completed' | 'refunded';
  purchased_at: string;
}

/**
 * Market Service
 * Market ve satın alma işlemleri
 */
export const marketService = {
  /**
   * Tüm market ürünlerini getir
   */
  async getMarketItems() {
    try {
      const { data, error } = await supabase
        .from('market_items')
        .select('*')
        .eq('is_active', true)
        .order('type')
        .order('price');

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Get market items error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Tipine göre market ürünlerini getir
   */
  async getMarketItemsByType(type: string) {
    try {
      const { data, error } = await supabase
        .from('market_items')
        .select('*')
        .eq('is_active', true)
        .eq('type', type)
        .order('price');

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Get market items by type error:', error);
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
          market_items (
            id,
            name,
            description,
            type,
            icon,
            effect_data
          )
        `)
        .eq('user_id', userId)
        .order('purchased_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Get user purchases error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Ürün satın al
   */
  async purchaseItem(itemId: string, quantity: number = 1) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User not authenticated');
      }

      // Ürün bilgilerini al
      const { data: item } = await supabase
        .from('market_items')
        .select('*')
        .eq('id', itemId)
        .single();

      if (!item) {
        throw new Error('Item not found');
      }

      // Stok kontrolü
      if (item.stock !== null && item.stock < quantity) {
        throw new Error('Insufficient stock');
      }

      const totalPrice = item.price * quantity;

      // Kullanıcının kredisini kontrol et
      const { data: profile } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', user.id)
        .single();

      if (!profile || profile.credits < totalPrice) {
        throw new Error('Insufficient credits');
      }

      // Satın alma kaydı oluştur
      const { data: purchase, error: purchaseError } = await supabase
        .from('user_purchases')
        .insert({
          user_id: user.id,
          item_id: itemId,
          quantity,
          total_price: totalPrice,
          status: 'completed',
        })
        .select()
        .single();

      if (purchaseError) throw purchaseError;

      // Krediyi düş
      await supabase.rpc('decrease_user_credits', {
        user_id: user.id,
        amount: totalPrice,
      });

      // Stok varsa güncelle
      if (item.stock !== null) {
        await supabase
          .from('market_items')
          .update({ stock: item.stock - quantity })
          .eq('id', itemId);
      }

      return { data: purchase, error: null };
    } catch (error) {
      console.error('Purchase item error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Kullanıcının aktif boost'larını getir
   */
  async getActiveBoosts(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_purchases')
        .select(`
          *,
          market_items!inner (
            id,
            name,
            type,
            icon,
            effect_data
          )
        `)
        .eq('user_id', userId)
        .eq('status', 'completed')
        .in('market_items.type', ['boost', 'powerup'])
        .order('purchased_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Get active boosts error:', error);
      return { data: null, error: error as Error };
    }
  },
};

