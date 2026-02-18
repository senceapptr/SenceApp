import { supabase } from '@/lib/supabase';

// ===== TYPES =====

export interface LeaderboardUser {
    id: string;
    username: string;
    full_name: string | null;
    profile_image: string | null;
    credits: number;
    level: number;
    rank: number;
}

export interface LeaderboardResponse {
    data: LeaderboardUser[];
    error: Error | null;
}

export interface UserRankResponse {
    rank: number;
    totalUsers: number;
    error: Error | null;
}

// ===== SERVICE =====

export const leaderboardService = {
    mapLeaderboardUser(user: any, rank: number): LeaderboardUser {
        return {
            credits: user?.credits ?? 0,
            full_name: user?.full_name ?? null,
            id: user?.id ?? '',
            level: user?.level ?? 1,
            profile_image: user?.profile_image ?? null,
            rank,
            username: user?.username ?? 'Kullanıcı',
        };
    },

    /**
     * Global Leaderboard - Top users sorted by credits (descending)
     */
    async getGlobalLeaderboard(limit: number = 100): Promise<LeaderboardResponse> {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('id, username, full_name, profile_image, credits, level')
                .order('credits', { ascending: false })
                .limit(limit);

            if (error) {
                console.error('Get global leaderboard error:', error);
                return { data: [], error };
            }

            // Add rank numbers
            const rankedData: LeaderboardUser[] = (data || []).map((user, index) =>
                this.mapLeaderboardUser(user, index + 1),
            );

            return { data: rankedData, error: null };
        } catch (error) {
            console.error('Get global leaderboard error:', error);
            return { data: [], error: error as Error };
        }
    },

    /**
     * Friends Leaderboard - Mutual followers (both follow each other) sorted by credits
     * "Arkadaş" = Users who follow you AND you follow them back
     */
    async getFriendsLeaderboard(userId: string): Promise<LeaderboardResponse> {
        try {
            // Step 1: Get users that I follow
            const { data: myFollowing, error: followingError } = await supabase
                .from('followers')
                .select('following_id')
                .eq('follower_id', userId);

            if (followingError) {
                console.error('Get following error:', followingError);
                return { data: [], error: followingError };
            }

            if (!myFollowing || myFollowing.length === 0) {
                // No one followed, return only self
                return await this.getSelfAsLeaderboard(userId);
            }

            const followingIds = myFollowing.map(f => f.following_id);

            // Step 2: Get users that follow me back (intersection = mutual friends)
            const { data: mutualFollows, error: mutualError } = await supabase
                .from('followers')
                .select('follower_id')
                .eq('following_id', userId)
                .in('follower_id', followingIds);

            if (mutualError) {
                console.error('Get mutual followers error:', mutualError);
                return { data: [], error: mutualError };
            }

            // Include self in friends list
            const friendIds = [userId, ...(mutualFollows || []).map(f => f.follower_id)];

            // Step 3: Get profiles for mutual friends + self, sorted by credits
            const { data: profiles, error: profilesError } = await supabase
                .from('profiles')
                .select('id, username, full_name, profile_image, credits, level')
                .in('id', friendIds)
                .order('credits', { ascending: false });

            if (profilesError) {
                console.error('Get friend profiles error:', profilesError);
                return { data: [], error: profilesError };
            }

            // Add rank numbers within friends group
            const rankedData: LeaderboardUser[] = (profiles || []).map((user, index) =>
                this.mapLeaderboardUser(user, index + 1),
            );

            return { data: rankedData, error: null };
        } catch (error) {
            console.error('Get friends leaderboard error:', error);
            return { data: [], error: error as Error };
        }
    },

    /**
     * Helper: Return just self when no friends
     */
    async getSelfAsLeaderboard(userId: string): Promise<LeaderboardResponse> {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('id, username, full_name, profile_image, credits, level')
                .eq('id', userId)
                .single();

            if (error) {
                return { data: [], error };
            }

            return {
                data: data ? [this.mapLeaderboardUser(data, 1)] : [],
                error: null,
            };
        } catch (error) {
            return { data: [], error: error as Error };
        }
    },

    /**
     * Get current user's global rank
     */
    async getUserGlobalRank(userId: string): Promise<UserRankResponse> {
        try {
            // Get user's credits
            const { data: user, error: userError } = await supabase
                .from('profiles')
                .select('credits')
                .eq('id', userId)
                .single();

            if (userError || !user) {
                return { rank: 0, totalUsers: 0, error: userError };
            }

            // Count users with more credits (they rank higher)
            const { count: higherCount, error: countError } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true })
                .gt('credits', user.credits);

            if (countError) {
                return { rank: 0, totalUsers: 0, error: countError };
            }

            // Get total users count
            const { count: totalCount, error: totalError } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true });

            if (totalError) {
                return { rank: 0, totalUsers: 0, error: totalError };
            }

            // User's rank = users with more credits + 1
            const rank = (higherCount || 0) + 1;

            return {
                rank,
                totalUsers: totalCount || 0,
                error: null,
            };
        } catch (error) {
            console.error('Get user global rank error:', error);
            return { rank: 0, totalUsers: 0, error: error as Error };
        }
    },

    /**
     * Get user's rank within friends group
     */
    async getUserFriendsRank(userId: string): Promise<UserRankResponse> {
        try {
            const { data: friends } = await this.getFriendsLeaderboard(userId);

            const userIndex = friends.findIndex(f => f.id === userId);

            return {
                rank: userIndex >= 0 ? userIndex + 1 : 0,
                totalUsers: friends.length,
                error: null,
            };
        } catch (error) {
            console.error('Get user friends rank error:', error);
            return { rank: 0, totalUsers: 0, error: error as Error };
        }
    },
};
