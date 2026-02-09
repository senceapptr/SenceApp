import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TaskCard } from './TaskCard';
import { TasksListProps } from '../types';

export function TasksList({ tasks, onTaskAction }: TasksListProps) {
  return (
    <View style={styles.container}>
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onAction={onTaskAction}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },
});
