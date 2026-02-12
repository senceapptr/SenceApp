import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { User } from '../types';
import { ACCENT_DARK } from '../shared/theme';

interface LeagueProgressCardProps {
  currentUser: User;
}

export function LeagueProgressCard({ currentUser }: LeagueProgressCardProps) {
  const progress = Math.min(100, (currentUser.joinedLeagues / currentUser.maxLeagues) * 100);

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8}>
      <View style={styles.content}>
        <Text style={styles.title}>Lig Kotası</Text>
        <Text style={styles.subtitle}>
          {currentUser.joinedLeagues}/{currentUser.maxLeagues} lig kullanıldı
        </Text>
      </View>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#161B22',
    borderColor: '#30363D',
    borderRadius: 16,
    borderWidth: 1,
    elevation: 4,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  content: {
    marginBottom: 12,
  },
  progressBar: {
    backgroundColor: '#0D1117',
    borderRadius: 6,
    height: 10,
    overflow: 'hidden',
    width: '100%',
  },
  progressFill: {
    backgroundColor: ACCENT_DARK,
    borderRadius: 6,
    height: '100%',
  },
  subtitle: {
    color: '#8B949E',
    fontSize: 14,
    fontWeight: '500',
  },
  title: {
    color: '#F0F6FC',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
});
