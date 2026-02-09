import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { League } from '../types';

interface MyLeagueModalProps {
  visible: boolean;
  league: League | null;
  onClose: () => void;
  onQuestions: () => void;
  onLeaderboard: () => void;
  onChat: () => void;
  onShare: () => void;
}

export function MyLeagueModal({
  visible,
  league,
  onClose,
  onQuestions,
  onLeaderboard,
  onChat,
  onShare
}: MyLeagueModalProps) {
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
                <View style={[styles.statIconContainer, { backgroundColor: 'rgba(239,68,68,0.15)' }]}>
                  <Ionicons name="calendar" size={20} color="#EF4444" />
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
                  <Text style={styles.statLabel}>Katılım</Text>
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
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={onQuestions}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={['#10B981', '#059669', '#047857']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.primaryButtonGradient}
              >
                <Text style={styles.rocketIcon}>🚀</Text>
                <Text style={styles.primaryButtonText}>YARIŞ!</Text>
                <View style={styles.buttonArrow}>
                  <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.8)" />
                </View>
              </LinearGradient>
            </TouchableOpacity>

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
                onPress={onChat}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['rgba(59,130,246,0.2)', 'rgba(59,130,246,0.1)']}
                  style={styles.quickActionGradient}
                >
                  <Ionicons name="chatbubbles" size={22} color="#3B82F6" />
                  <Text style={styles.quickActionText}>Sohbet</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickActionButton}
                onPress={onShare}
                activeOpacity={0.8}
              >
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
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  leagueIconText: {
    fontSize: 36,
  },
  leagueTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  leagueDescription: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 12,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  creatorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(16,185,129,0.15)',
    borderRadius: 20,
  },
  creatorText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6EE7B7',
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(16,185,129,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statInfo: {
    flex: 1,
  },
  statValue: {
    fontSize: 17,
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
    fontSize: 14,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  categoriesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryTag: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: 'rgba(139,92,246,0.15)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.3)',
  },
  categoryTagText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#A78BFA',
  },
  primaryButton: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  primaryButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  rocketIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  primaryButtonText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  buttonArrow: {
    position: 'absolute',
    right: 20,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  quickActionGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
  },
});
