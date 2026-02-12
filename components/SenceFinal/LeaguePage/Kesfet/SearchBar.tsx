import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { View, TextInput, StyleSheet } from 'react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

export function SearchBar({ onChangeText, value }: SearchBarProps) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Lig adı ve @kullanıcıadı ara"
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="#8B949E"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <View style={styles.icon}>
        <Ionicons name="search-outline" size={18} color="#9CA3AF" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    position: 'relative',
  },
  icon: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  input: {
    backgroundColor: '#161B22',
    borderColor: '#30363D',
    borderRadius: 24,
    borderWidth: 1,
    color: '#F0F6FC',
    fontSize: 16,
    paddingHorizontal: 24,
    paddingRight: 56,
    paddingVertical: 16,
  },
});
