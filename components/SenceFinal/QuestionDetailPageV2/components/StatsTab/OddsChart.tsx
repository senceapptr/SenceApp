import React from 'react';
import { View, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import type { Theme } from '@/contexts/ThemeContext';
import { SCREEN_WIDTH } from '@/components/SenceFinal/QuestionDetailPageV2/styles';

interface OddsChartProps {
  theme: Theme;
}

const oddsChartData = {
  labels: ['7d', '6d', '5d', '4d', '3d', '2d', '1d', 'Bugün'],
  datasets: [
    { data: [1.45, 1.42, 1.38, 1.35, 1.32, 1.30, 1.29, 1.28], color: () => '#34C759', strokeWidth: 3 },
    { data: [2.8, 2.95, 3.2, 3.35, 3.45, 3.55, 3.6, 3.64], color: () => '#DC2626', strokeWidth: 3 },
  ],
  legend: ['EVET Oranı', 'HAYIR Oranı'],
};

export function OddsChart({ theme }: OddsChartProps) {
  return (
    <View style={{ marginBottom: 20 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Ionicons name="trending-up" size={20} color={theme.accent} />
        <Text style={{ fontSize: 18, fontWeight: '900', color: theme.textPrimary }}>Oran Değişimi Grafiği</Text>
      </View>
      <View
        style={{
          backgroundColor: theme.surfaceCard,
          borderRadius: 16,
          padding: 20,
          borderWidth: 1,
          borderColor: theme.border,
        }}
      >
        <LineChart
          data={oddsChartData}
          width={SCREEN_WIDTH - 64}
          height={250}
          chartConfig={{
            backgroundColor: theme.surface,
            backgroundGradientFrom: theme.surface,
            backgroundGradientTo: theme.surface,
            decimalPlaces: 2,
            color: () => theme.textMuted,
            labelColor: () => theme.textPrimary,
            style: { borderRadius: 16 },
            propsForDots: { r: '5', strokeWidth: '2' },
            propsForLabels: { fontSize: 10, fontWeight: 'bold' },
          }}
          bezier
          style={{ borderRadius: 16 }}
          withShadow={false}
          withInnerLines
          withOuterLines
          withVerticalLines
          withHorizontalLines
          withVerticalLabels
          withHorizontalLabels
        />
        <View style={{ borderTopWidth: 1, borderTopColor: theme.border, paddingTop: 16, marginTop: 16 }}>
          <Text style={{ fontSize: 12, color: theme.textMuted, textAlign: 'center' }}>Oranlar, toplam yatırım miktarlarına göre dinamik olarak değişmektedir</Text>
        </View>
      </View>
    </View>
  );
}
