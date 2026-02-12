import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ActiveCoupon } from '../types';
import { CouponCard } from './CouponCard';

interface ActiveCouponsSectionProps {
  coupons?: ActiveCoupon[];
  isDarkMode: boolean;
  theme: any;
  onCouponPress?: (coupon: ActiveCoupon) => void;
  onSeeAllPress?: () => void;
  onCreateCouponPress?: () => void;
}

export function ActiveCouponsSection({
  coupons,
  isDarkMode,
  theme,
  onCouponPress,
  onSeeAllPress,
  onCreateCouponPress,
}: ActiveCouponsSectionProps) {
  // Güvenlik kontrolü - coupons undefined veya null ise boş array kullan
  const safeCoupons = coupons || [];

  // Theme güvenlik kontrolü
  if (!theme) {
    return null;
  }

  // Empty state göster
  if (safeCoupons.length === 0) {
    return (
      <View style={[styles.section, { backgroundColor: 'transparent' }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: '#F0F6FC' }]}>Aktif Ticketlar</Text>
        </View>

        <View style={styles.emptyStateContainer}>
          <View style={[styles.emptyStateGradient, { backgroundColor: '#21262D' }]}>
            <View style={styles.emptyStateIconContainer}>
              <Ionicons name="ticket-outline" size={48} color="#256EFF" />
            </View>

            <Text style={styles.emptyStateTitle}>Aktif Ticketın Yok</Text>

            <TouchableOpacity style={styles.createCouponButton} onPress={onCreateCouponPress} activeOpacity={0.8}>
              <Ionicons name="add-circle" size={20} color="#256EFF" />
              <Text style={styles.createCouponButtonText}>Ticket Oluştur</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.section, { backgroundColor: 'transparent' }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: '#F0F6FC' }]}>Aktif Ticketlar</Text>
        <TouchableOpacity onPress={onSeeAllPress}>
          <Text style={[styles.seeAll, { color: '#256EFF' }]}>Tümünü gör</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={Array.isArray(safeCoupons) ? safeCoupons : []}
        renderItem={({ item }) => {
          // Güvenlik kontrolü - item undefined ise null döndür
          if (!item) {
            return null;
          }
          return (
            <CouponCard coupon={item} isDarkMode={isDarkMode} theme={theme} onPress={() => onCouponPress?.(item)} />
          );
        }}
        keyExtractor={(item, index) => (item && item.id ? item.id.toString() : index.toString())}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        removeClippedSubviews={true}
        maxToRenderPerBatch={2}
        windowSize={3}
        initialNumToRender={1}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    marginVertical: 8,
    borderRadius: 12,
    marginHorizontal: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F0F6FC',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
    color: '#256EFF',
  },
  list: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  emptyStateContainer: {
    marginHorizontal: 16,
    marginTop: 8,
  },
  emptyStateGradient: {
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#30363D',
  },
  emptyStateIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 24,
    textAlign: 'center',
  },
  createCouponButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(37, 110, 255, 0.16)',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#256EFF',
  },
  createCouponButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#256EFF',
  },
});
