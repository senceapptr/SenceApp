import { supabase } from '@/lib/supabase';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  type: 'daily' | 'monthly';
  requirement_type: string;
  requirement_value: number;
  reward_credits: number;
  reward_experience: number;
  icon: string;
  is_active: boolean;
  reset_period: string;
}

export interface UserTaskProgress {
  id: string;
  user_id: string;
  task_id: string;
  progress: number;
  is_completed: boolean;
  is_claimed: boolean;
  completed_at: string | null;
  claimed_at: string | null;
  reset_at: string | null;
  tasks?: Task;
}

export interface TaskWithProgress extends Task {
  progress: number;
  is_completed: boolean;
  is_claimed: boolean;
  actionType: 'navigate' | 'claim';
  navigationTarget?: '/home' | '/leagues' | '/gamehub' | null;
}

/**
 * Tasks Service - Görev işlemleri
 * Real-time progress calculation (Option B)
 */
export const tasksService = {
  /**
   * Kullanıcı girişini kaydet (session tracking)
   */
  async recordUserSession(userId: string) {
    try {
      const { error } = await supabase
        .from('user_sessions')
        .upsert({
          user_id: userId,
          session_date: new Date().toISOString().split('T')[0],
        }, {
          onConflict: 'user_id,session_date',
          ignoreDuplicates: true
        });

      if (error && error.code !== '23505') { // Ignore unique violation
        console.error('Record session error:', error);
      }
      return { success: true };
    } catch (error) {
      console.error('Record user session error:', error);
      return { success: false };
    }
  },

  /**
   * Kullanıcının giriş günlerini getir (takvim için)
   */
  async getUserLoginDays(userId: string, year: number, month: number) {
    try {
      const startDate = new Date(year, month, 1).toISOString().split('T')[0];
      const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('user_sessions')
        .select('session_date')
        .eq('user_id', userId)
        .gte('session_date', startDate)
        .lte('session_date', endDate);

      if (error) throw error;

      const loginDays = data?.map(s => new Date(s.session_date).getDate()) || [];
      return { data: loginDays, error: null };
    } catch (error) {
      console.error('Get user login days error:', error);
      return { data: [], error: error as Error };
    }
  },

  /**
   * Tüm aktif görevleri getir
   */
  async getTasks(type?: 'daily' | 'monthly') {
    try {
      let query = supabase
        .from('tasks')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: true });

      if (type) {
        query = query.eq('type', type);
      }

      const { data, error } = await query;
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Get tasks error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Günlük görevleri real-time progress ile getir
   */
  async getDailyTasks(userId: string): Promise<{ data: TaskWithProgress[] | null; error: Error | null }> {
    try {
      // Görevleri ve mevcut user_tasks kayıtlarını paralel getir
      const [tasksResult, userTasksResult] = await Promise.all([
        this.getTasks('daily'),
        supabase
          .from('user_tasks')
          .select('*')
          .eq('user_id', userId)
      ]);

      if (tasksResult.error) throw tasksResult.error;
      const tasks = tasksResult.data || [];

      // Bugünün başlangıcı (UTC)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayStr = today.toISOString();

      // Her görev için gerçek ilerlemeyi hesapla
      const tasksWithProgress: TaskWithProgress[] = await Promise.all(
        tasks.map(async (task) => {
          const progress = await this.calculateTaskProgress(userId, task, todayStr, 'daily');
          const userTask = userTasksResult.data?.find(ut => ut.task_id === task.id);

          // Reset kontrolü - günlük görev ve resetlenmesi gerekiyorsa
          const needsReset = userTask && userTask.reset_at && new Date(userTask.reset_at) < today;

          const is_completed = progress >= task.requirement_value;
          const is_claimed = needsReset ? false : (userTask?.is_claimed || false);

          return {
            ...task,
            progress: Math.min(progress, task.requirement_value),
            is_completed,
            is_claimed,
            actionType: (is_completed && !is_claimed) ? 'claim' : 'navigate',
            navigationTarget: this.getNavigationTarget(task.requirement_type),
          } as TaskWithProgress;
        })
      );

      return { data: tasksWithProgress, error: null };
    } catch (error) {
      console.error('Get daily tasks error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Aylık görevleri real-time progress ile getir
   */
  async getMonthlyTasks(userId: string): Promise<{ data: TaskWithProgress[] | null; error: Error | null }> {
    try {
      const [tasksResult, userTasksResult] = await Promise.all([
        this.getTasks('monthly'),
        supabase
          .from('user_tasks')
          .select('*')
          .eq('user_id', userId)
      ]);

      if (tasksResult.error) throw tasksResult.error;
      const tasks = tasksResult.data || [];

      // Ayın başlangıcı
      const monthStart = new Date();
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);
      const monthStartStr = monthStart.toISOString();

      const tasksWithProgress: TaskWithProgress[] = await Promise.all(
        tasks.map(async (task) => {
          const progress = await this.calculateTaskProgress(userId, task, monthStartStr, 'monthly');
          const userTask = userTasksResult.data?.find(ut => ut.task_id === task.id);

          // Reset kontrolü - aylık görev ve ay değişmişse
          const currentMonth = new Date().getMonth();
          const resetMonth = userTask?.reset_at ? new Date(userTask.reset_at).getMonth() : null;
          const needsReset = userTask && resetMonth !== null && resetMonth !== currentMonth;

          const is_completed = progress >= task.requirement_value;
          const is_claimed = needsReset ? false : (userTask?.is_claimed || false);

          return {
            ...task,
            progress: Math.min(progress, task.requirement_value),
            is_completed,
            is_claimed,
            actionType: (is_completed && !is_claimed) ? 'claim' : 'navigate',
            navigationTarget: this.getNavigationTarget(task.requirement_type),
          } as TaskWithProgress;
        })
      );

      return { data: tasksWithProgress, error: null };
    } catch (error) {
      console.error('Get monthly tasks error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Görev tipine göre ilerlemeyi hesapla
   */
  async calculateTaskProgress(userId: string, task: Task, startDate: string, period: 'daily' | 'monthly'): Promise<number> {
    try {
      switch (task.requirement_type) {
        case 'prediction_count':
          return await this.countPredictions(userId, startDate);

        case 'correct_predictions':
          return await this.countCorrectPredictions(userId, startDate);

        case 'coupon_count':
          return await this.countCoupons(userId, startDate);

        case 'login_streak':
          return await this.countLoginDays(userId, period);

        case 'daily_games':
          return await this.countDailyGamesCompleted(userId, startDate);

        case 'league_prediction':
          return await this.countLeaguePredictions(userId, startDate);

        case 'league_complete':
          return await this.countCompletedLeagues(userId, startDate);

        case 'daily_games_bonus':
          return await this.countDailyGamesBonuses(userId, startDate);

        default:
          return 0;
      }
    } catch (error) {
      console.error(`Calculate progress error for ${task.requirement_type}:`, error);
      return 0;
    }
  },

  /**
   * Navigasyon hedefini belirle
   */
  getNavigationTarget(requirementType: string): '/home' | '/leagues' | '/gamehub' | null {
    switch (requirementType) {
      case 'coupon_count':
      case 'prediction_count':
      case 'correct_predictions':
        return '/home';

      case 'league_prediction':
      case 'league_complete':
        return '/leagues';

      case 'daily_games':
      case 'daily_games_bonus':
        return '/gamehub';

      case 'login_streak':
        return null; // Giriş görevi için navigasyon yok

      default:
        return '/home';
    }
  },

  // =====================================================
  // PROGRESS CALCULATION HELPERS
  // =====================================================

  async countPredictions(userId: string, startDate: string): Promise<number> {
    const { count, error } = await supabase
      .from('predictions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', startDate);

    return error ? 0 : (count || 0);
  },

  async countCorrectPredictions(userId: string, startDate: string): Promise<number> {
    const { count, error } = await supabase
      .from('predictions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'won')
      .gte('resolved_at', startDate);

    return error ? 0 : (count || 0);
  },

  async countCoupons(userId: string, startDate: string): Promise<number> {
    const { count, error } = await supabase
      .from('coupons')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', startDate);

    return error ? 0 : (count || 0);
  },

  async countLoginDays(userId: string, period: 'daily' | 'monthly'): Promise<number> {
    const now = new Date();
    let startDate: string;

    if (period === 'daily') {
      // Günlük için bugün giriş yapılıp yapılmadığını kontrol et
      startDate = now.toISOString().split('T')[0];
      const { count, error } = await supabase
        .from('user_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('session_date', startDate);

      return error ? 0 : (count || 0);
    } else {
      // Aylık için bu aydaki giriş günlerini say
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      startDate = monthStart.toISOString().split('T')[0];

      const { count, error } = await supabase
        .from('user_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('session_date', startDate);

      return error ? 0 : (count || 0);
    }
  },

  async countDailyGamesCompleted(userId: string, startDate: string): Promise<number> {
    // user_daily_games tablosundan tamamlanan oyun sayısını hesapla
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('user_daily_games')
      .select('daily_progress')
      .eq('user_id', userId)
      .eq('date', today)
      .single();

    return error ? 0 : (data?.daily_progress || 0);
  },

  async countLeaguePredictions(userId: string, startDate: string): Promise<number> {
    // league_members tablosundan kullanıcının lig tahminlerini say
    const { data, error } = await supabase
      .from('league_members')
      .select('total_predictions')
      .eq('user_id', userId)
      .gte('joined_at', startDate);

    if (error || !data) return 0;

    // Bugünkü tahminleri say (basit yaklaşım: aktif liglerdeki tahminler)
    const total = data.reduce((sum, m) => sum + (m.total_predictions || 0), 0);
    return total > 0 ? 1 : 0; // En az 1 tahmin varsa görev tamamlanır
  },

  async countCompletedLeagues(userId: string, startDate: string): Promise<number> {
    // Tamamlanan liglerdeki üyelikleri say
    const { count, error } = await supabase
      .from('league_members')
      .select(`
        *,
        leagues!inner (status)
      `, { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('leagues.status', 'completed')
      .gte('joined_at', startDate);

    return error ? 0 : (count || 0);
  },

  async countDailyGamesBonuses(userId: string, startDate: string): Promise<number> {
    // Günlük bonus alınan gün sayısını say
    const { count, error } = await supabase
      .from('user_daily_games')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('daily_bonus_claimed', true)
      .gte('date', startDate.split('T')[0]);

    return error ? 0 : (count || 0);
  },

  // =====================================================
  // CLAIM REWARD
  // =====================================================

  /**
   * Tamamlanan görevin ödülünü al
   */
  async claimTaskReward(userId: string, taskId: string) {
    try {
      // Görevi getir
      const { data: task, error: taskError } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', taskId)
        .single();

      if (taskError || !task) {
        throw new Error('Görev bulunamadı');
      }

      // user_tasks kaydını kontrol et veya oluştur
      const { data: existingUserTask } = await supabase
        .from('user_tasks')
        .select('*')
        .eq('user_id', userId)
        .eq('task_id', taskId)
        .single();

      if (existingUserTask?.is_claimed) {
        throw new Error('Ödül zaten alındı');
      }

      // Krediyi ekle
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      await supabase
        .from('profiles')
        .update({ credits: (profile?.credits || 0) + task.reward_credits })
        .eq('id', userId);

      // user_tasks güncelle veya oluştur
      const now = new Date().toISOString();
      const resetAt = task.type === 'daily'
        ? new Date(new Date().setDate(new Date().getDate() + 1)).toISOString()
        : new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString();

      if (existingUserTask) {
        await supabase
          .from('user_tasks')
          .update({
            is_completed: true,
            is_claimed: true,
            completed_at: now,
            claimed_at: now,
            reset_at: resetAt,
          })
          .eq('id', existingUserTask.id);
      } else {
        await supabase
          .from('user_tasks')
          .insert({
            user_id: userId,
            task_id: taskId,
            progress: task.requirement_value,
            is_completed: true,
            is_claimed: true,
            completed_at: now,
            claimed_at: now,
            reset_at: resetAt,
          });
      }

      return {
        data: {
          credits: task.reward_credits,
          experience: task.reward_experience
        },
        error: null
      };
    } catch (error) {
      console.error('Claim task reward error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Günlük görevleri sıfırla (gece 12'de çağrılmalı)
   */
  async resetDailyTasks(userId: string) {
    try {
      const { data: dailyTasks } = await this.getTasks('daily');
      if (!dailyTasks) return;

      const taskIds = dailyTasks.map(t => t.id);

      await supabase
        .from('user_tasks')
        .update({
          progress: 0,
          is_completed: false,
          is_claimed: false,
          reset_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .in('task_id', taskIds);

      return { success: true };
    } catch (error) {
      console.error('Reset daily tasks error:', error);
      return { success: false };
    }
  },

  /**
   * Aylık görevleri sıfırla (ay başında çağrılmalı)
   */
  async resetMonthlyTasks(userId: string) {
    try {
      const { data: monthlyTasks } = await this.getTasks('monthly');
      if (!monthlyTasks) return;

      const taskIds = monthlyTasks.map(t => t.id);

      await supabase
        .from('user_tasks')
        .update({
          progress: 0,
          is_completed: false,
          is_claimed: false,
          reset_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .in('task_id', taskIds);

      return { success: true };
    } catch (error) {
      console.error('Reset monthly tasks error:', error);
      return { success: false };
    }
  },
};