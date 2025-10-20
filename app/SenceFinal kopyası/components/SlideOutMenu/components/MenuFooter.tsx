import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function MenuFooter() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Sence v1.0.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
  },
  text: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
});



