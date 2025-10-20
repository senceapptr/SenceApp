import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface LogoutButtonProps {
  onPress: () => void;
  isDarkMode: boolean;
}

export function LogoutButton({ onPress, isDarkMode }: LogoutButtonProps) {
  const theme = {
    bg: isDarkMode ? 'rgba(255, 165, 0, 0.15)' : '#FEF3C7',
    border: isDarkMode ? 'rgba(255, 165, 0, 0.3)' : '#FCD34D',
    text: isDarkMode ? '#FFA500' : '#D97706',
  };

  return (
    <TouchableOpacity 
      style={[styles.button, { 
        backgroundColor: theme.bg,
        borderColor: theme.border
      }]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons name="log-out-outline" size={20} color={theme.text} style={styles.icon} />
      <Text style={[styles.text, { color: theme.text }]}>
        Çıkış Yap
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FCD34D',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  icon: {
    marginRight: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D97706',
    textAlign: 'center',
  },
});

