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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { DailyChallengeButton } from './DailyChallengeButton';
import { DailyChallengeFlow } from './DailyChallengeFlow';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface AlternativeHomePageProps {
  onBack: () => void;
  handleQuestionDetail: (questionId: number) => void;
  handleVote: (questionId: number, vote: 'yes' | 'no', odds: number, questionTitle?: string) => void;
  onMenuToggle: () => void;
}

export function AlternativeHomePage({ onBack, handleQuestionDetail, handleVote, onMenuToggle }: AlternativeHomePageProps) {
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);
  const [headerOpacity] = useState(new Animated.Value(0));
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const refreshAnim = useRef(new Animated.Value(0)).current;
  const [isDailyChallengeOpen, setIsDailyChallengeOpen] = useState(false);

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

  // Handle scroll for header opacity - Optimized for performance
  useEffect(() => {
    const listenerId = scrollY.addListener(({ value }) => {
      const startFade = 420;
      const fullOpaque = 520;
      
      let opacity = 0;
      if (value > startFade) {
        if (value >= fullOpaque) {
          opacity = 1;
        } else {
          opacity = (value - startFade) / (fullOpaque - startFade);
        }
      }
      
      // Use setValue instead of animated interpolation for better performance
      headerOpacity.setValue(opacity);
    });

    return () => scrollY.removeListener(listenerId);
  }, []);

  // Render Featured Question Card
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
        <TouchableOpacity
          style={[styles.voteButton, styles.yesButton]}
          onPress={() => handleVote(item.id, 'yes', item.yesOdds, item.title)}
        >
          <Text style={styles.voteButtonText}>EVET</Text>
          <Text style={styles.voteOdds}>{item.yesOdds}x</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.voteButton, styles.noButton]}
          onPress={() => handleVote(item.id, 'no', item.noOdds, item.title)}
        >
          <Text style={styles.voteButtonText}>HAYIR</Text>
          <Text style={styles.voteOdds}>{item.noOdds}x</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  // Render Coupon Card
  const renderCouponCard = ({ item }: { item: any }) => (
    <LinearGradient
      colors={item.colors}
      style={styles.couponCard}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text style={styles.couponName}>{item.name}</Text>
      
      <View style={styles.couponStats}>
        <View style={styles.couponStatRow}>
          <Text style={styles.couponStatLabel}>Soru Sayısı</Text>
          <Text style={styles.couponStatValue}>{item.questionCount} adet</Text>
        </View>
        <View style={styles.couponStatRow}>
          <Text style={styles.couponStatLabel}>Toplam Oran</Text>
          <Text style={styles.couponStatValue}>{item.totalOdds}x</Text>
        </View>
        <View style={styles.couponStatRow}>
          <Text style={styles.couponStatLabel}>Potansiyel Kazanç</Text>
          <Text style={styles.couponStatValue}>{item.potentialWinnings} 💎</Text>
        </View>
        <View style={styles.couponStatRow}>
          <Text style={styles.couponStatLabel}>Bitiş</Text>
          <Text style={styles.couponStatValue}>{item.endsIn}</Text>
        </View>
      </View>
    </LinearGradient>
  );

  // Render Trend Question Card
  const renderTrendCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.trendCard}
      onPress={() => handleQuestionDetail(item.id)}
      activeOpacity={0.95}
    >
      <Image source={{ uri: item.image }} style={styles.trendImage} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.8)']}
        style={styles.trendGradient}
      />

      {/* Category Badge */}
      <View style={styles.categoryBadge}>
        <Text style={styles.categoryText}>{item.category}</Text>
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <View style={[styles.progressBar, { width: `${item.yesPercentage}%` }]} />
        </View>
        <Text style={styles.progressText}>%{item.yesPercentage} EVET</Text>
      </View>

      {/* Vote Count */}
      <View style={styles.voteCount}>
        <Text style={styles.voteCountText}>👥 {formatVotes(item.votes)}</Text>
      </View>

      {/* Time Remaining */}
      <View style={styles.timeRemaining}>
        <Text style={styles.timeRemainingText}>⏱️ {item.timeLeft}</Text>
      </View>

      {/* Question Title */}
      <Text style={styles.trendTitle}>{item.title}</Text>

      {/* Action Buttons */}
      <View style={styles.trendActionButtons}>
        <TouchableOpacity
          style={[styles.trendVoteButton, styles.trendYesButton]}
          onPress={() => handleVote(item.id, 'yes', item.yesOdds)}
        >
          <Text style={styles.trendVoteButtonText}>EVET</Text>
          <Text style={styles.trendVoteOdds}>{item.yesOdds}x</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.trendVoteButton, styles.trendNoButton]}
          onPress={() => handleVote(item.id, 'no', item.noOdds)}
        >
          <Text style={styles.trendVoteButtonText}>HAYIR</Text>
          <Text style={styles.trendVoteOdds}>{item.noOdds}x</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={['#FAFAFA', '#F5F5F5', '#F0F0F0', '#EBEBEB']}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      {/* Fixed Header */}
      <Animated.View style={[styles.header, { backgroundColor: headerOpacity.interpolate({
        inputRange: [0, 1],
        outputRange: ['rgba(255,255,255,0)', 'rgba(255,255,255,1)']
      }) }]}>
        <SafeAreaView style={styles.headerContent}>
          <Animated.Text style={[styles.headerTitle, {
            color: headerOpacity.interpolate({
              inputRange: [0, 1],
              outputRange: ['#ffffff', '#000000']
            }),
            textShadowColor: headerOpacity.interpolate({
              inputRange: [0, 1],
              outputRange: ['rgba(0,0,0,0.8)', 'rgba(0,0,0,0)']
            })
          }]}>
            Sence.
          </Animated.Text>
          
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={onMenuToggle}
            activeOpacity={0.8}
          >
            <View style={styles.hamburgerIcon}>
              <View style={styles.hamburgerLine} />
              <View style={styles.hamburgerLine} />
              <View style={styles.hamburgerLine} />
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
          <FlatList
            data={enhancedFeatured}
            renderItem={renderFeaturedCard}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
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
            {enhancedFeatured.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  index === currentFeatureIndex ? styles.activeIndicator : styles.inactiveIndicator
                ]}
              />
            ))}
          </View>
        </View>

        {/* Daily Challenge Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Günün Challenge'ı</Text>
          </View>
          <View style={styles.challengeButtonContainer}>
            <DailyChallengeButton onChallenge={handleDailyChallengeOpen} />
          </View>
        </View>

        {/* Active Coupons Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Aktif Kuponlar</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Tümünü gör</Text>
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
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trend Sorular</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Tümünü görüntüle</Text>
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
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 5,
    paddingBottom: -10,
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
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.8)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  hamburgerIcon: {
    width: 20,
    height: 16,
    justifyContent: 'space-between',
  },
  hamburgerLine: {
    width: 20,
    height: 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
  },
  scrollView: {
    flex: 1,
    paddingBottom: 100, // Add padding for bottom navigation
    backgroundColor: 'transparent',
  },
  featuredSection: {
    height: SCREEN_HEIGHT * 0.7,
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
    bottom: 210, // move closer to title
    left: 24,
    right: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
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
    bottom: 130,
    left: 24,
    right: 24,
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 32,
  },
  actionButtons: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
    flexDirection: 'row',
    gap: 16,
  },
  voteButton: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
  yesButton: {
    backgroundColor: '#22C55E',
    borderWidth: 3,
    borderColor: 'rgba(34,197,94,0.7)',
  },
  noButton: {
    backgroundColor: '#EF4444',
    borderWidth: 3,
    borderColor: 'rgba(239,68,68,0.7)',
  },
  voteButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 2,
  },
  voteOdds: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
    opacity: 1,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 2,
  },
  indicators: {
    position: 'absolute',
    bottom: 24,
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
    paddingVertical: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 24,
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
  challengeButtonContainer: {
    paddingHorizontal: 0,
  },
  couponsContainer: {
    paddingLeft: 16,
  },
  couponCard: {
    width: 280,
    marginRight: 16,
    padding: 24,
    borderRadius: 24,
  },
  couponName: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  couponStats: {
    gap: 12,
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
    gap: 16,
  },
  trendCard: {
    height: 400,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: '#1E40AF',
  },
  trendImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  trendGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  categoryBadge: {
    position: 'absolute',
    top: 24,
    left: 0,
    backgroundColor: '#1E40AF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  categoryText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressContainer: {
    position: 'absolute',
    top: 24,
    right: 24,
    alignItems: 'center',
  },
  progressBackground: {
    width: 80,
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#10B981',
  },
  progressText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  voteCount: {
    position: 'absolute',
    bottom: 195,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  voteCountText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  timeRemaining: {
    position: 'absolute',
    bottom: 155,
    right: 0,
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  timeRemainingText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  trendTitle: {
    position: 'absolute',
    bottom: 95,
    left: 24,
    right: 24,
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 28,
  },
  trendActionButtons: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    flexDirection: 'row',
    gap: 16,
  },
  trendVoteButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
  },
  trendYesButton: {
    backgroundColor: 'rgba(34,197,94,0.9)',
    borderColor: 'rgba(34,197,94,0.3)',
  },
  trendNoButton: {
    backgroundColor: 'rgba(239,68,68,0.9)',
    borderColor: 'rgba(239,68,68,0.3)',
  },
  trendVoteButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
  },
  trendVoteOdds: {
    color: '#ffffff',
    fontSize: 14,
    opacity: 0.9,
  },
});
