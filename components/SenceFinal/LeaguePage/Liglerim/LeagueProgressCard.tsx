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
            colors={['#10B981', '#34D399']}
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
    backgroundColor: '#161B22',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#30363D',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
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
    color: '#F0F6FC',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#8B949E',
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
    backgroundColor: '#0D1117',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
  },
});

