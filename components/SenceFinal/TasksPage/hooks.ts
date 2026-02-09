import { useMemo, useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { tasksService, TaskWithProgress } from '@/services/tasks.service';
import { Task, TaskTab } from './types';

export function useTasks() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TaskTab>('daily');
  const [dailyTasks, setDailyTasks] = useState<Task[]>([]);
  const [monthlyTasks, setMonthlyTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [loginDays, setLoginDays] = useState<number[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<string>('');

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

  // Countdown timer for daily reset
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setDate(midnight.getDate() + 1);
      midnight.setHours(0, 0, 0, 0);

      const diff = midnight.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeRemaining(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  // TaskWithProgress -> Task mapping helper
  const mapToTask = (taskWithProgress: TaskWithProgress, isDaily: boolean): Task => ({
    id: taskWithProgress.id,
    title: taskWithProgress.title,
    description: taskWithProgress.description || '',
    progress: taskWithProgress.progress,
    maxProgress: taskWithProgress.requirement_value,
    reward: taskWithProgress.reward_credits,
    icon: taskWithProgress.icon,
    completed: taskWithProgress.is_completed,
    claimed: taskWithProgress.is_claimed,
    timeLeft: isDaily ? timeRemaining : `${daysInMonth - today} gün`,
    actionType: taskWithProgress.actionType,
    navigationTarget: taskWithProgress.navigationTarget,
  });

  // Load tasks data from backend
  const loadTasksData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Record user session for login tracking
      await tasksService.recordUserSession(user.id);

      // Load daily tasks, monthly tasks, and login days in parallel
      const [dailyResult, monthlyResult, loginDaysResult] = await Promise.all([
        tasksService.getDailyTasks(user.id),
        tasksService.getMonthlyTasks(user.id),
        tasksService.getUserLoginDays(user.id, currentYear, currentMonth),
      ]);

      // Map daily tasks
      if (dailyResult.data) {
        const mapped = dailyResult.data.map(t => mapToTask(t, true));
        setDailyTasks(mapped);
      }

      // Map monthly tasks
      if (monthlyResult.data) {
        const mapped = monthlyResult.data.map(t => mapToTask(t, false));
        setMonthlyTasks(mapped);
      }

      // Set login days
      if (loginDaysResult.data) {
        setLoginDays(loginDaysResult.data);
      }

    } catch (err) {
      console.error('Tasks data load error:', err);
      Alert.alert('Hata', 'Görev verileri yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  }, [user, currentMonth, currentYear, today, timeRemaining, daysInMonth]);

  // Load data on mount and when user changes
  useEffect(() => {
    loadTasksData();
  }, [user]);

  // Claim task reward
  const claimReward = useCallback(async (taskId: string) => {
    if (!user) return;

    try {
      const result = await tasksService.claimTaskReward(user.id, taskId);

      if (result.data) {
        Alert.alert(
          '🎉 Tebrikler!',
          `${result.data.credits} kredi kazandınız!`,
          [{ text: 'Tamam', onPress: () => loadTasksData() }]
        );
      } else if (result.error) {
        Alert.alert('Hata', result.error.message);
      }
    } catch (err) {
      console.error('Claim reward error:', err);
      Alert.alert('Hata', 'Ödül alınırken bir hata oluştu');
    }
  }, [user, loadTasksData]);

  // Handle task action (navigate or claim)
  const handleTaskAction = useCallback((task: Task) => {
    if (task.actionType === 'claim') {
      claimReward(task.id);
    }
    // Navigation will be handled by the parent component
  }, [claimReward]);

  // Current tasks based on active tab
  const currentTasks = activeTab === 'daily' ? dailyTasks : monthlyTasks;
  const completedTasks = currentTasks.filter(t => t.completed).length;
  const claimedTasks = currentTasks.filter(t => t.claimed).length;

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
    currentTasks,
    completedTasks,
    claimedTasks,
    timeRemaining,
    // actions
    handleTaskAction,
    claimReward,
    loadTasksData,
  };
}
