import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { League } from '../types';
import { LeagueCard } from '../shared/LeagueCard';

interface CompletedSectionProps {
  leagues: League[];
  nowTick: number;
  onCardPress: (league: League) => void;
  onQuestionsPress: (league: League) => void;
  onLeaderboardPress: (league: League) => void;
  onChatPress: (league: League) => void;
}

export function CompletedSection({ 
  leagues, 
  nowTick,
  onCardPress,
  onQuestionsPress,
  onLeaderboardPress,
  onChatPress
}: CompletedSectionProps) {
  if (leagues.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Tamamlanan Ligler</Text>
      {leagues.map((league) => (
        <LeagueCard
          key={league.id}
          league={league}
          nowTick={nowTick}
          isMyLeague
          onCardPress={onCardPress}
          onQuestionsPress={onQuestionsPress}
          onLeaderboardPress={onLeaderboardPress}
          onChatPress={onChatPress}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 32,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: '#F0F6FC',
    marginBottom: 16,
  },
});
