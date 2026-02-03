import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, FlatList, RefreshControl, Text, Alert, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { couponsService } from '@/services/coupons.service';
import { CategoryType, Coupon } from './types';
import { calculateStatistics, computeCouponStatus } from './utils';
import { useHeaderAnimation } from './hooks';
import { Header } from './components/Header';
import { StatisticsCards } from './components/StatisticsCards';
import { CategoryTabs } from './components/CategoryTabs';
import { CouponCard } from './components/CouponCard';
import { CouponDetailModal } from './components/CouponDetailModal';
import { CouponsPageSkeleton } from './components/CouponsPageSkeleton';

interface CouponsPageProps {
  onMenuToggle: () => void;
  onQuestionDetail?: (questionId: number) => void;
  refreshTrigger?: number; // Bu prop değiştiğinde sayfa yenilenecek
  onCreateCouponPress?: () => void; // Ticket oluşturmaya yönlendir
}

// Empty State Component with animations
function CouponsEmptyState({ onCreatePress }: { onCreatePress?: () => void }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entrance animation
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

    // Float animation
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
      ])
    ).start();

    // Pulse animation for button
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
      ])
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
        <Animated.View
          style={[
            styles.emptyIconWrapper,
            { transform: [{ translateY: floatAnim }] },
          ]}
        >
          <View style={styles.emptyIconCircle}>
            <Ionicons name="ticket" size={64} color="#10B981" />
          </View>
          
          {/* Decorative elements */}
          <View style={[styles.decorativeCircle, styles.decorativeCircle1]} />
          <View style={[styles.decorativeCircle, styles.decorativeCircle2]} />
          <View style={[styles.decorativeCircle, styles.decorativeCircle3]} />
        </Animated.View>

        <Text style={styles.emptyTitle}>Henüz Ticket Yok</Text>
        <Text style={styles.emptyDescription}>
          Sorulara oy vererek heyecan dolu{'\n'}
          ticketlar oluştur ve kazanmaya başla! 🎯
        </Text>

        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <TouchableOpacity
            style={styles.emptyActionButton}
            onPress={onCreatePress}
            activeOpacity={0.8}
          >
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
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [showCouponDetail, setShowCouponDetail] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const { headerTranslateY, handleScroll } = useHeaderAnimation();

  // Backend'den ticket verilerini yükle
  const loadCouponsData = async (isRefresh = false) => {
    if (!user) {
      setLoading(false);
      setShowSkeleton(false);
      return;
    }

    try {
      setLoading(true);
      // Sadece ilk yüklemede skeleton göster, refresh sırasında gösterme
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
        if (__DEV__ && result.data.length > 0) {
          const first = result.data[0] as any;
          console.log('[Ticketlarım] İlk kupon keys:', Object.keys(first));
          console.log('[Ticketlarım] coupon_selections sayısı:', first.coupon_selections?.length ?? 'yok');
        }
        // Backend'den gelen veriyi frontend formatına çevir
        const mappedCoupons: Coupon[] = result.data.map((coupon: any) => {
          // coupon_selections bazen farklı key ile gelebilir (coupon_selections / couponSelections)
          const rawSelections =
            coupon.coupon_selections ??
            coupon.couponSelections ??
            (Array.isArray(coupon.selections) ? coupon.selections : []);
          const selections = Array.isArray(rawSelections) ? rawSelections : [];

          const predictions = selections.map((selection: any) => {
            const q = selection.questions ?? selection.question;
            const questionRow = Array.isArray(q) ? q?.[0] ?? q : q;
            const categoryName =
              questionRow?.categories?.name ??
              questionRow?.category?.name ??
              (typeof questionRow?.categories === 'string' ? questionRow.categories : null);
            const result =
              selection.status === 'won' ? 'won' as const
              : selection.status === 'lost' ? 'lost' as const
              : selection.status === 'cancelled' ? 'cancelled' as const
              : 'pending' as const;
            return {
              id: selection.id ?? 0,
              questionId: selection.question_id ?? 0,
              question: questionRow?.title ?? 'Soru bulunamadı',
              choice: selection.vote ?? 'yes',
              odds: Number(selection.odds) || 1,
              category: categoryName ?? 'Genel',
              result,
              endDate: questionRow?.end_date ? new Date(questionRow.end_date) : null
            };
          });

          const status = computeCouponStatus(predictions);

          return {
            id: coupon.display_id ?? coupon.id ?? 0,
            predictions,
            totalOdds: coupon.total_odds || 1,
            potentialEarnings: coupon.potential_win || 0,
            status,
            createdAt: new Date(coupon.created_at),
            claimedReward: coupon.claimed_reward || false,
            username: coupon.username || '@kullanici',
            investmentAmount: coupon.stake_amount || 0,
          };
        });

        setCoupons(mappedCoupons);
      } else {
        console.log('No data received from backend');
        setCoupons([]);
      }
    } catch (err) {
      console.error('Coupons load error:', err);
      Alert.alert('Hata', 'Ticketlar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
      // Animasyon olmadan direkt geçiş
      if (!isRefresh && showSkeleton) {
        setShowSkeleton(false);
      }
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
    await loadCouponsData(true); // true = bu bir refresh işlemi
    setRefreshing(false);
  };

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

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Header onMenuToggle={onMenuToggle} headerTranslateY={headerTranslateY} />

        {/* Skeleton Loading */}
        {showSkeleton ? (
          <View style={styles.skeletonContainer} pointerEvents="none">
            <CouponsPageSkeleton />
          </View>
        ) : (
          /* Actual Content */
          <View style={styles.contentContainer}>
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
                colors={['#10B981', '#059669']}
                tintColor="#10B981"
                progressBackgroundColor="#161B22"
                title="Yenileniyor..."
                titleColor="#10B981"
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
              pendingCoupons={stats.pendingCoupons}
              wonCoupons={stats.wonCoupons}
              lostCoupons={stats.lostCoupons}
              cancelledCoupons={stats.cancelledCoupons}
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
                ListEmptyComponent={
                  <CouponsEmptyState onCreatePress={onCreateCouponPress} />
                }
              />
            </View>
          </ScrollView>
          </View>
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
  contentContainer: {
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
    paddingHorizontal: 20,
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



