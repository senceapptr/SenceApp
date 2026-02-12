import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';

import { League } from '../types';
import { PRIMARY_BLUE } from '../shared/theme';
import { resolveLeagueIcon } from '../shared/leagueIcons';
import { LEAGUE_DETAIL_STAT_ICONS } from '../shared/leagueDetailStatIcons';

interface DiscoverLeagueModalProps {
  visible: boolean;
  onJoin: () => void;
  onClose: () => void;
  league: League | null;
  onScoring: () => void;
  onLeaderboard: () => void;
}

export function DiscoverLeagueModal({
  league,
  onClose,
  onJoin,
  onLeaderboard,
  onScoring,
  visible,
}: DiscoverLeagueModalProps) {
  if (!league) return null;
  const resolvedIcon = resolveLeagueIcon(league.leagueIconName, league.leagueIconColor);
  const canJoin = !league.isJoined && league.status !== 'completed';
  const joinText = league.isJoined ? 'Katıldın' : league.status === 'completed' ? 'Süre Doldu' : 'Lige Katıl';

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
                <View
                  style={[
                    styles.statIconContainer,
                    { backgroundColor: LEAGUE_DETAIL_STAT_ICONS.prize.backgroundColor },
                  ]}
                >
                  <Ionicons
                    name={LEAGUE_DETAIL_STAT_ICONS.prize.icon}
                    size={20}
                    color={LEAGUE_DETAIL_STAT_ICONS.prize.color}
                  />
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
                  <Ionicons
                    name={LEAGUE_DETAIL_STAT_ICONS.endDate.icon}
                    size={20}
                    color={LEAGUE_DETAIL_STAT_ICONS.endDate.color}
                  />
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
                  <Ionicons
                    name={LEAGUE_DETAIL_STAT_ICONS.joinCost.icon}
                    size={20}
                    color={LEAGUE_DETAIL_STAT_ICONS.joinCost.color}
                  />
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

              <TouchableOpacity style={styles.quickActionButton} onPress={onScoring} activeOpacity={0.8}>
                <LinearGradient
                  colors={['rgba(59,130,246,0.2)', 'rgba(59,130,246,0.1)']}
                  style={styles.quickActionGradient}
                >
                  <Ionicons name="analytics" size={22} color="#3B82F6" />
                  <Text style={styles.quickActionText}>Puanlama</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Join Button */}
            <TouchableOpacity style={styles.joinButton} onPress={onJoin} activeOpacity={0.8} disabled={!canJoin}>
              <LinearGradient
                colors={canJoin ? [PRIMARY_BLUE, PRIMARY_BLUE] : ['#2F4F8C', '#2F4F8C']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.joinGradient, !canJoin && styles.joinGradientDisabled]}
              >
                <View style={styles.joinLeft}>
                  <Ionicons
                    name={league.isJoined ? 'checkmark-circle-outline' : 'rocket-outline'}
                    size={20}
                    color="#FFFFFF"
                  />
                  <Text style={styles.joinText}>{joinText}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.85)" style={styles.joinChevron} />
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  categoriesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoriesSection: {
    marginBottom: 24,
  },
  categoryTag: {
    backgroundColor: 'rgba(37, 110, 255,0.15)',
    borderColor: 'rgba(37, 110, 255,0.3)',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  categoryTagText: {
    color: PRIMARY_BLUE,
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
    backgroundColor: 'rgba(37, 110, 255, 0.15)',
    borderRadius: 12,
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
  joinButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  joinChevron: {
    marginRight: 2,
  },
  joinGradient: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
  joinGradientDisabled: {
    opacity: 0.88,
  },
  joinLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  joinText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  leagueDescription: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
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
    shadowOffset: { height: 5, width: 0 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    width: 72,
  },
  leagueTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  quickActionButton: {
    borderRadius: 16,
    flex: 1,
    overflow: 'hidden',
  },
  quickActionGradient: {
    alignItems: 'center',
    borderRadius: 16,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    paddingVertical: 16,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  quickActionText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  scrollView: {
    flex: 1,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    width: '47%',
  },
  statIconContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(37, 110, 255,0.15)',
    borderRadius: 12,
    height: 40,
    justifyContent: 'center',
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
    fontSize: 16,
    fontWeight: '700',
  },
});
