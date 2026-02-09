import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ProgressSummaryProps } from '../types';

export function ProgressSummary({ completed, total, claimed, showDailyTimer, timeRemaining }: ProgressSummaryProps) {
  const progressPercentage = total > 0 ? (completed / total) * 100 : 0;
  const allClaimed = claimed === total && total > 0;

  // Renk belirleme
  const getProgressColor = () => {
    if (allClaimed) return ['#10B981', '#059669'];
    if (progressPercentage >= 80) return ['#10B981', '#059669'];
    if (progressPercentage >= 50) return ['#F59E0B', '#D97706'];
    return ['#8B5CF6', '#7C3AED'];
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#161B22', '#0D1117']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        {/* Header Row */}
        <View style={styles.headerRow}>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{completed}</Text>
              <Text style={styles.statLabel}>Tamamlandı</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <Text style={styles.statValue}>{claimed}</Text>
              <Text style={styles.statLabel}>Alındı</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <Text style={styles.statValue}>{total}</Text>
              <Text style={styles.statLabel}>Toplam</Text>
            </View>
          </View>

          {/* Timer for daily tasks */}
          {showDailyTimer && timeRemaining && (
            <View style={styles.timerBadge}>
              <Ionicons name="time-outline" size={14} color="#F59E0B" />
              <Text style={styles.timerText}>{timeRemaining}</Text>
            </View>
          )}
        </View>

        {/* Progress Bar */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>İlerleme</Text>
            <Text style={styles.progressPercent}>{Math.round(progressPercentage)}%</Text>
          </View>

          <View style={styles.progressBarBg}>
            <LinearGradient
              colors={getProgressColor()}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressBarFill, { width: `${progressPercentage}%` }]}
            />
          </View>
        </View>

        {/* All Complete Message */}
        {allClaimed && (
          <View style={styles.completeMessage}>
            <Ionicons name="checkmark-circle" size={16} color="#10B981" />
            <Text style={styles.completeText}>Tüm görevler tamamlandı!</Text>
          </View>
        )}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#30363D',
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#F0F6FC',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#8B949E',
    textTransform: 'uppercase',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#30363D',
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    gap: 4,
    marginLeft: 12,
  },
  timerText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F59E0B',
  },
  progressSection: {
    marginTop: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8B949E',
  },
  progressPercent: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F0F6FC',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#21262D',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  completeMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    gap: 6,
  },
  completeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#10B981',
  },
});
