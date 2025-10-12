import * as React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface RadioGroupProps {
  value: string;
  onValueChange: (value: string) => void;
  options: { label: string; value: string }[];
  style?: any;
}

function RadioGroup({ value, onValueChange, options, style }: RadioGroupProps) {
  return (
    <View style={[styles.group, style]}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={styles.item}
          onPress={() => onValueChange(option.value)}
        >
          <View style={[styles.circle, value === option.value && styles.circleActive]}>
            {value === option.value && <Feather name="circle" size={16} color="#2563eb" />}
          </View>
          <Text style={styles.label}>{option.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    flexDirection: 'column',
    gap: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  circleActive: {
    borderColor: '#2563eb',
    backgroundColor: '#e0e7ff',
  },
  label: {
    fontSize: 15,
    color: '#222',
  },
});

export { RadioGroup };
