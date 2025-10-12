import * as React from "react";
import { View, StyleSheet, ViewStyle } from 'react-native';

interface ProgressProps {
  value: number; // 0-100
  style?: ViewStyle;
}

function Progress({ value, style }: ProgressProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={[styles.bar, { width: `${Math.max(0, Math.min(100, value))}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 8,
    width: '100%',
    backgroundColor: '#dbeafe',
    borderRadius: 8,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    backgroundColor: '#2563eb',
    borderRadius: 8,
  },
});

export { Progress };
