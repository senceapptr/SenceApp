import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ActiveCoupon } from '../types';

interface CouponCardProps {
  coupon: ActiveCoupon;
  isDarkMode: boolean;
  theme: any;
}

export function CouponCard({ coupon, isDarkMode, theme }: CouponCardProps) {
  return (
    <LinearGradient
      colors={isDarkMode 
        ? [theme.surfaceCard, theme.surfaceElevated, theme.surface]
        : coupon.colors
      }
      style={[styles.card, {
        borderWidth: isDarkMode ? 1 : 0,
        borderColor: isDarkMode ? theme.border : 'transparent',
        shadowColor: isDarkMode ? 'transparent' : '#000'
      }]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text style={[styles.name, { color: isDarkMode ? theme.textPrimary : '#FFFFFF' }]}>
        {coupon.name}
      </Text>
      
      <View style={styles.stats}>
        <View style={styles.statRow}>
          <Text style={[styles.statLabel, { color: isDarkMode ? theme.textSecondary : 'rgba(255,255,255,0.8)' }]}>
            Soru Sayısı
          </Text>
          <Text style={[styles.statValue, { color: isDarkMode ? theme.textPrimary : '#FFFFFF' }]}>
            {coupon.questionCount} adet
          </Text>
        </View>
        <View style={styles.statRow}>
          <Text style={[styles.statLabel, { color: isDarkMode ? theme.textSecondary : 'rgba(255,255,255,0.8)' }]}>
            Toplam Oran
          </Text>
          <Text style={[styles.statValue, { color: isDarkMode ? theme.textPrimary : '#FFFFFF' }]}>
            {coupon.totalOdds}x
          </Text>
        </View>
        <View style={styles.statRow}>
          <Text style={[styles.statLabel, { color: isDarkMode ? theme.textSecondary : 'rgba(255,255,255,0.8)' }]}>
            Potansiyel Kazanç
          </Text>
          <Text style={[styles.statValue, { color: theme.accent }]}>
            {coupon.potentialWinnings} 💎
          </Text>
        </View>
        <View style={styles.statRow}>
          <Text style={[styles.statLabel, { color: isDarkMode ? theme.textSecondary : 'rgba(255,255,255,0.8)' }]}>
            Bitiş
          </Text>
          <Text style={[styles.statValue, { color: theme.warning }]}>
            {coupon.endsIn}
          </Text>
        </View>
      </View>
    </LinearGradient>
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
});



