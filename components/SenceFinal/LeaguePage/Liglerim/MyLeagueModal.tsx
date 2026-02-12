import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';

import { League } from '../types';
import { PRIMARY_BLUE } from '../shared/theme';
import { resolveLeagueIcon } from '../shared/leagueIcons';
import { LEAGUE_DETAIL_STAT_ICONS } from '../shared/leagueDetailStatIcons';

interface MyLeagueModalProps {
  visible: boolean;
  onChat: () => void;
  onClose: () => void;
  onShare: () => void;
  league: League | null;
  onQuestions: () => void;
  onLeaderboard: () => void;
}

export function MyLeagueModal({
  league,
  onChat,
  onClose,
  onLeaderboard,
  onQuestions,
  onShare,
  visible,
}: MyLeagueModalProps) {
  if (!league) return null;
  const resolvedIcon = resolveLeagueIcon(league.leagueIconName, league.leagueIconColor);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          {/* Dark Glass Header */}
          <LinearGradient colors={['#0D1117', '#161B22', '#21262D']} style={styles.header}>
            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7}>
              <Ionicons name="close" size={24} color="#9CA3AF" />
            </TouchableOpacity>

            {/* League Icon */}
            <View style={[styles.leagueIcon, { backgroundColor: resolvedIcon.color }]}>
              <Ionicons name={resolvedIcon.name} size={32} color="#FFFFFF" />
            </View>

            {/* League Info */}
            <Text style={styles.leagueTitle}>{league.name}</Text>
            <Text style={styles.leagueDescription}>{league.description}</Text>

            {/* Creator Badge */}
            <View style={styles.creatorBadge}>
              <Ionicons name="person-circle" size={16} color={PRIMARY_BLUE} />
              <Text style={styles.creatorText}>@{league.creator}</Text>
            </View>
          </LinearGradient>

          {/* Body Content */}
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Stats Cards */}
            <View style={styles.statsContainer}>
              {/* Participants */}
              <View style={styles.statCard}>
                <View
                  style={[
                    styles.statIconContainer,
                    { backgroundColor: LEAGUE_DETAIL_STAT_ICONS.participants.backgroundColor },
                  ]}
                >
                  <Ionicons
                    name={LEAGUE_DETAIL_STAT_ICONS.participants.icon}
                    size={20}
                    color={LEAGUE_DETAIL_STAT_ICONS.participants.color}
                  />
                </View>
                <View style={styles.statInfo}>
                  <Text style={styles.statValue}>{league.participants}</Text>
                  <Text style={styles.statLabel}>/ {league.maxParticipants}</Text>
                </View>
              </View>

              {/* Prize */}
              <View style={styles.statCard}>
                <View style={[styles.statIconContainer, { backgroundColor: LEAGUE_DETAIL_STAT_ICONS.prize.backgroundColor }]}>
                  <Ionicons name={LEAGUE_DETAIL_STAT_ICONS.prize.icon} size={20} color={LEAGUE_DETAIL_STAT_ICONS.prize.color} />
                </View>
                <View style={styles.statInfo}>
                  <Text style={styles.statValue}>{league.prize}</Text>
                  <Text style={styles.statLabel}>Ödül</Text>
                </View>
              </View>

              {/* End Date */}
              <View style={styles.statCard}>
                <View
                  style={[
                    styles.statIconContainer,
                    { backgroundColor: LEAGUE_DETAIL_STAT_ICONS.endDate.backgroundColor },
                  ]}
                >
                  <Ionicons name={LEAGUE_DETAIL_STAT_ICONS.endDate.icon} size={20} color={LEAGUE_DETAIL_STAT_ICONS.endDate.color} />
                </View>
                <View style={styles.statInfo}>
                  <Text style={styles.statValue} numberOfLines={1}>
                    {league.endDate}
                  </Text>
                  <Text style={styles.statLabel}>Bitiş</Text>
                </View>
              </View>

              {/* Join Cost */}
              <View style={styles.statCard}>
                <View
                  style={[
                    styles.statIconContainer,
                    { backgroundColor: LEAGUE_DETAIL_STAT_ICONS.joinCost.backgroundColor },
                  ]}
                >
                  <Ionicons name={LEAGUE_DETAIL_STAT_ICONS.joinCost.icon} size={20} color={LEAGUE_DETAIL_STAT_ICONS.joinCost.color} />
                </View>
                <View style={styles.statInfo}>
                  <Text style={styles.statValue}>{league.joinCost === 0 ? 'Ücretsiz' : `${league.joinCost}`}</Text>
                  <Text style={styles.statLabel}>Katılım Ücreti</Text>
                </View>
              </View>
            </View>

            {/* Categories */}
            {league.categories && league.categories.length > 0 && (
              <View style={styles.categoriesSection}>
                <Text style={styles.sectionTitle}>Kategoriler</Text>
                <View style={styles.categoriesList}>
                  {league.categories.map((cat, index) => (
                    <View key={index} style={styles.categoryTag}>
                      <Text style={styles.categoryTagText}>{cat}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Primary Action - YARIŞ! */}
            <TouchableOpacity style={styles.primaryButton} onPress={onQuestions} activeOpacity={0.85}>
              <LinearGradient
                colors={[PRIMARY_BLUE, PRIMARY_BLUE, PRIMARY_BLUE]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.primaryButtonGradient}
              >
                <Ionicons name="rocket-outline" size={22} color="#FFFFFF" style={styles.rocketIcon} />
                <Text style={styles.primaryButtonText}>YARIŞ!</Text>
                <View style={styles.buttonArrow}>
                  <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.8)" />
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {/* Quick Actions */}
            <View style={styles.quickActions}>
              <TouchableOpacity style={styles.quickActionButton} onPress={onLeaderboard} activeOpacity={0.8}>
                <LinearGradient
                  colors={['rgba(245,158,11,0.2)', 'rgba(245,158,11,0.1)']}
                  style={styles.quickActionGradient}
                >
                  <Ionicons name="trophy" size={22} color="#F59E0B" />
                  <Text style={styles.quickActionText}>Sıralama</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.quickActionButton} onPress={onChat} activeOpacity={0.8}>
                <LinearGradient
                  colors={['rgba(59,130,246,0.2)', 'rgba(59,130,246,0.1)']}
                  style={styles.quickActionGradient}
                >
                  <Ionicons name="chatbubbles" size={22} color="#3B82F6" />
                  <Text style={styles.quickActionText}>Sohbet</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.quickActionButton} onPress={onShare} activeOpacity={0.8}>
                <LinearGradient
                  colors={['rgba(236,72,153,0.2)', 'rgba(236,72,153,0.1)']}
                  style={styles.quickActionGradient}
                >
                  <Ionicons name="share-social" size={22} color="#EC4899" />
                  <Text style={styles.quickActionText}>Davet</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  buttonArrow: {
    position: 'absolute',
    right: 20,
  },
  categoriesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoriesSection: {
    marginBottom: 24,
  },
  categoryTag: {
    backgroundColor: 'rgba(139,92,246,0.15)',
    borderColor: 'rgba(139,92,246,0.3)',
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  categoryTagText: {
    color: '#A78BFA',
    fontSize: 13,
    fontWeight: '600',
  },
  closeButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    position: 'absolute',
    right: 16,
    top: 16,
    width: 36,
    zIndex: 10,
  },
  content: {
    backgroundColor: '#0D1117',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    height: '85%',
    overflow: 'hidden',
  },
  creatorBadge: {
    alignItems: 'center',
    backgroundColor: 'rgba(37, 110, 255,0.15)',
    borderRadius: 20,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  creatorText: {
    color: PRIMARY_BLUE,
    fontSize: 13,
    fontWeight: '600',
  },
  header: {
    alignItems: 'center',
    borderBottomColor: 'rgba(255,255,255,0.08)',
    borderBottomWidth: 1,
    padding: 24,
    paddingTop: 20,
    position: 'relative',
  },
  leagueDescription: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 15,
    marginBottom: 12,
    paddingHorizontal: 20,
    textAlign: 'center',
  },
  leagueIcon: {
    alignItems: 'center',
    borderRadius: 22,
    height: 72,
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: 'rgba(0,0,0,0.45)',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    width: 72,
  },
  leagueTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  primaryButton: {
    borderRadius: 20,
    elevation: 8,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#256EFF',
    shadowOffset: { height: 6, width: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
  },
  primaryButtonGradient: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 18,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 2,
  },
  quickActionButton: {
    borderRadius: 16,
    flex: 1,
    overflow: 'hidden',
  },
  quickActionGradient: {
    alignItems: 'center',
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
    justifyContent: 'center',
    paddingVertical: 16,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '600',
  },
  rocketIcon: {
    marginRight: 12,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  scrollView: {
    flex: 1,
  },
  sectionTitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    padding: 14,
    width: '47%',
  },
  statIconContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(37, 110, 255,0.15)',
    borderRadius: 12,
    height: 40,
    justifyContent: 'center',
    marginRight: 12,
    width: 40,
  },
  statInfo: {
    flex: 1,
    minWidth: 0,
  },
  statLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
});
