import * as React from "react";
import { Switch as RNSwitch, StyleSheet, ViewStyle } from 'react-native';

interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  style?: ViewStyle;
}

function Switch({ value, onValueChange, style }: SwitchProps) {
  return (
    <RNSwitch
      value={value}
      onValueChange={onValueChange}
      style={style}
      trackColor={{ false: '#E5E7EB', true: '#2563eb' }}
      thumbColor={value ? '#fff' : '#fff'}
    />
  );
}

export { Switch };
