import React from 'react';
import { View, Text } from 'react-native';
import { TotalPoolCard } from './TotalPoolCard';
import { OddsChart } from './OddsChart';
import { TopInvestorsList } from './TopInvestorsList';
import type { Theme } from '@/contexts/ThemeContext';
import type { MainQuestion, TopInvestor } from '../../types';

interface StatsTabProps {
  mainQuestion: MainQuestion;
  theme: Theme;
  topInvestors: TopInvestor[];
}

export function StatsTab({ mainQuestion, theme, topInvestors }: StatsTabProps) {
  return (
    <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 0 }}>
      <TotalPoolCard mainQuestion={mainQuestion} theme={theme} />
      <OddsChart theme={theme} />
      <TopInvestorsList investors={topInvestors} theme={theme} />
      <View style={{ marginBottom: 8 }}>
        <Text style={{ fontSize: 18, fontWeight: '900', color: theme.textPrimary, marginBottom: 16 }}>Oy Dağılımı</Text>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: theme.surfaceCard,
            borderRadius: 16,
            padding: 20,
            borderWidth: 1,
            borderColor: theme.border,
          }}
        >
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ fontSize: 28, fontWeight: '900', color: theme.accent, marginBottom: 4 }}>{mainQuestion.yesPercentage}%</Text>
            <Text style={{ fontSize: 12, fontWeight: '700', color: theme.textMuted, marginBottom: 4 }}>EVET</Text>
            <Text style={{ fontSize: 14, fontWeight: '700', color: theme.textPrimary }}>{mainQuestion.yesInvestment.toLocaleString('tr-TR')} ₺</Text>
          </View>
          <View style={{ width: 1, backgroundColor: theme.border, marginHorizontal: 16 }} />
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ fontSize: 28, fontWeight: '900', color: theme.error, marginBottom: 4 }}>{mainQuestion.noPercentage}%</Text>
            <Text style={{ fontSize: 12, fontWeight: '700', color: theme.textMuted, marginBottom: 4 }}>HAYIR</Text>
            <Text style={{ fontSize: 14, fontWeight: '700', color: theme.textPrimary }}>{mainQuestion.noInvestment.toLocaleString('tr-TR')} ₺</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
