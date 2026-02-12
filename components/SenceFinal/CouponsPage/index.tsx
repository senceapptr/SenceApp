import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Text, Alert, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { couponsService } from '@/services/coupons.service';
import { CategoryType, Coupon } from './types';
import { calculateStatistics } from './utils';
import { mapBackendCouponsToFrontend } from './couponMapper';
import { useHeaderAnimation } from './hooks';
import { Header } from './components/Header';
import { StatisticsCards } from './components/StatisticsCards';
import { CategoryTabs } from './components/CategoryTabs';
import { CouponCard } from './components/CouponCard';
import { CouponDetailModal } from './components/CouponDetailModal';
import { CouponsPageSkeleton } from './components/CouponsPageSkeleton';

interface CouponsPageProps {
  onMenuToggle: () => void;
  onQuestionDetail?: (questionId: string) => void;
  refreshTrigger?: number;
  onCreateCouponPress?: () => void;
}

// Empty State Component with animations
function CouponsEmptyState({ onCreatePress }: { onCreatePress?: () => void }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.emptyStateWrapper,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <View style={styles.emptyStateCard}>
        <Animated.View style={[styles.emptyIconWrapper, { transform: [{ translateY: floatAnim }] }]}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="ticket" size={64} color="#10B981" />
          </View>
          <View style={[styles.decorativeCircle, styles.decorativeCircle1]} />
          <View style={[styles.decorativeCircle, styles.decorativeCircle2]} />
          <View style={[styles.decorativeCircle, styles.decorativeCircle3]} />
        </Animated.View>

        <Text style={styles.emptyTitle}>Henüz Ticket Yok</Text>
        <Text style={styles.emptyDescription}>
          Sorulara oy vererek heyecan dolu{'\n'}
          ticketlar oluştur ve kazanmaya başla!
        </Text>

        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <TouchableOpacity style={styles.emptyActionButton} onPress={onCreatePress} activeOpacity={0.8}>
            <Ionicons name="add-circle" size={24} color="#FFFFFF" />
            <Text style={styles.emptyActionButtonText}>İlk Ticketını Oluştur</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

export function CouponsPage({ onMenuToggle, onQuestionDetail, refreshTrigger, onCreateCouponPress }: CouponsPageProps) {
  const { user } = useAuth();
  // Tek seçim için state - varsayılan 'all'
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [previousCategory, setPreviousCategory] = useState<CategoryType>('all');
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [showCouponDetail, setShowCouponDetail] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const { headerTranslateY, handleScroll } = useHeaderAnimation();

  const loadCouponsData = async (isRefresh = false) => {
    if (!user) {
      setLoading(false);
      setShowSkeleton(false);
      return;
    }

    try {
      setLoading(true);
      if (!isRefresh) {
        setShowSkeleton(true);
      }
      const result = await couponsService.getUserCoupons(user.id);

      if (result.error) {
        console.error('Error loading coupons:', result.error);
        Alert.alert('Hata', 'Ticketlar yüklenirken bir hata oluştu');
        setLoading(false);
        setShowSkeleton(false);
        return;
      }

      if (result.data) {
        const mappedCoupons = mapBackendCouponsToFrontend(result.data);
        setCoupons(mappedCoupons);
      } else {
        setCoupons([]);
      }
    } catch (err) {
      console.error('Coupons load error:', err);
      Alert.alert('Hata', 'Ticketlar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
      if (!isRefresh && showSkeleton) {
        setShowSkeleton(false);
      }
    }
  };

  useEffect(() => {
    loadCouponsData();
  }, [user]);

  useEffect(() => {
    if (refreshTrigger && refreshTrigger > 0) {
      loadCouponsData();
    }
  }, [refreshTrigger]);

  const stats = calculateStatistics(coupons);

  // Tek seçime göre filtrele
  const filteredCoupons = coupons.filter(coupon => {
    if (selectedCategory === 'all') return true;
    return coupon.status === selectedCategory;
  });

  const handleCategoryChange = useCallback((category: CategoryType) => {
    setSelectedCategory(prev => {
      if (prev !== category) {
        setPreviousCategory(prev);
      }
      return category;
    });
  }, []);

  const handleCouponClick = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setShowCouponDetail(true);
  };

  // Karttan direkt claim
  const handleCouponClaim = async (coupon: Coupon) => {
    if (!coupon.rawId) {
      Alert.alert('Hata', 'Kupon bilgisi eksik');
      return;
    }

    try {
      const result = await couponsService.claimCouponReward(coupon.rawId);

      if (result.error) {
        Alert.alert('Hata', result.error.message || 'Ödül alınırken bir hata oluştu');
        return;
      }

      const data = result.data as { success?: boolean; message?: string; error?: string; amount?: number } | null;

      if (data?.success) {
        Alert.alert(
          'Tebrikler! 🎉',
          data.message ||
            `${data.amount?.toLocaleString() || coupon.potentialEarnings.toLocaleString()} kredi hesabınıza eklendi!`,
        );
        // Kupon listesini güncelle
        setCoupons(prev => prev.map(c => (c.rawId === coupon.rawId ? { ...c, claimedReward: true } : c)));
      } else {
        Alert.alert('Hata', data?.error || 'Ödül alınamadı');
      }
    } catch (err) {
      Alert.alert('Hata', 'Ödül alınırken bir hata oluştu');
    }
  };

  const handleClaimReward = async (couponId: number) => {
    const coupon = coupons.find(c => c.id === couponId);
    if (coupon) {
      await handleCouponClaim(coupon);
    }
    setShowCouponDetail(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCouponsData(true);
    setRefreshing(false);
  };

  // ListHeaderComponent için memoize
  const ListHeader = useCallback(
    () => (
      <View style={styles.listHeader}>
        <StatisticsCards
          totalCoupons={stats.totalCoupons}
          totalEarnings={stats.totalEarnings}
          totalLost={stats.totalLost}
        />
        <CategoryTabs
          selectedCategory={selectedCategory}
          previousCategory={previousCategory}
          onCategoryChange={handleCategoryChange}
          totalCoupons={stats.totalCoupons}
          pendingCoupons={stats.pendingCoupons}
          wonCoupons={stats.wonCoupons}
          lostCoupons={stats.lostCoupons}
        />
      </View>
    ),
    [stats, selectedCategory, previousCategory, handleCategoryChange],
  );

  // Giriş yapılmamış
  if (!user) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <Header onMenuToggle={onMenuToggle} headerTranslateY={headerTranslateY} />
          <View style={styles.loadingContent}>
            <Text style={styles.errorText}>Ticketları görüntülemek için giriş yapmalısınız</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  const renderCouponItem = ({ item }: { item: Coupon }) => (
    <CouponCard coupon={item} onPress={handleCouponClick} onClaim={handleCouponClaim} />
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Header onMenuToggle={onMenuToggle} headerTranslateY={headerTranslateY} />

        {showSkeleton ? (
          <View style={styles.skeletonContainer} pointerEvents="none">
            <CouponsPageSkeleton />
          </View>
        ) : (
          <FlatList
            data={filteredCoupons}
            renderItem={renderCouponItem}
            keyExtractor={item => item.rawId || item.id.toString()}
            ListHeaderComponent={ListHeader}
            ListEmptyComponent={<CouponsEmptyState onCreatePress={onCreateCouponPress} />}
            contentContainerStyle={styles.flatListContent}
            showsVerticalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#10B981', '#059669']}
                tintColor="#10B981"
                progressBackgroundColor="#161B22"
                title="Yenileniyor..."
                titleColor="#10B981"
              />
            }
          />
        )}

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
    backgroundColor: '#0D1117',
  },
  safeArea: {
    flex: 1,
  },
  skeletonContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
  flatListContent: {
    paddingTop: 70,
    paddingHorizontal: 24,
    paddingBottom: 120,
  },
  listHeader: {
    marginBottom: 8,
  },
  loadingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  // Empty State Styles
  emptyStateWrapper: {
    paddingTop: 20,
    paddingBottom: 60,
  },
  emptyStateCard: {
    backgroundColor: '#161B22',
    borderRadius: 24,
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#30363D',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  },
  emptyIconWrapper: {
    position: 'relative',
    marginBottom: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#21262D',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#10B981',
    borderStyle: 'dashed',
  },
  decorativeCircle: {
    position: 'absolute',
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#10B981',
    opacity: 0.2,
  },
  decorativeCircle1: {
    width: 140,
    height: 140,
    top: -10,
  },
  decorativeCircle2: {
    width: 160,
    height: 160,
    top: -20,
  },
  decorativeCircle3: {
    width: 180,
    height: 180,
    top: -30,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F0F6FC',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 15,
    color: '#8B949E',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  emptyActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 10,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  emptyActionButtonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
