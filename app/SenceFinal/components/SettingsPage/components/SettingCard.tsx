import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SettingCardProps } from '../types';
import { SettingSwitch } from './SettingSwitch';
import { useTheme } from '../../../contexts/ThemeContext';

export function SettingCard({ item, settings, isDarkMode, onToggle, onNavigate }: SettingCardProps) {
  const { theme, toggleTheme } = useTheme();
  
  const isToggle = item.type === 'toggle';
  const isNavigate = item.type === 'navigate';

  const handlePress = () => {
    if (isNavigate) {
      onNavigate(item.key);
    }
  };

  const handleToggle = () => {
    if (item.key === 'darkMode') {
      toggleTheme();
    } else {
      onToggle(item.key);
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.card, { 
        backgroundColor: theme.surface, 
        borderColor: theme.border,
        shadowColor: isDarkMode ? 'transparent' : '#000'
      }]}
      onPress={handlePress}
      activeOpacity={isNavigate ? 0.7 : 1}
      disabled={!isNavigate}
    >
      <View style={styles.content}>
        <View style={styles.info}>
          <Text style={[styles.label, { color: theme.textPrimary }]}>
            {item.label}
          </Text>
          <Text style={[styles.description, { color: theme.textSecondary }]}>
            {item.description}
          </Text>
        </View>
        
        {isToggle && (
          <SettingSwitch
            value={item.key === 'darkMode' ? isDarkMode : settings[item.key as keyof typeof settings] as boolean}
            onValueChange={handleToggle}
            isDarkMode={isDarkMode}
          />
        )}
        
        {isNavigate && (
          <View style={styles.navigateButton}>
            <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
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
    flex: 1,
    marginRight: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
  },
  navigateButton: {
    padding: 4,
  },
});

