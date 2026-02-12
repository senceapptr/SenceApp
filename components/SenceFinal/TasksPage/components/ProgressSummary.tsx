import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ProgressSummaryProps } from '../types';

export function ProgressSummary({
  completed,
  total,
  showResetTimer,
  timeRemaining,
}: ProgressSummaryProps) {
  const progressRatio = total > 0 ? completed / total : 0;
  const progressWidth = `${Math.min(progressRatio * 100, 100)}%` as `${number}%`;
  const isDone = total > 0 && completed >= total;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.topRow}>
          <Text style={[styles.counter, isDone && styles.counterDone]}>{`${completed}/${total}`}</Text>
          {showResetTimer && timeRemaining ? (
            <Text style={styles.resetText}>{timeRemaining}</Text>
          ) : null}
        </View>

        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: progressWidth },
              isDone ? styles.progressFillDone : null,
            ]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#141A24',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(120, 148, 191, 0.24)',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 8,
  },
  counter: {
    color: '#E6F0FF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  counterDone: {
    color: '#30D158',
  },
  resetText: {
    color: '#9DB1D6',
    fontSize: 11.5,
    fontWeight: '600',
    flexShrink: 1,
    textAlign: 'right',
  },
  progressTrack: {
    backgroundColor: '#273247',
    borderRadius: 999,
    height: 8,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: '#0A84FF',
    borderRadius: 999,
    height: '100%',
    minWidth: 4,
  },
  progressFillDone: {
    backgroundColor: '#30D158',
  },
});
