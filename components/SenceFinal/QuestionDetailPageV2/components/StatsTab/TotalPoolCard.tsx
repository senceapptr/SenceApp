import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import type { Theme } from '@/contexts/ThemeContext';
import type { MainQuestion } from '../../types';

interface TotalPoolCardProps {
  mainQuestion: MainQuestion;
  theme: Theme;
}

export function TotalPoolCard({ mainQuestion, theme }: TotalPoolCardProps) {
  return (
    <LinearGradient
      colors={[theme.accent, theme.primaryDark, theme.primaryDark + 'E6']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ borderRadius: 24, overflow: 'hidden', marginBottom: 20 }}
    >
      <View style={{ padding: 24 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 12 }}>
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderWidth: 2,
              borderColor: 'rgba(255, 255, 255, 0.3)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="trending-up" size={28} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 10, fontWeight: '900', color: '#ffffffB3', letterSpacing: 0.5, marginBottom: 4 }}>TOPLAM ÖDÜL HAVUZU</Text>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
              <Text style={{ fontSize: 36, fontWeight: '900', color: '#fff' }}>{mainQuestion.totalPool.toLocaleString('tr-TR')}</Text>
              <Text style={{ fontSize: 24, fontWeight: '700', color: '#ffffffE6' }}>₺</Text>
            </View>
          </View>
        </View>
        <View style={{ height: 1, backgroundColor: 'rgba(255, 255, 255, 0.2)', marginVertical: 16 }} />
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: '#ffffffB3', marginBottom: 4 }}>EVET Yatırım</Text>
            <Text style={{ fontSize: 18, fontWeight: '900', color: '#fff' }}>{mainQuestion.yesInvestment.toLocaleString('tr-TR')} ₺</Text>
          </View>
          <View style={{ width: 1, backgroundColor: 'rgba(255, 255, 255, 0.2)', marginHorizontal: 16 }} />
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: '#ffffffB3', marginBottom: 4 }}>HAYIR Yatırım</Text>
            <Text style={{ fontSize: 18, fontWeight: '900', color: '#fff' }}>{mainQuestion.noInvestment.toLocaleString('tr-TR')} ₺</Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}
