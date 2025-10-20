import React from 'react';
import { Switch } from 'react-native';
import { SettingSwitchProps } from '../types';

export function SettingSwitch({ value, onValueChange, isDarkMode }: SettingSwitchProps) {
  const theme = {
    primary: '#432870',
    border: isDarkMode ? '#374151' : '#D1D5DB',
    surface: isDarkMode ? '#1F2937' : '#FFFFFF',
  };

  return (
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ 
        false: theme.border, 
        true: theme.primary 
      }}
      thumbColor={theme.surface}
      ios_backgroundColor={theme.border}
    />
  );
}

