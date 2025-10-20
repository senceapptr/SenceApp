import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

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
  onMenuToggle: () => void;
}

export function TasksPage({ onBack, onMenuToggle }: TasksPageProps) {
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
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <SafeAreaView edges={['top']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={24} color="#202020" />
          </TouchableOpacity>
          
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Görevler</Text>
            <Text style={styles.headerSubtitle}>
              {completedTasks}/{totalTasks} tamamlandı
            </Text>
          </View>

          <View style={styles.checkIconContainer}>
            <LinearGradient
              colors={['#c61585', '#432870']}
              style={styles.checkIconGradient}
            >
              <Ionicons name="checkmark-circle" size={24} color="white" />
            </LinearGradient>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressSection}>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBg}>
              <LinearGradient
                colors={['#c61585', '#432870']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.progressBarFill, { width: `${(completedTasks / totalTasks) * 100}%` }]}
              />
            </View>
          </View>
          <View style={styles.progressInfo}>
            <Text style={styles.progressText}>
              İlerleme: %{Math.round((completedTasks / totalTasks) * 100)}
            </Text>
            {activeTab === 'daily' && (
              <Text style={styles.timeLeftText}>⏰ 18:42:15 kaldı</Text>
            )}
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'daily' && styles.activeTab]}
            onPress={() => setActiveTab('daily')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === 'daily' && styles.activeTabText]}>
              Günlük Görevler
            </Text>
            {activeTab === 'daily' && (
              <LinearGradient
                colors={['#c61585', '#432870']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.tabIndicator}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'monthly' && styles.activeTab]}
            onPress={() => setActiveTab('monthly')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === 'monthly' && styles.activeTabText]}>
              Aylık Görevler
            </Text>
            {activeTab === 'monthly' && (
              <LinearGradient
                colors={['#c61585', '#432870']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.tabIndicator}
              />
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Monthly Calendar */}
        {activeTab === 'monthly' && (
          <View style={styles.calendarSection}>
            <View style={styles.calendarCard}>
              <View style={styles.calendarHeader}>
                <View>
                  <Text style={styles.calendarTitle}>
                    📅 {monthNames[currentMonth]} {currentYear}
                  </Text>
                  <Text style={styles.calendarSubtitle}>Aylık giriş takibin</Text>
                </View>
                <LinearGradient
                  colors={['#c61585', '#432870']}
                  style={styles.loginBadge}
                >
                  <Text style={styles.loginBadgeNumber}>
                    {loginDays.filter(day => day <= today).length}
                  </Text>
                  <Text style={styles.loginBadgeText}>gün giriş</Text>
                </LinearGradient>
              </View>

              {/* Calendar Grid */}
              <View style={styles.calendarGrid}>
                <View style={styles.dayNamesRow}>
                  {dayNames.map((day, index) => (
                    <View key={index} style={styles.dayNameCell}>
                      <Text style={styles.dayNameText}>{day}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.daysGrid}>
                  {/* Empty cells for days before month starts */}
                  {Array.from({ length: firstDayOfMonth }, (_, index) => (
                    <View key={`empty-${index}`} style={styles.dayCell} />
                  ))}
                  
                  {/* Days of the month */}
                  {Array.from({ length: daysInMonth }, (_, index) => {
                    const day = index + 1;
                    const isToday = day === today;
                    const hasLogin = loginDays.includes(day) && day <= today;
                    const isFuture = day > today;
                    
                    return (
                      <View key={day} style={styles.dayCell}>
                        {isToday ? (
                          <LinearGradient
                            colors={['#7C3AED', '#432870']}
                            style={[styles.dayButton, styles.todayButton]}
                          >
                            <Text style={styles.todayText}>{day}</Text>
                            <View style={styles.todayBadge}>
                              <Text style={styles.todayBadgeText}>⭐</Text>
                            </View>
                          </LinearGradient>
                        ) : hasLogin ? (
                          <View style={[styles.dayButton, styles.loginDayButton]}>
                            <Text style={styles.loginDayText}>{day}</Text>
                            <View style={styles.checkBadge}>
                              <Text style={styles.checkBadgeText}>✓</Text>
                            </View>
                          </View>
                        ) : (
                          <View style={[
                            styles.dayButton,
                            isFuture ? styles.futureDayButton : styles.normalDayButton
                          ]}>
                            <Text style={[
                              styles.dayText,
                              isFuture ? styles.futureDayText : styles.normalDayText
                            ]}>
                              {day}
                            </Text>
                          </View>
                        )}
                      </View>
                    );
                  })}
                </View>
              </View>

              {/* Calendar Legend */}
              <View style={styles.calendarLegend}>
                <View style={styles.legendItem}>
                  <View style={styles.legendColorLogin} />
                  <Text style={styles.legendText}>Giriş Yapılan Günler</Text>
                </View>
                <View style={styles.legendItem}>
                  <LinearGradient
                    colors={['#7C3AED', '#432870']}
                    style={styles.legendColorToday}
                  />
                  <Text style={styles.legendText}>Bugün</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Tasks List */}
        <View style={styles.tasksSection}>
          {currentTasks.map((task, index) => {
            const progressPercentage = Math.min((task.progress / task.maxProgress) * 100, 100);
            
            return (
              <View 
                key={task.id}
                style={[
                  styles.taskCard,
                  task.completed && styles.completedTaskCard
                ]}
              >
                {/* Task Content */}
                <View style={styles.taskContent}>
                  <View style={styles.taskTop}>
                    <View style={styles.taskTitleSection}>
                      <View style={styles.taskTitleRow}>
                        <Text style={[
                          styles.taskTitle,
                          task.completed && styles.completedTaskTitle
                        ]}>
                          {task.title}
                        </Text>
                        {task.completed && (
                          <View style={styles.completedBadge}>
                            <Ionicons name="checkmark" size={14} color="white" />
                          </View>
                        )}
                      </View>
                      <Text style={styles.taskDescription}>{task.description}</Text>
                      
                      {/* Progress */}
                      <View style={styles.taskProgressSection}>
                        <View style={styles.taskProgressInfo}>
                          <Text style={styles.taskProgressText}>
                            {task.progress}/{task.maxProgress}
                          </Text>
                          <Text style={styles.taskProgressPercent}>
                            {Math.round(progressPercentage)}%
                          </Text>
                        </View>
                        <View style={styles.taskProgressBarBg}>
                          {task.completed ? (
                            <LinearGradient
                              colors={['#c61585', '#432870']}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 0 }}
                              style={[styles.taskProgressBarFill, { width: `${progressPercentage}%` }]}
                            />
                          ) : (
                            <View style={[
                              styles.taskProgressBarFill,
                              styles.taskProgressBarIncomplete,
                              { width: `${progressPercentage}%` }
                            ]} />
                          )}
                        </View>
                      </View>
                    </View>

                    {/* Reward */}
                    <View style={styles.taskRewardSection}>
                      <View style={[
                        styles.rewardBadge,
                        task.completed && styles.rewardBadgeCompleted
                      ]}>
                        <Ionicons name="cash" size={12} color="white" />
                        <Text style={styles.rewardText}>{task.reward}</Text>
                      </View>
                      {task.timeLeft && !task.completed && (
                        <Text style={styles.taskTimeLeft}>⏰ {task.timeLeft}</Text>
                      )}
                    </View>
                  </View>

                  {/* Action Button */}
                  {!task.completed && (
                    <TouchableOpacity
                      style={styles.taskButton}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={['#432870', '#B29EFD']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.taskButtonGradient}
                      >
                        <Text style={styles.taskButtonText}>
                          {task.progress > 0 ? 'Devam Et' : 'Başla'}
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* Bottom Summary */}
        <View style={styles.summarySection}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryContent}>
              <View>
                <Text style={styles.summaryTitle}>
                  {activeTab === 'daily' ? 'Günlük Toplam' : 'Aylık Toplam'}
                </Text>
                <Text style={styles.summarySubtitle}>
                  {completedTasks}/{totalTasks} görev tamamlandı
                </Text>
              </View>
              <View style={styles.summaryRight}>
                <Text style={styles.summaryCredits}>
                  +{currentTasks.filter(t => t.completed).reduce((sum, t) => sum + t.reward, 0)}
                </Text>
                <Text style={styles.summaryCreditsLabel}>kredi kazandın</Text>
              </View>
            </View>
            
            {completedTasks === totalTasks && (
              <View style={styles.allCompletedBanner}>
                <LinearGradient
                  colors={['#c61585', '#432870']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.allCompletedGradient}
                >
                  <Text style={styles.allCompletedText}>
                    🎉 Tüm görevleri tamamladın! Harikasın!
                  </Text>
                </LinearGradient>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F3F5',
  },
  header: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F2F3F5',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F3F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#202020',
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#432870',
  },
  checkIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  checkIconGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressSection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  progressBarContainer: {
    marginBottom: 8,
  },
  progressBarBg: {
    width: '100%',
    height: 8,
    backgroundColor: '#F2F3F5',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#432870',
  },
  timeLeftText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B29EFD',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F2F3F5',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    position: 'relative',
  },
  activeTab: {},
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(32, 32, 32, 0.6)',
    textAlign: 'center',
  },
  activeTabText: {
    color: '#432870',
    fontWeight: '700',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  calendarSection: {
    padding: 16,
  },
  calendarCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'rgba(67, 40, 112, 0.2)',
    padding: 24,
    shadowColor: '#432870',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 40,
    elevation: 8,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#432870',
    marginBottom: 4,
  },
  calendarSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(32, 32, 32, 0.6)',
  },
  loginBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    alignItems: 'center',
  },
  loginBadgeNumber: {
    fontSize: 18,
    fontWeight: '900',
    color: 'white',
  },
  loginBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  calendarGrid: {
    backgroundColor: 'rgba(67, 40, 112, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  dayNamesRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  dayNameCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  dayNameText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#432870',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    padding: 2,
  },
  dayButton: {
    flex: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  todayButton: {
    transform: [{ scale: 1.1 }],
  },
  todayText: {
    fontSize: 14,
    fontWeight: '700',
    color: 'white',
  },
  todayBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    backgroundColor: 'white',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayBadgeText: {
    fontSize: 8,
  },
  loginDayButton: {
    backgroundColor: '#c61585',
  },
  loginDayText: {
    fontSize: 14,
    fontWeight: '700',
    color: 'white',
  },
  checkBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    backgroundColor: '#432870',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBadgeText: {
    fontSize: 8,
    color: 'white',
  },
  futureDayButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 1,
    borderColor: '#F2F3F5',
  },
  futureDayText: {
    fontSize: 14,
    fontWeight: '700',
    color: 'rgba(32, 32, 32, 0.4)',
  },
  normalDayButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#F2F3F5',
  },
  normalDayText: {
    fontSize: 14,
    fontWeight: '700',
    color: 'rgba(32, 32, 32, 0.6)',
  },
  dayText: {
    fontSize: 14,
    fontWeight: '700',
  },
  calendarLegend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(67, 40, 112, 0.1)',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColorLogin: {
    width: 12,
    height: 12,
    backgroundColor: '#c61585',
    borderRadius: 6,
    marginRight: 8,
  },
  legendColorToday: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: 'rgba(32, 32, 32, 0.6)',
  },
  tasksSection: {
    padding: 16,
  },
  taskCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#F2F3F5',
    marginBottom: 12,
    overflow: 'hidden',
  },
  completedTaskCard: {
    backgroundColor: 'rgba(198, 21, 133, 0.1)',
    borderColor: 'rgba(198, 21, 133, 0.3)',
  },
  taskContent: {
    padding: 16,
  },
  taskTop: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  taskTitleSection: {
    flex: 1,
  },
  taskTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#202020',
    marginRight: 8,
  },
  completedTaskTitle: {
    color: '#432870',
  },
  completedBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#c61585',
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskDescription: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(32, 32, 32, 0.6)',
    marginBottom: 8,
  },
  taskProgressSection: {
    marginTop: 4,
  },
  taskProgressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  taskProgressText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#432870',
  },
  taskProgressPercent: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(32, 32, 32, 0.6)',
  },
  taskProgressBarBg: {
    width: '100%',
    height: 6,
    backgroundColor: '#F2F3F5',
    borderRadius: 3,
    overflow: 'hidden',
  },
  taskProgressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  taskProgressBarIncomplete: {
    backgroundColor: '#B29EFD',
  },
  taskRewardSection: {
    marginLeft: 16,
    alignItems: 'flex-end',
  },
  rewardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#432870',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  rewardBadgeCompleted: {
    backgroundColor: '#c61585',
  },
  rewardText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'white',
    marginLeft: 4,
  },
  taskTimeLeft: {
    fontSize: 12,
    fontWeight: '500',
    color: '#B29EFD',
  },
  taskButton: {
    marginTop: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  taskButtonGradient: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  taskButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: 'white',
  },
  summarySection: {
    padding: 16,
    paddingTop: 0,
  },
  summaryCard: {
    backgroundColor: 'rgba(67, 40, 112, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(67, 40, 112, 0.2)',
    padding: 16,
  },
  summaryContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#432870',
  },
  summarySubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(32, 32, 32, 0.6)',
  },
  summaryRight: {
    alignItems: 'flex-end',
  },
  summaryCredits: {
    fontSize: 18,
    fontWeight: '900',
    color: '#432870',
  },
  summaryCreditsLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(32, 32, 32, 0.6)',
  },
  allCompletedBanner: {
    marginTop: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  allCompletedGradient: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  allCompletedText: {
    fontSize: 14,
    fontWeight: '900',
    color: 'white',
  },
});