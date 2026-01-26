import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from 'react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

export function SearchBar({ value, onChangeText }: SearchBarProps) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Lig adı ve @kullanıcıadı ara"
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="#8B949E"
      />
      <View style={styles.icon}>
        <LinearGradient
          colors={['#10B981', '#34D399']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.iconGradient}
        >
          <Text style={styles.iconText}>🔍</Text>
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    position: 'relative',
  },
  input: {
    backgroundColor: '#161B22',
    borderWidth: 1,
    borderColor: '#30363D',
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 24,
    paddingRight: 56,
    fontSize: 16,
    color: '#F0F6FC',
  },
  icon: {
    position: 'absolute',
    right: 16,
    top: 14,
  },
  iconGradient: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 16,
  },
});

