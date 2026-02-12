import { Json } from '@/lib/database.types';
import { supabase } from '@/lib/supabase';

export interface MarketItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  image_url: string | null;
  category_id: string | null;
  featured: boolean | null;
  badge: string | null;
  status: 'active' | 'inactive' | 'out_of_stock' | null;
  requires_shipping: boolean | null;
  is_active: boolean | null;
  stock: number | null;
  type: string;
  created_at: string | null;
  updated_at?: string | null;
}

export interface MarketCategory {
  id: string;
  name: string;
  slug: string;
  icon_name: string;
}

export interface ShippingAddressSnapshot {
  addressLine: string;
  city: string;
  country: 'TR';
  district: string;
  phone: string;
  postalCode: string;
  recipientName: string;
}

export interface PurchaseItemData {
  item_id: string;
  quantity?: number;
  shipping_address?: ShippingAddressSnapshot;
}

export interface UserPurchase {
  id: string;
  user_id: string;
  item_id: string;
  quantity: number;
  total_price: number;
  status: 'pending' | 'completed' | 'cancelled' | 'refunded';
  requires_shipping: boolean;
  shipping_status: 'not_required' | 'address_collected' | 'processing' | 'shipped' | 'delivered';
  shipping_address: Json | null;
  purchased_at: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  market_items?: MarketItem;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop&q=80';

/**
 * Market Service
 * Market islemleri
 */
export const marketService = {
  /**
   * Tum aktif market urunlerini getir
   */
  async getMarketItems() {
    try {
      const { data, error } = await supabase
        .from('market_items')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      const itemsWithImages =
        data?.map(item => ({
          ...item,
          image_url: item.image_url || FALLBACK_IMAGE,
        })) || [];

      return { data: itemsWithImages, error: null };
    } catch (error) {
      console.error('Get market items error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Kategoriye gore market urunlerini getir
   */
  async getMarketItemsByCategory(categoryId: string) {
    try {
      const { data, error } = await supabase
        .from('market_items')
        .select('*')
        .eq('is_active', true)
        .eq('type', categoryId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      const itemsWithImages =
        data?.map(item => ({
          ...item,
          image_url: item.image_url || FALLBACK_IMAGE,
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
      const { data, error } = await supabase.from('market_items').select('type').eq('is_active', true);

      if (error) {
        throw error;
      }

      const uniqueTypes = [
        ...new Set((data?.map(item => item.type).filter((type): type is string => typeof type === 'string') || [])),
      ];
      const categories: MarketCategory[] = uniqueTypes.map(type => ({
        id: type,
        name: this.getCategoryDisplayName(type),
        slug: type,
        icon_name: this.getCategoryIconName(type),
      }));

      return { data: categories, error: null };
    } catch (error) {
      console.error('Get market categories error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Kategori goruntuleme adini getir
   */
  getCategoryDisplayName(type: string): string {
    const categoryNames: Record<string, string> = {
      avatar: 'Avatarlar',
      badge: 'Rozetler',
      boost: 'Boostlar',
      powerup: 'Güçlendirmeler',
      theme: 'Temalar',
    };
    return categoryNames[type] || type;
  },

  /**
   * Kategori ikon adini getir
   */
  getCategoryIconName(type: string): string {
    const categoryIcons: Record<string, string> = {
      avatar: 'person-circle-outline',
      badge: 'ribbon-outline',
      boost: 'flash-outline',
      powerup: 'rocket-outline',
      theme: 'color-palette-outline',
    };
    return categoryIcons[type] || 'pricetag-outline';
  },

  /**
   * Urun detayini getir
   */
  async getMarketItemById(itemId: string) {
    try {
      const { data, error } = await supabase.from('market_items').select('*').eq('id', itemId).single();

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      console.error('Get market item by id error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Urun satin al
   */
  async purchaseItem(purchaseData: PurchaseItemData) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase.rpc('purchase_market_item', {
        p_item_id: purchaseData.item_id,
        p_quantity: purchaseData.quantity || 1,
        p_shipping_address: purchaseData.shipping_address
          ? ({ ...purchaseData.shipping_address } as Json)
          : null,
      });

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      console.error('Purchase item error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Kullanicinin satin alimlarini getir
   */
  async getUserPurchases(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_purchases')
        .select(
          `
          *,
          market_items (*)
        `,
        )
        .eq('user_id', userId)
        .order('purchased_at', { ascending: false });

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      console.error('Get user purchases error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * One cikan urunleri getir
   */
  async getFeaturedItems() {
    try {
      const { data, error } = await supabase
        .from('market_items')
        .select('*')
        .eq('is_active', true)
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        throw error;
      }

      const itemsWithImages =
        data?.map(item => ({
          ...item,
          image_url: item.image_url || FALLBACK_IMAGE,
        })) || [];

      return { data: itemsWithImages, error: null };
    } catch (error) {
      console.error('Get featured items error:', error);
      return { data: null, error: error as Error };
    }
  },
};
