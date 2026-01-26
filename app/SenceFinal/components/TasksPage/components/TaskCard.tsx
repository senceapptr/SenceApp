import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const progressPercentage = Math.min((task.progress / task.maxProgress) * 100, 100);

  return (
    <View style={[styles.taskCard, task.completed && styles.completedTaskCard]}>
      <View style={styles.taskContent}>
        <View style={styles.taskTop}>
          <View style={styles.taskTitleSection}>
            <View style={styles.taskTitleRow}>
              <Text style={[styles.taskTitle, task.completed && styles.completedTaskTitle]}>{task.title}</Text>
              {task.completed && (
                <View style={styles.completedBadge}>
                  <Ionicons name="checkmark" size={14} color="white" />
                </View>
              )}
            </View>
            <Text style={styles.taskDescription}>{task.description}</Text>
            <View style={styles.taskProgressSection}>
              <View style={styles.taskProgressInfo}>
                <Text style={styles.taskProgressText}>{task.progress}/{task.maxProgress}</Text>
                <Text style={styles.taskProgressPercent}>{Math.round(progressPercentage)}%</Text>
              </View>
              <View style={styles.taskProgressBarBg}>
                {task.completed ? (
                  <LinearGradient colors={["#10B981", "#059669"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.taskProgressBarFill, { width: `${progressPercentage}%` }]} />
                ) : (
                  <View style={[styles.taskProgressBarFill, styles.taskProgressBarIncomplete, { width: `${progressPercentage}%` }]} />
                )}
              </View>
            </View>
          </View>
          <View style={styles.taskRewardSection}>
            <View style={[styles.rewardBadge, task.completed && styles.rewardBadgeCompleted]}>
              <Ionicons name="cash" size={12} color="white" />
              <Text style={styles.rewardText}>{task.reward}</Text>
            </View>
            {task.timeLeft && !task.completed && (
              <Text style={styles.taskTimeLeft}>⏰ {task.timeLeft}</Text>
            )}
          </View>
        </View>
        {!task.completed && (
          <TouchableOpacity style={styles.taskButton} activeOpacity={0.8}>
            <LinearGradient colors={["#10B981", "#059669"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.taskButtonGradient}>
              <Text style={styles.taskButtonText}>{task.progress > 0 ? 'Devam Et' : 'Başla'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  taskCard: {
    backgroundColor: '#161B22',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#30363D',
    marginBottom: 12,
    overflow: 'hidden',
  },
  completedTaskCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  taskContent: { padding: 16 },
  taskTop: { flexDirection: 'row', marginBottom: 12 },
  taskTitleSection: { flex: 1 },
  taskTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  taskTitle: { fontSize: 14, fontWeight: '700', color: '#F0F6FC', marginRight: 8 },
  completedTaskTitle: { color: '#10B981' },
  completedBadge: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#10B981', alignItems: 'center', justifyContent: 'center' },
  taskDescription: { fontSize: 12, fontWeight: '500', color: '#8B949E', marginBottom: 8 },
  taskProgressSection: { marginTop: 4 },
  taskProgressInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  taskProgressText: { fontSize: 12, fontWeight: '700', color: '#10B981' },
  taskProgressPercent: { fontSize: 12, fontWeight: '500', color: '#8B949E' },
  taskProgressBarBg: { width: '100%', height: 6, backgroundColor: '#21262D', borderRadius: 3, overflow: 'hidden' },
  taskProgressBarFill: { height: '100%', borderRadius: 3 },
  taskProgressBarIncomplete: { backgroundColor: '#059669' },
  taskRewardSection: { marginLeft: 16, alignItems: 'flex-end' },
  rewardBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#10B981', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginBottom: 4 },
  rewardBadgeCompleted: { backgroundColor: '#059669' },
  rewardText: { fontSize: 12, fontWeight: '700', color: 'white', marginLeft: 4 },
  taskTimeLeft: { fontSize: 12, fontWeight: '500', color: '#34D399' },
  taskButton: { marginTop: 12, borderRadius: 12, overflow: 'hidden' },
  taskButtonGradient: { paddingVertical: 8, alignItems: 'center' },
  taskButtonText: { fontSize: 14, fontWeight: '700', color: 'white' },
});







