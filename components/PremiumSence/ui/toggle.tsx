import * as React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface ToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label?: string;
  style?: ViewStyle;
  labelStyle?: TextStyle;
}

function Toggle({ value, onValueChange, label, style, labelStyle }: ToggleProps) {
  return (
    <TouchableOpacity
      style={[styles.toggle, value && styles.active, style]}
      onPress={() => onValueChange(!value)}
      activeOpacity={0.7}
    >
      <Text style={[styles.label, value && styles.activeLabel, labelStyle]}>{label || (value ? 'Açık' : 'Kapalı')}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  toggle: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    marginVertical: 4,
  },
  active: {
    backgroundColor: '#2563eb',
  },
  label: {
    fontSize: 15,
    color: '#222',
  },
  activeLabel: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export { Toggle };
