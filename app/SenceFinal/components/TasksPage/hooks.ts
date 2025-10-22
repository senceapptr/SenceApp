import { useMemo, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { tasksService } from '@/services';
import { Task, TaskTab } from './types';

export function useTasks() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TaskTab>('daily');
  const [dailyTasks, setDailyTasks] = useState<Task[]>([]);
  const [monthlyTasks, setMonthlyTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [loginDays, setLoginDays] = useState<number[]>([]);

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const today = currentDate.getDate();

  const monthNames = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];

  const dayNames = ['P', 'S', 'Ç', 'P', 'C', 'C', 'P'];

  // Backend'den görev verilerini yükle
  const loadTasksData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      console.log('Loading tasks for user:', user.id);
      
      // Paralel olarak günlük ve aylık görevleri yükle
      const [dailyResult, monthlyResult, loginDaysResult] = await Promise.all([
        tasksService.getDailyTasks(user.id),
        tasksService.getMonthlyTasks(user.id),
        tasksService.getUserLoginDays(user.id, currentYear, currentMonth),
      ]);

      console.log('Daily tasks result:', dailyResult);
      console.log('Monthly tasks result:', monthlyResult);
      console.log('Login days result:', loginDaysResult);
      
      // Debug monthly tasks specifically
      console.log('Monthly tasks data length:', monthlyResult.data?.length || 0);
      console.log('Monthly tasks error:', monthlyResult.error);

      // Günlük görevler
      if (dailyResult.data && dailyResult.data.length > 0) {
        console.log('Using database daily tasks:', dailyResult.data.length);
        const mappedDailyTasks: Task[] = dailyResult.data.map((progress: any) => ({
          id: progress.task_id,
          title: progress.tasks?.title || 'Görev',
          description: progress.tasks?.description || '',
          progress: progress.progress || 0,
          maxProgress: progress.tasks?.requirement_value || 1,
          reward: progress.tasks?.reward_credits || 0,
          completed: progress.is_completed || false,
          timeLeft: progress.is_completed ? undefined : '18:42:15', // TODO: Gerçek countdown
        }));
        setDailyTasks(mappedDailyTasks);
      } else {
        console.log('No daily tasks found in database, using mock data');
        setDailyTasks(mockDailyTasks);
      }

      // Aylık görevler
      if (monthlyResult.data && monthlyResult.data.length > 0) {
        console.log('Using database monthly tasks:', monthlyResult.data.length);
        const mappedMonthlyTasks: Task[] = monthlyResult.data.map((progress: any) => ({
          id: progress.task_id,
          title: progress.tasks?.title || 'Görev',
          description: progress.tasks?.description || '',
          progress: progress.progress || 0,
          maxProgress: progress.tasks?.requirement_value || 1,
          reward: progress.tasks?.reward_credits || 0,
          completed: progress.is_completed || false,
          timeLeft: progress.is_completed ? undefined : '25 gün', // TODO: Gerçek countdown
        }));
        setMonthlyTasks(mappedMonthlyTasks);
      } else {
        console.log('No monthly tasks found in database, using mock data');
        setMonthlyTasks(mockMonthlyTasks);
      }

      // Giriş günleri
      if (loginDaysResult.data) {
        setLoginDays(loginDaysResult.data);
      }

    } catch (err) {
      console.error('Tasks data load error:', err);
      Alert.alert('Hata', 'Görev verileri yüklenirken bir hata oluştu');
      // Fallback to mock data
      setDailyTasks(mockDailyTasks);
      setMonthlyTasks(mockMonthlyTasks);
      setLoginDays([3, 5, 7, 10, 12, 15, 18, 20, 22, 25, 28]);
    } finally {
      setLoading(false);
    }
  };

  // Sayfa yüklendiğinde veriyi çek
  useEffect(() => {
    loadTasksData();
  }, [user, currentMonth, currentYear]);

  // Mock data fallback
  const mockDailyTasks: Task[] = [
    { id: 'daily-login', title: 'Uygulamaya Giriş Yap', description: 'Günlük girişini tamamla', progress: 1, maxProgress: 1, reward: 10, completed: true },
    { id: 'daily-coupon', title: 'Kupon Yap', description: '1 kupon oluştur ve oyna', progress: 0, maxProgress: 1, reward: 25, completed: false, timeLeft: '18:42:15' },
    { id: 'daily-trivia', title: 'Trivia Oyna', description: '3 trivia sorusunu yanıtla', progress: 1, maxProgress: 3, reward: 20, completed: false, timeLeft: '18:42:15' },
    { id: 'daily-swipe', title: 'Swipe Kupon Yap', description: 'Hızlı tahmin modunda 5 tahmin yap', progress: 3, maxProgress: 5, reward: 30, completed: false, timeLeft: '18:42:15' },
    { id: 'daily-league', title: 'Lig Bahsi Yap', description: 'Liglerden 1 bahis yap', progress: 0, maxProgress: 1, reward: 35, completed: false, timeLeft: '18:42:15' },
  ];

  const mockMonthlyTasks: Task[] = [
    { id: 'monthly-streak-7', title: '7 Günlük Giriş', description: '7 gün üst üste uygulamaya gir', progress: 3, maxProgress: 7, reward: 100, completed: false, timeLeft: '25 gün' },
    { id: 'monthly-streak-14', title: '14 Günlük Giriş', description: '14 gün üst üste uygulamaya gir', progress: 3, maxProgress: 14, reward: 250, completed: false, timeLeft: '25 gün' },
    { id: 'monthly-streak-28', title: '28 Günlük Giriş', description: '28 gün üst üste uygulamaya gir', progress: 3, maxProgress: 28, reward: 500, completed: false, timeLeft: '25 gün' },
    { id: 'monthly-league-1st', title: "Lig'de 1. Ol", description: 'Herhangi bir ligde 1. sırayı yakala', progress: 2, maxProgress: 1, reward: 300, completed: false, timeLeft: '25 gün' },
  ];

  // Görev tamamlama fonksiyonu
  const completeTask = async (taskId: string, progressIncrement: number = 1) => {
    if (!user) return;

    try {
      const result = await tasksService.updateTaskProgress({
        task_id: taskId,
        user_id: user.id,
        progress_increment: progressIncrement,
      });

      if (result.data) {
        // Verileri yenile
        loadTasksData();
      }
    } catch (err) {
      console.error('Complete task error:', err);
      Alert.alert('Hata', 'Görev tamamlanırken bir hata oluştu');
    }
  };

  return {
    activeTab,
    setActiveTab,
    loading,
    // calendar
    currentMonth,
    currentYear,
    daysInMonth,
    firstDayOfMonth,
    today,
    monthNames,
    dayNames,
    loginDays,
    // data
    dailyTasks,
    monthlyTasks,
    // actions
    completeTask,
    loadTasksData,
  };
}



