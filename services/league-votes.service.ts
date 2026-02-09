import { supabase } from '@/lib/supabase';

export interface LeagueVote {
    id: string;
    league_id: string;
    user_id: string;
    question_id: string;
    vote: 'yes' | 'no' | 'skip';
    odds_at_vote: number;
    status: 'pending' | 'won' | 'lost' | 'skipped';
    points_earned: number;
    created_at: string;
    resolved_at: string | null;
    questions?: {
        id: string;
        title: string;
        image_url: string | null;
        yes_odds: number;
        no_odds: number;
        result: string | null;
    };
}

export interface UnansweredQuestion {
    id: string;
    title: string;
    description: string | null;
    image_url: string | null;
    yes_odds: number;
    no_odds: number;
    total_votes: number;
    yes_percentage: number;
    no_percentage: number;
    end_date: string;
    category_name: string | null;
    category_icon: string | null;
}

export interface SubmitVoteData {
    league_id: string;
    user_id: string;
    question_id: string;
    vote: 'yes' | 'no' | 'skip';
    odds_at_vote: number;
}

/**
 * League Votes Service
 * Handles swipe-based predictions in leagues
 */
export const leagueVotesService = {
    /**
     * Submit a vote (swipe)
     */
    async submitVote(data: SubmitVoteData) {
        try {
            const { data: vote, error } = await supabase
                .from('league_votes')
                .insert({
                    league_id: data.league_id,
                    user_id: data.user_id,
                    question_id: data.question_id,
                    vote: data.vote,
                    odds_at_vote: data.odds_at_vote,
                    status: data.vote === 'skip' ? 'skipped' : 'pending',
                })
                .select()
                .single();

            if (error) throw error;
            return { data: vote, error: null };
        } catch (error) {
            console.error('Submit vote error:', error);
            return { data: null, error: error as Error };
        }
    },

    /**
     * Get unanswered questions for a league using RPC function
     */
    async getUnansweredQuestions(leagueId: string, userId: string, limit: number = 20) {
        try {
            const { data, error } = await supabase
                .rpc('get_unanswered_league_questions', {
                    p_league_id: leagueId,
                    p_user_id: userId,
                    p_limit: limit,
                });

            if (error) throw error;
            return { data: data as UnansweredQuestion[], error: null };
        } catch (error) {
            console.error('Get unanswered questions error:', error);
            return { data: null, error: error as Error };
        }
    },

    /**
     * Get user's vote history for a league
     */
    async getUserVotes(leagueId: string, userId: string, status?: 'pending' | 'won' | 'lost' | 'skipped') {
        try {
            let query = supabase
                .from('league_votes')
                .select(`
          *,
          questions (
            id,
            title,
            image_url,
            yes_odds,
            no_odds,
            result
          )
        `)
                .eq('league_id', leagueId)
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (status) {
                query = query.eq('status', status);
            }

            const { data, error } = await query;

            if (error) throw error;
            return { data: data as LeagueVote[], error: null };
        } catch (error) {
            console.error('Get user votes error:', error);
            return { data: null, error: error as Error };
        }
    },

    /**
     * Get pending votes count for a user in a league
     */
    async getPendingVotesCount(leagueId: string, userId: string) {
        try {
            const { count, error } = await supabase
                .from('league_votes')
                .select('*', { count: 'exact', head: true })
                .eq('league_id', leagueId)
                .eq('user_id', userId)
                .eq('status', 'pending');

            if (error) throw error;
            return { data: count || 0, error: null };
        } catch (error) {
            console.error('Get pending votes count error:', error);
            return { data: 0, error: error as Error };
        }
    },

    /**
     * Get user stats for a league (wins, losses, total points)
     */
    async getUserLeagueStats(leagueId: string, userId: string) {
        try {
            const { data, error } = await supabase
                .from('league_votes')
                .select('status, points_earned, vote')
                .eq('league_id', leagueId)
                .eq('user_id', userId)
                .neq('vote', 'skip');

            if (error) throw error;

            const stats = {
                totalVotes: data?.length || 0,
                wins: data?.filter(v => v.status === 'won').length || 0,
                losses: data?.filter(v => v.status === 'lost').length || 0,
                pending: data?.filter(v => v.status === 'pending').length || 0,
                totalPoints: data?.reduce((sum, v) => sum + (v.points_earned || 0), 0) || 0,
                accuracy: 0,
            };

            const resolved = stats.wins + stats.losses;
            stats.accuracy = resolved > 0 ? Math.round((stats.wins / resolved) * 100) : 0;

            return { data: stats, error: null };
        } catch (error) {
            console.error('Get user league stats error:', error);
            return { data: null, error: error as Error };
        }
    },

    /**
     * Undo last vote (delete pending vote)
     */
    async undoVote(voteId: string) {
        try {
            const { error } = await supabase
                .from('league_votes')
                .delete()
                .eq('id', voteId)
                .eq('status', 'pending');

            if (error) throw error;
            return { success: true, error: null };
        } catch (error) {
            console.error('Undo vote error:', error);
            return { success: false, error: error as Error };
        }
    },

    /**
     * Get the last vote made by user in a league (for undo)
     */
    async getLastVote(leagueId: string, userId: string) {
        try {
            const { data, error } = await supabase
                .from('league_votes')
                .select('*')
                .eq('league_id', leagueId)
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
            return { data, error: null };
        } catch (error) {
            console.error('Get last vote error:', error);
            return { data: null, error: error as Error };
        }
    },
};
