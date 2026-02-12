import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PRIMARY_BLUE } from '../../LeaguePage/shared/theme';
import { TaskCardProps } from '../types';

const CARD_GAP_TO_OUTER = 1;
const CARD_INNER_RADIUS = 19;
const CARD_OUTER_RADIUS = CARD_INNER_RADIUS + CARD_GAP_TO_OUTER;
const CARD_CONTENT_PADDING = 15;

const CTA_GAP_TO_OUTER = 1;
const CTA_INNER_RADIUS = 24;
const CTA_OUTER_RADIUS = CTA_INNER_RADIUS + CTA_GAP_TO_OUTER;
const CTA_GAP_TO_CARD_EDGE = CARD_CONTENT_PADDING;
const CTA_HORIZONTAL_OFFSET = -(CARD_CONTENT_PADDING - CTA_GAP_TO_CARD_EDGE);

export function TaskCard({ task, onAction }: TaskCardProps) {
  const progressPercentage = task.maxProgress > 0 ? Math.min((task.progress / task.maxProgress) * 100, 100) : 0;
  const isCompleted = task.completed;
  const isClaimed = task.claimed;

  const getTaskIconName = (): keyof typeof Ionicons.glyphMap => {
    switch (task.requirementType) {
      case 'coupon_count':
        return 'ticket-outline';
      case 'prediction_count':
        return 'analytics-outline';
      case 'correct_predictions':
        return 'checkmark-done-outline';
      case 'login_streak':
        return 'log-in-outline';
      case 'daily_games':
      case 'daily_games_bonus':
        return 'game-controller-outline';
      case 'league_prediction':
        return 'trophy-outline';
      case 'league_complete':
        return 'medal-outline';
      default:
        switch (task.navigationTarget) {
          case '/home':
            return 'home-outline';
          case '/leagues':
            return 'trophy-outline';
          case '/gamehub':
            return 'game-controller-outline';
          default:
            return 'ellipse-outline';
        }
    }
  };

  const accentColor = isClaimed ? '#8E8E93' : PRIMARY_BLUE;
  const taskIcon = getTaskIconName();
  const actionText = task.completed && !task.claimed ? 'Ödülü Al' : task.progress > 0 ? 'Devam Et' : 'Başla';

  return (
    <TouchableOpacity
      activeOpacity={isClaimed ? 1 : 0.92}
      onPress={() => !isClaimed && onAction(task)}
      style={[
        styles.container,
        {
          backgroundColor: isClaimed ? 'rgba(142, 142, 147, 0.35)' : 'rgba(37, 110, 255, 0.30)',
        },
      ]}
    >
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={[styles.iconHalo, { shadowColor: accentColor }]}> 
              <View
                style={[
                  styles.iconBox,
                  {
                    backgroundColor: `${accentColor}20`,
                    borderColor: `${accentColor}55`,
                  },
                ]}
              >
                <Ionicons name={taskIcon} size={20} color={accentColor} />
              </View>
            </View>
            <View style={styles.titleSection}>
              <Text style={[styles.title, isClaimed && styles.claimedTitle]} numberOfLines={2}>
                {task.title}
              </Text>
            </View>
          </View>

          <View style={styles.rewardBlock}>
            <Text style={[styles.rewardValue, { color: accentColor }]}>{task.reward}</Text>
            <Text style={styles.rewardLabel}>kredi</Text>
          </View>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressInfo}>
            <Text style={styles.progressLabel}>İlerleme</Text>
            <Text style={styles.progressValue}>
              {task.progress}/{task.maxProgress}
            </Text>
          </View>

          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${progressPercentage}%`,
                  backgroundColor: accentColor,
                },
              ]}
            />
          </View>
        </View>

        {!isClaimed && (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => onAction(task)}
            style={styles.actionButton}
          >
            <View style={styles.actionButtonInner}>
              <View style={styles.actionIconBadge}>
                <Ionicons
                  name={task.completed && !task.claimed ? 'gift-outline' : 'arrow-forward-outline'}
                  size={15}
                  color="#FFFFFF"
                  style={styles.actionIcon}
                />
              </View>
              <Text style={styles.actionButtonText}>{actionText}</Text>
            </View>
          </TouchableOpacity>
        )}

        {isClaimed && (
          <View style={styles.claimedContainer}>
            <Ionicons name="checkmark-circle" size={18} color="#8E8E93" />
            <Text style={styles.claimedText}>Ödül Alındı</Text>
          </View>
        )}

        {!isCompleted && task.timeLeft && (
          <View style={styles.timeLeftContainer}>
            <Ionicons name="time-outline" size={12} color="#A1A1AA" />
            <Text style={styles.timeLeftText}>{task.timeLeft}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    borderRadius: CARD_OUTER_RADIUS,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
    padding: CARD_GAP_TO_OUTER,
  },
  card: {
    padding: CARD_CONTENT_PADDING,
    borderRadius: CARD_INNER_RADIUS,
    backgroundColor: '#1C1C1E',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  iconHalo: {
    borderRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.32,
    shadowRadius: 8,
    elevation: 2,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  titleSection: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#F5F5F7',
    lineHeight: 22,
  },
  claimedTitle: {
    color: '#A1A1AA',
  },
  rewardBlock: {
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  rewardValue: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
    lineHeight: 24,
  },
  rewardLabel: {
    fontSize: 11,
    color: '#A1A1AA',
    fontWeight: '600',
    letterSpacing: 0.2,
    marginTop: 3,
    textTransform: 'lowercase',
  },
  progressSection: {
    marginBottom: 12,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 7,
  },
  progressLabel: {
    fontSize: 11,
    color: '#A1A1AA',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  progressValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#DEE7FB',
  },
  progressBarBg: {
    height: 7,
    backgroundColor: '#2C2C2E',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 999,
  },
  actionButton: {
    backgroundColor: '#3D83FF',
    borderRadius: CTA_OUTER_RADIUS,
    marginHorizontal: CTA_HORIZONTAL_OFFSET,
    padding: CTA_GAP_TO_OUTER,
  },
  actionButtonInner: {
    backgroundColor: PRIMARY_BLUE,
    borderRadius: CTA_INNER_RADIUS,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  actionIconBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  actionIcon: {
    marginRight: 0,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  claimedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    backgroundColor: '#2C2C2E',
    borderWidth: 1,
    borderColor: 'rgba(142, 142, 147, 0.24)',
    borderRadius: 14,
  },
  claimedText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#A1A1AA',
    marginLeft: 6,
  },
  timeLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 9,
    gap: 4,
  },
  timeLeftText: {
    fontSize: 11,
    color: '#A1A1AA',
    fontWeight: '600',
  },
});
