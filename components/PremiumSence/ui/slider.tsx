import * as React from "react";
import { View, StyleSheet } from 'react-native';
import SliderRN from '@react-native-community/slider';

interface SliderProps {
  value: number;
  onValueChange: (value: number) => void;
  minimumValue?: number;
  maximumValue?: number;
  step?: number;
  style?: any;
}

function Slider({ value, onValueChange, minimumValue = 0, maximumValue = 100, step = 1, style }: SliderProps) {
  return (
    <View style={style}>
      <SliderRN
        value={value}
        onValueChange={onValueChange}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        step={step}
        style={styles.slider}
        minimumTrackTintColor="#2563eb"
        maximumTrackTintColor="#dbeafe"
        thumbTintColor="#2563eb"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  slider: {
    width: '100%',
    height: 32,
  },
});

export { Slider };
