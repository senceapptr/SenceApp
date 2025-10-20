import React, { useState, useRef } from 'react';
import { View, StyleSheet, StatusBar, Animated, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';
import { mockFeaturedQuestions, mockActiveCoupons, mockTrendQuestions } from './utils';
import { useHeaderAnimation } from './hooks';
import { Header } from './components/Header';
import { FeaturedCarousel } from './components/FeaturedCarousel';
import { ActivitiesSection } from './components/ActivitiesSection';
import { ActiveCouponsSection } from './components/ActiveCouponsSection';
import { TrendQuestionsSection } from './components/TrendQuestionsSection';
import { DailyChallengeFlow } from '../DailyChallengeFlow';

interface HomePageProps {
  onBack: () => void;
  handleQuestionDetail: (questionId: number) => void;
  handleVote: (questionId: number, vote: 'yes' | 'no', odds: number, questionTitle?: string) => void;
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
  const [refreshing, setRefreshing] = useState(false);
  const [isDailyChallengeOpen, setIsDailyChallengeOpen] = useState(false);
  const refreshAnim = useRef(new Animated.Value(0)).current;
  const { headerTranslateY, scrollY } = useHeaderAnimation();

  const onRefresh = () => {
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

    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const handleDailyChallengeOpen = () => {
    setIsDailyChallengeOpen(true);
  };

  const handleDailyChallengeClose = () => {
    setIsDailyChallengeOpen(false);
  };

  const handleDailyChallengeComplete = () => {
    console.log('Daily Challenge completed!');
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
        <FeaturedCarousel
          questions={mockFeaturedQuestions}
          onQuestionPress={handleQuestionDetail}
          onVote={handleVote}
        />

        <ActivitiesSection
          isDarkMode={isDarkMode}
          theme={theme}
          onChallengePress={handleDailyChallengeOpen}
          onTasksPress={handleTasksOpen}
          onWriteQuestionPress={handleWriteQuestionPress}
        />

        <ActiveCouponsSection
          coupons={mockActiveCoupons}
          isDarkMode={isDarkMode}
          theme={theme}
        />

        <TrendQuestionsSection
          questions={mockTrendQuestions}
          isDarkMode={isDarkMode}
          theme={theme}
          onQuestionPress={handleQuestionDetail}
          onVote={handleVote}
        />
      </Animated.ScrollView>

      <DailyChallengeFlow
        isOpen={isDailyChallengeOpen}
        onClose={handleDailyChallengeClose}
        onComplete={handleDailyChallengeComplete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
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
});



