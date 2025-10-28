import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ActiveCoupon } from '../types';

interface CouponCardProps {
  coupon?: ActiveCoupon;
  isDarkMode: boolean;
  theme: any;
  onPress?: () => void;
}

export function CouponCard({ coupon, isDarkMode, theme, onPress }: CouponCardProps) {
  // Güvenlik kontrolü - coupon undefined ise null döndür
  if (!coupon) {
    return null;
  }

  // Theme güvenlik kontrolü
  if (!theme) {
    return null;
  }

  // 3 farklı mor tonu
  const purpleGradients = [
    ['#432870', '#5A3A8B'], // Koyu mor
    ['#6B46C1', '#8B5CF6'], // Orta mor
    ['#7C3AED', '#A855F7'], // Açık mor
  ];

  const gradientColors = isDarkMode 
    ? [theme.surfaceCard || '#FFFFFF', theme.surfaceElevated || '#F5F5F5', theme.surface || '#FFFFFF']
    : purpleGradients[(coupon.id || 0) % purpleGradients.length];

  // Güvenlik kontrolü - gradientColors'ın bir array olduğundan emin ol
  const safeGradientColors = Array.isArray(gradientColors) ? gradientColors : ['#432870', '#5A3A8B'];

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <LinearGradient
        colors={safeGradientColors}
        style={[styles.card, {
          borderWidth: isDarkMode ? 1 : 0,
          borderColor: isDarkMode ? (theme.border || '#E5E5E5') : 'transparent',
          shadowColor: isDarkMode ? 'transparent' : '#000'
        }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
      <Text style={[styles.name, { color: isDarkMode ? (theme.textPrimary || '#000000') : '#FFFFFF' }]}>
        {coupon.name || 'Kupon'}
      </Text>
      
      <View style={styles.stats}>
        <View style={styles.statRow}>
          <Text style={[styles.statLabel, { color: isDarkMode ? (theme.textSecondary || '#666666') : 'rgba(255,255,255,0.8)' }]}>
            Soru Sayısı
          </Text>
          <Text style={[styles.statValue, { color: isDarkMode ? (theme.textPrimary || '#000000') : '#FFFFFF' }]}>
            {coupon.questionCount || 0} adet
          </Text>
        </View>
        <View style={styles.statRow}>
          <Text style={[styles.statLabel, { color: isDarkMode ? (theme.textSecondary || '#666666') : 'rgba(255,255,255,0.8)' }]}>
            Toplam Oran
          </Text>
          <Text style={[styles.statValue, { color: isDarkMode ? (theme.textPrimary || '#000000') : '#FFFFFF' }]}>
            {coupon.totalOdds || 0}x
          </Text>
        </View>
        <View style={styles.statRow}>
          <Text style={[styles.statLabel, { color: isDarkMode ? (theme.textSecondary || '#666666') : 'rgba(255,255,255,0.8)' }]}>
            Potansiyel Kazanç
          </Text>
          <View style={styles.coinContainer}>
            <Text style={[styles.statValue, { color: '#FFFFFF' }]}>
              {coupon.potentialWinnings || 0}
            </Text>
            <Ionicons name="diamond" size={16} color="#FFFFFF" />
          </View>
        </View>
        <View style={styles.statRow}>
          <Text style={[styles.statLabel, { color: isDarkMode ? (theme.textSecondary || '#666666') : 'rgba(255,255,255,0.8)' }]}>
            Bitiş
          </Text>
          <Text style={[styles.statValue, { color: '#FFFFFF' }]}>
            {coupon.endsIn || 'Bilinmiyor'}
          </Text>
        </View>
      </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 280,
    marginRight: 8,
    padding: 16,
    borderRadius: 16,
  },
  name: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  stats: {
    gap: 6,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  statValue: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  coinContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});




