import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { gamehubService, DailyGameState, GameType } from '@/services/gamehub.service';

export interface UseGameHubReturn {
    // State
    loading: boolean;
    dailyState: DailyGameState | null;
    error: string | null;

    // Computed
    spinAvailable: boolean;
    gamesCompleted: number;
    totalGames: number;
    bonusAvailable: boolean;
    todayEarnings: number;

    // Actions
    refreshState: () => Promise<void>;
    spinWheel: (predeterminedReward?: number) => Promise<{ reward: number } | null>;
    completeGame: (gameType: GameType) => Promise<{ reward: number; progress: number } | null>;
    claimBonus: () => Promise<{ bonus: number } | null>;
}

export function useGameHub(): UseGameHubReturn {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [dailyState, setDailyState] = useState<DailyGameState | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Fetch daily state
    const refreshState = useCallback(async () => {
        if (!user?.id) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const { data, error: fetchError } = await gamehubService.getDailyGameState(user.id);

            if (fetchError) throw fetchError;
            setDailyState(data);
        } catch (err) {
            console.error('useGameHub refreshState error:', err);
            setError('Günlük oyun durumu yüklenemedi');
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    // Initial fetch
    useEffect(() => {
        refreshState();
    }, [refreshState]);

    // Spin the wheel - accepts predetermined reward from wheel animation
    const spinWheel = useCallback(async (predeterminedReward?: number): Promise<{ reward: number } | null> => {
        if (!user?.id) return null;

        try {
            const { data, error: spinError } = await gamehubService.spinDailyWheel(user.id, predeterminedReward);

            if (spinError) throw spinError;

            // Refresh state after spin
            await refreshState();

            return data ? { reward: data.reward } : null;
        } catch (err) {
            console.error('useGameHub spinWheel error:', err);
            setError('Çark çevrilemedi');
            return null;
        }
    }, [user?.id, refreshState]);

    // Complete a game
    const completeGame = useCallback(async (gameType: GameType): Promise<{ reward: number; progress: number } | null> => {
        if (!user?.id) return null;

        try {
            const { data, error: completeError } = await gamehubService.completeGame(user.id, gameType);

            if (completeError) throw completeError;

            // Refresh state after completion
            await refreshState();

            return data;
        } catch (err) {
            console.error('useGameHub completeGame error:', err);
            setError('Oyun tamamlanamadı');
            return null;
        }
    }, [user?.id, refreshState]);

    // Claim daily bonus
    const claimBonus = useCallback(async (): Promise<{ bonus: number } | null> => {
        if (!user?.id) return null;

        try {
            const { data, error: claimError } = await gamehubService.claimDailyBonus(user.id);

            if (claimError) throw claimError;

            // Refresh state after claim
            await refreshState();

            return data ? { bonus: data.bonus } : null;
        } catch (err) {
            console.error('useGameHub claimBonus error:', err);
            setError('Bonus alınamadı');
            return null;
        }
    }, [user?.id, refreshState]);

    // Computed values
    const spinAvailable = !dailyState?.daily_spin_used;
    const gamesCompleted = (dailyState?.zip_completed ? 1 : 0) + (dailyState?.higher_lower_completed ? 1 : 0);
    const totalGames = 2; // Zip + Higher/Lower
    const bonusAvailable = gamesCompleted >= 2 && !dailyState?.daily_bonus_claimed;
    const todayEarnings = (dailyState?.daily_spin_reward || 0) +
        (dailyState?.zip_reward || 0) +
        (dailyState?.higher_lower_reward || 0) +
        (dailyState?.daily_bonus_amount || 0);

    return {
        loading,
        dailyState,
        error,
        spinAvailable,
        gamesCompleted,
        totalGames,
        bonusAvailable,
        todayEarnings,
        refreshState,
        spinWheel,
        completeGame,
        claimBonus,
    };
}
