import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { tasksService, TaskWithProgress } from '@/services/tasks.service';
import { Task, TaskTab } from './types';

const SECOND_MS = 1000;
const MINUTE_MS = 60 * SECOND_MS;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

const formatTwoDigit = (value: number) => value.toString().padStart(2, '0');

const formatDailyCountdownText = (diffMs: number) => {
  const safeDiff = Math.max(0, diffMs);
  const days = Math.floor(safeDiff / DAY_MS);
  const hours = Math.floor((safeDiff % DAY_MS) / HOUR_MS) + (days * 24);
  const minutes = Math.floor((safeDiff % HOUR_MS) / MINUTE_MS);
  const seconds = Math.floor((safeDiff % MINUTE_MS) / SECOND_MS);

  if (hours > 0) {
    return `${formatTwoDigit(hours)} saat ${formatTwoDigit(minutes)} dakika`;
  }

  return `${formatTwoDigit(minutes)} dakika ${formatTwoDigit(seconds)} saniye`;
};

const formatMonthlyCountdownText = (diffMs: number) => {
  const safeDiff = Math.max(0, diffMs);
  const days = Math.floor(safeDiff / DAY_MS);
  const hours = Math.floor((safeDiff % DAY_MS) / HOUR_MS);
  const minutes = Math.floor((safeDiff % HOUR_MS) / MINUTE_MS);
  const seconds = Math.floor((safeDiff % MINUTE_MS) / SECOND_MS);

  if (days > 0) {
    return `${days} gün ${formatTwoDigit(hours)} saat`;
  }

  if (hours > 0) {
    return `${formatTwoDigit(hours)} saat ${formatTwoDigit(minutes)} dakika`;
  }

  return `${formatTwoDigit(minutes)} dakika ${formatTwoDigit(seconds)} saniye`;
};

export function useTasks() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TaskTab>('daily');
  const [dailyTasks, setDailyTasks] = useState<Task[]>([]);
  const [monthlyTasks, setMonthlyTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [loginDays, setLoginDays] = useState<number[]>([]);
  const [dailyResetRemaining, setDailyResetRemaining] = useState<string>('00 dakika 00 saniye');
  const [monthlyResetRemaining, setMonthlyResetRemaining] = useState<string>('0 gün 00 saat');

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

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();

      const nextDay = new Date(now);
      nextDay.setDate(nextDay.getDate() + 1);
      nextDay.setHours(0, 0, 0, 0);

      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

      setDailyResetRemaining(formatDailyCountdownText(nextDay.getTime() - now.getTime()));
      setMonthlyResetRemaining(formatMonthlyCountdownText(nextMonth.getTime() - now.getTime()));
    };

    updateTimer();
    const interval = setInterval(updateTimer, SECOND_MS);

    return () => clearInterval(interval);
  }, []);

  const mapToTask = (taskWithProgress: TaskWithProgress): Task => ({
    id: taskWithProgress.id,
    title: taskWithProgress.title,
    description: taskWithProgress.description || '',
    progress: taskWithProgress.progress,
    maxProgress: taskWithProgress.requirement_value,
    reward: taskWithProgress.reward_credits,
    icon: taskWithProgress.icon || undefined,
    requirementType: taskWithProgress.requirement_type,
    completed: taskWithProgress.is_completed,
    claimed: taskWithProgress.is_claimed,
    actionType: taskWithProgress.actionType,
    navigationTarget: taskWithProgress.navigationTarget,
  });

  const loadTasksData = useCallback(async () => {
    if (!user) {
      setDailyTasks([]);
      setMonthlyTasks([]);
      setLoginDays([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      await tasksService.recordUserSession(user.id);

      const [dailyResult, monthlyResult, loginDaysResult] = await Promise.all([
        tasksService.getDailyTasks(user.id),
        tasksService.getMonthlyTasks(user.id),
        tasksService.getUserLoginDays(user.id, currentYear, currentMonth),
      ]);

      if (dailyResult.data) {
        setDailyTasks(dailyResult.data.map(mapToTask));
      }

      if (monthlyResult.data) {
        setMonthlyTasks(monthlyResult.data.map(mapToTask));
      }

      if (loginDaysResult.data) {
        setLoginDays(loginDaysResult.data);
      }
    } catch (err) {
      console.error('Tasks data load error:', err);
      Alert.alert('Hata', 'Görev verileri yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  }, [currentMonth, currentYear, user]);

  useEffect(() => {
    loadTasksData();
  }, [loadTasksData]);

  const claimReward = useCallback(async (taskId: string) => {
    if (!user) return;

    try {
      const result = await tasksService.claimTaskReward(user.id, taskId);

      if (result.data) {
        Alert.alert(
          'Tebrikler',
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

  const currentTasks = activeTab === 'daily' ? dailyTasks : monthlyTasks;
  const completedTasks = currentTasks.filter(t => t.completed).length;
  const currentResetLabel = activeTab === 'daily' ? 'Günlük sıfırlama' : 'Aylık sıfırlama';
  const currentResetRemaining = activeTab === 'daily' ? dailyResetRemaining : monthlyResetRemaining;

  return {
    activeTab,
    setActiveTab,
    loading,
    currentMonth,
    currentYear,
    daysInMonth,
    firstDayOfMonth,
    today,
    monthNames,
    dayNames,
    loginDays,
    dailyTasks,
    monthlyTasks,
    currentTasks,
    completedTasks,
    currentResetLabel,
    currentResetRemaining,
    claimReward,
    loadTasksData,
  };
}
