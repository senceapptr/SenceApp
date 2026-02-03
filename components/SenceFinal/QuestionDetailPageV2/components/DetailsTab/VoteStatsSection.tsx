import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import type { Theme } from '@/contexts/ThemeContext';
import type { MainQuestion } from '../../types';

interface VoteStatsSectionProps {
  mainQuestion: MainQuestion;
  theme: Theme;
}

export function VoteStatsSection({ mainQuestion, theme }: VoteStatsSectionProps) {
  const yesProgressAnim = useRef(new Animated.Value(0)).current;
  const noProgressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(yesProgressAnim, { toValue: mainQuestion.yesPercentage, duration: 1000, delay: 300, useNativeDriver: false }),
      Animated.timing(noProgressAnim, { toValue: mainQuestion.noPercentage, duration: 1000, delay: 300, useNativeDriver: false }),
    ]).start();
  }, [mainQuestion.yesPercentage, mainQuestion.noPercentage]);

  return (
    <View
      style={{
        backgroundColor: theme.surfaceCard,
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: theme.border,
      }}
    >
      <Text style={{ fontSize: 16, fontWeight: '900', color: theme.textPrimary, marginBottom: 12 }}>Oy Dağılımı</Text>
      <View style={{ flexDirection: 'column', gap: 12 }}>
        <View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Text style={{ fontSize: 12, fontWeight: '900', color: theme.accent }}>EVET</Text>
            <Text style={{ fontSize: 12, fontWeight: '900', color: theme.accent }}>{mainQuestion.yesPercentage}%</Text>
          </View>
          <View style={{ height: 12, backgroundColor: theme.background, borderRadius: 6, overflow: 'hidden', marginBottom: 4 }}>
            <Animated.View
              style={[
                { height: '100%', backgroundColor: theme.accent, borderRadius: 6 },
                { width: yesProgressAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }) },
              ]}
            />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 12, color: theme.textMuted }}>{mainQuestion.yesOdds}x oran</Text>
            <Text style={{ fontSize: 12, color: theme.textMuted }}>{mainQuestion.yesInvestment.toLocaleString('tr-TR')} ₺</Text>
          </View>
        </View>
        <View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Text style={{ fontSize: 12, fontWeight: '900', color: theme.error }}>HAYIR</Text>
            <Text style={{ fontSize: 12, fontWeight: '900', color: theme.error }}>{mainQuestion.noPercentage}%</Text>
          </View>
          <View style={{ height: 12, backgroundColor: theme.background, borderRadius: 6, overflow: 'hidden', marginBottom: 4 }}>
            <Animated.View
              style={[
                { height: '100%', backgroundColor: theme.error, borderRadius: 6 },
                { width: noProgressAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }) },
              ]}
            />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 12, color: theme.textMuted }}>{mainQuestion.noOdds}x oran</Text>
            <Text style={{ fontSize: 12, color: theme.textMuted }}>{mainQuestion.noInvestment.toLocaleString('tr-TR')} ₺</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
