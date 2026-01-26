import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CreditHistoryItem } from '../types';

interface StatisticsTabProps {
  creditHistory: CreditHistoryItem[];
  stats?: any;
}

export const StatisticsTab: React.FC<StatisticsTabProps> = ({ creditHistory, stats }) => {
  // İstatistik değerlerini hesapla
  const totalPredictions = stats?.total_predictions || 0;
  const correctPredictions = stats?.correct_predictions || 0;
  const accuracyRate = stats?.accuracy_rate || 0;
  const totalEarnings = stats?.total_earnings || 0;
  const longestStreak = stats?.longest_streak || 0;
  const currentStreak = stats?.current_streak || 0;
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
          colors={['#059669', 'rgba(16,185,129,0.9)']}
          style={styles.statCard}
        >
          <Text style={[styles.statCardLabel, { color: 'rgba(255,255,255,0.9)' }]}>En Uzun Seri</Text>
          <Text style={[styles.statCardValue, { color: '#fff' }]}>{longestStreak}</Text>
        </LinearGradient>

        <LinearGradient
          colors={['#059669', '#10B981']}
          style={styles.statCard}
        >
          <Text style={[styles.statCardLabel, { color: 'rgba(255,255,255,0.9)' }]}>Mevcut Seri</Text>
          <Text style={[styles.statCardValue, { color: '#fff' }]}>{currentStreak}</Text>
        </LinearGradient>
      </View>

      {/* Additional Stats */}
      <View style={styles.additionalStatsCard}>
        <Text style={styles.cardTitle}>Genel İstatistikler</Text>
        <View style={styles.statRow}>
          <Text style={styles.statRowLabel}>Toplam Tahmin</Text>
          <Text style={[styles.statRowValue, { color: '#10B981' }]}>{totalPredictions}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statRowLabel}>Doğru Tahmin</Text>
          <Text style={[styles.statRowValue, { color: '#34C759' }]}>{correctPredictions}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statRowLabel}>Başarı Oranı</Text>
          <Text style={[styles.statRowValue, { color: '#C9F158' }]}>{accuracyRate.toFixed(1)}%</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statRowLabel}>Toplam Kazanç</Text>
          <Text style={[styles.statRowValue, { color: totalEarnings >= 0 ? '#34C759' : '#FF3B30' }]}>
            {totalEarnings >= 0 ? '+' : ''}{totalEarnings.toLocaleString()} kredi
          </Text>
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
    backgroundColor: '#161B22',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#30363D',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#F0F6FC',
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
    backgroundColor: '#21262D',
    borderRadius: 10,
    justifyContent: 'flex-end',
  },
  chartBarFill: {
    backgroundColor: '#10B981',
    borderRadius: 10,
    minHeight: 4,
  },
  chartLabel: {
    fontSize: 12,
    color: '#8B949E',
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
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 4,
  },
  statCardValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#F0F6FC',
  },
  additionalStatsCard: {
    backgroundColor: '#161B22',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#30363D',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  statRowLabel: {
    fontSize: 16,
    color: '#8B949E',
  },
  statRowValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#F0F6FC',
  },
});


