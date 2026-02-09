import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { leaderboardService, LeaderboardUser } from '@/services/leaderboard.service';
import { LeaderboardTab } from './types';

export function useLeaderboard() {
    const { user, profile } = useAuth();

    const [activeTab, setActiveTab] = useState<LeaderboardTab>('global');
    const [globalUsers, setGlobalUsers] = useState<LeaderboardUser[]>([]);
    const [friendsUsers, setFriendsUsers] = useState<LeaderboardUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [userGlobalRank, setUserGlobalRank] = useState(0);
    const [userFriendsRank, setUserFriendsRank] = useState(0);
    const [totalGlobalUsers, setTotalGlobalUsers] = useState(0);
    const [totalFriendsUsers, setTotalFriendsUsers] = useState(0);

    const fetchData = useCallback(async () => {
        if (!user) return;

        try {
            // Fetch global leaderboard
            const globalRes = await leaderboardService.getGlobalLeaderboard(100);
            if (!globalRes.error) {
                setGlobalUsers(globalRes.data);
            }

            // Fetch friends leaderboard
            const friendsRes = await leaderboardService.getFriendsLeaderboard(user.id);
            if (!friendsRes.error) {
                setFriendsUsers(friendsRes.data);
                setTotalFriendsUsers(friendsRes.data.length);
            }

            // Get user's global rank
            const globalRankRes = await leaderboardService.getUserGlobalRank(user.id);
            if (!globalRankRes.error) {
                setUserGlobalRank(globalRankRes.rank);
                setTotalGlobalUsers(globalRankRes.totalUsers);
            }

            // Get user's friends rank
            const friendsRankRes = await leaderboardService.getUserFriendsRank(user.id);
            if (!friendsRankRes.error) {
                setUserFriendsRank(friendsRankRes.rank);
            }
        } catch (error) {
            console.error('Fetch leaderboard error:', error);
        }
    }, [user]);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            await fetchData();
            setLoading(false);
        };
        load();
    }, [fetchData]);

    const handleRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    }, [fetchData]);

    // Get current data based on active tab
    const currentUsers = activeTab === 'global' ? globalUsers : friendsUsers;
    const topThree = currentUsers.slice(0, 3);
    const restOfList = currentUsers.slice(3);
    const currentUserRank = activeTab === 'global' ? userGlobalRank : userFriendsRank;
    const currentTotalUsers = activeTab === 'global' ? totalGlobalUsers : totalFriendsUsers;

    return {
        // State
        activeTab,
        loading,
        refreshing,
        currentUsers,
        topThree,
        restOfList,
        currentUserRank,
        currentTotalUsers,

        // User info
        userId: user?.id,
        userCredits: profile?.credits || 0,
        userProfileImage: profile?.profile_image,
        username: profile?.username || user?.email?.split('@')[0] || 'user',

        // Actions
        setActiveTab,
        handleRefresh,
    };
}
