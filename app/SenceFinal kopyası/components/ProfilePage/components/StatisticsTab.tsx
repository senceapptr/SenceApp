import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CreditHistoryItem } from '../types';

interface StatisticsTabProps {
  creditHistory: CreditHistoryItem[];
}

export const StatisticsTab: React.FC<StatisticsTabProps> = ({ creditHistory }) => {
  return (
    <View style={styles.statisticsContainer}>
      {/* Credit History */}
      <View style={styles.creditHistoryCard}>
        <Text style={styles.cardTitle}>Kredi Değişimi</Text>
        <View style={styles.creditChart}>
          {creditHistory.map((item, index) => (
            <View key={index} style={styles.chartItem}>
              <View style={styles.chartBar}>
                <View style={[
                  styles.chartBarFill,
                  { height: `${(item.credits / 3000) * 100}%` }
                ]} />
              </View>
              <Text style={styles.chartLabel}>{item.day}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsCardsContainer}>
        <LinearGradient
          colors={['#C9F158', 'rgba(201,241,88,0.8)']}
          style={styles.statCard}
        >
          <Text style={styles.statCardLabel}>En Büyük Oran</Text>
          <Text style={styles.statCardValue}>5.25x</Text>
        </LinearGradient>

        <LinearGradient
          colors={['#432870', '#B29EFD']}
          style={styles.statCard}
        >
          <Text style={[styles.statCardLabel, { color: 'rgba(255,255,255,0.8)' }]}>Kupon Rekoru</Text>
          <Text style={[styles.statCardValue, { color: 'white' }]}>12.8x</Text>
        </LinearGradient>
      </View>

      {/* Additional Stats */}
      <View style={styles.additionalStatsCard}>
        <Text style={styles.cardTitle}>Genel İstatistikler</Text>
        <View style={styles.statRow}>
          <Text style={styles.statRowLabel}>Kazanma Oranı</Text>
          <Text style={[styles.statRowValue, { color: '#34C759' }]}>68%</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statRowLabel}>Toplam Kazanç</Text>
          <Text style={[styles.statRowValue, { color: '#432870' }]}>+1,250 ₺</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statRowLabel}>Ortalama Oran</Text>
          <Text style={styles.statRowValue}>1.89x</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  statisticsContainer: {
    gap: 16,
  },
  creditHistoryCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#202020',
    marginBottom: 16,
  },
  creditChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
  },
  chartItem: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  chartBar: {
    width: 20,
    height: 80,
    backgroundColor: '#F2F3F5',
    borderRadius: 10,
    justifyContent: 'flex-end',
  },
  chartBarFill: {
    backgroundColor: '#432870',
    borderRadius: 10,
    minHeight: 4,
  },
  chartLabel: {
    fontSize: 12,
    color: '#202020',
    fontWeight: '600',
  },
  statsCardsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
  },
  statCardLabel: {
    fontSize: 14,
    color: '#353831',
    marginBottom: 4,
  },
  statCardValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#353831',
  },
  additionalStatsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  statRowLabel: {
    fontSize: 16,
    color: 'rgba(32,32,32,0.6)',
  },
  statRowValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#202020',
  },
});


