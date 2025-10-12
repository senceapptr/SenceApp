import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface VoteButtonsProps {
  yesOdds: number;
  noOdds: number;
  onYesPress: () => void;
  onNoPress: () => void;
}

export function VoteButtons({ yesOdds, noOdds, onYesPress, onNoPress }: VoteButtonsProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.yesButton}
        onPress={onYesPress}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#34C759', '#28A745']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <Text style={styles.buttonText}>EVET</Text>
          <Text style={styles.odds}>{yesOdds}x</Text>
        </LinearGradient>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.noButton}
        onPress={onNoPress}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#FF3B30', '#DC3545']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <Text style={styles.buttonText}>HAYIR</Text>
          <Text style={styles.odds}>{noOdds}x</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
  },
  yesButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  noButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  gradient: {
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  odds: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
});

