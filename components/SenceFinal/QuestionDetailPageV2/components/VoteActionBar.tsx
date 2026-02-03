import React, { useRef } from 'react';
import { View, Text, Pressable, Animated, Easing } from 'react-native';
import type { Theme } from '@/contexts/ThemeContext';
import type { MainQuestion } from '../types';

interface VoteActionBarProps {
  mainQuestion: MainQuestion;
  theme: Theme;
  userPrediction: { vote: 'yes' | 'no' } | null;
  onPressYes: () => void;
  onPressNo: () => void;
  insets: { bottom: number };
  styles: ReturnType<typeof import('../styles').createStyles>;
}

export function VoteActionBar({ mainQuestion, theme, userPrediction, onPressYes, onPressNo, insets, styles }: VoteActionBarProps) {
  const yesFillAnim = useRef(new Animated.Value(0)).current;
  const noFillAnim = useRef(new Animated.Value(0)).current;

  const yesFillWidth = yesFillAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });
  const noFillWidth = noFillAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  const handleYesPressIn = () => {
    if (userPrediction) return;
    Animated.timing(yesFillAnim, { toValue: 1, duration: 50, easing: Easing.out(Easing.quad), useNativeDriver: false }).start();
  };
  const handleYesPressOut = () => {
    onPressYes();
    Animated.timing(yesFillAnim, { toValue: 0, duration: 50, easing: Easing.in(Easing.quad), useNativeDriver: false }).start();
  };
  const handleNoPressIn = () => {
    if (userPrediction) return;
    Animated.timing(noFillAnim, { toValue: 1, duration: 50, easing: Easing.out(Easing.quad), useNativeDriver: false }).start();
  };
  const handleNoPressOut = () => {
    onPressNo();
    Animated.timing(noFillAnim, { toValue: 0, duration: 50, easing: Easing.in(Easing.quad), useNativeDriver: false }).start();
  };

  if (userPrediction) {
    return (
      <View style={[styles.compactVoteBar, { paddingBottom: insets.bottom }]}>
        <View style={styles.compactVoteRow}>
          <View style={[styles.userPredictionBadge, { flex: 1, alignItems: 'center' }]}>
            <Text style={styles.userPredictionText}>
              Tahminin: <Text style={{ color: userPrediction.vote === 'yes' ? theme.accent : theme.error, fontWeight: '900' }}>{userPrediction.vote === 'yes' ? 'EVET' : 'HAYIR'}</Text>
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.compactVoteBar, { paddingBottom: insets.bottom }]}>
      <View style={styles.compactVoteRow}>
        <Pressable
          onPressIn={handleYesPressIn}
          onPressOut={handleYesPressOut}
          style={({ pressed }) => [styles.compactVoteBtn, styles.compactVoteBtnYes, pressed && styles.compactVoteBtnPressed]}
        >
          <Animated.View
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: yesFillWidth,
              backgroundColor: theme.accent,
              opacity: 0.35,
              borderRadius: 10,
            }}
          />
          <Text style={[styles.compactVoteLabelYes, { color: theme.accent }]}>EVET</Text>
          <Text style={styles.compactVoteOdds}>{mainQuestion?.yesOdds || 2}x</Text>
        </Pressable>
        <View style={styles.compactVoteDivider} />
        <Pressable
          onPressIn={handleNoPressIn}
          onPressOut={handleNoPressOut}
          style={({ pressed }) => [styles.compactVoteBtn, styles.compactVoteBtnNo, pressed && styles.compactVoteBtnPressed]}
        >
          <Animated.View
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: noFillWidth,
              backgroundColor: theme.error,
              opacity: 0.35,
              borderRadius: 10,
            }}
          />
          <Text style={[styles.compactVoteLabelNo, { color: theme.error }]}>HAYIR</Text>
          <Text style={styles.compactVoteOdds}>{mainQuestion?.noOdds || 2}x</Text>
        </Pressable>
      </View>
    </View>
  );
}
