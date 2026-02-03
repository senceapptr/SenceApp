import React from 'react';
import { View, Text, TouchableOpacity, Modal, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import type { Theme } from '@/contexts/ThemeContext';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface SuccessModalProps {
  visible: boolean;
  onClose: () => void;
  theme: Theme;
  selectedVote: 'yes' | 'no' | null;
  betAmount: string;
  potentialWin: number;
  successScaleAnim: Animated.Value;
  confettiAnim: Animated.Value;
}

export function SuccessModal({
  visible,
  onClose,
  theme,
  selectedVote,
  betAmount,
  potentialWin,
  successScaleAnim,
  confettiAnim,
}: SuccessModalProps) {
  if (!selectedVote) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)', justifyContent: 'center', alignItems: 'center' }}>
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: 'hidden',
            opacity: confettiAnim,
            transform: [
              {
                translateY: confettiAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-100, 0],
                }),
              },
            ],
          }}
        >
          {[...Array(20)].map((_, i) => (
            <Animated.View
              key={i}
              style={{
                position: 'absolute',
                width: 10,
                height: 10,
                borderRadius: 2,
                top: -20,
                left: `${Math.random() * 100}%`,
                backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#9B59B6', '#3498DB'][i % 5],
                transform: [
                  {
                    translateY: confettiAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, SCREEN_HEIGHT * 0.6 + Math.random() * 200],
                    }),
                  },
                  {
                    rotate: confettiAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', `${Math.random() * 720}deg`],
                    }),
                  },
                ],
              }}
            />
          ))}
        </Animated.View>
        <Animated.View
          style={[
            {
              backgroundColor: theme.surface,
              borderRadius: 24,
              padding: 32,
              width: 320,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: theme.border,
            },
            { transform: [{ scale: successScaleAnim }] },
          ]}
        >
          <View style={{ marginBottom: 20 }}>
            <LinearGradient
              colors={selectedVote === 'yes' ? [theme.accent, theme.primaryDark] : [theme.error, '#B91C1C']}
              style={{ width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center' }}
            >
              <Ionicons name="checkmark" size={48} color="#fff" />
            </LinearGradient>
          </View>
          <Text style={{ fontSize: 28, fontWeight: '900', color: theme.textPrimary, marginBottom: 8 }}>Tebrikler!</Text>
          <Text style={{ fontSize: 16, color: theme.textMuted, marginBottom: 24 }}>Ticketınız Başarıyla Alındı</Text>
          <View
            style={{
              width: '100%',
              backgroundColor: theme.surfaceCard,
              borderRadius: 16,
              padding: 20,
              marginBottom: 24,
              borderWidth: 1,
              borderColor: theme.border,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={{ fontSize: 14, color: theme.textMuted }}>Tahmin</Text>
              <Text style={{ fontSize: 14, fontWeight: '700', color: selectedVote === 'yes' ? theme.accent : theme.error }}>{selectedVote === 'yes' ? 'EVET' : 'HAYIR'}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={{ fontSize: 14, color: theme.textMuted }}>Yatırım</Text>
              <Text style={{ fontSize: 14, fontWeight: '700', color: theme.textPrimary }}>{betAmount} Kredi</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 14, color: theme.textMuted }}>Potansiyel Kazanç</Text>
              <Text style={{ fontSize: 18, fontWeight: '900', color: theme.accent }}>{potentialWin.toFixed(0)} Kredi</Text>
            </View>
          </View>
          <TouchableOpacity
            style={{ backgroundColor: theme.accent, paddingVertical: 16, paddingHorizontal: 48, borderRadius: 16 }}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#fff' }}>Tamam</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}
