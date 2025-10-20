import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PageHeaderProps } from '../types';
import { useTheme } from '../../../contexts/ThemeContext';

export function PageHeader({ onBack, onMenuToggle }: PageHeaderProps) {
  const { theme, isDarkMode } = useTheme();

  return (
    <View style={[styles.header, { 
      backgroundColor: theme.surface, 
      borderBottomColor: theme.border 
    }]}>
      <TouchableOpacity
        onPress={onBack}
        style={[styles.backButton, { backgroundColor: theme.hover }]}
        activeOpacity={0.7}
      >
        <Ionicons name="chevron-back" size={20} color={theme.textSecondary} />
      </TouchableOpacity>
      
      <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
        Ayarlar
      </Text>
      
      <TouchableOpacity 
        style={[styles.menuButton, { 
          backgroundColor: theme.surface, 
          borderColor: theme.border,
          shadowColor: isDarkMode ? 'transparent' : '#000'
        }]}
        onPress={onMenuToggle}
        activeOpacity={0.8}
      >
        <View style={styles.hamburgerIcon}>
          <View style={[styles.hamburgerLine, { backgroundColor: theme.primary }]} />
          <View style={[styles.hamburgerLine, { backgroundColor: theme.primary }]} />
          <View style={[styles.hamburgerLine, { backgroundColor: theme.primary }]} />
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
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  hamburgerIcon: {
    width: 20,
    height: 16,
    justifyContent: 'space-between',
  },
  hamburgerLine: {
    width: 20,
    height: 2.5,
    backgroundColor: '#432870',
    borderRadius: 1.25,
  },
});

