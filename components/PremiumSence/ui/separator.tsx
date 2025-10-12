import * as React from "react";
import { View, StyleSheet, ViewStyle } from 'react-native';

interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical';
  style?: ViewStyle;
}

function Separator({ orientation = 'horizontal', style }: SeparatorProps) {
  return (
    <View
      style={[
        orientation === 'horizontal' ? styles.horizontal : styles.vertical,
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  horizontal: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },
  vertical: {
    width: StyleSheet.hairlineWidth,
    height: '100%',
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
  },
});

export { Separator };
