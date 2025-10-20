import { useMemo, useState } from 'react';
import { Task, TaskTab } from './types';

export function useTasks() {
  const [activeTab, setActiveTab] = useState<TaskTab>('daily');

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

  const loginDays = [3, 5, 7, 10, 12, 15, 18, 20, 22, 25, 28];

  const dailyTasks: Task[] = useMemo(() => ([
    { id: 'daily-login', title: 'Uygulamaya Giriş Yap', description: 'Günlük girişini tamamla', progress: 1, maxProgress: 1, reward: 10, completed: true },
    { id: 'daily-coupon', title: 'Kupon Yap', description: '1 kupon oluştur ve oyna', progress: 0, maxProgress: 1, reward: 25, completed: false, timeLeft: '18:42:15' },
    { id: 'daily-trivia', title: 'Trivia Oyna', description: '3 trivia sorusunu yanıtla', progress: 1, maxProgress: 3, reward: 20, completed: false, timeLeft: '18:42:15' },
    { id: 'daily-swipe', title: 'Swipe Kupon Yap', description: 'Hızlı tahmin modunda 5 tahmin yap', progress: 3, maxProgress: 5, reward: 30, completed: false, timeLeft: '18:42:15' },
    { id: 'daily-league', title: 'Lig Bahsi Yap', description: 'Liglerden 1 bahis yap', progress: 0, maxProgress: 1, reward: 35, completed: false, timeLeft: '18:42:15' },
  ]), []);

  const monthlyTasks: Task[] = useMemo(() => ([
    { id: 'monthly-streak-7', title: '7 Günlük Giriş', description: '7 gün üst üste uygulamaya gir', progress: 3, maxProgress: 7, reward: 100, completed: false, timeLeft: '25 gün' },
    { id: 'monthly-streak-14', title: '14 Günlük Giriş', description: '14 gün üst üste uygulamaya gir', progress: 3, maxProgress: 14, reward: 250, completed: false, timeLeft: '25 gün' },
    { id: 'monthly-streak-28', title: '28 Günlük Giriş', description: '28 gün üst üste uygulamaya gir', progress: 3, maxProgress: 28, reward: 500, completed: false, timeLeft: '25 gün' },
    { id: 'monthly-league-1st', title: "Lig'de 1. Ol", description: 'Herhangi bir ligde 1. sırayı yakala', progress: 2, maxProgress: 1, reward: 300, completed: false, timeLeft: '25 gün' },
  ]), []);

  return {
    activeTab,
    setActiveTab,
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
  };
}



