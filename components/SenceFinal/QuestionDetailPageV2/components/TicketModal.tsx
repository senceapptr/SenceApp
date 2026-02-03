import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import type { Theme } from '@/contexts/ThemeContext';
import type { MainQuestion } from '../types';

interface TicketModalProps {
  visible: boolean;
  onClose: () => void;
  theme: Theme;
  mainQuestion: MainQuestion;
  selectedVote: 'yes' | 'no' | null;
  betAmount: string;
  onBetAmountChange: (value: string) => void;
  onConfirm: () => void;
  isProcessing: boolean;
  calculatePotentialWin: () => number;
}

export function TicketModal({
  visible,
  onClose,
  theme,
  mainQuestion,
  selectedVote,
  betAmount,
  onBetAmountChange,
  onConfirm,
  isProcessing,
  calculatePotentialWin,
}: TicketModalProps) {
  if (!selectedVote) return null;

  const quickAmounts = ['50', '100', '250', '500', '1000'];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, justifyContent: 'flex-end' }}>
        <Pressable style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]} onPress={onClose} />
        <View
          style={{
            backgroundColor: theme.surface,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingHorizontal: 24,
            paddingBottom: 40,
            borderTopWidth: 1,
            borderTopColor: theme.border,
          }}
        >
          <View style={{ alignItems: 'center', paddingTop: 12, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: theme.border, marginBottom: 20 }}>
            <View style={{ width: 40, height: 4, backgroundColor: theme.textMuted, borderRadius: 2, marginBottom: 16 }} />
            <Text style={{ fontSize: 20, fontWeight: '800', color: theme.textPrimary }}>Ticket Al</Text>
            <TouchableOpacity style={{ position: 'absolute', right: 0, top: 20, padding: 8 }} onPress={onClose}>
              <Ionicons name="close" size={24} color={theme.textMuted} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 16,
              borderRadius: 16,
              marginBottom: 24,
              backgroundColor: selectedVote === 'yes' ? theme.accent + '1A' : theme.error + '1A',
              borderWidth: 1,
              borderColor: selectedVote === 'yes' ? theme.accent + '4D' : theme.error + '4D',
            }}
          >
            <View style={{ marginRight: 12 }}>
              <Ionicons name={selectedVote === 'yes' ? 'checkmark-circle' : 'close-circle'} size={32} color={selectedVote === 'yes' ? theme.accent : theme.error} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, color: theme.textMuted, marginBottom: 2 }}>Seçiminiz</Text>
              <Text style={{ fontSize: 18, fontWeight: '800', color: selectedVote === 'yes' ? theme.accent : theme.error }}>{selectedVote === 'yes' ? 'EVET' : 'HAYIR'}</Text>
            </View>
            <View style={{ backgroundColor: theme.surfaceCard, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 }}>
              <Text style={{ fontSize: 18, fontWeight: '900', color: theme.textPrimary }}>{selectedVote === 'yes' ? mainQuestion?.yesOdds : mainQuestion?.noOdds}x</Text>
              <Text style={{ fontSize: 10, color: theme.textMuted }}>oran</Text>
            </View>
          </View>
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: theme.textMuted, marginBottom: 12 }}>Yatırmak İstediğiniz Kredi</Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: theme.background,
                borderRadius: 16,
                paddingHorizontal: 20,
                paddingVertical: 16,
                borderWidth: 1,
                borderColor: theme.border,
              }}
            >
              <TextInput
                style={{ flex: 1, fontSize: 28, fontWeight: '800', color: theme.textPrimary }}
                value={betAmount}
                onChangeText={onBetAmountChange}
                keyboardType="numeric"
                placeholder="100"
                placeholderTextColor={theme.textMuted}
              />
              <Text style={{ fontSize: 16, fontWeight: '600', color: theme.textMuted }}>Kredi</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, gap: 8 }}>
              {quickAmounts.map((amount) => (
                <TouchableOpacity
                  key={amount}
                  style={[
                    { flex: 1, paddingVertical: 10, backgroundColor: theme.surfaceCard, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: theme.border },
                    betAmount === amount && { backgroundColor: theme.accent, borderColor: theme.accent },
                  ]}
                  onPress={() => onBetAmountChange(amount)}
                >
                  <Text style={[{ fontSize: 14, fontWeight: '700', color: theme.textMuted }, betAmount === amount && { color: '#fff' }]}>{amount}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View
            style={{
              backgroundColor: theme.surfaceCard,
              borderRadius: 16,
              padding: 20,
              marginBottom: 24,
              borderWidth: 1,
              borderColor: theme.border,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <Text style={{ fontSize: 14, color: theme.textMuted }}>Yatırım</Text>
              <Text style={{ fontSize: 14, fontWeight: '600', color: theme.textPrimary }}>{betAmount || '0'} Kredi</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <Text style={{ fontSize: 14, color: theme.textMuted }}>Oran</Text>
              <Text style={{ fontSize: 14, fontWeight: '600', color: theme.textPrimary }}>{selectedVote === 'yes' ? mainQuestion?.yesOdds : mainQuestion?.noOdds}x</Text>
            </View>
            <View style={{ height: 1, backgroundColor: theme.border, marginVertical: 12 }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: theme.textPrimary }}>Potansiyel Kazanç</Text>
              <Text style={{ fontSize: 20, fontWeight: '900', color: theme.accent }}>{calculatePotentialWin().toFixed(0)} Kredi</Text>
            </View>
          </View>
          <TouchableOpacity
            style={{ borderRadius: 16, overflow: 'hidden', opacity: isProcessing ? 0.7 : 1 }}
            onPress={onConfirm}
            disabled={isProcessing}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={selectedVote === 'yes' ? [theme.accent, theme.primaryDark] : [theme.error, '#B91C1C']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, gap: 10 }}
            >
              {isProcessing ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Ionicons name="ticket" size={22} color="#fff" />
                  <Text style={{ fontSize: 18, fontWeight: '800', color: '#fff' }}>Ticket Al</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
