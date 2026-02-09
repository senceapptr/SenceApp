import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { TaskCardProps } from '../types';

export function TaskCard({ task, onAction }: TaskCardProps) {
  const progressPercentage = Math.min((task.progress / task.maxProgress) * 100, 100);
  const isCompleted = task.completed;
  const isClaimed = task.claimed;
  const canClaim = isCompleted && !isClaimed;

  // İkon mapping
  const getIconName = (): keyof typeof Ionicons.glyphMap => {
    switch (task.navigationTarget) {
      case '/home': return 'ticket-outline';
      case '/leagues': return 'trophy-outline';
      case '/gamehub': return 'game-controller-outline';
      default: return 'checkmark-circle-outline';
    }
  };

  // Renk teması
  const getAccentColor = () => {
    if (isClaimed) return '#6B7280'; // Claimed - gri
    if (canClaim) return '#10B981'; // Can claim - yeşil
    if (progressPercentage > 50) return '#F59E0B'; // Half done - sarı
    return '#8B5CF6'; // Default - mor
  };

  const accentColor = getAccentColor();

  return (
    <TouchableOpacity
      activeOpacity={isClaimed ? 1 : 0.9}
      onPress={() => !isClaimed && onAction(task)}
      style={[
        styles.container,
        { borderColor: accentColor + '40', shadowColor: accentColor }
      ]}
    >
      <LinearGradient
        colors={['#161B22', '#0D1117']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={[styles.iconBox, { backgroundColor: accentColor + '20' }]}>
              <Text style={styles.iconEmoji}>{task.icon || '🎯'}</Text>
            </View>
            <View style={styles.titleSection}>
              <View style={styles.titleRow}>
                <Text style={[styles.title, isClaimed && styles.claimedTitle]} numberOfLines={1}>
                  {task.title}
                </Text>
                {isClaimed && (
                  <View style={styles.claimedBadge}>
                    <Ionicons name="checkmark" size={10} color="white" />
                  </View>
                )}
              </View>
              <Text style={styles.description} numberOfLines={1}>{task.description}</Text>
            </View>
          </View>

          {/* Reward Badge */}
          <View style={[styles.rewardBadge, { backgroundColor: accentColor + '15', borderColor: accentColor + '30' }]}>
            <Ionicons name="diamond" size={12} color={accentColor} />
            <Text style={[styles.rewardText, { color: accentColor }]}>{task.reward}</Text>
          </View>
        </View>

        {/* Progress Section */}
        <View style={styles.progressSection}>
          <View style={styles.progressInfo}>
            <Text style={styles.progressLabel}>İlerleme</Text>
            <Text style={[styles.progressValue, { color: accentColor }]}>
              {task.progress}/{task.maxProgress}
            </Text>
          </View>

          <View style={styles.progressBarBg}>
            <LinearGradient
              colors={isClaimed ? ['#6B7280', '#4B5563'] : [accentColor, accentColor + 'CC']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressBarFill, { width: `${progressPercentage}%` }]}
            />
          </View>
        </View>

        {/* Action Button */}
        {!isClaimed && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onAction(task)}
            style={styles.actionButton}
          >
            <LinearGradient
              colors={canClaim ? ['#10B981', '#059669'] : ['#8B5CF6', '#7C3AED']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.actionButtonGradient}
            >
              <Ionicons
                name={canClaim ? 'gift-outline' : getIconName()}
                size={16}
                color="white"
                style={styles.actionIcon}
              />
              <Text style={styles.actionButtonText}>
                {canClaim ? 'Ödülü Al' : (task.progress > 0 ? 'Devam Et' : 'Başla')}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* Claimed State */}
        {isClaimed && (
          <View style={styles.claimedContainer}>
            <Ionicons name="checkmark-circle" size={18} color="#6B7280" />
            <Text style={styles.claimedText}>Ödül Alındı</Text>
          </View>
        )}

        {/* Time Left (only for uncompleted) */}
        {!isCompleted && task.timeLeft && (
          <View style={styles.timeLeftContainer}>
            <Ionicons name="time-outline" size={12} color="#8B949E" />
            <Text style={styles.timeLeftText}>{task.timeLeft}</Text>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 1.5,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  gradient: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconEmoji: {
    fontSize: 18,
  },
  titleSection: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F0F6FC',
    flex: 1,
  },
  claimedTitle: {
    color: '#6B7280',
  },
  claimedBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#6B7280',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  description: {
    fontSize: 12,
    color: '#8B949E',
    fontWeight: '500',
  },
  rewardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    gap: 4,
  },
  rewardText: {
    fontSize: 13,
    fontWeight: '700',
  },
  progressSection: {
    marginBottom: 14,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 11,
    color: '#8B949E',
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  progressValue: {
    fontSize: 12,
    fontWeight: '700',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#21262D',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  actionButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  actionIcon: {
    marginRight: 6,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: 'white',
  },
  claimedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#21262D',
    borderRadius: 12,
  },
  claimedText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginLeft: 6,
  },
  timeLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    gap: 4,
  },
  timeLeftText: {
    fontSize: 11,
    color: '#8B949E',
    fontWeight: '500',
  },
});
