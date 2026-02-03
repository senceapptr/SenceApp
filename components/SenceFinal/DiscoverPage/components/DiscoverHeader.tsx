import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';

interface DiscoverHeaderProps {
  onBack: () => void;
  onMenuToggle: () => void;
}

export function DiscoverHeader({ onBack, onMenuToggle }: DiscoverHeaderProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.header, { backgroundColor: theme.background }]}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
      </TouchableOpacity>
      <Text style={[styles.title, { color: theme.textPrimary }]}>Yeni Keşfet</Text>
      <TouchableOpacity onPress={onMenuToggle} style={styles.menuButton}>
        <View style={styles.hamburgerIcon}>
          <View style={[styles.hamburgerLine, { backgroundColor: theme.textPrimary }]} />
          <View style={[styles.hamburgerLine, { backgroundColor: theme.textPrimary }]} />
          <View style={[styles.hamburgerLine, { backgroundColor: theme.textPrimary }]} />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  menuButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hamburgerIcon: {
    width: 20,
    height: 16,
    justifyContent: 'space-between',
  },
  hamburgerLine: {
    width: 20,
    height: 2.5,
    borderRadius: 1.25,
  },
});
