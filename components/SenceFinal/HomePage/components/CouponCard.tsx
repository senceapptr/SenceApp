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

  // Yeşil tema – aktif kupon kartları (eskisi gibi)
  const greenGradients = [
    ['#0D2818', '#134E2E'], // Koyu yeşil
    ['#14532D', '#166534'], // Orta yeşil
    ['#1A2E1A', '#243524'], // Yeşilimsi koyu
  ];

  const gradientColors = greenGradients[(coupon.id || 0) % greenGradients.length];
  const safeGradientColors = Array.isArray(gradientColors) ? gradientColors : ['#0D2818', '#134E2E'];

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <LinearGradient
        colors={safeGradientColors}
        style={[styles.card, {
          borderWidth: 1,
          borderColor: '#10B981',
          shadowColor: '#000'
        }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
      <Text style={[styles.name, { color: '#F0F6FC' }]}>
        {coupon.name || 'Ticket'}
      </Text>
      
      <View style={styles.stats}>
        <View style={styles.statRow}>
          <Text style={[styles.statLabel, { color: '#8B949E' }]}>
            Soru Sayısı
          </Text>
          <Text style={[styles.statValue, { color: '#F0F6FC' }]}>
            {coupon.questionCount || 0} adet
          </Text>
        </View>
        <View style={styles.statRow}>
          <Text style={[styles.statLabel, { color: '#8B949E' }]}>
            Toplam Oran
          </Text>
          <Text style={[styles.statValue, { color: '#F0F6FC' }]}>
            {coupon.totalOdds || 0}x
          </Text>
        </View>
        <View style={styles.statRow}>
          <Text style={[styles.statLabel, { color: '#8B949E' }]}>
            Potansiyel Kazanç
          </Text>
          <View style={styles.coinContainer}>
            <Text style={[styles.statValue, { color: '#10B981' }]}>
              {coupon.potentialWinnings || 0}
            </Text>
            <Ionicons name="diamond" size={16} color="#10B981" />
          </View>
        </View>
        <View style={styles.statRow}>
          <Text style={[styles.statLabel, { color: '#8B949E' }]}>
            Bitiş
          </Text>
          <Text style={[styles.statValue, { color: '#F0F6FC' }]}>
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




