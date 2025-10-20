import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SettingSectionProps } from '../types';
import { SettingCard } from './SettingCard';
import { useTheme } from '../../../contexts/ThemeContext';

export function SettingSection({ 
  section, 
  settings, 
  isDarkMode, 
  onToggleSetting, 
  onNavigate 
}: SettingSectionProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.section}>
      <Text style={[styles.title, { color: theme.textPrimary }]}>
        {section.title}
      </Text>
      <View style={styles.items}>
        {section.items.map((item) => (
          <SettingCard
            key={item.key}
            item={item}
            settings={settings}
            isDarkMode={isDarkMode}
            onToggle={onToggleSetting}
            onNavigate={onNavigate}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    // No specific styles needed, handled by parent
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  items: {
    gap: 12,
  },
});

