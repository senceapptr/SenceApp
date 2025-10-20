import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { League } from '../types';
import { LeagueCard } from '../shared/LeagueCard';

interface FeaturedSectionProps {
  leagues: League[];
  onCardPress: (league: League) => void;
  onJoinPress: (league: League) => void;
}

export function FeaturedSection({ leagues, onCardPress, onJoinPress }: FeaturedSectionProps) {
  if (leagues.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Öne Çıkarılan Ligler</Text>
      {leagues.map((league) => (
        <LeagueCard
          key={league.id}
          league={league}
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
    color: '#202020',
    marginBottom: 16,
  },
});

