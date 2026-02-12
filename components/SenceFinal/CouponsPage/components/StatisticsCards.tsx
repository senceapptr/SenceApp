import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StatisticsCardsProps {
  totalCoupons: number;
  totalEarnings: number;
  totalLost: number;
}

export function StatisticsCards({ totalCoupons, totalEarnings, totalLost }: StatisticsCardsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={[styles.card, styles.cardLarge, styles.cardPurple]}>
          <Text style={styles.label}>Toplam Ticket</Text>
          <Text style={styles.value}>{totalCoupons}</Text>
        </View>

        <View style={[styles.card, styles.cardLarge, styles.cardGreen]}>
          <Text style={styles.label}>Kazanılan Kredi</Text>
          <Text style={styles.value}>{totalEarnings.toLocaleString()}</Text>
        </View>

        <View style={[styles.card, styles.cardLarge, styles.cardRed]}>
          <Text style={styles.label}>Kaybedilen Kredi</Text>
          <Text style={styles.value}>{totalLost.toLocaleString()}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  cardPurple: {
    backgroundColor: '#21262D',
    borderWidth: 1,
    borderColor: '#256EFF',
  },
  cardGreen: {
    backgroundColor: '#21262D',
    borderWidth: 1,
    borderColor: '#10B981',
  },
  cardRed: {
    backgroundColor: '#21262D',
    borderWidth: 1,
    borderColor: '#DC2626',
  },
  label: {
    color: '#8B949E',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  value: {
    color: '#F0F6FC',
    fontSize: 20,
    fontWeight: '900',
  },
});
