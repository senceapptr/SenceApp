import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { League } from '../types';
import { LeagueCard } from '../shared/LeagueCard';

interface FeaturedSectionProps {
  nowTick: number;
  leagues: League[];
  onCardPress: (league: League) => void;
  onJoinPress: (league: League) => void;
}

export function FeaturedSection({ leagues, nowTick, onCardPress, onJoinPress }: FeaturedSectionProps) {
  if (leagues.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Öne Çıkarılan Ligler</Text>
      {leagues.map(league => (
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
    color: '#F0F6FC',
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 16,
  },
});
