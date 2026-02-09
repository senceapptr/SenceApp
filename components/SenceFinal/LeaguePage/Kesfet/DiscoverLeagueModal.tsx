import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { League } from '../types';

interface DiscoverLeagueModalProps {
  visible: boolean;
  league: League | null;
  onClose: () => void;
  onJoin: () => void;
  onLeaderboard: () => void;
  onScoring: () => void;
}

export function DiscoverLeagueModal({
  visible,
  league,
  onClose,
  onJoin,
  onLeaderboard,
  onScoring
}: DiscoverLeagueModalProps) {
  if (!league) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          {/* Dark Glass Header */}
          <LinearGradient
            colors={['#0D1117', '#161B22', '#21262D']}
            style={styles.header}
          >
            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={24} color="#9CA3AF" />
            </TouchableOpacity>

            {/* League Icon */}
            <LinearGradient
              colors={['#10B981', '#059669']}
              style={styles.leagueIcon}
            >
              <Text style={styles.leagueIconText}>🏆</Text>
            </LinearGradient>

            {/* League Info */}
            <Text style={styles.leagueTitle}>{league.name}</Text>
            <Text style={styles.leagueDescription}>{league.description}</Text>

            {/* Creator Badge */}
            <View style={styles.creatorBadge}>
              <Ionicons name="person-circle" size={16} color="#6EE7B7" />
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
                <View style={styles.statIconContainer}>
                  <Ionicons name="people" size={20} color="#10B981" />
                </View>
                <View style={styles.statInfo}>
                  <Text style={styles.statValue}>{league.participants}</Text>
                  <Text style={styles.statLabel}>/ {league.maxParticipants}</Text>
                </View>
              </View>

              {/* Prize */}
              <View style={styles.statCard}>
                <View style={[styles.statIconContainer, { backgroundColor: 'rgba(245,158,11,0.15)' }]}>
                  <Ionicons name="gift" size={20} color="#F59E0B" />
                </View>
                <View style={styles.statInfo}>
                  <Text style={styles.statValue}>{league.prize}</Text>
                  <Text style={styles.statLabel}>Ödül</Text>
                </View>
              </View>

              {/* End Date */}
              <View style={styles.statCard}>
                <View style={[styles.statIconContainer, { backgroundColor: 'rgba(59,130,246,0.15)' }]}>
                  <Ionicons name="calendar" size={20} color="#3B82F6" />
                </View>
                <View style={styles.statInfo}>
                  <Text style={styles.statValue}>{league.endDate}</Text>
                  <Text style={styles.statLabel}>Bitiş</Text>
                </View>
              </View>

              {/* Join Cost */}
              <View style={styles.statCard}>
                <View style={[styles.statIconContainer, { backgroundColor: 'rgba(139,92,246,0.15)' }]}>
                  <Ionicons name="ticket" size={20} color="#8B5CF6" />
                </View>
                <View style={styles.statInfo}>
                  <Text style={styles.statValue}>
                    {league.joinCost === 0 ? 'Ücretsiz' : `${league.joinCost}`}
                  </Text>
                  <Text style={styles.statLabel}>{league.joinCost > 0 ? 'Kredi' : 'Katılım'}</Text>
                </View>
              </View>
            </View>

            {/* Categories */}
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

            {/* Quick Actions */}
            <View style={styles.quickActions}>
              <TouchableOpacity
                style={styles.quickActionButton}
                onPress={onLeaderboard}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['rgba(245,158,11,0.2)', 'rgba(245,158,11,0.1)']}
                  style={styles.quickActionGradient}
                >
                  <Ionicons name="trophy" size={22} color="#F59E0B" />
                  <Text style={styles.quickActionText}>Sıralama</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickActionButton}
                onPress={onScoring}
                activeOpacity={0.8}
              >
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
            <TouchableOpacity
              style={styles.joinButton}
              onPress={onJoin}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#10B981', '#059669']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.joinGradient}
              >
                <Ionicons name="rocket" size={22} color="#FFFFFF" />
                <Text style={styles.joinText}>Lige Katıl</Text>
                <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.7)" />
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: '#0D1117',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    height: '85%',
    overflow: 'hidden',
  },
  header: {
    padding: 24,
    paddingTop: 20,
    alignItems: 'center',
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  leagueIcon: {
    width: 72,
    height: 72,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  leagueIconText: {
    fontSize: 32,
  },
  leagueTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  leagueDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  creatorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  creatorText: {
    fontSize: 13,
    color: '#6EE7B7',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    width: '47%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(16,185,129,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statInfo: {
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 2,
  },
  categoriesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  categoriesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryTag: {
    backgroundColor: 'rgba(16,185,129,0.15)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.3)',
  },
  categoryTagText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#10B981',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  quickActionButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  quickActionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
  },
  quickActionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  joinButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  joinGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
  },
  joinText: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
