import { supabase } from '@/lib/supabase';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  type: 'daily' | 'monthly';
  target_value: number;
  reward_credits: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserTaskProgress {
  id: string;
  user_id: string;
  task_id: string;
  current_progress: number;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  tasks?: Task;
}

export interface CompleteTaskData {
  task_id: string;
  user_id: string;
  progress_increment?: number;
}

/**
 * Tasks Service
 * Görev işlemleri
 */
export const tasksService = {
  /**
   * Tüm aktif görevleri getir
   */
  async getTasks() {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('is_active', true)
        .order('type', { ascending: true })
        .order('created_at', { ascending: true });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Get tasks error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Kullanıcının görev ilerlemesini getir
   */
  async getUserTaskProgress(userId: string) {
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
            requirement_value,
            reward_credits,
            is_active
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Get user task progress error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Kullanıcının günlük görevlerini getir
   */
  async getDailyTasks(userId: string) {
    try {
      console.log('Getting daily tasks for user:', userId);
      
      // Önce tüm aktif günlük görevleri getir
      const { data: allDailyTasks, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .eq('type', 'daily')
        .eq('is_active', true);

      if (tasksError) throw tasksError;
      console.log('All daily tasks:', allDailyTasks);

      // Kullanıcının mevcut görev ilerlemelerini getir
      const { data: userProgress, error: progressError } = await supabase
        .from('user_tasks')
        .select('*')
        .eq('user_id', userId);

      if (progressError) throw progressError;
      console.log('User progress:', userProgress);

      // RLS sorunları nedeniyle doğrudan fallback mekanizmasını kullanıyoruz
      console.log('Using direct fallback mechanism to avoid RLS issues');
      
      // Doğrudan tasks tablosundan veri çek
      const { data: directTasks, error: directError } = await supabase
        .from('tasks')
        .select('*')
        .eq('type', 'daily')
        .eq('is_active', true);

      if (directError) throw directError;
      
      console.log('Direct daily tasks from database:', directTasks?.length || 0);
      
      // Tasks verilerini user_tasks formatına dönüştür
      const mockUserTasks = directTasks?.map(task => ({
        id: `mock-${task.id}`,
        user_id: userId,
        task_id: task.id,
        progress: 0,
        is_completed: false,
        is_claimed: false,
        tasks: task
      })) || [];
      
      console.log('Daily tasks created:', mockUserTasks.length);
      return { data: mockUserTasks, error: null };
    } catch (error) {
      console.error('Get daily tasks error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Kullanıcının aylık görevlerini getir
   */
  async getMonthlyTasks(userId: string) {
    try {
      console.log('Getting monthly tasks for user:', userId);
      
      // Önce tüm aktif aylık görevleri getir
      const { data: allMonthlyTasks, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .eq('type', 'monthly')
        .eq('is_active', true);

      if (tasksError) throw tasksError;
      console.log('All monthly tasks found:', allMonthlyTasks?.length || 0);
      console.log('Monthly tasks details:', allMonthlyTasks);

      // Kullanıcının mevcut görev ilerlemelerini getir
      const { data: userProgress, error: progressError } = await supabase
        .from('user_tasks')
        .select('*')
        .eq('user_id', userId);

      if (progressError) throw progressError;
      console.log('User progress for monthly:', userProgress);

      // RLS sorunları nedeniyle doğrudan fallback mekanizmasını kullanıyoruz
      console.log('Using direct fallback mechanism for monthly tasks to avoid RLS issues');
      
      // Doğrudan tasks tablosundan veri çek
      const { data: directTasks, error: directError } = await supabase
        .from('tasks')
        .select('*')
        .eq('type', 'monthly')
        .eq('is_active', true);

      if (directError) throw directError;
      
      console.log('Direct monthly tasks from database:', directTasks?.length || 0);
      
      // Tasks verilerini user_tasks formatına dönüştür
      const mockUserTasks = directTasks?.map(task => ({
        id: `mock-${task.id}`,
        user_id: userId,
        task_id: task.id,
        progress: 0,
        is_completed: false,
        is_claimed: false,
        tasks: task
      })) || [];
      
      console.log('Monthly tasks created:', mockUserTasks.length);
      return { data: mockUserTasks, error: null };
    } catch (error) {
      console.error('Get monthly tasks error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Görev ilerlemesini güncelle
   */
  async updateTaskProgress(progressData: CompleteTaskData) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User not authenticated');
      }

      // Mevcut ilerlemeyi kontrol et
      const { data: existingProgress, error: progressError } = await supabase
        .from('user_tasks')
        .select('*')
        .eq('user_id', user.id)
        .eq('task_id', progressData.task_id)
        .single();

      if (progressError && progressError.code !== 'PGRST116') {
        throw progressError;
      }

      // Görev detaylarını al
      const { data: task, error: taskError } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', progressData.task_id)
        .single();

      if (taskError) throw taskError;

      const increment = progressData.progress_increment || 1;
      const newProgress = (existingProgress?.progress || 0) + increment;
      const isCompleted = newProgress >= task.requirement_value;

      if (existingProgress) {
        // Mevcut ilerlemeyi güncelle
        const { data, error } = await supabase
          .from('user_tasks')
          .update({
            progress: newProgress,
            is_completed: isCompleted,
            completed_at: isCompleted ? new Date().toISOString() : null,
          })
          .eq('id', existingProgress.id)
          .select()
          .single();

        if (error) throw error;

        // Eğer görev tamamlandıysa kredi ver
        if (isCompleted && !existingProgress.is_completed) {
          await this.rewardUserCredits(user.id, task.reward_credits);
        }

        return { data, error: null };
      } else {
        // Yeni ilerleme kaydı oluştur
        const { data, error } = await supabase
          .from('user_tasks')
          .insert({
            user_id: user.id,
            task_id: progressData.task_id,
            progress: newProgress,
            is_completed: isCompleted,
            completed_at: isCompleted ? new Date().toISOString() : null,
          })
          .select()
          .single();

        if (error) throw error;

        // Eğer görev tamamlandıysa kredi ver
        if (isCompleted) {
          await this.rewardUserCredits(user.id, task.reward_credits);
        }

        return { data, error: null };
      }
    } catch (error) {
      console.error('Update task progress error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Kullanıcıya kredi ver
   */
  async rewardUserCredits(userId: string, credits: number) {
    try {
      // Mevcut krediyi al
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      // Krediyi güncelle
      const { error } = await supabase
        .from('profiles')
        .update({ 
          credits: profile.credits + credits 
        })
        .eq('id', userId);

      if (error) throw error;
      return { data: { credits: profile.credits + credits }, error: null };
    } catch (error) {
      console.error('Reward user credits error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Günlük görevleri sıfırla (günlük görevler için)
   */
  async resetDailyTasks(userId: string) {
    try {
      const { error } = await supabase
        .from('user_tasks')
        .delete()
        .eq('user_id', userId)
        .eq('tasks.type', 'daily');

      if (error) throw error;
      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('Reset daily tasks error:', error);
      return { data: null, error: error as Error };
    }
  },

  /**
   * Kullanıcının giriş günlerini getir (takvim için)
   * Şimdilik mock data döndürüyor, ileride user_activities tablosu eklenebilir
   */
  async getUserLoginDays(userId: string, year: number, month: number) {
    try {
      // Şimdilik mock data döndürüyor
      // İleride user_activities tablosu eklenip bu fonksiyon güncellenebilir
      const mockLoginDays = [3, 5, 7, 10, 12, 15, 18, 20, 22, 25, 28];
      
      return { data: mockLoginDays, error: null };
    } catch (error) {
      console.error('Get user login days error:', error);
      return { data: [], error: error as Error };
    }
  },
};