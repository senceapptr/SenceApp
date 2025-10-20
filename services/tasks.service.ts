import { supabase } from '@/lib/supabase';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  type: 'daily' | 'weekly' | 'monthly' | 'achievement';
  requirement_type: string;
  requirement_value: number;
  reward_credits: number;
  reward_experience: number;
  icon: string | null;
  is_active: boolean;
  reset_period: 'daily' | 'weekly' | 'monthly' | 'never' | null;
  created_at: string;
}

export interface UserTask {
  id: string;
  user_id: string;
  task_id: string;
  progress: number;
  is_completed: boolean;
  is_claimed: boolean;
  completed_at: string | null;
  claimed_at: string | null;
  reset_at: string | null;
  created_at: string;
}

/**
 * Tasks Service
 * Görev işlemleri
 */
export const tasksService = {
  /**
   * Tüm görevleri getir
   */
  async getAllTasks() {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('is_active', true)
        .order('type')
        .order('reward_credits', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Get all tasks error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Kullanıcının görevlerini getir
   */
  async getUserTasks(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_tasks')
        .select(`
          *,
          tasks (
            id,
            title,
            description,
            type,
            requirement_type,
            requirement_value,
            reward_credits,
            reward_experience,
            icon,
            reset_period
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Get user tasks error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Günlük görevleri getir
   */
  async getDailyTasks(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_tasks')
        .select(`
          *,
          tasks!inner (
            id,
            title,
            description,
            type,
            requirement_type,
            requirement_value,
            reward_credits,
            reward_experience,
            icon
          )
        `)
        .eq('user_id', userId)
        .eq('tasks.type', 'daily')
        .order('is_completed');

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Get daily tasks error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Görev ilerlemesini güncelle
   */
  async updateTaskProgress(userId: string, taskId: string, progress: number) {
    try {
      // Görev bilgisini al
      const { data: task } = await supabase
        .from('tasks')
        .select('requirement_value')
        .eq('id', taskId)
        .single();

      const isCompleted = task && progress >= task.requirement_value;

      const { data, error } = await supabase
        .from('user_tasks')
        .update({
          progress,
          is_completed: isCompleted,
          completed_at: isCompleted ? new Date().toISOString() : null,
        })
        .eq('user_id', userId)
        .eq('task_id', taskId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Update task progress error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Görev ödülünü talep et
   */
  async claimTaskReward(userId: string, taskId: string) {
    try {
      // Görev bilgilerini al
      const { data: userTask } = await supabase
        .from('user_tasks')
        .select(`
          *,
          tasks (
            reward_credits,
            reward_experience
          )
        `)
        .eq('user_id', userId)
        .eq('task_id', taskId)
        .single();

      if (!userTask || !userTask.is_completed || userTask.is_claimed) {
        throw new Error('Task cannot be claimed');
      }

      // Ödülü işaretle
      const { error: updateError } = await supabase
        .from('user_tasks')
        .update({
          is_claimed: true,
          claimed_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .eq('task_id', taskId);

      if (updateError) throw updateError;

      // Kullanıcıya kredi ve XP ekle
      const { error: creditsError } = await supabase.rpc('increase_user_credits', {
        user_id: userId,
        amount: userTask.tasks.reward_credits,
      });

      if (creditsError) throw creditsError;

      const { error: xpError } = await supabase.rpc('increase_user_experience', {
        user_id: userId,
        amount: userTask.tasks.reward_experience,
      });

      if (xpError) throw xpError;

      return { error: null };
    } catch (error) {
      console.error('Claim task reward error:', error);
      return { error: error as Error };
    }
  },

  /**
   * Kullanıcı için eksik görevleri oluştur
   */
  async initializeUserTasks(userId: string) {
    try {
      // Tüm aktif görevleri al
      const { data: allTasks } = await supabase
        .from('tasks')
        .select('id')
        .eq('is_active', true);

      if (!allTasks) return { error: null };

      // Mevcut user_tasks'ları al
      const { data: existingTasks } = await supabase
        .from('user_tasks')
        .select('task_id')
        .eq('user_id', userId);

      const existingTaskIds = existingTasks?.map((t) => t.task_id) || [];

      // Eksik görevleri bul
      const missingTasks = allTasks.filter(
        (task) => !existingTaskIds.includes(task.id)
      );

      if (missingTasks.length === 0) return { error: null };

      // Eksik görevleri oluştur
      const userTasks = missingTasks.map((task) => ({
        user_id: userId,
        task_id: task.id,
        progress: 0,
        is_completed: false,
        is_claimed: false,
      }));

      const { error } = await supabase.from('user_tasks').insert(userTasks);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Initialize user tasks error:', error);
      return { error: error as Error };
    }
  },
};

