import * as React from "react";
import { TextInput, StyleSheet, TextInputProps } from 'react-native';

function Textarea(props: TextInputProps) {
  return (
    <TextInput
      style={styles.textarea}
      multiline
      numberOfLines={4}
      placeholderTextColor="#888"
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  textarea: {
    minHeight: 80,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: '#fff',
    marginVertical: 6,
    textAlignVertical: 'top',
  },
});

export { Textarea };
