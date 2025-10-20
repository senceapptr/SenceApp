import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SocialButtonProps } from '../types';

export function SocialButton({ social, onPress, isDarkMode }: SocialButtonProps) {
  const theme = {
    surface: isDarkMode ? '#1F2937' : 'white',
    border: isDarkMode ? '#374151' : '#E5E7EB',
    textPrimary: isDarkMode ? '#F9FAFB' : '#111827',
    textMuted: isDarkMode ? '#9CA3AF' : '#6B7280',
  };

  return (
    <TouchableOpacity
      style={[styles.container, { 
        backgroundColor: theme.surface, 
        borderColor: theme.border,
        shadowColor: isDarkMode ? 'transparent' : '#000'
      }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.info}>
          <View style={styles.iconContainer}>
            <Ionicons name={social.icon as any} size={24} color={social.color} />
          </View>
          <Text style={[styles.label, { color: theme.textPrimary }]}>
            {social.platform}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
});

