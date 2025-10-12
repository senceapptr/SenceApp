import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  FlatList,
  Animated,
  PanResponder,
  RefreshControl,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { DailyChallengeButton } from './DailyChallengeButton';
import { TasksButton } from './TasksButton';
import { DailyChallengeFlow } from './DailyChallengeFlow';
import { useTheme } from '../contexts/ThemeContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface AlternativeHomePageProps {
  onBack: () => void;
  handleQuestionDetail: (questionId: number) => void;
  handleVote: (questionId: number, vote: 'yes' | 'no', odds: number, questionTitle?: string) => void;
  onMenuToggle: () => void;
  onTasksNavigate?: () => void;
}

export function NewHomePage({ onBack, handleQuestionDetail, handleVote, onMenuToggle, onTasksNavigate }: AlternativeHomePageProps) {
  const { theme, isDarkMode } = useTheme();
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);
  const [headerVisible, setHeaderVisible] = useState(true);
  const headerTranslateY = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const scrollViewRef = useRef<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const refreshAnim = useRef(new Animated.Value(0)).current;
  const [isDailyChallengeOpen, setIsDailyChallengeOpen] = useState(false);
  const [isTasksOpen, setIsTasksOpen] = useState(false);
  const isScrolling = useRef(false);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Enhanced featured questions - 5 questions for carousel
  const enhancedFeatured = [
    {
      id: 1,
      title: "ChatGPT-5 bu yıl içinde çıkacak mı?",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
      votes: 127000,
      timeLeft: "2 gün 14 saat",
      category: "Teknoloji",
      yesOdds: 2.4,
      noOdds: 1.6,
      dominantColor: "#4F46E5"
    },
    {
      id: 2,
      title: "Türkiye Milli Takımı Euro 2024'te finale kalacak mı?",
      image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop",
      votes: 89000,
      timeLeft: "3 gün 12 saat",
      category: "Spor",
      yesOdds: 3.2,
      noOdds: 1.8,
      dominantColor: "#059669"
    },
    {
      id: 3,
      title: "Bitcoin 2024 sonunda 100.000 doları aşacak mı?",
      image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=600&fit=crop",
      votes: 234000,
      timeLeft: "5 gün 8 saat",
      category: "Ekonomi",
      yesOdds: 2.1,
      noOdds: 2.0,
      dominantColor: "#F59E0B"
    },
    {
      id: 4,
      title: "Apple Vision Pro 2024'te Türkiye'ye gelecek mi?",
      image: "https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=800&h=600&fit=crop",
      votes: 156000,
      timeLeft: "1 gün 8 saat",
      category: "Teknoloji",
      yesOdds: 1.9,
      noOdds: 2.1,
      dominantColor: "#6366F1"
    },
    {
      id: 5,
      title: "İstanbul'da emlak fiyatları bu yıl %30 daha artacak mı?",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop",
      votes: 445000,
      timeLeft: "4 gün 6 saat",
      category: "Ekonomi",
      yesOdds: 2.8,
      noOdds: 1.6,
      dominantColor: "#DC2626"
    }
  ];

  const carouselScrollX = useRef(new Animated.Value(0)).current;

  // Active Coupons Data
  const activeCoupons = [
    {
      id: 1,
      name: "Süper Combo",
      questionCount: 5,
      totalOdds: 12.8,
      potentialWinnings: 2560,
      endsIn: "2g 14s",
      colors: ["#432870", "#5A3A8B"]
    },
    {
      id: 2,
      name: "Tech Special",
      questionCount: 3,
      totalOdds: 6.4,
      potentialWinnings: 1280,
      endsIn: "5s 8d",
      colors: ["#134E4A", "#0F766E"]
    },
    {
      id: 3,
      name: "Risk Master",
      questionCount: 8,
      totalOdds: 24.6,
      potentialWinnings: 4920,
      endsIn: "1g 12s",
      colors: ["#DC2626", "#B91C1C"]
    }
  ];

  // Trend Questions
  const trendQuestions = [
    {
      id: 6,
      title: "Netflix Türkiye'de abonelik fiyatları %50 artacak mı?",
      category: "Teknoloji",
      image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=400&fit=crop",
      votes: 89400,
      timeLeft: "3 gün 12 saat",
      yesOdds: 2.8,
      noOdds: 1.6,
      yesPercentage: 68
    },
    {
      id: 7,
      title: "Yapay zeka 2024 sonuna kadar %25 işsizlik artışına sebep olacak mı?",
      category: "Teknoloji",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=400&fit=crop",
      votes: 156000,
      timeLeft: "1 gün 8 saat",
      yesOdds: 3.2,
      noOdds: 1.4,
      yesPercentage: 78
    },
    {
      id: 8,
      title: "Türkiye'de enflasyon 2024 sonunda %20'nin altına düşecek mi?",
      category: "Ekonomi",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop",
      votes: 234000,
      timeLeft: "5 gün 2 saat",
      yesOdds: 2.1,
      noOdds: 1.9,
      yesPercentage: 45
    },
    {
      id: 9,
      title: "Galatasaray bu sezon şampiyon olacak mı?",
      category: "Spor",
      image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=400&fit=crop",
      votes: 445000,
      timeLeft: "2 gün 18 saat",
      yesOdds: 1.8,
      noOdds: 2.2,
      yesPercentage: 55
    }
  ];

  // Format votes
  const formatVotes = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(0)}k`;
    return count.toString();
  };

  // Handle refresh
  const onRefresh = () => {
    setRefreshing(true);
    
    // Animate refresh icon
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

    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  // Daily Challenge handlers
  const handleDailyChallengeOpen = () => {
    setIsDailyChallengeOpen(true);
  };

  const handleDailyChallengeClose = () => {
    setIsDailyChallengeOpen(false);
  };

  const handleDailyChallengeComplete = () => {
    // Handle challenge completion (e.g., show success message, update user stats)
    console.log('Daily Challenge completed!');
  };

  // Tasks handlers
  const handleTasksOpen = () => {
    if (onTasksNavigate) {
      onTasksNavigate();
    } else {
      setIsTasksOpen(true);
    }
  };

  const handleTasksClose = () => {
    setIsTasksOpen(false);
  };

  // Professional scroll-based header animation
  useEffect(() => {
    const listenerId = scrollY.addListener(({ value }) => {
      const currentScrollY = value;
      const scrollDelta = currentScrollY - lastScrollY.current;
      
      // Clear any existing timeout
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      
      // Mark as scrolling
      isScrolling.current = true;
      
      // Slower hide when scrolling down, slower show when scrolling up
      if (scrollDelta > 15 && currentScrollY > 50) {
        // Scrolling down - slower hide header with smooth animation
        if (headerVisible) {
          setHeaderVisible(false);
          Animated.timing(headerTranslateY, {
            toValue: -120,
            duration: 400,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }).start();
        }
      } else if (scrollDelta < -15 || currentScrollY <= 50) {
        // Scrolling up or near top - slower show header with smooth animation
        if (!headerVisible) {
          setHeaderVisible(true);
          Animated.timing(headerTranslateY, {
            toValue: 0,
            duration: 450,
            easing: Easing.out(Easing.back(1.1)),
            useNativeDriver: true,
          }).start();
        }
      }
      
      lastScrollY.current = currentScrollY;
      
      // Reset scrolling flag after a short delay
      scrollTimeout.current = setTimeout(() => {
        isScrolling.current = false;
      }, 100);
    });

    return () => {
      scrollY.removeListener(listenerId);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [headerVisible]);

  // Render Featured Question Card
  const FeaturedVoteButton = ({
    label,
    odds,
    color,
    onPress,
  }: { label: string; odds: number; color: string; onPress: () => void }) => {
    const fillAnim = useRef(new Animated.Value(0)).current;

    const handlePressIn = () => {
      Animated.timing(fillAnim, {
        toValue: 1,
        duration: 250,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }).start();
    };

    const handlePressOut = () => {
      Animated.timing(fillAnim, {
        toValue: 0,
        duration: 250,
        easing: Easing.in(Easing.quad),
        useNativeDriver: false,
      }).start();
      onPress();
    };

    const fillWidth = fillAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%'],
    });

    return (
      <TouchableOpacity
        style={[styles.voteButton, { borderColor: color }]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <Animated.View
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: fillWidth,
            backgroundColor: color,
            opacity: 1.00,
            borderRadius: 20,
          }}
        />
        <Text style={styles.voteButtonText}>{label}</Text>
        <Text style={styles.voteOdds}>{odds}x</Text>
      </TouchableOpacity>
    );
  };

  const renderFeaturedCard = ({ item, index }: { item: any; index: number }) => (
    <TouchableOpacity
      style={styles.featuredCard}
      onPress={() => handleQuestionDetail(item.id)}
      activeOpacity={0.95}
    >
      <Image source={{ uri: item.image }} style={styles.featuredImage} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
        style={styles.featuredGradient}
      />
      
      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statBadge}>
          <Text style={styles.statText}>👥 {formatVotes(item.votes)} Oy</Text>
        </View>
        <View style={styles.statBadge}>
          <Text style={styles.statText}>⏱️ {item.timeLeft}</Text>
        </View>
      </View>

      {/* Question Title */}
      <Text style={styles.featuredTitle}>{item.title}</Text>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <FeaturedVoteButton
          label="EVET"
          odds={item.yesOdds}
          color="#34C759"
          onPress={() => handleVote(item.id, 'yes', item.yesOdds, item.title)}
        />
        <FeaturedVoteButton
          label="HAYIR"
          odds={item.noOdds}
          color="#FF3B30"
          onPress={() => handleVote(item.id, 'no', item.noOdds, item.title)}
        />
      </View>
    </TouchableOpacity>
  );

  // Render Coupon Card
    const renderCouponCard = ({ item }: { item: any }) => (
      <LinearGradient
        colors={isDarkMode 
          ? [theme.surfaceCard, theme.surfaceElevated, theme.surface]
          : item.colors
        }
        style={[styles.couponCard, {
          borderWidth: isDarkMode ? 1 : 0,
          borderColor: isDarkMode ? theme.border : 'transparent',
          shadowColor: isDarkMode ? 'transparent' : '#000'
        }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={[styles.couponName, { color: isDarkMode ? theme.textPrimary : '#FFFFFF' }]}>{item.name}</Text>
        
        <View style={styles.couponStats}>
          <View style={styles.couponStatRow}>
            <Text style={[styles.couponStatLabel, { color: isDarkMode ? theme.textSecondary : 'rgba(255,255,255,0.8)' }]}>Soru Sayısı</Text>
            <Text style={[styles.couponStatValue, { color: isDarkMode ? theme.textPrimary : '#FFFFFF' }]}>{item.questionCount} adet</Text>
          </View>
          <View style={styles.couponStatRow}>
            <Text style={[styles.couponStatLabel, { color: isDarkMode ? theme.textSecondary : 'rgba(255,255,255,0.8)' }]}>Toplam Oran</Text>
            <Text style={[styles.couponStatValue, { color: isDarkMode ? theme.textPrimary : '#FFFFFF' }]}>{item.totalOdds}x</Text>
          </View>
          <View style={styles.couponStatRow}>
            <Text style={[styles.couponStatLabel, { color: isDarkMode ? theme.textSecondary : 'rgba(255,255,255,0.8)' }]}>Potansiyel Kazanç</Text>
            <Text style={[styles.couponStatValue, { color: theme.accent }]}>{item.potentialWinnings} 💎</Text>
          </View>
          <View style={styles.couponStatRow}>
            <Text style={[styles.couponStatLabel, { color: isDarkMode ? theme.textSecondary : 'rgba(255,255,255,0.8)' }]}>Bitiş</Text>
            <Text style={[styles.couponStatValue, { color: theme.warning }]}>{item.endsIn}</Text>
          </View>
        </View>
      </LinearGradient>
    );

  // SENCEBUDUR-style Question Card Component with background images
  const QuestionCard = ({ question, onQuestionClick, onVote }: { question: any; onQuestionClick: (id: number) => void; onVote: (questionId: number, vote: 'yes' | 'no', odds: number) => void }) => {
    const CircularProgress = ({ percentage, size = 70 }: { percentage: number; size?: number }) => {
      const radius = (size - 8) / 2;
      const circumference = 2 * Math.PI * radius;
      const strokeDasharray = circumference;
      const strokeDashoffset = circumference - (percentage / 100) * circumference;
      
      return (
        <View style={{ width: size, height: size, position: 'relative' }}>
          {/* Background circle */}
          <View style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: 6,
            borderColor: '#F2F3F5',
            position: 'absolute'
          }} />
          
          {/* Progress circle */}
          <View style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: 6,
            borderColor: '#432870',
            borderLeftColor: 'transparent',
            borderBottomColor: 'transparent',
            transform: [{ rotate: '-90deg' }],
            position: 'absolute'
          }} />
          
          {/* Percentage text */}
          <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Text style={{
              fontSize: size * 0.2,
              fontWeight: 'bold',
              color: '#432870'
            }}>
              {percentage}%
            </Text>
          </View>
        </View>
      );
    };

    return (
      <View style={{
        height: 200,
        borderRadius: 24,
        overflow: 'hidden',
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.12,
        shadowRadius: 20,
        elevation: 8,
        marginBottom: 8
      }}>
        <Image 
          source={{ uri: question.image }}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
          }}
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.9)', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.3)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
          }}
        />
        
        <View style={{
          flex: 1,
          padding: 16,
          justifyContent: 'space-between',
          zIndex: 1,
        }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}>
            <View style={{
              flex: 1,
              paddingRight: 16,
            }}>
              <TouchableOpacity onPress={() => onQuestionClick(question.id)}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '900',
                  color: 'white',
                  lineHeight: 20,
                  marginBottom: 8,
                  textShadowColor: 'rgba(0, 0, 0, 0.8)',
                  textShadowOffset: { width: 0, height: 2 },
                  textShadowRadius: 4,
                }}>
                  {question.title}
                </Text>
              </TouchableOpacity>
              
              <View style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
                alignSelf: 'flex-start',
              }}>
                <Text style={{
                  fontSize: 10,
                  fontWeight: '700',
                  color: 'white',
                  letterSpacing: 0.5,
                }}>
                  {question.category.toUpperCase()}
                </Text>
              </View>
            </View>

            <View style={{
              alignItems: 'center',
            }}>
              <CircularProgress 
                percentage={question.yesPercentage}
                size={70}
              />
            </View>
          </View>

          <View style={{
            gap: 8,
          }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              gap: 12,
            }}>
              <Text style={{
                fontSize: 12,
                fontWeight: '700',
                color: 'white',
                textShadowColor: 'rgba(0, 0, 0, 0.8)',
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 2,
              }}>
                {formatVotes(question.votes)}
              </Text>
              <Text style={{
                fontSize: 12,
                fontWeight: '700',
                color: 'white',
                textShadowColor: 'rgba(0, 0, 0, 0.8)',
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 2,
              }}>
                {question.timeLeft}
              </Text>
            </View>
            
            <View style={{
              flexDirection: 'row',
              borderRadius: 12,
              overflow: 'hidden',
              height: 40,
            }}>
              <TouchableOpacity
                onPress={() => onVote(question.id, 'yes', question.yesOdds)}
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#10b981',
                }}
              >
                <Text style={{
                  fontSize: 12,
                  fontWeight: '900',
                  color: 'white',
                }}>
                  EVET
                </Text>
                <Text style={{
                  fontSize: 10,
                  fontWeight: '700',
                  color: 'white',
                  opacity: 0.9,
                }}>
                  {question.yesOdds}x
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => onVote(question.id, 'no', question.noOdds)}
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#ef4444',
                }}
              >
                <Text style={{
                  fontSize: 12,
                  fontWeight: '900',
                  color: 'white',
                }}>
                  HAYIR
                </Text>
                <Text style={{
                  fontSize: 10,
                  fontWeight: '700',
                  color: 'white',
                  opacity: 0.9,
                }}>
                  {question.noOdds}x
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  // Render Trend Question Card using SENCEBUDUR style
  const renderTrendCard = ({ item }: { item: any }) => (
    <QuestionCard 
      question={item} 
      onQuestionClick={handleQuestionDetail} 
      onVote={handleVote} 
    />
  );

  // Current index still maintained for other logic

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
      
      {/* Smooth Floating Header */}
      <Animated.View style={[
        styles.smoothFloatingHeader,
        {
          transform: [{ translateY: headerTranslateY }],
        }
      ]}>
        <SafeAreaView style={styles.smoothHeaderContent}>
          <TouchableOpacity 
            style={[styles.smoothMenuButton, { 
              backgroundColor: isDarkMode ? theme.surfaceElevated : 'rgba(255,255,255,0.95)',
              borderColor: isDarkMode ? theme.border : 'rgba(0,0,0,0.05)',
              shadowColor: isDarkMode ? 'transparent' : '#000'
            }]}
            onPress={onMenuToggle}
            activeOpacity={0.8}
          >
            <View style={styles.smoothHamburgerIcon}>
              <View style={[styles.smoothHamburgerLine, { backgroundColor: isDarkMode ? theme.textPrimary : '#1F2937' }]} />
              <View style={[styles.smoothHamburgerLine, { backgroundColor: isDarkMode ? theme.textPrimary : '#1F2937' }]} />
              <View style={[styles.smoothHamburgerLine, { backgroundColor: isDarkMode ? theme.textPrimary : '#1F2937' }]} />
            </View>
          </TouchableOpacity>
        </SafeAreaView>
      </Animated.View>

      <Animated.ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={32}
        scrollEnabled={true}
        scrollToOverflowEnabled={false}
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
        {/* Featured Questions Carousel */}
        <View style={styles.featuredSection}>
          <Animated.FlatList
            data={enhancedFeatured}
            renderItem={renderFeaturedCard}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: carouselScrollX } } }],
              { useNativeDriver: false }
            )}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
              setCurrentFeatureIndex(index);
            }}
            removeClippedSubviews={true}
            maxToRenderPerBatch={3}
            windowSize={5}
            initialNumToRender={2}
            getItemLayout={(data, index) => ({
              length: SCREEN_WIDTH,
              offset: SCREEN_WIDTH * index,
              index,
            })}
          />
          
          {/* Carousel Indicators */}
          <View style={styles.indicators}>
            {enhancedFeatured.map((_, index) => {
              const inputRange = [
                (index - 1) * SCREEN_WIDTH,
                index * SCREEN_WIDTH,
                (index + 1) * SCREEN_WIDTH,
              ];
              const width = carouselScrollX.interpolate({
                inputRange,
                outputRange: [8, 24, 8],
                extrapolate: 'clamp',
              });
              const opacity = carouselScrollX.interpolate({
                inputRange,
                outputRange: [0.5, 1, 0.5],
                extrapolate: 'clamp',
              });
              return (
                <Animated.View
                  key={index}
                  style={[
                    styles.indicator,
                    {
                      width,
                      opacity,
                      backgroundColor: '#ffffff',
                    },
                  ]}
                />
              );
            })}
          </View>
        </View>

        {/* Daily Challenge & Tasks Section */}
          <View style={[styles.section, styles.activitiesSection, { backgroundColor: isDarkMode ? theme.surface : '#FFFFFF' }]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Günlük Aktiviteler</Text>
            </View>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity 
              style={[
                styles.activityButton,
                { backgroundColor: isDarkMode ? theme.surfaceCard : '#F6F7F9', borderColor: isDarkMode ? theme.border : '#E5E7EB', shadowColor: isDarkMode ? 'transparent' : '#000' },
                styles.challengeButton
              ]}
              onPress={handleDailyChallengeOpen}
              activeOpacity={0.8}
            >
              <View style={styles.iconWrapper}>
                <Ionicons name="trophy" size={30} color="#10B981" />
              </View>
              <Text style={[styles.buttonTitle, styles.challengeTitle]}>Challenge</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.activityButton,
                { backgroundColor: isDarkMode ? theme.surfaceCard : '#F6F7F9', borderColor: isDarkMode ? theme.border : '#E5E7EB', shadowColor: isDarkMode ? 'transparent' : '#000' },
                styles.tasksButton
              ]}
              onPress={handleTasksOpen}
              activeOpacity={0.8}
            >
              <View style={styles.iconWrapper}>
                <Ionicons name="checkmark-done" size={30} color="#F97316" />
              </View>
              <Text style={[styles.buttonTitle, styles.tasksTitle]}>Görevler</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.activityButton,
                { backgroundColor: isDarkMode ? theme.surfaceCard : '#F6F7F9', borderColor: isDarkMode ? theme.border : '#E5E7EB', shadowColor: isDarkMode ? 'transparent' : '#000' },
                styles.writeButton
              ]}
              onPress={() => console.log('Write Question pressed')}
              activeOpacity={0.8}
            >
              <View style={styles.iconWrapper}>
                <Ionicons name="color-wand" size={30} color="#8B5CF6" />
              </View>
              <Text style={[styles.buttonTitle, styles.writeTitle]}>Soru Yaz</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Active Coupons Section */}
          <View style={[styles.section, { backgroundColor: isDarkMode ? theme.surface : '#FFFFFF' }]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Aktif Kuponlar</Text>
              <TouchableOpacity>
                <Text style={[styles.seeAllText, { color: theme.primary }]}>Tümünü gör</Text>
              </TouchableOpacity>
            </View>
          
          <FlatList
            data={activeCoupons}
            renderItem={renderCouponCard}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.couponsContainer}
            removeClippedSubviews={true}
            maxToRenderPerBatch={2}
            windowSize={3}
            initialNumToRender={1}
          />
        </View>

        {/* Trend Questions Section */}
          <View style={[styles.section, { backgroundColor: isDarkMode ? theme.surface : '#FFFFFF' }]}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Trend Sorular</Text>
              <TouchableOpacity>
                <Text style={[styles.seeAllText, { color: theme.primary }]}>Tümünü görüntüle</Text>
              </TouchableOpacity>
            </View>
          
          <FlatList
            data={trendQuestions}
            renderItem={renderTrendCard}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            contentContainerStyle={styles.trendsContainer}
            removeClippedSubviews={false}
            maxToRenderPerBatch={1}
            windowSize={2}
            initialNumToRender={1}
          />
        </View>
      </Animated.ScrollView>

      {/* Daily Challenge Flow */}
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
  smoothFloatingHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: 'transparent',
  },
  smoothHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  discoverButton: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  discoverButtonText: {
    fontSize: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowOffset: { width: -3, height: 3 },
    textShadowRadius: 2,
  },
  smoothMenuButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    backdropFilter: 'blur(10px)',
  },
  smoothHamburgerIcon: {
    width: 18,
    height: 14,
    justifyContent: 'space-between',
  },
  smoothHamburgerLine: {
    width: 18,
    height: 2.5,
    backgroundColor: '#1F2937',
    borderRadius: 1.25,
  },
  scrollView: {
    flex: 1,
    paddingBottom: 100, // Add padding for bottom navigation
    backgroundColor: 'transparent',
  },
  featuredSection: {
    height: SCREEN_HEIGHT * 0.55, // Increased from 0.5 to 0.6 for better carousel size
  },
  featuredCard: {
    width: SCREEN_WIDTH,
    height: '100%',
    position: 'relative',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  featuredGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  statsRow: {
    position: 'absolute',
    bottom: 195, // slightly lower for closer grouping
    left: 24,
    right: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBadge: {
    backgroundColor: '#432870',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  featuredTitle: {
    position: 'absolute',
    bottom: 115,
    left: 24,
    right: 24,
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 32,
  },
  actionButtons: {
    position: 'absolute',
    bottom: 46,
    left: 24,
    right: 24,
    flexDirection: 'row',
    gap: 16,
  },
  voteButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 2,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  yesButton: {
    borderColor: '#34C759',
  },
  noButton: {
    borderColor: '#FF3B30',
  },
  voteButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 2,
  },
  voteOdds: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
    opacity: 1,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 2,
  },
  indicators: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  indicator: {
    height: 8,
    borderRadius: 4,
  },
  activeIndicator: {
    width: 24,
    backgroundColor: '#ffffff',
  },
  inactiveIndicator: {
    width: 8,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  section: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    marginVertical: 8,
    borderRadius: 12,
    marginHorizontal: 8,
  },
  activitiesSection: {
    paddingTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#432870',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#432870',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
  },
  activityButton: {
    flex: 1,
    minHeight: 60,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F6F7F9',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  },
  challengeButton: {},
  tasksButton: {},
  writeButton: {},
  buttonIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconWrapper: {
    marginBottom: 6,
  },
  buttonTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
  // colorful icon backgrounds + matching titles
  challengeIcon: {
    backgroundColor: 'rgba(79, 70, 229, 0.12)',
  },
  tasksIcon: {
    backgroundColor: 'rgba(249, 115, 22, 0.12)',
  },
  writeIcon: {
    backgroundColor: 'rgba(139, 92, 246, 0.12)',
  },
  challengeTitle: { color: '#10B981' },
  tasksTitle: { color: '#F97316' },
  writeTitle: { color: '#8B5CF6' },
  couponsContainer: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  couponCard: {
    width: 280,
    marginRight: 8,
    padding: 16,
    borderRadius: 16,
  },
  couponName: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  couponStats: {
    gap: 6,
  },
  couponStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  couponStatLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  couponStatValue: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  trendsContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
});