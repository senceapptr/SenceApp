import * as React from "react";
import { ScrollView, StyleSheet, ViewStyle } from 'react-native';

interface ScrollAreaProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

function ScrollArea({ children, style }: ScrollAreaProps) {
  return (
    <ScrollView style={[styles.scroll, style]}>
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    width: '100%',
    maxHeight: 220,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 8,
  },
});

export { ScrollArea };
