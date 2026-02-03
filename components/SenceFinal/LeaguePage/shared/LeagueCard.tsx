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
              colors={['#10B981', '#059669']}
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
    backgroundColor: '#161B22',
    borderWidth: 1,
    borderColor: '#30363D',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  featuredCard: {
    borderColor: '#10B981',
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
    color: '#F0F6FC',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#8B949E',
    marginBottom: 12,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    fontSize: 12,
    color: '#484F58',
    marginHorizontal: 8,
  },
  creator: {
    fontSize: 12,
    color: '#8B949E',
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  prizeText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#10B981',
    textAlign: 'right',
  },
  prizeLabel: {
    fontSize: 14,
    color: '#8B949E',
    marginTop: 4,
  },
  positionText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#10B981',
  },
  positionLabel: {
    fontSize: 14,
    color: '#8B949E',
    marginTop: 4,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statsText: {
    fontSize: 14,
    color: '#8B949E',
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
    backgroundColor: '#21262D',
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#30363D',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F0F6FC',
  },
  chatActionButton: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#10B981',
    borderRadius: 16,
    alignItems: 'center',
  },
  chatActionButtonText: {
    fontSize: 16,
  },
});

