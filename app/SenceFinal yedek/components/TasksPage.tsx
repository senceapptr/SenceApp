import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface TasksPageProps {
  onBack: () => void;
  onMenuToggle: () => void;
}

export function TasksPage({ onBack, onMenuToggle }: TasksPageProps) {
  const tasks = [
    {
      id: 1,
      title: "Günlük 5 Soru Cevapla",
      description: "Herhangi 5 soruya cevap ver",
      progress: 3,
      total: 5,
      reward: "100 💎",
      completed: false,
      type: "daily"
    },
    {
      id: 2,
      title: "3 Kupon Oluştur",
      description: "3 farklı kupon oluştur",
      progress: 1,
      total: 3,
      reward: "250 💎",
      completed: false,
      type: "daily"
    },
    {
      id: 3,
      title: "Haftalık 50 Soru",
      description: "Bu hafta 50 soruya cevap ver",
      progress: 23,
      total: 50,
      reward: "500 💎",
      completed: false,
      type: "weekly"
    },
    {
      id: 4,
      title: "İlk Kupon Kazancı",
      description: "İlk kuponunu kazan",
      progress: 0,
      total: 1,
      reward: "1000 💎",
      completed: false,
      type: "achievement"
    }
  ];

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'daily': return '📅';
      case 'weekly': return '📊';
      case 'achievement': return '🏆';
      default: return '📋';
    }
  };

  const getTaskColor = (type: string): [string, string] => {
    switch (type) {
      case 'daily': return ['#3B82F6', '#1D4ED8'];
      case 'weekly': return ['#8B5CF6', '#7C3AED'];
      case 'achievement': return ['#F59E0B', '#D97706'];
      default: return ['#6B7280', '#4B5563'];
    }
  };

  const TaskCard = ({ task }: { task: any }) => {
    const progressPercentage = (task.progress / task.total) * 100;
    const isCompleted = task.progress >= task.total;
    
    return (
      <View style={[styles.taskCard, isCompleted && styles.completedTaskCard]}>
        <LinearGradient
          colors={isCompleted ? ['#10B981', '#059669'] : getTaskColor(task.type)}
          style={styles.taskGradient}
        >
          <View style={styles.taskHeader}>
            <View style={styles.taskIconContainer}>
              <Text style={styles.taskIcon}>{getTaskIcon(task.type)}</Text>
            </View>
            <View style={styles.taskInfo}>
              <Text style={styles.taskTitle}>{task.title}</Text>
              <Text style={styles.taskDescription}>{task.description}</Text>
            </View>
            {isCompleted && (
              <View style={styles.completedBadge}>
                <Ionicons name="checkmark" size={16} color="white" />
              </View>
            )}
          </View>
          
          <View style={styles.taskProgress}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${Math.min(progressPercentage, 100)}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {task.progress}/{task.total}
            </Text>
          </View>
          
          <View style={styles.taskReward}>
            <Text style={styles.rewardText}>{task.reward}</Text>
          </View>
        </LinearGradient>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Header */}
      <SafeAreaView style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Görevler</Text>
          
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={onMenuToggle}
            activeOpacity={0.8}
          >
            <Ionicons name="menu" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Background Gradient */}
      <LinearGradient
        colors={['#1F2937', '#111827', '#0F172A']}
        style={styles.backgroundGradient}
      />

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Tamamlanan</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>1</Text>
            <Text style={styles.statLabel}>Devam Eden</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>850</Text>
            <Text style={styles.statLabel}>Toplam 💎</Text>
          </View>
        </View>

        {/* Tasks List */}
        <View style={styles.tasksSection}>
          <Text style={styles.sectionTitle}>Günlük Görevler</Text>
          {tasks.filter(task => task.type === 'daily').map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </View>

        <View style={styles.tasksSection}>
          <Text style={styles.sectionTitle}>Haftalık Görevler</Text>
          {tasks.filter(task => task.type === 'weekly').map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </View>

        <View style={styles.tasksSection}>
          <Text style={styles.sectionTitle}>Başarımlar</Text>
          {tasks.filter(task => task.type === 'achievement').map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  statsSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
  tasksSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  taskCard: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  completedTaskCard: {
    opacity: 0.8,
  },
  taskGradient: {
    padding: 16,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  taskIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  taskIcon: {
    fontSize: 20,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 2,
  },
  taskDescription: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  completedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    marginRight: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  taskReward: {
    alignItems: 'flex-end',
  },
  rewardText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FEF3C7',
  },
});