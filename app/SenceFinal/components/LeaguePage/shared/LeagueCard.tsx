import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { League } from '../types';
import { CategoryBadge } from './CategoryBadge';

interface LeagueCardProps {
  league: League;
  isMyLeague?: boolean;
  onCardPress: (league: League) => void;
  onJoinPress?: (league: League) => void;
  onQuestionsPress?: (league: League) => void;
  onLeaderboardPress?: (league: League) => void;
  onChatPress?: (league: League) => void;
}

export function LeagueCard({
  league,
  isMyLeague = false,
  onCardPress,
  onJoinPress,
  onQuestionsPress,
  onLeaderboardPress,
  onChatPress,
}: LeagueCardProps) {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        (league.isFeatured || (isMyLeague && league.status === 'active')) && styles.featuredCard,
        league.status === 'completed' && styles.completedCard
      ]}
      onPress={() => onCardPress(league)}
      activeOpacity={0.9}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.name}>{league.name}</Text>
            <Text style={styles.description}>{league.description}</Text>
            <View style={styles.meta}>
              <CategoryBadge category={league.category} />
              <Text style={styles.separator}>•</Text>
              <Text style={styles.creator}>@{league.creator}</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            {!isMyLeague ? (
              <>
                <Text style={styles.prizeText}>{league.prize}</Text>
                <Text style={styles.prizeLabel}>Ödül</Text>
              </>
            ) : (
              <>
                <Text style={styles.positionText}>#{league.position}</Text>
                <Text style={styles.positionLabel}>Sıralama</Text>
              </>
            )}
          </View>
        </View>
        
        <View style={styles.stats}>
          <Text style={styles.statsText}>👥 {league.participants}/{league.maxParticipants}</Text>
          <Text style={styles.statsText}>📅 {league.endDate}</Text>
        </View>

        {!isMyLeague ? (
          <TouchableOpacity 
            style={styles.joinButtonWrapper}
            onPress={(e) => {
              e.stopPropagation();
              onJoinPress?.(league);
            }}
            disabled={league.status === 'completed'}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#432870', '#5A3A8B', '#6B4A9D']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.joinButton}
            >
              <Text style={styles.joinButtonText}>Katıl</Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <View style={styles.myLeagueActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={(e) => {
                e.stopPropagation();
                onQuestionsPress?.(league);
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.actionButtonText}>📝 Sorular</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={(e) => {
                e.stopPropagation();
                onLeaderboardPress?.(league);
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.actionButtonText}>🏆 Sıralama</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.chatActionButton}
              onPress={(e) => {
                e.stopPropagation();
                onChatPress?.(league);
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.chatActionButtonText}>💬</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#F2F3F5',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  featuredCard: {
    borderColor: '#432870',
  },
  completedCard: {
    opacity: 0.6,
  },
  content: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
    marginRight: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: '900',
    color: '#202020',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: 'rgba(32, 32, 32, 0.7)',
    marginBottom: 12,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    fontSize: 12,
    color: 'rgba(32, 32, 32, 0.5)',
    marginHorizontal: 8,
  },
  creator: {
    fontSize: 12,
    color: 'rgba(32, 32, 32, 0.5)',
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  prizeText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#432870',
    textAlign: 'right',
  },
  prizeLabel: {
    fontSize: 14,
    color: 'rgba(32, 32, 32, 0.5)',
    marginTop: 4,
  },
  positionText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#432870',
  },
  positionLabel: {
    fontSize: 14,
    color: 'rgba(32, 32, 32, 0.5)',
    marginTop: 4,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statsText: {
    fontSize: 14,
    color: 'rgba(32, 32, 32, 0.7)',
  },
  joinButtonWrapper: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  joinButton: {
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 24,
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  myLeagueActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#F2F3F5',
    borderRadius: 16,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#202020',
  },
  chatActionButton: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#432870',
    borderRadius: 16,
    alignItems: 'center',
  },
  chatActionButtonText: {
    fontSize: 16,
  },
});

