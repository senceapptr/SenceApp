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

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.outerCard}
    >
      <View style={styles.cardFrame}>
        <LinearGradient
          colors={['rgba(37,110,255,0.30)', 'rgba(37,110,255,0.10)']}
          style={styles.innerCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={[styles.name, { color: '#F0F6FC' }]}>{coupon.name || 'Ticket'}</Text>

          <View style={styles.stats}>
            <View style={styles.statRow}>
              <Text style={[styles.statLabel, { color: '#8B949E' }]}>Soru Sayısı</Text>
              <Text style={[styles.statValue, { color: '#F0F6FC' }]}>{coupon.questionCount || 0} adet</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={[styles.statLabel, { color: '#8B949E' }]}>Toplam Oran</Text>
              <Text style={[styles.statValue, { color: '#F0F6FC' }]}>{coupon.totalOdds || 0}x</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={[styles.statLabel, { color: '#8B949E' }]}>Potansiyel Kazanç</Text>
              <View style={styles.coinContainer}>
                <Text style={[styles.statValue, { color: '#fefefeff' }]}>{coupon.potentialWinnings || 0}</Text>
                <Ionicons name="diamond" size={16} color="#ffffffff" />
              </View>
            </View>
            <View style={styles.statRow}>
              <Text style={[styles.statLabel, { color: '#8B949E' }]}>Bitiş</Text>
              <Text style={[styles.statValue, { color: '#F0F6FC' }]}>{coupon.endsIn || 'Bilinmiyor'}</Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  outerCard: {
    width: 280,
    marginRight: 8,
    borderRadius: 24,
    borderWidth: 2.5,
    borderColor: '#256EFF',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardFrame: {
    borderRadius: 22,
    overflow: 'hidden',
  },
  innerCard: {
    padding: 16,
    borderRadius: 22,
    backgroundColor: 'rgba(18, 37, 77, 0)',
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
