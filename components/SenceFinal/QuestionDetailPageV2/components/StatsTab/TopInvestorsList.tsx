import React from 'react';
import { View, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Theme } from '@/contexts/ThemeContext';
import type { TopInvestor } from '../../types';

interface TopInvestorsListProps {
  investors: TopInvestor[];
  theme: Theme;
}

export function TopInvestorsList({ investors, theme }: TopInvestorsListProps) {
  const getRankStyle = (index: number) => {
    if (index === 0) return { backgroundColor: '#F59E0B' };
    if (index === 1) return { backgroundColor: '#94A3B8' };
    if (index === 2) return { backgroundColor: '#EA580C' };
    return {};
  };

  return (
    <View style={{ marginBottom: 20 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Ionicons name="trophy" size={20} color={theme.accent} />
        <Text style={{ fontSize: 18, fontWeight: '900', color: theme.textPrimary }}>En Çok Yatırım Yapanlar</Text>
      </View>
      {investors.map((investor, index) => (
        <View
          key={`investor-${index}-${investor.username}`}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.surfaceCard,
            borderRadius: 16,
            padding: 16,
            marginBottom: 10,
            gap: 12,
            borderWidth: 1,
            borderColor: theme.border,
          }}
        >
          <View
            style={[
              { width: 32, height: 32, borderRadius: 16, backgroundColor: theme.background, alignItems: 'center', justifyContent: 'center' },
              getRankStyle(index),
            ]}
          >
            <Text style={{ fontSize: 14, fontWeight: '900', color: index < 3 ? '#fff' : theme.textPrimary }}>#{index + 1}</Text>
          </View>
          <Image source={{ uri: investor.avatar }} style={{ width: 40, height: 40, borderRadius: 20 }} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: theme.textPrimary, marginBottom: 2 }}>{investor.username}</Text>
            <Text style={{ fontSize: 12, color: theme.textMuted }}>{investor.amount.toLocaleString('tr-TR')} ₺ yatırım</Text>
          </View>
          <View
            style={{
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 12,
              backgroundColor: investor.vote === 'yes' ? theme.accent + '33' : theme.error + '33',
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: '700', color: investor.vote === 'yes' ? theme.accent : theme.error }}>{investor.vote === 'yes' ? 'EVET' : 'HAYIR'}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}
