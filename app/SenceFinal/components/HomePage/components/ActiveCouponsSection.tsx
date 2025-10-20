import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { ActiveCoupon } from '../types';
import { CouponCard } from './CouponCard';

interface ActiveCouponsSectionProps {
  coupons: ActiveCoupon[];
  isDarkMode: boolean;
  theme: any;
}

export function ActiveCouponsSection({ coupons, isDarkMode, theme }: ActiveCouponsSectionProps) {
  return (
    <View style={[styles.section, { backgroundColor: isDarkMode ? theme.surface : '#FFFFFF' }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Aktif Kuponlar</Text>
        <TouchableOpacity>
          <Text style={[styles.seeAll, { color: theme.primary }]}>Tümünü gör</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={coupons}
        renderItem={({ item }) => (
          <CouponCard coupon={item} isDarkMode={isDarkMode} theme={theme} />
        )}
        keyExtractor={(item) => item.id.toString()}
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
    color: '#432870',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
    color: '#432870',
  },
  list: {
    paddingLeft: 16,
    paddingRight: 16,
  },
});




