import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { League } from '../types';
import { LeagueCard } from '../shared/LeagueCard';

interface CommunitySectionProps {
  leagues: League[];
  nowTick: number;
  onCardPress: (league: League) => void;
  onJoinPress: (league: League) => void;
}

export function CommunitySection({ leagues, nowTick, onCardPress, onJoinPress }: CommunitySectionProps) {
  if (leagues.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Topluluk Ligleri</Text>
      {leagues.map((league) => (
        <LeagueCard
          key={league.id}
          league={league}
          nowTick={nowTick}
          onCardPress={onCardPress}
          onJoinPress={onJoinPress}
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
