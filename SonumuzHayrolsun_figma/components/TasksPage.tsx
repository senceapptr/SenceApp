import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Task {
  id: string;
  title: string;
  description: string;
  progress: number;
  maxProgress: number;
  reward: number;
  completed: boolean;
  timeLeft?: string;
}

interface TasksPageProps {
  onBack: () => void;
}

export function TasksPage({ onBack }: TasksPageProps) {
  const [activeTab, setActiveTab] = useState<'daily' | 'monthly'>('daily');
  
  // Calendar data - simulating user login days for current month
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  // Simulate login days (3, 5, 7, 10, 12, 15, 18, 20, 22, 25, 28)
  const loginDays = [3, 5, 7, 10, 12, 15, 18, 20, 22, 25, 28];
  const today = currentDate.getDate();
  
  const monthNames = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];
  
  const dayNames = ['P', 'S', 'Ç', 'P', 'C', 'C', 'P'];

  const dailyTasks: Task[] = [
    {
      id: 'daily-login',
      title: 'Uygulamaya Giriş Yap',
      description: 'Günlük girişini tamamla',
      progress: 1,
      maxProgress: 1,
      reward: 10,
      completed: true
    },
    {
      id: 'daily-coupon',
      title: 'Kupon Yap',
      description: '1 kupon oluştur ve oyna',
      progress: 0,
      maxProgress: 1,
      reward: 25,
      completed: false,
      timeLeft: '18:42:15'
    },
    {
      id: 'daily-trivia',
      title: 'Trivia Oyna',
      description: '3 trivia sorusunu yanıtla',
      progress: 1,
      maxProgress: 3,
      reward: 20,
      completed: false,
      timeLeft: '18:42:15'
    },
    {
      id: 'daily-swipe',
      title: 'Swipe Kupon Yap',
      description: 'Hızlı tahmin modunda 5 tahmin yap',
      progress: 3,
      maxProgress: 5,
      reward: 30,
      completed: false,
      timeLeft: '18:42:15'
    },
    {
      id: 'daily-league',
      title: 'Lig Bahsi Yap',
      description: 'Liglerden 1 bahis yap',
      progress: 0,
      maxProgress: 1,
      reward: 35,
      completed: false,
      timeLeft: '18:42:15'
    }
  ];

  const monthlyTasks: Task[] = [
    {
      id: 'monthly-streak-7',
      title: '7 Günlük Giriş',
      description: '7 gün üst üste uygulamaya gir',
      progress: 3,
      maxProgress: 7,
      reward: 100,
      completed: false,
      timeLeft: '25 gün'
    },
    {
      id: 'monthly-streak-14',
      title: '14 Günlük Giriş',
      description: '14 gün üst üste uygulamaya gir',
      progress: 3,
      maxProgress: 14,
      reward: 250,
      completed: false,
      timeLeft: '25 gün'
    },
    {
      id: 'monthly-streak-28',
      title: '28 Günlük Giriş',
      description: '28 gün üst üste uygulamaya gir',
      progress: 3,
      maxProgress: 28,
      reward: 500,
      completed: false,
      timeLeft: '25 gün'
    },
    {
      id: 'monthly-league-1st',
      title: 'Lig\'de 1. Ol',
      description: 'Herhangi bir ligde 1. sırayı yakala',
      progress: 2,
      maxProgress: 1,
      reward: 300,
      completed: false,
      timeLeft: '25 gün'
    }
  ];

  const currentTasks = activeTab === 'daily' ? dailyTasks : monthlyTasks;
  const completedTasks = currentTasks.filter(task => task.completed).length;
  const totalTasks = currentTasks.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F3F5] via-white to-[#432870]/5">
      {/* Header */}
      <div className="bg-white border-b border-[#F2F3F5] sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-[#F2F3F5] flex items-center justify-center hover:bg-[#432870]/10 transition-colors"
          >
            <svg className="w-5 h-5 text-[#202020]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="text-center">
            <h1 className="text-[#202020] text-lg font-black">Görevler</h1>
            <p className="text-[#432870] text-xs font-bold">
              {completedTasks}/{totalTasks} tamamlandı
            </p>
          </div>

          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#C9F158] to-[#432870] flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-4 pb-4">
          <div className="w-full bg-[#F2F3F5] rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#C9F158] to-[#432870] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(completedTasks / totalTasks) * 100}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-[#432870] text-xs font-bold">
              İlerleme: %{Math.round((completedTasks / totalTasks) * 100)}
            </span>
            {activeTab === 'daily' && (
              <span className="text-[#B29EFD] text-xs font-bold">
                ⏰ 18:42:15 kaldı
              </span>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#F2F3F5]">
          <button
            onClick={() => setActiveTab('daily')}
            className={`flex-1 py-3 px-4 text-center relative transition-colors ${
              activeTab === 'daily'
                ? 'text-[#432870] font-bold'
                : 'text-[#202020]/60 font-medium'
            }`}
          >
            Günlük Görevler
            {activeTab === 'daily' && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#C9F158] to-[#432870]"
                layoutId="activeTab"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('monthly')}
            className={`flex-1 py-3 px-4 text-center relative transition-colors ${
              activeTab === 'monthly'
                ? 'text-[#432870] font-bold'
                : 'text-[#202020]/60 font-medium'
            }`}
          >
            Aylık Görevler
            {activeTab === 'monthly' && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#C9F158] to-[#432870]"
                layoutId="activeTab"
              />
            )}
          </button>
        </div>
      </div>

      {/* Monthly Calendar - Enhanced */}
      {activeTab === 'monthly' && (
        <div className="p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-white via-[#432870]/5 to-white rounded-3xl border-2 border-[#432870]/20 p-6 mb-6 shadow-xl"
            style={{
              boxShadow: '0 20px 40px rgba(67, 40, 112, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)'
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-[#432870] font-black text-lg mb-1">
                  📅 {monthNames[currentMonth]} {currentYear}
                </h3>
                <p className="text-[#202020]/60 text-sm font-medium">
                  Aylık giriş takibin
                </p>
              </div>
              <div className="text-right">
                <div className="bg-gradient-to-r from-[#C9F158] to-[#432870] text-white px-4 py-2 rounded-2xl">
                  <div className="font-black text-lg">
                    {loginDays.filter(day => day <= today).length}
                  </div>
                  <div className="text-xs font-medium opacity-90">
                    gün giriş
                  </div>
                </div>
              </div>
            </div>
            
            {/* Calendar Grid - Enhanced */}
            <div className="bg-[#432870]/5 rounded-2xl p-4 mb-4">
              <div className="grid grid-cols-7 gap-2 mb-3">
                {dayNames.map((day, index) => (
                  <div key={index} className="text-center text-[#432870] text-sm font-black py-2">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-2">
              {/* Empty cells for days before month starts */}
              {Array.from({ length: firstDayOfMonth }, (_, index) => (
                <div key={`empty-${index}`} className="h-8" />
              ))}
              
              {/* Days of the month */}
              {Array.from({ length: daysInMonth }, (_, index) => {
                const day = index + 1;
                const isToday = day === today;
                const hasLogin = loginDays.includes(day) && day <= today;
                const isFuture = day > today;
                
                return (
                  <motion.div
                    key={day}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.02 }}
                    className={`h-10 w-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all relative ${
                      isToday
                        ? 'bg-gradient-to-r from-[#C9F158] to-[#432870] text-white shadow-lg transform scale-110'
                        : hasLogin
                        ? 'bg-[#C9F158] text-[#432870] shadow-md hover:shadow-lg transform hover:scale-105'
                        : isFuture
                        ? 'bg-white/50 text-[#202020]/40 border border-[#F2F3F5]'
                        : 'bg-white text-[#202020]/60 hover:bg-[#432870]/10 border border-[#F2F3F5] hover:border-[#432870]/20'
                    }`}
                    whileHover={!isFuture ? { scale: isToday ? 1.1 : 1.05 } : {}}
                  >
                    {day}
                    {hasLogin && !isToday && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-3 h-3 bg-[#432870] rounded-full flex items-center justify-center"
                      >
                        <span className="text-white text-xs">✓</span>
                      </motion.div>
                    )}
                    {isToday && (
                      <motion.div
                        animate={{ 
                          scale: [1, 1.2, 1],
                          rotate: [0, 360]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center"
                      >
                        <span className="text-[#432870] text-xs">⭐</span>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#432870]/10">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#C9F158] rounded-full"></div>
                <span className="text-xs text-[#202020]/60">Giriş Yapılan Günler</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-r from-[#C9F158] to-[#432870] rounded-full"></div>
                <span className="text-xs text-[#202020]/60">Bugün</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Tasks List */}
      <div className="p-4 space-y-3">
        <AnimatePresence mode="wait">
          {currentTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`relative overflow-hidden rounded-2xl border-2 transition-all ${
                task.completed
                  ? 'bg-gradient-to-r from-[#C9F158]/20 to-[#432870]/20 border-[#C9F158]/30'
                  : 'bg-white border-[#F2F3F5] hover:border-[#432870]/20'
              }`}
            >
              {/* Completed Shine Effect */}
              {task.completed && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
                />
              )}

              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-bold text-sm ${
                        task.completed ? 'text-[#432870]' : 'text-[#202020]'
                      }`}>
                        {task.title}
                      </h3>
                      {task.completed && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-5 h-5 bg-[#C9F158] rounded-full flex items-center justify-center"
                        >
                          <svg className="w-3 h-3 text-[#432870]" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                          </svg>
                        </motion.div>
                      )}
                    </div>
                    <p className="text-[#202020]/60 text-xs font-medium mb-2">
                      {task.description}
                    </p>
                    
                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[#432870] text-xs font-bold">
                          {task.progress}/{task.maxProgress}
                        </span>
                        <span className="text-[#202020]/60 text-xs">
                          {Math.round((task.progress / task.maxProgress) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-[#F2F3F5] rounded-full h-1.5 overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full transition-all duration-500 ${
                            task.completed
                              ? 'bg-gradient-to-r from-[#C9F158] to-[#432870]'
                              : 'bg-[#B29EFD]'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((task.progress / task.maxProgress) * 100, 100)}%` }}
                          transition={{ duration: 1, delay: index * 0.2 }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Reward */}
                  <div className="ml-4 text-right">
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                      task.completed
                        ? 'bg-[#C9F158] text-[#432870]'
                        : 'bg-[#432870] text-white'
                    }`}>
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/>
                      </svg>
                      {task.reward}
                    </div>
                    {task.timeLeft && !task.completed && (
                      <p className="text-[#B29EFD] text-xs font-medium mt-1">
                        ⏰ {task.timeLeft}
                      </p>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                {!task.completed && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full mt-3 py-2 bg-gradient-to-r from-[#432870] to-[#B29EFD] text-white font-bold text-sm rounded-xl hover:shadow-lg transition-all"
                  >
                    {task.progress > 0 ? 'Devam Et' : 'Başla'}
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Bottom Summary */}
      <div className="p-4 bg-white border-t border-[#F2F3F5] mt-4">
        <div className="bg-gradient-to-r from-[#432870]/10 to-[#B29EFD]/10 rounded-2xl p-4 border border-[#432870]/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[#432870] font-black text-sm">
                {activeTab === 'daily' ? 'Günlük Toplam' : 'Aylık Toplam'}
              </h3>
              <p className="text-[#202020]/60 text-xs font-medium">
                {completedTasks}/{totalTasks} görev tamamlandı
              </p>
            </div>
            <div className="text-right">
              <div className="text-[#432870] font-black text-lg">
                +{currentTasks.filter(t => t.completed).reduce((sum, t) => sum + t.reward, 0)}
              </div>
              <p className="text-[#202020]/60 text-xs font-medium">kredi kazandın</p>
            </div>
          </div>
          
          {completedTasks === totalTasks && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 p-3 bg-gradient-to-r from-[#C9F158] to-[#432870] rounded-xl text-center"
            >
              <p className="text-white font-black text-sm">
                🎉 Tüm görevleri tamamladın! Harikasın!
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}