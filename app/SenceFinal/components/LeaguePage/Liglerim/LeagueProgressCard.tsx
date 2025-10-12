import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User } from '../types';

interface LeagueProgressCardProps {
  currentUser: User;
}

export function LeagueProgressCard({ currentUser }: LeagueProgressCardProps) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8}>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Lig Kotası</Text>
          <Text style={styles.subtitle}>
            {currentUser.joinedLeagues}/{currentUser.maxLeagues} lig
          </Text>
        </View>
        <View style={styles.circle}>
          <LinearGradient
            colors={['#432870', '#B29EFD']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.circleGradient}
          >
            <Text style={styles.count}>{currentUser.joinedLeagues}</Text>
            <Text style={styles.max}>/{currentUser.maxLeagues}</Text>
          </LinearGradient>
        </View>
      </View>
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill,
            { width: `${(currentUser.joinedLeagues / currentUser.maxLeagues) * 100}%` }
          ]}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  circle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
  },
  circleGradient: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  count: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  max: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#F2F3F5',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#432870',
  },
});

