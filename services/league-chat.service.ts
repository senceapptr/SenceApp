import { supabase } from '@/lib/supabase';

export interface LeagueChatMessage {
  id: string;
  league_id: string;
  user_id: string;
  message: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    username: string;
    profile_image: string | null;
  };
}

export interface CreateLeagueChatMessageData {
  league_id: string;
  user_id: string;
  message: string;
}

/**
 * League Chat Service
 * Lig chat mesajları yönetimi
 */
export const leagueChatService = {
  /**
   * Lig chat mesajlarını getir
   */
  async getLeagueChatMessages(leagueId: string) {
    try {
      console.log('Getting chat messages for league:', leagueId);
      
      const { data, error } = await supabase
        .from('league_chat_messages' as any)
        .select(`
          *,
          profiles (
            username,
            profile_image
          )
        `)
        .eq('league_id', leagueId)
        .order('created_at', { ascending: true });

      console.log('Get messages response:', { data, error });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Get league chat messages error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Yeni chat mesajı gönder
   */
  async sendChatMessage(messageData: CreateLeagueChatMessageData) {
    try {
      console.log('Sending to database:', messageData);
      
      const { data, error } = await supabase
        .from('league_chat_messages' as any)
        .insert([messageData])
        .select(`
          *,
          profiles (
            username,
            profile_image
          )
        `)
        .single();

      console.log('Database response:', { data, error });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Send chat message error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Chat mesajını güncelle
   */
  async updateChatMessage(messageId: string, message: string) {
    try {
      const { data, error } = await supabase
        .from('league_chat_messages')
        .update({ 
          message,
          updated_at: new Date().toISOString()
        })
        .eq('id', messageId)
        .select(`
          *,
          profiles (
            username,
            profile_image
          )
        `)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Update chat message error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Chat mesajını sil
   */
  async deleteChatMessage(messageId: string) {
    try {
      const { error } = await supabase
        .from('league_chat_messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;
      return { data: true, error: null };
    } catch (error) {
      console.error('Delete chat message error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Real-time chat mesajları dinle
   */
  subscribeToLeagueChat(leagueId: string, callback: (message: LeagueChatMessage) => void) {
    console.log('Starting subscription for league:', leagueId);
    
    const subscription = supabase
      .channel(`league-chat-${leagueId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'league_chat_messages',
          filter: `league_id=eq.${leagueId}`,
        },
        async (payload) => {
          console.log('Real-time payload received:', payload);
          
          // Mesajı tam detaylarıyla getir
          const { data, error } = await supabase
            .from('league_chat_messages' as any)
            .select(`
              *,
              profiles (
                username,
                profile_image
              )
            `)
            .eq('id', payload.new.id)
            .single();

          console.log('Real-time message data:', { data, error });

          if (!error && data) {
            callback(data);
          } else {
            console.warn('Failed to fetch real-time message details:', error);
          }
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return subscription;
  },

  /**
   * Real-time subscription'ı kapat
   */
  unsubscribeFromLeagueChat(subscription: any) {
    if (subscription) {
      supabase.removeChannel(subscription);
    }
  }
};
