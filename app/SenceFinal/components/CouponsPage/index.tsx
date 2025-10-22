import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, FlatList, RefreshControl, SafeAreaView, ActivityIndicator, Text, Alert } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { couponsService } from '@/services';
import { CategoryType, Coupon } from './types';
import { calculateStatistics } from './utils';
import { useHeaderAnimation } from './hooks';
import { Header } from './components/Header';
import { StatisticsCards } from './components/StatisticsCards';
import { CategoryTabs } from './components/CategoryTabs';
import { CouponCard } from './components/CouponCard';
import { CouponDetailModal } from './components/CouponDetailModal';

interface CouponsPageProps {
  onMenuToggle: () => void;
  onQuestionDetail?: (questionId: number) => void;
  refreshTrigger?: number; // Bu prop değiştiğinde sayfa yenilenecek
}

export function CouponsPage({ onMenuToggle, onQuestionDetail, refreshTrigger }: CouponsPageProps) {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [showCouponDetail, setShowCouponDetail] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const { headerTranslateY, handleScroll } = useHeaderAnimation();

  // Backend'den kupon verilerini yükle
  const loadCouponsData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const result = await couponsService.getUserCoupons(user.id);
      
      if (result.data) {
        // Backend'den gelen veriyi frontend formatına çevir
        const mappedCoupons: Coupon[] = result.data.map((coupon: any) => ({
          id: parseInt(coupon.id) || 0,
          predictions: coupon.coupon_selections?.map((selection: any) => ({
            id: parseInt(selection.id) || 0,
            questionId: parseInt(selection.question_id) || 0,
            question: selection.questions?.title || 'Soru bulunamadı',
            choice: selection.vote,
            odds: parseFloat(selection.odds) || 1,
            category: selection.questions?.category || 'Genel',
            result: selection.status === 'won' ? 'won' : selection.status === 'lost' ? 'lost' : 'pending'
          })) || [],
          totalOdds: parseFloat(coupon.total_odds) || 1,
          potentialEarnings: parseInt(coupon.potential_win) || 0,
          status: coupon.status === 'pending' ? 'live' : coupon.status === 'won' ? 'won' : coupon.status === 'lost' ? 'lost' : 'live',
          createdAt: new Date(coupon.created_at),
          claimedReward: coupon.claimed_reward || false,
          username: coupon.username || '@kullanici',
          investmentAmount: parseInt(coupon.stake_amount) || 0,
        }));
        setCoupons(mappedCoupons);
      }
    } catch (err) {
      console.error('Coupons load error:', err);
      Alert.alert('Hata', 'Kuponlar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Sayfa yüklendiğinde veriyi çek
  useEffect(() => {
    loadCouponsData();
  }, [user]);

  // refreshTrigger değiştiğinde veriyi yenile
  useEffect(() => {
    if (refreshTrigger && refreshTrigger > 0) {
      loadCouponsData();
    }
  }, [refreshTrigger]);

  const stats = calculateStatistics(coupons);

  const filteredCoupons = coupons.filter(coupon => {
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

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCouponsData();
    setRefreshing(false);
  };

  // Loading durumu
  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <SafeAreaView style={styles.safeArea}>
          <Header onMenuToggle={onMenuToggle} headerTranslateY={headerTranslateY} />
          <View style={styles.loadingContent}>
            <ActivityIndicator size="large" color="#432870" />
            <Text style={styles.loadingText}>Kuponlar yükleniyor...</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // Giriş yapılmamış
  if (!user) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <SafeAreaView style={styles.safeArea}>
          <Header onMenuToggle={onMenuToggle} headerTranslateY={headerTranslateY} />
          <View style={styles.loadingContent}>
            <Text style={styles.errorText}>Kuponları görüntülemek için giriş yapmalısınız</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

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
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
    color: '#432870',
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});



