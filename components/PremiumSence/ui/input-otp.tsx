import * as React from "react";
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface InputOTPProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  style?: any;
}

function InputOTP({ length = 6, value, onChange, style }: InputOTPProps) {
  const inputs = React.useRef<(TextInput | null)[]>([]);

  const handleChange = (text: string, idx: number) => {
    if (!/^[0-9]?$/.test(text)) return;
    const chars = value.split('');
    chars[idx] = text;
    const newValue = chars.join('').slice(0, length);
    onChange(newValue);
    if (text && idx < length - 1) {
      inputs.current[idx + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, idx: number) => {
    if (e.nativeEvent.key === 'Backspace' && !value[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus();
    }
  };

  return (
    <View style={[styles.group, style]}>
      {Array.from({ length }).map((_, idx) => (
        <TextInput
          key={idx}
          ref={ref => (inputs.current[idx] = ref)}
          style={styles.input}
          keyboardType="number-pad"
          maxLength={1}
          value={value[idx] || ''}
          onChangeText={text => handleChange(text, idx)}
          onKeyPress={e => handleKeyPress(e, idx)}
          textAlign="center"
        />
      ))}
    </View>
  );
}

function InputOTPSeparator() {
  return (
    <View style={styles.separator}>
      <Feather name="minus" size={18} color="#888" />
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    width: 40,
    height: 48,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    fontSize: 22,
    color: '#222',
    backgroundColor: '#fff',
    marginHorizontal: 2,
  },
  separator: {
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export { InputOTP, InputOTPSeparator };
