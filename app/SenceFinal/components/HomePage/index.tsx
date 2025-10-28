import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, StatusBar, Animated, Alert, Text, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useHeaderAnimation } from './hooks';
import { Header } from './components/Header';
import { FeaturedCarousel } from './components/FeaturedCarousel';
import { ActivitiesSection } from './components/ActivitiesSection';
import { ActiveCouponsSection } from './components/ActiveCouponsSection';
import { TrendQuestionsSection } from './components/TrendQuestionsSection';
import { DailyChallengeFlow } from '../DailyChallengeFlow';
import { DailyChallengeSwipeDeck } from '../DailyChallengeSwipeDeck';
import { RefreshIndicator } from './components/RefreshIndicator';
import { questionsService } from '@/services/questions.service';
import { couponsService } from '@/services/coupons.service';
import { CouponDetailModal } from '../CouponsPage/components/CouponDetailModal';
import { HomePageSkeleton } from './HomePageSkeleton';
import type { FeaturedQuestion, TrendQuestion, ActiveCoupon } from './types';

interface HomePageProps {
  onBack: () => void;
  handleQuestionDetail: (questionId: string) => void;
  handleVote: (questionId: string, vote: 'yes' | 'no', odds: number, questionTitle?: string) => void;
  onMenuToggle: () => void;
  onTasksNavigate?: () => void;
  onCouponsNavigate?: () => void;
  onDiscoverAllNavigate?: () => void;
}

export function HomePage({ 
  onBack, 
  handleQuestionDetail, 
  handleVote, 
  onMenuToggle, 
  onTasksNavigate,
  onCouponsNavigate,
  onDiscoverAllNavigate
}: HomePageProps) {
  const { theme, isDarkMode } = useTheme();
  const { user } = useAuth();
  
  // State tanımlamaları
  const [featuredQuestions, setFeaturedQuestions] = useState<FeaturedQuestion[]>([]);
  const [trendQuestions, setTrendQuestions] = useState<TrendQuestion[]>([]);
  const [activeCoupons, setActiveCoupons] = useState<any[]>([]); // Boş array ile başla
  const [loading, setLoading] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isDailyChallengeOpen, setIsDailyChallengeOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<ActiveCoupon | null>(null);
  const [showCouponDetail, setShowCouponDetail] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [canTriggerRefresh, setCanTriggerRefresh] = useState(true);
  
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
        const mappedFeatured: FeaturedQuestion[] = featuredResult.data.map((q: any) => {
          // Primary kategoriyi kullan (category_id)
          const displayCategory = q.categories;
          
          return {
            id: q.id, // UUID olarak bırak
            title: q.title,
            image: q.image_url || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
            votes: q.total_votes || 0,
            timeLeft: calculateTimeLeft(q.end_date),
            category: displayCategory?.name || 'Genel',
            yesOdds: q.yes_odds,
            noOdds: q.no_odds,
            dominantColor: displayCategory?.color || '#4F46E5',
          };
        });
        setFeaturedQuestions(mappedFeatured);
      }

      // Trend questions
      if (trendingResult.data) {
        const mappedTrend: TrendQuestion[] = trendingResult.data.map((q: any) => {
          // Primary kategoriyi kullan (category_id)
          const displayCategory = q.categories;
          
          return {
            id: q.id, // UUID olarak bırak
            title: q.title,
            category: displayCategory?.name || 'Genel',
            image: q.image_url || 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=400&fit=crop',
            votes: q.total_votes || 0,
            timeLeft: calculateTimeLeft(q.end_date),
            yesOdds: q.yes_odds,
            noOdds: q.no_odds,
            yesPercentage: q.yes_percentage || 0,
          };
        });
        setTrendQuestions(mappedTrend);
      }

      // Active coupons
      if (couponsResult.data && Array.isArray(couponsResult.data) && couponsResult.data.length > 0) {
        // Backend'den gelen veriyi ActiveCoupon formatına dönüştür
        const mappedCoupons = couponsResult.data.map((coupon: any) => {
          // Predictions'ları backend'den gelen coupon_selections'dan oluştur
          const predictions = (coupon.coupon_selections || []).map((selection: any) => ({
            id: selection.id || 0,
            questionId: selection.question_id || 0,
            question: selection.questions?.title || 'Soru bulunamadı',
            choice: selection.vote || 'yes',
            odds: selection.odds || 1,
            category: selection.questions?.categories?.name || 'Genel',
            result: selection.status === 'won' ? 'won' : selection.status === 'lost' ? 'lost' : 'pending',
            endDate: selection.questions?.end_date ? new Date(selection.questions.end_date) : null
          }));

          // Kupondaki en geç sonuçlanacak sorunun end_date'ini bul
          const getLatestEndDate = (predictions: any[]): Date | null => {
            if (!predictions || predictions.length === 0) return null;
            
            const validEndDates = predictions
              .map(prediction => prediction.endDate)
              .filter(endDate => endDate instanceof Date && !isNaN(endDate.getTime()));
            
            if (validEndDates.length === 0) return null;
            
            return new Date(Math.max(...validEndDates.map(date => date.getTime())));
          };

          const latestEndDate = getLatestEndDate(predictions);
          const endsIn = latestEndDate ? calculateTimeLeft(latestEndDate.toISOString()) : 'Bilinmiyor';

          return {
            id: coupon.display_id || coupon.id,
            name: `Kupon #${coupon.display_id || coupon.id}`,
            questionCount: coupon.selections_count || 0,
            totalOdds: coupon.total_odds || 1,
            potentialWinnings: coupon.potential_win || 0,
            endsIn: endsIn,
            colors: ['#432870', '#5A3A8B'] as [string, string],
            // CouponDetailModal için gerekli alanlar
            predictions: predictions,
            potentialEarnings: coupon.potential_win || 0,
            status: coupon.status === 'pending' ? 'live' : coupon.status === 'won' ? 'won' : coupon.status === 'lost' ? 'lost' : 'live',
            createdAt: new Date(coupon.created_at),
            username: coupon.username || '@kullanici',
            investmentAmount: coupon.stake_amount || 0,
          };
        });
        setActiveCoupons(mappedCoupons);
      } else {
        // Backend'den veri yoksa boş array
        setActiveCoupons([]);
      }

      // Pre-load question details for faster access
      await preloadQuestionDetails(featuredResult.data || [], trendingResult.data || []);

    } catch (err) {
      console.error('Home data load error:', err);
      Alert.alert('Hata', 'Veriler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
      setShowSkeleton(false);
    }
  };

  // Zaman hesaplama fonksiyonu
  const calculateTimeLeft = (endDate: string): string => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return 'Sona erdi';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days} gün ${hours} saat`;
    return `${hours} saat`;
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
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "light-content"} 
        backgroundColor="transparent" 
        translucent 
      />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={isDarkMode 
          ? [theme.background, theme.surface, theme.surfaceElevated, theme.surfaceCard]
          : ['#FAFAFA', '#F5F5F5', '#F0F0F0', '#EBEBEB']
        }
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
    
      <Header 
        onMenuToggle={onMenuToggle} 
        headerTranslateY={headerTranslateY}
        isDarkMode={isDarkMode}
        theme={theme}
      />

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
        contentContainerStyle={{ backgroundColor: 'transparent' }}
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
          onCreateCouponPress={onDiscoverAllNavigate}
        />

        {/* Trend Questions - Backend'den */}
        {trendQuestions.length > 0 && (
          <TrendQuestionsSection
            questions={trendQuestions}
            isDarkMode={isDarkMode}
            theme={theme}
            onQuestionPress={handleQuestionDetail}
            onVote={handleVote}
          />
        )}
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
        onQuestionDetail={(questionId: number) => handleQuestionDetail(questionId.toString())}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
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
    paddingBottom: 100,
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



