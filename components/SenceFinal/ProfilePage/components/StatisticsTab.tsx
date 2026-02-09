
import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LineChart } from 'react-native-gifted-charts';
import { useAuth } from '@/contexts/AuthContext';
import { CreditHistoryItem, ProfileStats } from '../types';

interface StatisticsTabProps {
  creditHistory: CreditHistoryItem[];
  stats?: ProfileStats;
}

export const StatisticsTab: React.FC<StatisticsTabProps> = ({ creditHistory, stats }) => {
  const [activeSubTab, setActiveSubTab] = useState<'questions' | 'tickets'>('questions');
  const screenWidth = Dimensions.get('window').width;

  // Ensure hooks are called
  const { useMemo } = React;

  // Filter State
  const [timeRange, setTimeRange] = useState<'1W' | '1M' | 'All'>('1W');

  // Filter Data Logic
  const filteredData = useMemo(() => {
    if (!creditHistory || creditHistory.length === 0) return [{ value: 0, label: '' }];

    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    let filtered = creditHistory.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (timeRange === '1W') {
      filtered = filtered.filter(item => new Date(item.date) >= oneWeekAgo);
    } else if (timeRange === '1M') {
      filtered = filtered.filter(item => new Date(item.date) >= oneMonthAgo);
    }

    return filtered.map(item => ({
      value: item.value,
      label: new Date(item.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }),
      date: new Date(item.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })
    }));
  }, [creditHistory, timeRange]);

  // Adjust chart width and spacing
  const dataLength = filteredData.length;
  // Dynamic spacing to fit screen: (Screen - Padding) / (Items - 1)
  const chartSpacing = dataLength > 1 ? (screenWidth - 80) / (dataLength - 1) : 0;

  // If no data after filter
  const chartData = filteredData.length > 0 ? filteredData : [{ value: 0, label: '', date: '' }];

  const renderStatsRow = (label: string, value: string | number, color: string = '#F0F6FC') => (
    <View style={styles.statRow}>
      <Text style={styles.statRowLabel}>{label}</Text>
      <Text style={[styles.statRowValue, { color }]}>{value}</Text>
    </View>
  );

  return (
    <View style={styles.statisticsContainer}>
      {/* Credit History Chart */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Kredi Geçmişi</Text>
        <View style={styles.chartContainer}>
          <View style={styles.filterContainer}>
            {(['1W', '1M', 'All'] as const).map((range) => (
              <TouchableOpacity
                key={range}
                style={[styles.filterButton, timeRange === range && styles.filterButtonActive]}
                onPress={() => setTimeRange(range)}
              >
                <Text style={[styles.filterText, timeRange === range && styles.filterTextActive]}>
                  {range === '1W' ? '1 Hafta' : range === '1M' ? '1 Ay' : 'Tümü'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <LineChart
            areaChart
            curved
            data={chartData}
            height={220}
            width={screenWidth - 80}
            spacing={chartSpacing}
            initialSpacing={0}
            endSpacing={0}
            color1="#10B981"
            startFillColor1="#10B981"
            endFillColor1="rgba(16, 185, 129, 0.01)"
            startOpacity={0.3}
            endOpacity={0.05}
            noOfSections={4}
            yAxisThickness={0}
            xAxisThickness={0}
            yAxisTextStyle={{ color: '#8B949E', fontSize: 10 }}
            xAxisLabelTextStyle={{ color: '#8B949E', fontSize: 10 }}
            rulesColor="rgba(255,255,255,0.1)"
            rulesType="solid"
            pointerConfig={{
              pointerStripHeight: 160,
              pointerStripColor: 'rgba(255,255,255,0.2)',
              pointerStripWidth: 2,
              pointerColor: 'rgba(255,255,255,0.5)',
              radius: 6,
              pointerLabelWidth: 100,
              pointerLabelHeight: 90,
              activatePointersOnLongPress: false,
              autoAdjustPointerLabelPosition: false,
              pointerComponent: (items: any) => {
                if (!items || !items[0]) return null;
                const item = items[0];
                return (
                  <View style={{
                    height: 50,
                    width: 100,
                    backgroundColor: '#1F2937',
                    borderRadius: 8,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.1)',
                    transform: [{ translateX: -50 }], // Center horizontally
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                  }}>
                    <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>
                      {item.value?.toLocaleString()}
                    </Text>
                    <Text style={{ color: '#9CA3AF', fontSize: 10, marginTop: 2 }}>
                      {item.date}
                    </Text>
                  </View>
                );
              },
            }}
          />
        </View>
      </View>

      {/* Highlights */}
      <View style={styles.statsCardsContainer}>
        <LinearGradient
          colors={['#432870', '#5B3791']}
          style={styles.statCard}
        >
          <Text style={styles.statCardLabel}>En Yüksek Oran</Text>
          <Text style={styles.statCardValue}>{stats?.highestOddsWon?.toFixed(2) || '0.00'}x</Text>
        </LinearGradient>

        <LinearGradient
          colors={['#059669', '#10B981']}
          style={styles.statCard}
        >
          <Text style={styles.statCardLabel}>Maksimum Kazanç</Text>
          <Text style={styles.statCardValue}>{stats?.maxWinAmount?.toLocaleString() || '0'}</Text>
        </LinearGradient>
      </View>

      {/* Stats Toggle & List */}
      <View style={styles.card}>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, activeSubTab === 'questions' && styles.toggleButtonActive]}
            onPress={() => setActiveSubTab('questions')}
          >
            <Text style={[styles.toggleText, activeSubTab === 'questions' && styles.toggleTextActive]}>
              Sorular
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, activeSubTab === 'tickets' && styles.toggleButtonActive]}
            onPress={() => setActiveSubTab('tickets')}
          >
            <Text style={[styles.toggleText, activeSubTab === 'tickets' && styles.toggleTextActive]}>
              Ticketlar
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsList}>
          {activeSubTab === 'questions' ? (
            <>
              {renderStatsRow('Toplam Tahmin', stats?.totalPredictions || 0, '#F0F6FC')}
              {renderStatsRow('Doğru Yanıt', stats?.correctPredictions || 0, '#34C759')}
              {renderStatsRow('Başarı Oranı', `%${((stats?.accuracyRate || 0) * 100).toFixed(1)}`, '#C9F158')}
              {renderStatsRow('Toplam Kazanç', `+${(stats?.totalEarnings || 0).toLocaleString()} kredi`, '#34C759')}
            </>
          ) : (
            <>
              {renderStatsRow('Toplam Ticket', stats?.totalCoupons || 0, '#F0F6FC')}
              {renderStatsRow('Kazanan Ticket', stats?.wonCoupons || 0, '#34C759')}
              {renderStatsRow('Kupon Başarısı', `%${((stats?.couponAccuracyRate || 0) * 100).toFixed(1)}`, '#C9F158')}
              {renderStatsRow('Ticket Kazancı', `+${(stats?.couponTotalEarnings || 0).toLocaleString()} kredi`, '#34C759')}
            </>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  statisticsContainer: {
    gap: 16,
    paddingBottom: 24,
  },
  card: {
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
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#0D1117',
    borderRadius: 8,
    padding: 2,
    marginBottom: 16,
    width: '100%',
  },
  filterButton: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 6,
  },
  filterButtonActive: {
    backgroundColor: '#30363D',
  },
  filterText: {
    fontSize: 12,
    color: '#8B949E',
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#F0F6FC',
  },
  chartContainer: {
    overflow: 'hidden',
    marginLeft: -10, // Slight adjustment for Y axis
  },
  statsCardsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statCardLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
    fontWeight: '600',
  },
  statCardValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#0D1117',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  toggleButtonActive: {
    backgroundColor: '#30363D',
  },
  toggleText: {
    color: '#8B949E',
    fontWeight: '600',
    fontSize: 14,
  },
  toggleTextActive: {
    color: '#F0F6FC',
  },
  statsList: {
    gap: 4,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(48, 54, 61, 0.4)',
  },
  statRowLabel: {
    fontSize: 15,
    color: '#8B949E',
  },
  statRowValue: {
    fontSize: 16,
    fontWeight: '700',
  },
});
