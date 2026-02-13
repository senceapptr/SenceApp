import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { LineChart } from 'react-native-gifted-charts';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';

import { CreditHistoryItem, ProfileStats } from '../types';
import { ACCENT_DARK, PRIMARY_BLUE } from '../../LeaguePage/shared/theme';

interface StatisticsTabProps {
  stats?: ProfileStats;
  creditHistory: CreditHistoryItem[];
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
    if (!creditHistory || creditHistory.length === 0) return [{ label: '', value: 0 }];

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
      date: new Date(item.date).toLocaleDateString('tr-TR', {
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        month: 'long',
      }),
      label: new Date(item.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }),
      value: item.value,
    }));
  }, [creditHistory, timeRange]);

  // Adjust chart width and spacing
  const dataLength = filteredData.length;
  // Dynamic spacing to fit screen: (Screen - Padding) / (Items - 1)
  const chartSpacing = dataLength > 1 ? (screenWidth - 80) / (dataLength - 1) : 0;

  // If no data after filter
  const chartData = filteredData.length > 0 ? filteredData : [{ date: '', label: '', value: 0 }];

  const valueColorPrimary = PRIMARY_BLUE;
  const valueColorSecondary = '#60A5FA';
  const valueColorMuted = '#93C5FD';

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
            {(['1W', '1M', 'All'] as const).map(range => (
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
            color1={PRIMARY_BLUE}
            startFillColor1={PRIMARY_BLUE}
            endFillColor1="rgba(37, 110, 255, 0.02)"
            startOpacity={0.32}
            endOpacity={0.05}
            noOfSections={4}
            yAxisThickness={0}
            xAxisThickness={0}
            yAxisTextStyle={{ color: '#8B949E', fontSize: 10 }}
            xAxisLabelTextStyle={{ color: '#8B949E', fontSize: 10 }}
            rulesColor="rgba(59,130,246,0.24)"
            rulesType="solid"
            pointerConfig={{
              activatePointersOnLongPress: false,
              autoAdjustPointerLabelPosition: false,
              pointerColor: PRIMARY_BLUE,
              pointerComponent: (items: any) => {
                if (!items || !items[0]) return null;
                const item = items[0];
                return (
                  <View
                    style={{
                      alignItems: 'center',
                      backgroundColor: '#0F172A',
                      borderColor: 'rgba(59,130,246,0.35)',
                      borderRadius: 8,
                      borderWidth: 1,
                      elevation: 5,
                      height: 50,
                      justifyContent: 'center',
                      shadowColor: '#000',
                      shadowOffset: { height: 2, width: 0 },
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,
                      transform: [{ translateX: -50 }], // Center horizontally
                      width: 100,
                    }}
                  >
                    <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>
                      {item.value?.toLocaleString()}
                    </Text>
                    <Text style={{ color: '#BFDBFE', fontSize: 10, marginTop: 2 }}>{item.date}</Text>
                  </View>
                );
              },
              pointerLabelHeight: 90,
              pointerLabelWidth: 100,
              pointerStripColor: 'rgba(96,165,250,0.5)',
              pointerStripHeight: 160,
              pointerStripWidth: 2,
              radius: 6,
            }}
          />
        </View>
      </View>

      {/* Highlights */}
      <View style={styles.statsCardsContainer}>
        <LinearGradient colors={[ACCENT_DARK, PRIMARY_BLUE]} style={styles.statCard}>
          <Text style={styles.statCardLabel}>En Yüksek Oran</Text>
          <Text style={styles.statCardValue}>{stats?.highestOddsWon?.toFixed(2) || '0.00'}x</Text>
        </LinearGradient>

        <LinearGradient colors={[PRIMARY_BLUE, '#3B82F6']} style={styles.statCard}>
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
            <Text style={[styles.toggleText, activeSubTab === 'questions' && styles.toggleTextActive]}>Sorular</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, activeSubTab === 'tickets' && styles.toggleButtonActive]}
            onPress={() => setActiveSubTab('tickets')}
          >
            <Text style={[styles.toggleText, activeSubTab === 'tickets' && styles.toggleTextActive]}>Ticketlar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsList}>
          {activeSubTab === 'questions' ? (
            <>
              {renderStatsRow('Toplam Tahmin', stats?.totalPredictions || 0, '#F0F6FC')}
              {renderStatsRow('Doğru Yanıt', stats?.correctPredictions || 0, valueColorSecondary)}
              {renderStatsRow('Başarı Oranı', `%${((stats?.accuracyRate || 0) * 100).toFixed(1)}`, valueColorMuted)}
              {renderStatsRow(
                'Toplam Kazanç',
                `+${(stats?.totalEarnings || 0).toLocaleString()} kredi`,
                valueColorPrimary,
              )}
            </>
          ) : (
            <>
              {renderStatsRow('Toplam Ticket', stats?.totalCoupons || 0, '#F0F6FC')}
              {renderStatsRow('Kazanan Ticket', stats?.wonCoupons || 0, valueColorSecondary)}
              {renderStatsRow(
                'Kupon Başarısı',
                `%${((stats?.couponAccuracyRate || 0) * 100).toFixed(1)}`,
                valueColorMuted,
              )}
              {renderStatsRow(
                'Ticket Kazancı',
                `+${(stats?.couponTotalEarnings || 0).toLocaleString()} kredi`,
                valueColorPrimary,
              )}
            </>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#101827',
    borderColor: 'rgba(59,130,246,0.24)',
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  cardTitle: {
    color: '#F0F6FC',
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 16,
  },
  chartContainer: {
    marginLeft: -10, // Slight adjustment for Y axis
    overflow: 'hidden',
  },
  filterButton: {
    alignItems: 'center',
    borderRadius: 6,
    flex: 1,
    paddingVertical: 6,
  },
  filterButtonActive: {
    backgroundColor: ACCENT_DARK,
  },
  filterContainer: {
    backgroundColor: '#0B1322',
    borderColor: 'rgba(59,130,246,0.2)',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 16,
    padding: 2,
    width: '100%',
  },
  filterText: {
    color: '#8B949E',
    fontSize: 12,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#F0F6FC',
  },
  statCard: {
    alignItems: 'center',
    borderRadius: 16,
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  statCardLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  statCardValue: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
  },
  statisticsContainer: {
    gap: 16,
    paddingBottom: 24,
  },
  statRow: {
    alignItems: 'center',
    borderBottomColor: 'rgba(59, 130, 246, 0.18)',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  statRowLabel: {
    color: '#8B949E',
    fontSize: 15,
  },
  statRowValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  statsCardsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statsList: {
    gap: 4,
  },
  toggleButton: {
    alignItems: 'center',
    borderRadius: 8,
    flex: 1,
    paddingVertical: 8,
  },
  toggleButtonActive: {
    backgroundColor: ACCENT_DARK,
  },
  toggleContainer: {
    backgroundColor: '#0B1322',
    borderColor: 'rgba(59,130,246,0.2)',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 16,
    padding: 4,
  },
  toggleText: {
    color: '#8B949E',
    fontSize: 14,
    fontWeight: '600',
  },
  toggleTextActive: {
    color: '#F0F6FC',
  },
});
