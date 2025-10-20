import React from 'react';
import { View, StyleSheet, StatusBar, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PageHeader } from './components/PageHeader';
import { Tabs } from './components/Tabs';
import { ProgressSummary } from './components/ProgressSummary';
import { CalendarCard } from './components/CalendarCard';
import { TasksList } from './components/TasksList';
import { useTasks } from './hooks';

export interface TasksPageProps {
  onBack: () => void;
  onMenuToggle: () => void;
}

export function TasksPage({ onBack, onMenuToggle }: TasksPageProps) {
  const state = useTasks();

  const currentTasks = state.activeTab === 'daily' ? state.dailyTasks : state.monthlyTasks;
  const completedTasks = currentTasks.filter(t => t.completed).length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <SafeAreaView edges={['top']}> 
        <PageHeader 
          onBack={onBack}
          onMenuToggle={onMenuToggle}
          title="Görevler"
          subtitle={`${completedTasks}/${currentTasks.length} tamamlandı`}
        />
        <ProgressSummary 
          completed={completedTasks} 
          total={currentTasks.length}
          showDailyTimer={state.activeTab === 'daily'}
        />
        <Tabs activeTab={state.activeTab} onChangeTab={state.setActiveTab} />
      </SafeAreaView>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
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

        <TasksList tasks={currentTasks} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F3F5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
});

export default TasksPage;



