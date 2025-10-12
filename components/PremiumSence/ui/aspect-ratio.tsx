import * as React from "react";
import { View, StyleSheet, ViewStyle } from 'react-native';

interface AspectRatioProps {
  ratio?: number;
  style?: ViewStyle;
  children: React.ReactNode;
}

function AspectRatio({ ratio = 1, style, children }: AspectRatioProps) {
  return (
    <View style={[{ aspectRatio: ratio }, style]}>{children}</View>
  );
}

export { AspectRatio };
