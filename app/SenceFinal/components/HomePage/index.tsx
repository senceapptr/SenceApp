import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, StatusBar, Animated, RefreshControl, ActivityIndicator, Alert, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { mockActiveCoupons } from './utils';
import { useHeaderAnimation } from './hooks';
import { Header } from './components/Header';
import { FeaturedCarousel } from './components/FeaturedCarousel';
import { ActivitiesSection } from './components/ActivitiesSection';
import { ActiveCouponsSection } from './components/ActiveCouponsSection';
import { TrendQuestionsSection } from './components/TrendQuestionsSection';
import { DailyChallengeFlow } from '../DailyChallengeFlow';
import { DailyChallengeSwipeDeck } from '../DailyChallengeSwipeDeck';
import { questionsService, couponsService } from '@/services';
import type { FeaturedQuestion, TrendQuestion } from './types';

interface HomePageProps {
  onBack: () => void;
  handleQuestionDetail: (questionId: string) => void;
  handleVote: (questionId: string, vote: 'yes' | 'no', odds: number, questionTitle?: string) => void;
  onMenuToggle: () => void;
  onTasksNavigate?: () => void;
}

export function HomePage({ 
  onBack, 
  handleQuestionDetail, 
  handleVote, 
  onMenuToggle, 
  onTasksNavigate 
}: HomePageProps) {
  const { theme, isDarkMode } = useTheme();
  const { user } = useAuth();
  
  // State tanımlamaları
  const [featuredQuestions, setFeaturedQuestions] = useState<FeaturedQuestion[]>([]);
  const [trendQuestions, setTrendQuestions] = useState<TrendQuestion[]>([]);
  const [activeCoupons, setActiveCoupons] = useState<any[]>(mockActiveCoupons); // Başlangıçta mock data
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isDailyChallengeOpen, setIsDailyChallengeOpen] = useState(false);
  
  const refreshAnim = useRef(new Animated.Value(0)).current;
  const { headerTranslateY, scrollY } = useHeaderAnimation();

  // Backend'den veri yükleme
  const loadHomeData = async () => {
    try {
      setLoading(true);

      // Paralel olarak tüm verileri yükle
      const [featuredResult, trendingResult, couponsResult] = await Promise.all([
        questionsService.getFeaturedQuestions(),
        questionsService.getTrendingQuestions(),
        user ? couponsService.getActiveCoupons(user.id) : { data: null, error: null },
      ]);

      // Featured questions
      if (featuredResult.data) {
        const mappedFeatured: FeaturedQuestion[] = featuredResult.data.map((q: any) => ({
          id: q.id, // UUID olarak bırak
          title: q.title,
          image: q.image_url || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
          votes: q.total_votes || 0,
          timeLeft: calculateTimeLeft(q.end_date),
          category: q.categories?.name || 'Genel',
          yesOdds: q.yes_odds,
          noOdds: q.no_odds,
          dominantColor: q.categories?.color || '#4F46E5',
        }));
        setFeaturedQuestions(mappedFeatured);
      }

      // Trend questions
      if (trendingResult.data) {
        const mappedTrend: TrendQuestion[] = trendingResult.data.map((q: any) => ({
          id: q.id, // UUID olarak bırak
          title: q.title,
          category: q.categories?.name || 'Genel',
          image: q.image_url || 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=400&fit=crop',
          votes: q.total_votes || 0,
          timeLeft: calculateTimeLeft(q.end_date),
          yesOdds: q.yes_odds,
          noOdds: q.no_odds,
          yesPercentage: q.yes_percentage || 0,
        }));
        setTrendQuestions(mappedTrend);
      }

      // Active coupons
      if (couponsResult.data && Array.isArray(couponsResult.data) && couponsResult.data.length > 0) {
        // Backend'den gelen veriyi ActiveCoupon formatına dönüştür
        const mappedCoupons = couponsResult.data.map((coupon: any) => ({
          id: coupon.id,
          name: coupon.coupon_code || 'Kupon',
          questionCount: coupon.selections_count || 0,
          totalOdds: coupon.total_odds || 1,
          potentialWinnings: coupon.potential_win || 0,
          endsIn: calculateTimeLeft(coupon.created_at) || 'Bilinmiyor',
          colors: ['#432870', '#5A3A8B'] as [string, string]
        }));
        setActiveCoupons(mappedCoupons);
      } else {
        // Fallback to mock data if backend data is not available
        setActiveCoupons(mockActiveCoupons);
      }

    } catch (err) {
      console.error('Home data load error:', err);
      Alert.alert('Hata', 'Veriler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
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

  // Sayfa yüklendiğinde veriyi çek
  useEffect(() => {
    loadHomeData();
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    
    Animated.sequence([
      Animated.timing(refreshAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(refreshAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    await loadHomeData();
    setRefreshing(false);
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

  // Loading durumu
  if (loading && featuredQuestions.length === 0) {
    return (
      <View style={[styles.container, styles.loadingContainer, { backgroundColor: theme.background }]}>
        <StatusBar 
          barStyle={isDarkMode ? "light-content" : "light-content"} 
          backgroundColor="transparent" 
          translucent 
        />
        <LinearGradient
          colors={isDarkMode 
            ? [theme.background, theme.surface, theme.surfaceElevated, theme.surfaceCard]
            : ['#FAFAFA', '#F5F5F5', '#F0F0F0', '#EBEBEB']
          }
          style={styles.backgroundGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <ActivityIndicator size="large" color="#432870" />
        <Text style={[styles.loadingText, { color: theme.textPrimary }]}>Yükleniyor...</Text>
      </View>
    );
  }

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

      <Animated.ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={32}
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
          coupons={activeCoupons}
          isDarkMode={isDarkMode}
          theme={theme}
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
      </Animated.ScrollView>

      {isDailyChallengeOpen && (
        <View style={styles.challengeOverlay}>
          <DailyChallengeSwipeDeck
            onComplete={handleDailyChallengeComplete}
            onBack={handleDailyChallengeClose}
            triviaMultiplier={1.0}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
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



