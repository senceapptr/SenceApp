import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { guidelines } from '../../utils';

export const GuidelinesCard: React.FC = () => {
  return (
    <View style={styles.guidelinesCard}>
      <LinearGradient
        colors={['rgba(67,40,112,0.1)', 'rgba(178,158,253,0.1)']}
        style={styles.guidelinesGradient}
      >
        <View style={styles.guidelinesHeader}>
          <Text style={styles.guidelinesIcon}>📋</Text>
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
    borderColor: 'rgba(67,40,112,0.2)',
    borderRadius: 24,
  },
  guidelinesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  guidelinesIcon: {
    fontSize: 20,
  },
  guidelinesTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#202020',
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
    color: '#432870',
    marginTop: 2,
  },
  guidelineText: {
    fontSize: 14,
    color: 'rgba(32,32,32,0.8)',
    flex: 1,
    lineHeight: 20,
  },
});


