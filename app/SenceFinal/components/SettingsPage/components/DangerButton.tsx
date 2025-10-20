import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DangerButtonProps } from '../types';

export function DangerButton({ onPress, isDarkMode }: DangerButtonProps) {
  const theme = {
    dangerBg: isDarkMode ? 'rgba(255, 87, 87, 0.15)' : '#FEE2E2',
    dangerBorder: isDarkMode ? 'rgba(255, 87, 87, 0.3)' : '#FCA5A5',
    dangerText: isDarkMode ? '#FF5757' : '#B91C1C',
  };

  return (
    <TouchableOpacity 
      style={[styles.button, { 
        backgroundColor: theme.dangerBg,
        borderColor: theme.dangerBorder
      }]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, { color: theme.dangerText }]}>
        Hesabı Sil
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#B91C1C',
    textAlign: 'center',
  },
});

