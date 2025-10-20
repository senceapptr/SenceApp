import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface StatisticsCardsProps {
  totalCoupons: number;
  totalEarnings: number;
  totalLost: number;
}

export function StatisticsCards({ totalCoupons, totalEarnings, totalLost }: StatisticsCardsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <LinearGradient
          colors={['#432870', '#5A3A8B']}
          style={[styles.card, styles.cardLarge]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.label}>Toplam Kupon</Text>
          <Text style={styles.value}>{totalCoupons}</Text>
        </LinearGradient>

        <LinearGradient
          colors={['#10B981', '#059669']}
          style={[styles.card, styles.cardLarge]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.label}>Kazanılan Kredi</Text>
          <Text style={styles.value}>{totalEarnings.toLocaleString()}</Text>
        </LinearGradient>

        <LinearGradient
          colors={['#EF4444', '#DC2626']}
          style={[styles.card, styles.cardLarge]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.label}>Kaybedilen Kredi</Text>
          <Text style={styles.value}>{totalLost.toLocaleString()}</Text>
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  card: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  cardLarge: {
    minHeight: 80,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  value: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
  },
});



