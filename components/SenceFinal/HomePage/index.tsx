import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, StatusBar, Animated, Alert, Text, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useHeaderAnimation } from './hooks';
import { Header } from './components/Header';
import { FeaturedCarousel } from './components/FeaturedCarousel';
import { ActivitiesSection } from './components/ActivitiesSection';
import { ActiveCouponsSection } from './components/ActiveCouponsSection';
import { TrendQuestionsSection, type TrendSortBy } from './components/TrendQuestionsSection';
import { SortSheetOverlay } from './components/SortSheetOverlay';
import { DailyChallengeFlow } from '../DailyChallengeFlow';
import { DailyChallengeSwipeDeck } from '../DailyChallengeSwipeDeck';
import { RefreshIndicator } from './components/RefreshIndicator';
import { questionsService } from '@/services/questions.service';
import { couponsService } from '@/services/coupons.service';
import { CouponDetailModal } from '../CouponsPage/components/CouponDetailModal';
import { HomePageSkeleton } from './HomePageSkeleton';
import type { FeaturedQuestion, TrendQuestion, ActiveCoupon } from './types';
import { mapToFeaturedQuestion, mapToTrendQuestion } from './utils/questionMapper';
import { mapCouponToActiveCoupon } from './utils/couponMapper';

interface HomePageProps {
  onBack: () => void;
  handleQuestionDetail: (questionId: string) => void;
  handleVote: (questionId: string, vote: 'yes' | 'no', odds: number, questionTitle?: string) => void;
  onMenuToggle: () => void;
  onTasksNavigate?: () => void;
  onCouponsNavigate?: () => void;
  onSearchNavigate?: () => void;
}

export function HomePage({
  onBack,
  handleQuestionDetail,
  handleVote,
  onMenuToggle,
  onTasksNavigate,
  onCouponsNavigate,
  onSearchNavigate,
}: HomePageProps) {
  const { theme, isDarkMode } = useTheme();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  // State tanımlamaları
  const [featuredQuestions, setFeaturedQuestions] = useState<FeaturedQuestion[]>([]);
  const [trendQuestions, setTrendQuestions] = useState<TrendQuestion[]>([]);
  const [activeCoupons, setActiveCoupons] = useState<ActiveCoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isDailyChallengeOpen, setIsDailyChallengeOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<ActiveCoupon | null>(null);
  const [showCouponDetail, setShowCouponDetail] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [canTriggerRefresh, setCanTriggerRefresh] = useState(true);
  const [sortSheetVisible, setSortSheetVisible] = useState(false);
  const [sortBy, setSortBy] = useState<TrendSortBy>('date');

  const { headerTranslateY, scrollY } = useHeaderAnimation();
  const scrollViewRef = useRef<ScrollView>(null);
  const lastScrollY = useRef(0);

  // Backend'den veri yükleme
  const loadHomeData = async (isRefresh = false) => {
    try {
      setLoading(true);
      if (!isRefresh) {
        setShowSkeleton(true);
      }

      // Paralel olarak tüm verileri yükle
      const [featuredResult, trendingResult, couponsResult] = await Promise.all([
        questionsService.getFeaturedQuestions(),
        questionsService.getTrendingQuestions(),
        user ? couponsService.getActiveCoupons(user.id) : { data: null, error: null },
      ]);

      // Featured questions
      if (featuredResult.data) {
        const mappedFeatured: FeaturedQuestion[] = featuredResult.data.map(mapToFeaturedQuestion);
        setFeaturedQuestions(mappedFeatured);
      }

      // Trend questions
      if (trendingResult.data) {
        const mappedTrend: TrendQuestion[] = trendingResult.data.map(mapToTrendQuestion);
        setTrendQuestions(mappedTrend);
      }

      // Active coupons
      if (couponsResult.data && Array.isArray(couponsResult.data) && couponsResult.data.length > 0) {
        const mappedCoupons = couponsResult.data.map(mapCouponToActiveCoupon);
        setActiveCoupons(mappedCoupons);
      } else {
        setActiveCoupons([]);
      }

      // Pre-load question details for faster access
      await preloadQuestionDetails(featuredResult.data || [], trendingResult.data || []);
    } catch (err) {
      console.error('Home data load error:', err);

      // Daha spesifik hata mesajları
      let errorMessage = 'Veriler yüklenirken bir hata oluştu';

      if (err instanceof Error) {
        if (err.message.includes('network') || err.message.includes('fetch')) {
          errorMessage = 'İnternet bağlantınızı kontrol edin';
        } else if (err.message.includes('permission') || err.message.includes('RLS')) {
          errorMessage = 'Bu verilere erişim yetkiniz yok';
        } else {
          errorMessage = err.message || errorMessage;
        }
      }

      Alert.alert('Hata', errorMessage);
    } finally {
      setLoading(false);
      setShowSkeleton(false);
    }
  };

  // Kupon handler'ları
  const handleCouponPress = (coupon: ActiveCoupon) => {
    setSelectedCoupon(coupon);
    setShowCouponDetail(true);
  };

  const handleCouponDetailClose = () => {
    setShowCouponDetail(false);
    setSelectedCoupon(null);
  };

  const handleSeeAllCoupons = () => {
    // Kuponlarım sayfasına yönlendir
    if (onCouponsNavigate) {
      onCouponsNavigate();
    } else {
      console.log('Navigate to coupons page');
    }
  };

  // Soru detaylarını pre-load et
  const preloadQuestionDetails = async (featuredData: any[], trendingData: any[]) => {
    try {
      const allQuestions = [...(featuredData || []), ...(trendingData || [])];
      const questionIds = allQuestions.map(q => q.id).filter(Boolean);

      // Cache kullanımı kaldırıldı - şimdilik pre-load yok
    } catch (error) {
      console.log('Pre-load error:', error);
    }
  };

  // Sayfa yüklendiğinde veriyi çek
  useEffect(() => {
    loadHomeData();
  }, [user]);

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;

    // Track pull distance (negative scroll)
    if (offsetY < 0 && !refreshing) {
      setPullDistance(Math.abs(offsetY));
    } else {
      setPullDistance(0);
    }

    scrollY.setValue(offsetY);
    lastScrollY.current = offsetY;
  };

  const handleScrollEndDrag = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;

    // Trigger refresh when pulled down
    if (offsetY < -50 && canTriggerRefresh && !refreshing) {
      onRefresh();
    }
  };

  const onRefresh = async () => {
    if (refreshing) return;

    setCanTriggerRefresh(false);
    setRefreshing(true);
    setPullDistance(0);

    await loadHomeData(true);

    // Animasyonu göstermek için minimum süre
    setTimeout(() => {
      setRefreshing(false);
      setPullDistance(0);
      // Cooldown period
      setTimeout(() => {
        setCanTriggerRefresh(true);
      }, 1000);
    }, 800);
  };

  const handleDailyChallengeOpen = () => {
    setIsDailyChallengeOpen(true);
  };

  const handleDailyChallengeClose = () => {
    setIsDailyChallengeOpen(false);
  };

  const handleDailyChallengeComplete = (selections: any[]) => {
    console.log('Daily Challenge completed!', selections);
    setIsDailyChallengeOpen(false);
  };

  const handleTasksOpen = () => {
    if (onTasksNavigate) {
      onTasksNavigate();
    }
  };

  const handleWriteQuestionPress = () => {
    console.log('Write Question pressed');
  };

  return (
    <View style={[styles.container, { backgroundColor: '#0D1117' }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'light-content'} backgroundColor="transparent" translucent />

      {/* Background Gradient */}
      <LinearGradient
        colors={
          isDarkMode ? ['#0D1117', '#131A24', '#1A2332', '#0D1117'] : ['#0D1117', '#131A24', '#1A2332', '#0D1117']
        }
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <Header onMenuToggle={onMenuToggle} headerTranslateY={headerTranslateY} isDarkMode={isDarkMode} theme={theme} />

      {/* Custom Refresh Indicator */}
      <RefreshIndicator isRefreshing={refreshing} pullDistance={pullDistance} />

      {/* Skeleton Loading */}
      {showSkeleton ? (
        <View style={styles.skeletonContainer} pointerEvents="none">
          <HomePageSkeleton />
        </View>
      ) : (
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={{
            backgroundColor: 'transparent',
            paddingBottom: 132 + insets.bottom,
          }}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          onScrollEndDrag={handleScrollEndDrag}
          scrollEventThrottle={16}
          bounces={true}
          scrollEnabled={!refreshing}
          contentInsetAdjustmentBehavior="never"
        >
          {/* Featured Questions - Backend'den */}
          {featuredQuestions.length > 0 && (
            <FeaturedCarousel
              questions={featuredQuestions}
              onQuestionPress={handleQuestionDetail}
              onVote={handleVote}
            />
          )}

          <ActivitiesSection
            isDarkMode={isDarkMode}
            theme={theme}
            onChallengePress={handleDailyChallengeOpen}
            onTasksPress={handleTasksOpen}
            onWriteQuestionPress={handleWriteQuestionPress}
          />

          {/* Active Coupons - Backend'den (fallback mock data) */}
          <ActiveCouponsSection
            coupons={Array.isArray(activeCoupons) ? activeCoupons : []}
            isDarkMode={isDarkMode}
            theme={theme}
            onCouponPress={handleCouponPress}
            onSeeAllPress={handleSeeAllCoupons}
            onCreateCouponPress={() => {
              // Sorulara scroll et - kullanıcı oy vererek ticket oluşturabilir
              scrollViewRef.current?.scrollTo({ y: 0, animated: true });
            }}
          />

          {/* Trend Questions - Arama, kategori filtreleri ve sıralama ile */}
          <TrendQuestionsSection
            questions={trendQuestions}
            isDarkMode={isDarkMode}
            theme={theme}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onOpenSortSheet={() => setSortSheetVisible(true)}
            onQuestionPress={handleQuestionDetail}
            onVote={handleVote}
            onSearchPress={onSearchNavigate}
            onSeeAllPress={() => {
              scrollViewRef.current?.scrollTo({ y: 0, animated: true });
            }}
          />
        </ScrollView>
      )}

      {isDailyChallengeOpen && (
        <View style={styles.challengeOverlay}>
          <DailyChallengeSwipeDeck
            onComplete={handleDailyChallengeComplete}
            onBack={handleDailyChallengeClose}
            triviaMultiplier={1.0}
          />
        </View>
      )}

      {/* Coupon Detail Modal */}
      <CouponDetailModal
        visible={showCouponDetail}
        coupon={selectedCoupon}
        onClose={handleCouponDetailClose}
        onQuestionDetail={handleQuestionDetail}
      />

      {/* Sıralama sheet – Modal yok, overlay (dokunma bloklanmaz) */}
      {sortSheetVisible && (
        <SortSheetOverlay
          visible={sortSheetVisible}
          sortBy={sortBy}
          onSelect={key => {
            setSortBy(key);
            setSortSheetVisible(false);
          }}
          onClose={() => setSortSheetVisible(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1117',
  },
  skeletonContainer: {
    flex: 1,
    zIndex: 1,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  challengeOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
});
