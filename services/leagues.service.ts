import { supabase } from '@/lib/supabase';

export interface League {
  id: string;
  name: string;
  entry_fee: number;
  creator_id: string;
  prize_pool: number;
  start_date: string;
  created_at: string;
  updated_at: string;
  league_code: string;
  max_members: number;
  is_featured?: boolean;
  current_members: number;
  end_date: string | null;
  image_url: string | null;
  icon_name?: string | null;
  icon_color?: string | null;
  description: string | null;
  category_id: string | null;
  type: 'public' | 'private' | 'invite_only';
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  creator_profile?: {
    id: string;
    username: string | null;
  } | null;
}

export interface LeagueMember {
  id: string;
  points: number;
  user_id: string;
  league_id: string;
  joined_at: string;
  rank: number | null;
  total_predictions: number;
  correct_predictions: number;
  status: 'pending' | 'active' | 'left' | 'kicked';
}

export interface CreateLeagueData {
  name: string;
  end_date?: string;
  entry_fee?: number;
  icon_name?: string;
  icon_color?: string;
  description?: string;
  category_id?: string;
  max_members?: number;
  category_ids?: string[];
  type: 'public' | 'private' | 'invite_only';
}

export interface PendingLeagueRequest {
  userId: string;
  avatar: string;
  username: string;
  accuracy: number;
  requestDate: string;
  predictionCount: number;
}

const formatRelativeRequestDate = (isoDate?: string | null) => {
  if (!isoDate) return 'Az önce';

  const createdAtMs = new Date(isoDate).getTime();
  if (Number.isNaN(createdAtMs)) return 'Az önce';

  const diffMs = Math.max(0, Date.now() - createdAtMs);
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  if (diffMinutes < 1) return 'Az önce';
  if (diffMinutes < 60) return `${diffMinutes} dk önce`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} saat önce`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} gün önce`;
};

const isLeagueCategoriesRelationMissing = (error: any) =>
  error?.code === 'PGRST200' &&
  (String(error?.message || '').includes('league_categories') ||
    String(error?.details || '').includes('league_categories'));

const PUBLIC_LEAGUES_SELECT_BASE = `
          *,
          categories (
            id,
            name,
            slug,
            icon,
            color
          ),
          creator_profile:profiles!leagues_creator_id_fkey (
            id,
            username
          )
        `;

const PUBLIC_LEAGUES_SELECT_WITH_RELATION = `
          *,
          categories (
            id,
            name,
            slug,
            icon,
            color
          ),
          league_categories (
            category_id,
            categories (
              id,
              name,
              slug,
              icon,
              color
            )
          ),
          creator_profile:profiles!leagues_creator_id_fkey (
            id,
            username
          )
        `;

const USER_LEAGUES_SELECT_BASE = `
          *,
          leagues (
            *,
            categories (
              id,
              name,
              slug,
              icon,
              color
            ),
            creator_profile:profiles!leagues_creator_id_fkey (
              id,
              username
            )
          )
        `;

const USER_LEAGUES_SELECT_WITH_RELATION = `
          *,
          leagues (
            *,
            categories (
              id,
              name,
              slug,
              icon,
              color
            ),
            league_categories (
              category_id,
              categories (
                id,
                name,
                slug,
                icon,
                color
              )
            ),
            creator_profile:profiles!leagues_creator_id_fkey (
              id,
              username
            )
          )
        `;

const LEAGUE_BY_ID_SELECT_BASE = `
          *,
          categories (
            id,
            name,
            slug,
            icon,
            color
          ),
          creator_profile:profiles!leagues_creator_id_fkey (
            id,
            username
          )
        `;

const LEAGUE_BY_ID_SELECT_WITH_RELATION = `
          *,
          categories (
            id,
            name,
            slug,
            icon,
            color
          ),
          league_categories (
            category_id,
            categories (
              id,
              name,
              slug,
              icon,
              color
            )
          ),
          creator_profile:profiles!leagues_creator_id_fkey (
            id,
            username
          )
        `;

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
      const primaryQuery = await supabase
        .from('leagues')
        .select(PUBLIC_LEAGUES_SELECT_WITH_RELATION)
        .eq('type', 'public')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (!primaryQuery.error) {
        return { data: primaryQuery.data, error: null };
      }

      if (!isLeagueCategoriesRelationMissing(primaryQuery.error)) {
        throw primaryQuery.error;
      }

      console.warn(
        "[leaguesService.getPublicLeagues] league_categories relation schema cache'te hazır değil, base query fallback çalıştırılıyor.",
      );

      const fallbackQuery = await supabase
        .from('leagues')
        .select(PUBLIC_LEAGUES_SELECT_BASE)
        .eq('type', 'public')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (fallbackQuery.error) throw fallbackQuery.error;
      return { data: fallbackQuery.data, error: null };
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
      const primaryQuery = await supabase
        .from('league_members')
        .select(USER_LEAGUES_SELECT_WITH_RELATION)
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('joined_at', { ascending: false });

      if (!primaryQuery.error) {
        return { data: primaryQuery.data, error: null };
      }

      if (!isLeagueCategoriesRelationMissing(primaryQuery.error)) {
        throw primaryQuery.error;
      }

      console.warn(
        "[leaguesService.getUserLeagues] league_categories relation schema cache'te hazır değil, base query fallback çalıştırılıyor.",
      );

      const fallbackQuery = await supabase
        .from('league_members')
        .select(USER_LEAGUES_SELECT_BASE)
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('joined_at', { ascending: false });

      if (fallbackQuery.error) throw fallbackQuery.error;
      return { data: fallbackQuery.data, error: null };
    } catch (error) {
      console.error('Get user leagues error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Kullanıcının aktif/bekleyen üyelikte olduğu lig ID'lerini getir
   */
  async getUserJoinedLeagueIds(userId: string) {
    try {
      const { data, error } = await supabase
        .from('league_members')
        .select('league_id')
        .eq('user_id', userId)
        .in('status', ['active', 'pending']);

      if (error) throw error;

      const leagueIds = (data || [])
        .map(item => item.league_id)
        .filter((leagueId): leagueId is string => typeof leagueId === 'string');

      return { data: leagueIds, error: null };
    } catch (error) {
      console.error('Get joined league ids error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Lig detayını getir
   */
  async getLeagueById(leagueId: string) {
    try {
      const primaryQuery = await supabase
        .from('leagues')
        .select(LEAGUE_BY_ID_SELECT_WITH_RELATION)
        .eq('id', leagueId)
        .single();

      if (!primaryQuery.error) {
        return { data: primaryQuery.data, error: null };
      }

      if (!isLeagueCategoriesRelationMissing(primaryQuery.error)) {
        throw primaryQuery.error;
      }

      console.warn(
        "[leaguesService.getLeagueById] league_categories relation schema cache'te hazır değil, base query fallback çalıştırılıyor.",
      );

      const fallbackQuery = await supabase.from('leagues').select(LEAGUE_BY_ID_SELECT_BASE).eq('id', leagueId).single();

      if (fallbackQuery.error) throw fallbackQuery.error;
      return { data: fallbackQuery.data, error: null };
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
        .select(
          `
          *,
          profiles (
            id,
            username,
            full_name,
            profile_image,
            level
          )
        `,
        )
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
      const { category_ids, ...leagueBaseData } = leagueData;
      const primaryCategoryId = leagueBaseData.category_id || category_ids?.[0] || null;

      const leagueInsertPayload = {
        ...leagueBaseData,
        category_id: primaryCategoryId,
        creator_id: user.id,
        current_members: 1,
        league_code,
        status: 'active',
      };

      let league: League | null = null;
      let leagueError: any = null;

      ({ data: league, error: leagueError } = await supabase
        .from('leagues')
        .insert(leagueInsertPayload)
        .select()
        .single());

      // Remote schema cache gecikirse ikon kolonları olmadan tek seferlik fallback
      if (
        leagueError &&
        leagueError.code === 'PGRST204' &&
        (String(leagueError.message || '').includes('icon_color') ||
          String(leagueError.message || '').includes('icon_name'))
      ) {
        const { icon_color: _iconColor, icon_name: _iconName, ...fallbackPayload } = leagueInsertPayload;

        ({ data: league, error: leagueError } = await supabase
          .from('leagues')
          .insert(fallbackPayload)
          .select()
          .single());
      }

      if (leagueError) {
        if (leagueError.code === 'PGRST204') {
          throw new Error('Sunucu şeması henüz güncellenmedi. Lütfen migration sonrası tekrar deneyin.');
        }
        throw leagueError;
      }

      if (!league) {
        throw new Error('Lig oluşturulamadı');
      }

      // Oluşturucuyu otomatik olarak üye yap
      const { error: memberError } = await supabase.from('league_members').insert({
        league_id: league.id,
        points: 0,
        status: 'active',
        user_id: user.id,
      });

      if (memberError) throw memberError;

      // Çoklu kategori eşlemelerini kaydet
      if (category_ids && category_ids.length > 0) {
        const uniqueCategoryIds = [...new Set(category_ids.filter(Boolean))];

        if (uniqueCategoryIds.length > 0) {
          const { error: linkError } = await supabase.from('league_categories').insert(
            uniqueCategoryIds.map(categoryId => ({
              category_id: categoryId,
              league_id: league.id,
            })),
          );

          if (linkError) {
            throw linkError;
          }
        }
      }

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
      const { data: league } = await supabase.from('leagues').select('*').eq('id', leagueId).single();

      if (!league) {
        throw new Error('League not found');
      }

      const currentMembers = league.current_members ?? 0;
      const maxMembers = league.max_members ?? 0;

      if (currentMembers >= maxMembers) {
        throw new Error('League is full');
      }

      // Üyeliği ekle
      const { data, error } = await supabase
        .from('league_members')
        .insert({
          league_id: leagueId,
          points: 0,
          status: league.type === 'invite_only' ? 'pending' : 'active',
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Lig üye sayısını artır
      if (league.type !== 'invite_only') {
        await supabase
          .from('leagues')
          .update({ current_members: currentMembers + 1 })
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
      const { data: leagueData } = await supabase.from('leagues').select('current_members').eq('id', leagueId).single();

      if (leagueData) {
        await supabase
          .from('leagues')
          .update({
            current_members: Math.max((leagueData.current_members ?? 1) - 1, 0),
          })
          .eq('id', leagueId);
      }

      return { error: null };
    } catch (error) {
      console.error('Leave league error:', error);
      return { error: error as Error };
    }
  },

  /**
   * Invite-only liglerde bekleyen istekleri getir
   */
  async getPendingLeagueRequests(leagueId: string) {
    try {
      const { data, error } = await supabase
        .from('league_members')
        .select(
          `
          user_id,
          joined_at,
          total_predictions,
          correct_predictions,
          profiles:profiles!league_members_user_id_fkey (
            username,
            profile_image
          )
        `,
        )
        .eq('league_id', leagueId)
        .eq('status', 'pending')
        .order('joined_at', { ascending: false });

      if (error) throw error;

      const mappedRequests: PendingLeagueRequest[] = (data || []).map((member: any) => {
        const totalPredictions = member.total_predictions || 0;
        const correctPredictions = member.correct_predictions || 0;
        const accuracy = totalPredictions > 0 ? Math.round((correctPredictions / totalPredictions) * 100) : 0;

        return {
          accuracy,
          avatar:
            member.profiles?.profile_image ||
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face',
          predictionCount: totalPredictions,
          requestDate: formatRelativeRequestDate(member.joined_at),
          userId: member.user_id,
          username: member.profiles?.username || 'Bilinmeyen',
        };
      });

      return { data: mappedRequests, error: null };
    } catch (error) {
      console.error('Get pending league requests error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Bekleyen katılım isteğini onayla
   */
  async approveLeagueRequest(leagueId: string, userId: string) {
    try {
      const { data: updatedMembers, error: updateMemberError } = await supabase
        .from('league_members')
        .update({ status: 'active' })
        .eq('league_id', leagueId)
        .eq('user_id', userId)
        .eq('status', 'pending')
        .select('id');

      if (updateMemberError) throw updateMemberError;
      if (!updatedMembers || updatedMembers.length === 0) {
        throw new Error('Bekleyen katılım isteği bulunamadı');
      }

      const { data: leagueData, error: leagueError } = await supabase
        .from('leagues')
        .select('current_members')
        .eq('id', leagueId)
        .single();

      if (leagueError) throw leagueError;

      const currentMembers = leagueData?.current_members ?? 0;
      const { error: incrementError } = await supabase
        .from('leagues')
        .update({ current_members: currentMembers + 1 })
        .eq('id', leagueId);

      if (incrementError) throw incrementError;

      return { error: null };
    } catch (error) {
      console.error('Approve league request error:', error);
      return { error: error as Error };
    }
  },

  /**
   * Bekleyen katılım isteğini reddet
   */
  async rejectLeagueRequest(leagueId: string, userId: string) {
    try {
      const { error } = await supabase
        .from('league_members')
        .update({ status: 'kicked' })
        .eq('league_id', leagueId)
        .eq('user_id', userId)
        .eq('status', 'pending');

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Reject league request error:', error);
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
        .select(
          `
          *,
          categories (
            id,
            name,
            slug,
            icon,
            color
          ),
          creator_profile:profiles!leagues_creator_id_fkey (
            id,
            username
          )
        `,
        )
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
