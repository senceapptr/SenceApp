import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Task, TasksListProps } from '../types';
import { TaskCard } from './TaskCard';

export function TasksList({ tasks }: TasksListProps) {
  if (!tasks || tasks.length === 0) {
    return <View style={styles.empty} />;
  }
  return (
    <View style={styles.tasksSection}>
      {tasks.map((task: Task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tasksSection: {
    padding: 16,
  },
  empty: {
    height: 20,
  },
});






