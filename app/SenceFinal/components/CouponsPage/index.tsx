import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, FlatList, RefreshControl, SafeAreaView } from 'react-native';
import { CategoryType, Coupon } from './types';
import { mockCoupons, calculateStatistics } from './utils';
import { useHeaderAnimation } from './hooks';
import { Header } from './components/Header';
import { StatisticsCards } from './components/StatisticsCards';
import { CategoryTabs } from './components/CategoryTabs';
import { CouponCard } from './components/CouponCard';
import { CouponDetailModal } from './components/CouponDetailModal';

interface CouponsPageProps {
  onMenuToggle: () => void;
  onQuestionDetail?: (questionId: number) => void;
}

export function CouponsPage({ onMenuToggle, onQuestionDetail }: CouponsPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [showCouponDetail, setShowCouponDetail] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { headerTranslateY, handleScroll } = useHeaderAnimation();

  const stats = calculateStatistics(mockCoupons);

  const filteredCoupons = mockCoupons.filter(coupon => {
    if (selectedCategory === 'all') return true;
    return coupon.status === selectedCategory;
  });

  const handleCouponClick = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setShowCouponDetail(true);
  };

  const handleClaimReward = (couponId: number) => {
    setShowCouponDetail(false);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Header onMenuToggle={onMenuToggle} headerTranslateY={headerTranslateY} />

        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#432870', '#5A3A8B']}
              tintColor="#432870"
              progressBackgroundColor="#FFFFFF"
              title="Yenileniyor..."
              titleColor="#432870"
            />
          }
        >
          <StatisticsCards 
            totalCoupons={stats.totalCoupons}
            totalEarnings={stats.totalEarnings}
            totalLost={stats.totalLost}
          />

          <CategoryTabs
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            totalCoupons={stats.totalCoupons}
            liveCoupons={stats.liveCoupons}
            wonCoupons={stats.wonCoupons}
            lostCoupons={stats.lostCoupons}
          />

          <View style={styles.couponsContainer}>
            <FlatList
              data={filteredCoupons}
              renderItem={({ item }) => (
                <CouponCard coupon={item} onPress={handleCouponClick} />
              )}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              contentContainerStyle={styles.couponsList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </ScrollView>

        <CouponDetailModal
          visible={showCouponDetail}
          coupon={selectedCoupon}
          onClose={() => setShowCouponDetail(false)}
          onClaimReward={handleClaimReward}
          onQuestionDetail={onQuestionDetail}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingBottom: 100,
  },
  scrollContent: {
    paddingTop: 70,
  },
  couponsContainer: {
    paddingHorizontal: 24,
  },
  couponsList: {
    gap: 16,
  },
});



