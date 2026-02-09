import React from 'react';
import { View, StyleSheet, StatusBar, ScrollView, ActivityIndicator, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { PageHeader } from './components/PageHeader';
import { Tabs } from './components/Tabs';
import { ProgressSummary } from './components/ProgressSummary';
import { CalendarCard } from './components/CalendarCard';
import { TasksList } from './components/TasksList';
import { useTasks } from './hooks';
import { Task } from './types';

export interface TasksPageProps {
  onBack: () => void;
  onMenuToggle: () => void;
}

export function TasksPage({ onBack, onMenuToggle }: TasksPageProps) {
  const router = useRouter();
  const state = useTasks();

  // Handle task action (claim or navigate)
  const handleTaskAction = (task: Task) => {
    if (task.actionType === 'claim') {
      // Claim reward
      state.claimReward(task.id);
    } else if (task.navigationTarget) {
      // Navigate to target page
      switch (task.navigationTarget) {
        case '/home':
          router.push('/(tabs)');
          break;
        case '/leagues':
          router.push('/(tabs)/leagues');
          break;
        case '/gamehub':
          router.push('/(tabs)/gamehub');
          break;
      }
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D1117" />

      <SafeAreaView edges={['top']}>
        <PageHeader
          onBack={onBack}
          onMenuToggle={onMenuToggle}
          title="Görevler"
          subtitle={`${state.completedTasks}/${state.currentTasks.length} tamamlandı`}
        />

        <Tabs activeTab={state.activeTab} onChangeTab={state.setActiveTab} />

        <ProgressSummary
          completed={state.completedTasks}
          total={state.currentTasks.length}
          claimed={state.claimedTasks}
          showDailyTimer={state.activeTab === 'daily'}
          timeRemaining={state.timeRemaining}
        />
      </SafeAreaView>

      {state.loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B5CF6" />
          <Text style={styles.loadingText}>Görevler yükleniyor...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1117',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
    paddingTop: 16,
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
    color: '#8B5CF6',
  },
});

export default TasksPage;
