import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { PageType } from '../types';

interface ProfileCardProps {
  name: string;
  avatar: string;
  balance: number;
  isOnline: boolean;
  onProfilePress: () => void;
}

export function ProfileCard({ name, avatar, balance, isOnline, onProfilePress }: ProfileCardProps) {
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onProfilePress}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: avatar }}
            style={styles.avatar}
          />
          {isOnline && <View style={styles.onlineIndicator} />}
        </View>
        <View style={styles.details}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.balance}>₺{balance.toFixed(2)}</Text>
        </View>
        <View style={styles.arrow}>
          <Text style={styles.arrowText}>›</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 24,
    marginBottom: 15,
    marginTop: 5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#00FF88',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  balance: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00FF88',
    marginTop: 4,
  },
  arrow: {
    marginLeft: 8,
  },
  arrowText: {
    fontSize: 24,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: 'bold',
  },
});







