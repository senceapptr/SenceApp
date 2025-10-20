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
          {/* Header with Gradient */}
          <LinearGradient
            colors={['#c61585', '#5a3a8f', '#432870']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
          >
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>

            <View style={styles.leagueIcon}>
              <Text style={styles.leagueIconText}>🏆</Text>
            </View>

            <Text style={styles.leagueTitle}>{league.name}</Text>
            <Text style={styles.leagueDescription}>{league.description}</Text>
            
            <View style={styles.creator}>
              <Text style={styles.creatorIcon}>👤</Text>
              <Text style={styles.creatorText}>@{league.creator} tarafından oluşturuldu</Text>
            </View>
          </LinearGradient>

          {/* Body Content */}
          <ScrollView 
            style={styles.scrollView} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.body}>
              {/* Stats Grid 2x2 */}
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
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#432870', '#5a3a8f']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.joinButtonGradient}
                  >
                    <Text style={styles.joinText}>🎯 Katıl</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <View style={styles.secondaryButtons}>
                  <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={onLeaderboard}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.secondaryButtonText}>🏆 Sıralama</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={onScoring}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.secondaryButtonText}>📊 Puanlama</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '82%',
    overflow: 'hidden',
  },
  header: {
    padding: 24,
    paddingTop: 32,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  leagueIcon: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  leagueIconText: {
    fontSize: 40,
  },
  leagueTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: 'white',
    marginBottom: 8,
  },
  leagueDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 12,
  },
  creator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  creatorIcon: {
    fontSize: 14,
  },
  creatorText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  body: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
  },
  statsGrid: {
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
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
    gap: 12,
  },
  joinButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  joinButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  joinText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  secondaryButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#F2F3F5',
    borderRadius: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#202020',
  },
});
