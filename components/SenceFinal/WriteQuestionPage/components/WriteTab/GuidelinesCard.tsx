import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { guidelines } from '../../utils';

export const GuidelinesCard: React.FC = () => {
  return (
    <View style={styles.guidelinesCard}>
      <LinearGradient
        colors={['rgba(16,185,129,0.08)', 'rgba(5,150,105,0.08)']}
        style={styles.guidelinesGradient}
      >
        <View style={styles.guidelinesHeader}>
          <Text style={styles.guidelinesTitle}>Soru Yazım Kuralları</Text>
        </View>
        <View style={styles.guidelinesList}>
          {guidelines.map((guideline, index) => (
            <View key={index} style={styles.guidelineItem}>
              <Text style={styles.guidelineBullet}>•</Text>
              <Text style={styles.guidelineText}>{guideline}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  guidelinesCard: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  guidelinesGradient: {
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.25)',
    borderRadius: 24,
  },
  guidelinesHeader: {
    marginBottom: 16,
  },
  guidelinesTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#F0F6FC',
  },
  guidelinesList: {
    gap: 12,
  },
  guidelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  guidelineBullet: {
    fontSize: 16,
    color: '#10B981',
    marginTop: 2,
  },
  guidelineText: {
    fontSize: 14,
    color: '#8B949E',
    flex: 1,
    lineHeight: 20,
  },
});

