import { supabase } from '@/lib/supabase';

export interface League {
  id: string;
  name: string;
  description: string | null;
  creator_id: string;
  league_code: string;
  type: 'public' | 'private' | 'invite_only';
  category_id: string | null;
  max_members: number;
  current_members: number;
  entry_fee: number;
  prize_pool: number;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  start_date: string;
  end_date: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface LeagueMember {
  id: string;
  league_id: string;
  user_id: string;
  rank: number | null;
  points: number;
  correct_predictions: number;
  total_predictions: number;
  status: 'pending' | 'active' | 'left' | 'kicked';
  joined_at: string;
}

export interface CreateLeagueData {
  name: string;
  description?: string;
  type: 'public' | 'private' | 'invite_only';
  category_id?: string;
  max_members?: number;
  entry_fee?: number;
  end_date?: string;
}

/**
 * Leagues Service
 * Lig işlemleri
 */
export const leaguesService = {
  /**
   * Public ligleri getir
   */
  async getPublicLeagues() {
    try {
      const { data, error } = await supabase
        .from('leagues')
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
        .eq('type', 'public')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Get public leagues error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Kullanıcının liglerini getir
   */
  async getUserLeagues(userId: string) {
    try {
      const { data, error } = await supabase
        .from('league_members')
        .select(`
          *,
          leagues (
            *,
            categories (
              id,
              name,
              slug,
              icon,
              color
            )
          )
        `)
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('joined_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Get user leagues error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Lig detayını getir
   */
  async getLeagueById(leagueId: string) {
    try {
      const { data, error } = await supabase
        .from('leagues')
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
        .eq('id', leagueId)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Get league by id error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Lig üyelerini ve sıralamayı getir
   */
  async getLeagueMembers(leagueId: string) {
    try {
      const { data, error } = await supabase
        .from('league_members')
        .select(`
          *,
          profiles (
            id,
            username,
            full_name,
            profile_image,
            level
          )
        `)
        .eq('league_id', leagueId)
        .eq('status', 'active')
        .order('points', { ascending: false })
        .order('correct_predictions', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Get league members error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Yeni lig oluştur
   */
  async createLeague(leagueData: CreateLeagueData) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User not authenticated');
      }

      // Benzersiz lig kodu oluştur
      const league_code = `LG-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      const { data: league, error: leagueError } = await supabase
        .from('leagues')
        .insert({
          ...leagueData,
          creator_id: user.id,
          league_code,
          current_members: 1,
          status: 'active',
        })
        .select()
        .single();

      if (leagueError) throw leagueError;

      // Oluşturucuyu otomatik olarak üye yap
      const { error: memberError } = await supabase.from('league_members').insert({
        league_id: league.id,
        user_id: user.id,
        status: 'active',
        points: 0,
      });

      if (memberError) throw memberError;

      return { data: league, error: null };
    } catch (error) {
      console.error('Create league error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Lige katıl
   */
  async joinLeague(leagueId: string) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User not authenticated');
      }

      // Lig bilgilerini kontrol et
      const { data: league } = await supabase
        .from('leagues')
        .select('*')
        .eq('id', leagueId)
        .single();

      if (!league) {
        throw new Error('League not found');
      }

      if (league.current_members >= league.max_members) {
        throw new Error('League is full');
      }

      // Üyeliği ekle
      const { data, error } = await supabase
        .from('league_members')
        .insert({
          league_id: leagueId,
          user_id: user.id,
          status: league.type === 'invite_only' ? 'pending' : 'active',
          points: 0,
        })
        .select()
        .single();

      if (error) throw error;

      // Lig üye sayısını artır
      if (league.type !== 'invite_only') {
        await supabase
          .from('leagues')
          .update({ current_members: league.current_members + 1 })
          .eq('id', leagueId);
      }

      return { data, error: null };
    } catch (error) {
      console.error('Join league error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Ligden ayrıl
   */
  async leaveLeague(leagueId: string) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('league_members')
        .update({ status: 'left' })
        .eq('league_id', leagueId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Lig üye sayısını azalt
      await supabase.rpc('decrease_league_members', {
        league_id: leagueId,
      });

      return { error: null };
    } catch (error) {
      console.error('Leave league error:', error);
      return { error: error as Error };
    }
  },

  /**
   * Lig kodu ile lig ara
   */
  async searchLeagueByCode(leagueCode: string) {
    try {
      const { data, error } = await supabase
        .from('leagues')
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
        .eq('league_code', leagueCode.toUpperCase())
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Search league by code error:', error);
      return { data: null, error: error as Error };
    }
  },
};




