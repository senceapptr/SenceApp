import { supabase } from '@/lib/supabase';

// =====================================================
// GAME HUB SERVICE
// Günlük oyun işlemleri ve ödüller
// =====================================================

export interface DailyGameState {
    id: string;
    user_id: string;
    date: string;
    daily_spin_used: boolean;
    daily_spin_reward: number;
    zip_completed: boolean;
    zip_reward: number;
    higher_lower_completed: boolean;
    higher_lower_reward: number;
    daily_progress: number;
    daily_bonus_claimed: boolean;
    daily_bonus_amount: number;
    created_at: string;
    updated_at: string;
}

export type GameType = 'zip' | 'higher_lower';

// Reward constants
const REWARDS = {
    DAILY_SPIN_MIN: 50,
    DAILY_SPIN_MAX: 500,
    ZIP_COMPLETE: 100,
    HIGHER_LOWER_COMPLETE: 100,
    DAILY_BONUS: 200, // Extra bonus for completing all 3 games
};

/**
 * Game Hub Service
 * Günlük oyun işlemleri
 */
export const gamehubService = {
    /**
     * Kullanıcının günlük oyun durumunu getir
     * Eğer bugün için kayıt yoksa yeni oluşturur
     */
    async getDailyGameState(userId: string): Promise<{ data: DailyGameState | null; error: Error | null }> {
        try {
            const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

            // Bugünün kaydını getir
            const { data: existingRecord, error: selectError } = await supabase
                .from('user_daily_games')
                .select('*')
                .eq('user_id', userId)
                .eq('date', today)
                .single();

            if (selectError && selectError.code !== 'PGRST116') {
                // PGRST116 = no rows found, which is OK
                throw selectError;
            }

            if (existingRecord) {
                return { data: existingRecord, error: null };
            }

            // Bugün için kayıt yok, yeni oluştur
            const { data: newRecord, error: insertError } = await supabase
                .from('user_daily_games')
                .insert({
                    user_id: userId,
                    date: today,
                })
                .select()
                .single();

            if (insertError) throw insertError;

            return { data: newRecord, error: null };
        } catch (error) {
            console.error('Get daily game state error:', error);
            return { data: null, error: error as Error };
        }
    },

    /**
     * Günlük çarkı çevir
     * Eğer reward parametresi verilmişse o değeri kullanır (çarkın durduğu segment)
     * Verilmemişse rastgele 50-500 coin verir
     */
    async spinDailyWheel(userId: string, predeterminedReward?: number): Promise<{ data: { reward: number; newCredits: number } | null; error: Error | null }> {
        try {
            const today = new Date().toISOString().split('T')[0];

            // Mevcut durumu kontrol et
            const { data: currentState, error: stateError } = await this.getDailyGameState(userId);

            if (stateError) throw stateError;
            if (!currentState) throw new Error('Could not get daily game state');

            if (currentState.daily_spin_used) {
                throw new Error('Daily spin already used today');
            }

            // Eğer önceden belirlenmiş ödül varsa onu kullan, yoksa rastgele hesapla
            const reward = predeterminedReward ?? Math.floor(
                Math.random() * (REWARDS.DAILY_SPIN_MAX - REWARDS.DAILY_SPIN_MIN + 1) + REWARDS.DAILY_SPIN_MIN
            );

            // Spin durumunu güncelle
            const { error: updateError } = await supabase
                .from('user_daily_games')
                .update({
                    daily_spin_used: true,
                    daily_spin_reward: reward,
                })
                .eq('user_id', userId)
                .eq('date', today);

            if (updateError) throw updateError;

            // Kullanıcıya coin ver
            const { data: creditData, error: creditError } = await this.rewardCredits(userId, reward);

            if (creditError) throw creditError;

            return {
                data: {
                    reward,
                    newCredits: creditData?.credits || 0
                },
                error: null
            };
        } catch (error) {
            console.error('Spin daily wheel error:', error);
            return { data: null, error: error as Error };
        }
    },

    /**
     * Oyun tamamlandığında çağrılır
     */
    async completeGame(userId: string, gameType: GameType): Promise<{ data: { reward: number; progress: number } | null; error: Error | null }> {
        try {
            const today = new Date().toISOString().split('T')[0];

            // Mevcut durumu kontrol et
            const { data: currentState, error: stateError } = await this.getDailyGameState(userId);

            if (stateError) throw stateError;
            if (!currentState) throw new Error('Could not get daily game state');

            let reward = 0;
            let updateData: Partial<DailyGameState> = {};

            if (gameType === 'zip') {
                if (currentState.zip_completed) {
                    throw new Error('Zip game already completed today');
                }
                reward = REWARDS.ZIP_COMPLETE;
                updateData = {
                    zip_completed: true,
                    zip_reward: reward,
                    daily_progress: currentState.daily_progress + 1,
                };
            } else if (gameType === 'higher_lower') {
                if (currentState.higher_lower_completed) {
                    throw new Error('Higher/Lower game already completed today');
                }
                reward = REWARDS.HIGHER_LOWER_COMPLETE;
                updateData = {
                    higher_lower_completed: true,
                    higher_lower_reward: reward,
                    daily_progress: currentState.daily_progress + 1,
                };
            }

            // Durumu güncelle
            const { error: updateError } = await supabase
                .from('user_daily_games')
                .update(updateData)
                .eq('user_id', userId)
                .eq('date', today);

            if (updateError) throw updateError;

            // Kullanıcıya coin ver
            await this.rewardCredits(userId, reward);

            const newProgress = (updateData.daily_progress as number) || currentState.daily_progress;

            return {
                data: {
                    reward,
                    progress: newProgress
                },
                error: null
            };
        } catch (error) {
            console.error('Complete game error:', error);
            return { data: null, error: error as Error };
        }
    },

    /**
     * Günlük bonus al (3/3 tamamlandığında)
     */
    async claimDailyBonus(userId: string): Promise<{ data: { bonus: number; totalEarned: number } | null; error: Error | null }> {
        try {
            const today = new Date().toISOString().split('T')[0];

            // Mevcut durumu kontrol et
            const { data: currentState, error: stateError } = await this.getDailyGameState(userId);

            if (stateError) throw stateError;
            if (!currentState) throw new Error('Could not get daily game state');

            // Progress kontrolü - 3/3 olmalı (spin sayılmaz, sadece oyunlar + bonus için 2/2 yeterli)
            // Spin + 2 oyun = 3 olmak zorunda olsa bile bonus sadece daily_progress >= 2 olduğunda alınabilir
            // Spin hariç progress: zip + higher_lower = 2
            const gameProgress = (currentState.zip_completed ? 1 : 0) + (currentState.higher_lower_completed ? 1 : 0);

            if (gameProgress < 2) {
                throw new Error('Complete all games first to claim daily bonus');
            }

            if (currentState.daily_bonus_claimed) {
                throw new Error('Daily bonus already claimed');
            }

            const bonus = REWARDS.DAILY_BONUS;

            // Bonus durumunu güncelle
            const { error: updateError } = await supabase
                .from('user_daily_games')
                .update({
                    daily_bonus_claimed: true,
                    daily_bonus_amount: bonus,
                })
                .eq('user_id', userId)
                .eq('date', today);

            if (updateError) throw updateError;

            // Kullanıcıya bonus ver
            await this.rewardCredits(userId, bonus);

            // Toplam günlük kazancı hesapla
            const totalEarned =
                currentState.daily_spin_reward +
                currentState.zip_reward +
                currentState.higher_lower_reward +
                bonus;

            return {
                data: {
                    bonus,
                    totalEarned
                },
                error: null
            };
        } catch (error) {
            console.error('Claim daily bonus error:', error);
            return { data: null, error: error as Error };
        }
    },

    /**
     * Kullanıcıya coin ver
     */
    async rewardCredits(userId: string, credits: number): Promise<{ data: { credits: number } | null; error: Error | null }> {
        try {
            // Mevcut krediyi al
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('credits')
                .eq('id', userId)
                .single();

            if (profileError) throw profileError;

            const newCredits = (profile?.credits || 0) + credits;

            // Krediyi güncelle
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ credits: newCredits })
                .eq('id', userId);

            if (updateError) throw updateError;

            return { data: { credits: newCredits }, error: null };
        } catch (error) {
            console.error('Reward credits error:', error);
            return { data: null, error: error as Error };
        }
    },

    /**
     * Günlük oyun istatistiklerini getir
     */
    async getDailyStats(userId: string): Promise<{
        data: {
            spinUsed: boolean;
            gamesCompleted: number;
            totalGames: number;
            bonusClaimed: boolean;
            todayEarnings: number;
        } | null;
        error: Error | null
    }> {
        try {
            const { data: state, error } = await this.getDailyGameState(userId);

            if (error) throw error;
            if (!state) throw new Error('Could not get daily game state');

            const gamesCompleted = (state.zip_completed ? 1 : 0) + (state.higher_lower_completed ? 1 : 0);
            const todayEarnings =
                state.daily_spin_reward +
                state.zip_reward +
                state.higher_lower_reward +
                state.daily_bonus_amount;

            return {
                data: {
                    spinUsed: state.daily_spin_used,
                    gamesCompleted,
                    totalGames: 2, // Zip + Higher/Lower
                    bonusClaimed: state.daily_bonus_claimed,
                    todayEarnings,
                },
                error: null,
            };
        } catch (error) {
            console.error('Get daily stats error:', error);
            return { data: null, error: error as Error };
        }
    },
};
