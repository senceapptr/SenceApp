import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { UserCardProps } from '../types';
import { useTheme } from '@/contexts/ThemeContext';

export function UserCard({ username, avatarUrl, onPress }: UserCardProps) {
  const { theme, isDarkMode } = useTheme();

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={isDarkMode 
          ? ['rgba(16, 185, 129, 0.15)', 'rgba(5, 150, 105, 0.15)']
          : ['rgba(16, 185, 129, 0.1)', 'rgba(5, 150, 105, 0.1)']
        }
        style={[styles.card, { borderColor: theme.border }]}
      >
        <View style={styles.content}>
          <View style={styles.avatar}>
            <Image 
              source={{ uri: avatarUrl }}
              style={styles.avatarImage}
            />
          </View>
          <View style={styles.details}>
            <Text style={[styles.username, { color: theme.textPrimary }]}>
              {username}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#D1D5DB',
    overflow: 'hidden',
    marginRight: 16,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  details: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
});

