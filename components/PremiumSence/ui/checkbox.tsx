import * as React from "react";
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  style?: any;
}

function Checkbox({ checked, onChange, style }: CheckboxProps) {
  return (
    <TouchableOpacity
      style={[styles.box, checked && styles.checked, style]}
      onPress={() => onChange(!checked)}
      activeOpacity={0.7}
    >
      {checked && <Feather name="check" size={18} color="#2563eb" />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  box: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checked: {
    borderColor: '#2563eb',
    backgroundColor: '#e0e7ff',
  },
});

export { Checkbox };
