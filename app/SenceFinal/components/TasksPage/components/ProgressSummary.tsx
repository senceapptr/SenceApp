import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ProgressSummaryProps } from '../types';

export function ProgressSummary({ completed, total, showDailyTimer }: ProgressSummaryProps) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  return (
    <View style={styles.progressSection}>
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBg}>
          <LinearGradient colors={["#c61585", "#432870"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.progressBarFill, { width: `${pct}%` }]} />
        </View>
      </View>
      <View style={styles.progressInfo}>
        <Text style={styles.progressText}>İlerleme: %{pct}</Text>
        {showDailyTimer && <Text style={styles.timeLeftText}>⏰ 18:42:15 kaldı</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
});



