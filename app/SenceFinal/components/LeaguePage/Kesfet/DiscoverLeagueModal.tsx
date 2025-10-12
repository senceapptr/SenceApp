import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { League } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

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
          <LinearGradient
            colors={['#432870', '#5A3A8B', '#B29EFD']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
          >
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>

            <View style={styles.headerIcon}>
              <Text style={styles.headerIconText}>🏆</Text>
            </View>
            <Text style={styles.headerTitle}>{league.name}</Text>
            <Text style={styles.headerSubtitle}>{league.description}</Text>
            
            <View style={styles.creator}>
              <Text style={styles.creatorIcon}>👤</Text>
              <Text style={styles.creatorText}>@{league.creator} tarafından oluşturuldu</Text>
            </View>
          </LinearGradient>

          <View style={styles.body}>
            {/* 2x2 Stats Grid */}
            <View style={styles.statsGrid}>
              <View style={styles.statsRow}>
                <View style={[styles.statCard, styles.statCardParticipants]}>
                  <Text style={styles.statLabel}>KATILIMCI</Text>
                  <Text style={styles.statValue}>{league.participants}</Text>
                  <Text style={styles.statSubtext}>/ {league.maxParticipants} maksimum</Text>
                </View>
                
                <View style={[styles.statCard, styles.statCardReward]}>
                  <Text style={styles.statLabel}>ÖDÜL</Text>
                  <Text style={styles.statValue}>{league.prize}</Text>
                </View>
              </View>

              <View style={styles.statsRow}>
                <View style={[styles.statCard, styles.statCardEnd]}>
                  <Text style={styles.statLabel}>BİTİŞ</Text>
                  <Text style={styles.statValue}>{league.endDate}</Text>
                </View>
                
                <View style={[styles.statCard, styles.statCardParticipation]}>
                  <Text style={styles.statLabel}>KATILIM</Text>
                  <Text style={styles.statValue}>
                    {league.joinCost === 0 ? 'Ücretsiz' : `${league.joinCost} kredi`}
                  </Text>
                </View>
              </View>
            </View>

            {/* Categories */}
            <View style={styles.categoriesSection}>
              <Text style={styles.categoriesSectionTitle}>🎯 Kategoriler</Text>
              <View style={styles.categoriesList}>
                {league.categories.map((cat, index) => (
                  <View key={index} style={styles.categoryTag}>
                    <Text style={styles.categoryTagText}>{cat}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.joinButton}
                onPress={onJoin}
                activeOpacity={0.7}
              >
                <Text style={styles.joinText}>🎯 Katıl</Text>
              </TouchableOpacity>
              <View style={styles.secondaryButtons}>
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={onLeaderboard}
                  activeOpacity={0.8}
                >
                  <Text style={styles.secondaryText}>🏆 Sıralama</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={onScoring}
                  activeOpacity={0.8}
                >
                  <Text style={styles.secondaryText}>📊 Puanlama</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  content: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    marginTop: 60,
    marginBottom: 20,
    marginHorizontal: 16,
    maxHeight: '85%',
    minHeight: '70%',
    overflow: 'hidden',
  },
  header: {
    padding: 32,
    position: 'relative',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeText: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  headerIcon: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerIconText: {
    fontSize: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  creator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
  },
  creatorIcon: {
    fontSize: 14,
  },
  creatorText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  body: {
    padding: 24,
    paddingBottom: 32,
  },
  statsGrid: {
    paddingHorizontal: 8,
    paddingTop: 4,
    paddingBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
  },
  statCardParticipants: {
    backgroundColor: '#F3F4F6',
    borderColor: '#D1D5DB',
  },
  statCardReward: {
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
  },
  statCardEnd: {
    backgroundColor: '#DBEAFE',
    borderColor: '#93C5FD',
  },
  statCardParticipation: {
    backgroundColor: '#F3E8FF',
    borderColor: '#D8B4FE',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 4,
  },
  statSubtext: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  categoriesSection: {
    marginBottom: 24,
  },
  categoriesSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#202020',
    marginBottom: 12,
  },
  categoriesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryTag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(178, 158, 253, 0.3)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(67, 40, 112, 0.2)',
  },
  categoryTagText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#202020',
  },
  actions: {
    borderTopWidth: 2,
    borderTopColor: '#F2F3F5',
    paddingTop: 16,
    gap: 12,
  },
  joinButton: {
    backgroundColor: '#432870',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#432870',
  },
  joinText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  secondaryButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F2F3F5',
    borderRadius: 16,
    alignItems: 'center',
  },
  secondaryText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#202020',
  },
});

