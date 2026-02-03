import React from 'react';
import { Switch } from 'react-native';
import { SettingSwitchProps } from '../types';
import { useTheme } from '@/contexts/ThemeContext';

export function SettingSwitch({ value, onValueChange, isDarkMode }: SettingSwitchProps) {
  const { theme } = useTheme();
  const trackBorder = isDarkMode ? '#30363D' : '#D1D5DB';
  const thumbSurface = isDarkMode ? '#21262D' : '#FFFFFF';

  return (
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ 
        false: trackBorder, 
        true: theme.accent 
      }}
      thumbColor={thumbSurface}
      ios_backgroundColor={trackBorder}
    />
  );
}

