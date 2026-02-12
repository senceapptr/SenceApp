import React from 'react';
import { View, StyleSheet, StatusBar, ScrollView, ActivityIndicator, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { PRIMARY_BLUE } from '../LeaguePage/shared/theme';
import { PageHeader } from './components/PageHeader';
import { Tabs } from './components/Tabs';
import { ProgressSummary } from './components/ProgressSummary';
import { CalendarCard } from './components/CalendarCard';
import { TasksList } from './components/TasksList';
import { useTasks } from './hooks';
import { Task, TasksPageNavigation } from './types';

export interface TasksPageProps {
  onBack: () => void;
  onMenuToggle: () => void;
  onNavigateToPage?: (page: TasksPageNavigation) => void;
}

export function TasksPage({ onBack, onMenuToggle, onNavigateToPage }: TasksPageProps) {
  const router = useRouter();
  const state = useTasks();

  const navigateWithFallback = (target: TasksPageNavigation) => {
    if (onNavigateToPage) {
      onNavigateToPage(target);
      return;
    }

    switch (target) {
      case 'home':
        router.push('/(tabs)' as never);
        break;
      case 'leagues':
        router.push('/(tabs)/leagues' as never);
        break;
      case 'gameHub':
        router.push('/(tabs)/gamehub' as never);
        break;
    }
  };

  // Handle task action (claim or navigate)
  const handleTaskAction = (task: Task) => {
    if (task.actionType === 'claim') {
      // Claim reward
      state.claimReward(task.id);
    } else if (task.navigationTarget) {
      // Navigate to target page
      switch (task.navigationTarget) {
        case '/home':
          navigateWithFallback('home');
          break;
        case '/leagues':
          navigateWithFallback('leagues');
          break;
        case '/gamehub':
          navigateWithFallback('gameHub');
          break;
      }
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D1117" />

      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <PageHeader
          onBack={onBack}
          onMenuToggle={onMenuToggle}
          title="Görevler"
          subtitle={`${state.completedTasks}/${state.currentTasks.length} tamamlandı`}
        />

        <Tabs activeTab={state.activeTab} onChangeTab={state.setActiveTab} />
        {state.loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={PRIMARY_BLUE} />
            <Text style={styles.loadingText}>Görevler yükleniyor...</Text>
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <ProgressSummary
              completed={state.completedTasks}
              total={state.currentTasks.length}
              showResetTimer
              resetLabel={state.currentResetLabel}
              timeRemaining={state.currentResetRemaining}
            />

            {state.activeTab === 'monthly' && (
              <CalendarCard
                monthNames={state.monthNames}
                dayNames={state.dayNames}
                currentMonth={state.currentMonth}
                currentYear={state.currentYear}
                today={state.today}
                daysInMonth={state.daysInMonth}
                firstDayOfMonth={state.firstDayOfMonth}
                loginDays={state.loginDays}
              />
            )}

            <TasksList
              tasks={state.currentTasks}
              onTaskAction={handleTaskAction}
            />
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1117',
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
    paddingTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
    color: PRIMARY_BLUE,
  },
});

export default TasksPage;
