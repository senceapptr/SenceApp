import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
  Dimensions,
  Modal,
  TextInput,
  SafeAreaView,
  Easing,
} from 'react-native';
import { StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Category {
  id: string;
  label: string;
  icon: string;
  color: string;
}

interface Question {
  id: number;
  title: string;
  category: string;
  votes: number;
  timeLeft: string;
  yesOdds: number;
  noOdds: number;
  yesPercentage: number;
  image: string;
}

interface CategoryQuestionsPageProps {
  category: Category;
  onBack: () => void;
  handleQuestionDetail: (question: any) => void;
  handleVote: (questionId: number, vote: 'yes' | 'no', odds: number) => void;
  onMenuToggle?: () => void;
}

type SortType = 'date' | 'votes' | 'ending' | 'odds';

export function CategoryQuestionsPage({
  category,
  onBack,
  handleQuestionDetail,
  handleVote,
  onMenuToggle
}: CategoryQuestionsPageProps) {
  const { theme, isDarkMode } = useTheme();
  const [sortBy, setSortBy] = useState<SortType>('date');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Header animation values
  const headerTranslateY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Mock questions data
  const mockQuestions: Question[] = [
    {
      id: 1,
      title: `${category.label} kategorisinde örnek soru 1`,
      category: category.label,
      votes: 12500,
      timeLeft: '2g 14s',
      yesOdds: 2.4,
      noOdds: 1.6,
      yesPercentage: 62,
      image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop'
    },
    {
      id: 2,
      title: `${category.label} kategorisinde örnek soru 2`,
      category: category.label,
      votes: 8900,
      timeLeft: '1g 8s',
      yesOdds: 1.8,
      noOdds: 2.2,
      yesPercentage: 45,
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=600&fit=crop'
    },
    {
      id: 3,
      title: `${category.label} kategorisinde örnek soru 3`,
      category: category.label,
      votes: 15600,
      timeLeft: '3g 22s',
      yesOdds: 3.2,
      noOdds: 1.4,
      yesPercentage: 78,
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop'
    },
  ];

  // Filter questions based on search query
  const filteredQuestions = mockQuestions.filter(question => {
    if (searchQuery === '') return true;
    return question.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Animation values for question cards
  const cardAnimationsRef = useRef<{[key: number]: {
    yesBarWidth: Animated.Value;
    noBarWidth: Animated.Value;
    cardScale: Animated.Value;
    yesFillAnim: Animated.Value;
    noFillAnim: Animated.Value;
  }}>({});

  // Ensure animations exist for all questions
  filteredQuestions.forEach((question, index) => {
    if (!cardAnimationsRef.current[index]) {
      cardAnimationsRef.current[index] = {
        yesBarWidth: new Animated.Value(0),
        noBarWidth: new Animated.Value(0),
        cardScale: new Animated.Value(1),
        yesFillAnim: new Animated.Value(0),
        noFillAnim: new Animated.Value(0),
      };
    }
  });

  const formatVotes = (votes: number) => {
    if (votes >= 1000) {
      return `${(votes / 1000).toFixed(1)}K`;
    }
    return votes.toString();
  };

  const sortOptions = [
    { id: 'date' as SortType, label: 'En Yeni', icon: '🆕', description: 'En son eklenen sorular' },
    { id: 'votes' as SortType, label: 'En Popüler', icon: '🔥', description: 'En çok oy alan sorular' },
    { id: 'ending' as SortType, label: 'Yakında Bitecek', icon: '⏰', description: 'Süresi azalan sorular' },
    { id: 'odds' as SortType, label: 'Yüksek Oranlar', icon: '📈', description: 'En yüksek oranlı sorular' },
  ];

  const getCurrentSortLabel = () => {
    return sortOptions.find(s => s.id === sortBy)?.label || 'Sırala';
  };

  // Header animation logic
  const handleScroll = (event: any) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    const scrollDiff = currentScrollY - lastScrollY.current;
    
    // Clear existing timeout
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
    }
    
    if (scrollDiff > 5 && currentScrollY > 50) {
      // Scrolling down - hide header
      Animated.timing(headerTranslateY, {
        toValue: -120,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else if (scrollDiff < -5) {
      // Scrolling up - show header
      Animated.timing(headerTranslateY, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
      
      // Auto-hide after 3 seconds of no scrolling
      hideTimeout.current = setTimeout(() => {
        if (currentScrollY > 50) {
          Animated.timing(headerTranslateY, {
            toValue: -120,
            duration: 300,
            useNativeDriver: true,
          }).start();
        }
      }, 3000);
    }
    
    lastScrollY.current = currentScrollY;
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hideTimeout.current) {
        clearTimeout(hideTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    filteredQuestions.forEach((question, index) => {
      const animation = cardAnimationsRef.current[index];
      if (animation) {
        Animated.sequence([
          Animated.delay(200),
          Animated.timing(animation.yesBarWidth, {
            toValue: question.yesPercentage,
            duration: 800,
            useNativeDriver: false,
          }),
          Animated.delay(200),
          Animated.timing(animation.noBarWidth, {
            toValue: 100 - question.yesPercentage,
            duration: 800,
            useNativeDriver: false,
          }),
        ]).start();
      }
    });
  }, [filteredQuestions]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "dark-content"} 
        backgroundColor={theme.background} 
      />
      
      {/* Header - Animated */}
      <Animated.View style={[styles.animatedHeader, { transform: [{ translateY: headerTranslateY }] }]}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={onBack}
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={20} color="#432870" />
            </TouchableOpacity>
            
            <Text style={styles.headerTitle}>{category.label} ({filteredQuestions.length})</Text>
            
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
          </View>
        </SafeAreaView>
      </Animated.View>

      {/* Questions List */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Search Container - Moved from Header */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Hemen Keşfet!"
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <View style={styles.searchIconContainer}>
              <LinearGradient
                colors={['#432870', '#B29EFD']}
                style={styles.searchIconGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Ionicons name="search" size={16} color="white" />
              </LinearGradient>
            </View>
          </View>
          
          {/* Sort Button */}
          <TouchableOpacity
            onPress={() => setShowSortMenu(true)}
            style={styles.sortButton}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#432870', '#c61585']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.sortGradient}
            >
              <Ionicons name="swap-vertical" size={20} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {filteredQuestions.map((question, index) => {
          const noPercentage = 100 - question.yesPercentage;
          const animation = cardAnimationsRef.current[index] || {
            yesBarWidth: new Animated.Value(0),
            noBarWidth: new Animated.Value(0),
            cardScale: new Animated.Value(1),
            yesFillAnim: new Animated.Value(0),
            noFillAnim: new Animated.Value(0),
          };

          const handleCardPressIn = () => {
            Animated.spring(animation.cardScale, {
              toValue: 0.97,
              useNativeDriver: true,
            }).start();
          };

          const handleCardPressOut = () => {
            Animated.spring(animation.cardScale, {
              toValue: 1,
              useNativeDriver: true,
            }).start();
          };

          const handleYesPressIn = () => {
            Animated.timing(animation.yesFillAnim, {
              toValue: 1,
              duration: 250,
              easing: Easing.out(Easing.quad),
              useNativeDriver: false,
            }).start();
          };

          const handleYesPressOut = () => {
            Animated.timing(animation.yesFillAnim, {
              toValue: 0,
              duration: 250,
              easing: Easing.in(Easing.quad),
              useNativeDriver: false,
            }).start();
          };

          const handleNoPressIn = () => {
            Animated.timing(animation.noFillAnim, {
              toValue: 1,
              duration: 250,
              easing: Easing.out(Easing.quad),
              useNativeDriver: false,
            }).start();
          };

          const handleNoPressOut = () => {
            Animated.timing(animation.noFillAnim, {
              toValue: 0,
              duration: 250,
              easing: Easing.in(Easing.quad),
              useNativeDriver: false,
            }).start();
          };

          const yesFillWidth = animation.yesFillAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', '100%'],
          });

          const noFillWidth = animation.noFillAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', '100%'],
          });

          return (
          <TouchableOpacity
            key={question.id}
            onPress={() => handleQuestionDetail(question)}
            onPressIn={handleCardPressIn}
            onPressOut={handleCardPressOut}
            activeOpacity={0.95}
            style={styles.cardContainer}
          >
            <Animated.View 
              style={[
                styles.questionCard,
                {
                  transform: [{ scale: animation.cardScale }],
                }
              ]}
            >
              <Image 
                source={{ uri: question.image }}
                style={styles.questionImage}
              />
              <LinearGradient
                colors={['rgba(0,0,0,0.9)', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.2)']}
                style={styles.gradient}
                start={{ x: 0, y: 1 }}
                end={{ x: 0, y: 0 }}
              />
              
              <View style={styles.contentWrapper}>
                {/* Stats Row */}
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Ionicons name="people" size={14} color="rgba(255,255,255,0.9)" />
                    <Text style={styles.statText}>{formatVotes(question.votes)}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Ionicons name="time" size={14} color="rgba(255,255,255,0.9)" />
                    <Text style={styles.statText}>{question.timeLeft}</Text>
                  </View>
                </View>

                {/* Question Title */}
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>{question.title}</Text>
                </View>

                {/* Combined Percentage Bar */}
                <View style={styles.percentageContainer}>
                  {/* Percentage Labels */}
                  <View style={styles.percentageLabels}>
                    <Text style={[styles.percentageLabel, styles.yesLabel]}>
                      Yes {question.yesPercentage}%
                    </Text>
                    <Text style={[styles.percentageLabel, styles.noLabel]}>
                      No {noPercentage}%
                    </Text>
                  </View>
                  
                  {/* Single Combined Progress Bar */}
                  <View style={styles.progressBarContainer}>
                    {/* Yes bar from left */}
                    <Animated.View 
                      style={[
                        styles.progressBar,
                        styles.yesBar,
                        {
                          width: animation.yesBarWidth.interpolate({
                            inputRange: [0, 100],
                            outputRange: ['0%', '100%'],
                          }),
                        }
                      ]}
                    />
                    {/* No bar from right */}
                    <Animated.View 
                      style={[
                        styles.progressBar,
                        styles.noBar,
                        {
                          width: animation.noBarWidth.interpolate({
                            inputRange: [0, 100],
                            outputRange: ['0%', '100%'],
                          }),
                        }
                      ]}
                    />
                  </View>
                </View>

                {/* Vote Buttons */}
                <View style={styles.buttonsContainer}>
                  <TouchableOpacity
                    onPress={() => handleVote(question.id, 'yes', question.yesOdds)}
                    onPressIn={handleYesPressIn}
                    onPressOut={handleYesPressOut}
                    style={[styles.voteButton, styles.yesButton]}
                    activeOpacity={1}
                  >
                    <Animated.View
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: yesFillWidth,
                        backgroundColor: '#34C759',
                        borderRadius: 14,
                      }}
                    />
                    <Text style={styles.voteButtonText}>Yes</Text>
                    <Text style={styles.voteOdds}>{question.yesOdds}x</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleVote(question.id, 'no', question.noOdds)}
                    onPressIn={handleNoPressIn}
                    onPressOut={handleNoPressOut}
                    style={[styles.voteButton, styles.noButton]}
                    activeOpacity={1}
                  >
                    <Animated.View
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        bottom: 0,
                        width: noFillWidth,
                        backgroundColor: '#FF3B30',
                        borderRadius: 14,
                      }}
                    />
                    <Text style={styles.voteButtonText}>No</Text>
                    <Text style={styles.voteOdds}>{question.noOdds}x</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          </TouchableOpacity>
          );
        })}

        {filteredQuestions.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>{category.icon}</Text>
            <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>
              Henüz Soru Yok
            </Text>
            <Text style={[styles.emptySubtitle, { color: theme.textMuted }]}>
              {category.label} kategorisinde henüz soru bulunmuyor
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Sort Menu Modal */}
      <Modal
        visible={showSortMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSortMenu(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowSortMenu(false)}
        >
          <View style={styles.sortMenuContainer}>
            <View style={[styles.sortMenu, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <View style={styles.sortMenuHeader}>
                <Text style={[styles.sortMenuTitle, { color: theme.text }]}>Sıralama Seçenekleri</Text>
                <TouchableOpacity
                  onPress={() => setShowSortMenu(false)}
                  style={styles.sortMenuCloseButton}
                >
                  <Ionicons name="close" size={24} color={theme.textSecondary} />
                </TouchableOpacity>
              </View>
              
              {sortOptions.map((option, index) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.sortOption,
                    sortBy === option.id && styles.sortOptionActive,
                    { borderBottomColor: theme.border }
                  ]}
                  onPress={() => {
                    setSortBy(option.id);
                    setShowSortMenu(false);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.sortOptionContent}>
                    <Text style={styles.sortOptionIcon}>{option.icon}</Text>
                    <View style={styles.sortOptionTextContainer}>
                      <Text style={[
                        styles.sortOptionLabel,
                        { color: sortBy === option.id ? '#432870' : theme.text }
                      ]}>
                        {option.label}
                      </Text>
                      <Text style={[
                        styles.sortOptionDescription,
                        { color: theme.textSecondary }
                      ]}>
                        {option.description}
                      </Text>
                    </View>
                  </View>
                  {sortBy === option.id && (
                    <Ionicons name="checkmark-circle" size={24} color="#432870" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  animatedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: '#F9FAFB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  safeArea: {
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#111827',
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  hamburgerIcon: {
    width: 20,
    height: 16,
    justifyContent: 'space-between',
  },
  hamburgerLine: {
    width: 20,
    height: 2.5,
    backgroundColor: '#432870',
    borderRadius: 1.25,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 4,
    paddingVertical: 12,
    gap: 8,
    alignItems: 'center',
  },
  searchInputContainer: {
    flex: 1,
    position: 'relative',
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 24,
    paddingRight: 64,
    fontSize: 16,
    color: '#111827',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchIconContainer: {
    position: 'absolute',
    right: 8,
    top: 8,
    bottom: 8,
    width: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  searchIconGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sortButton: {
    width: 40,
    height: 40,
    borderRadius: 16,
    overflow: 'hidden',
  },
  sortGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 120, // Header height compensation
    padding: 16,
    gap: 8,
  },
  cardContainer: {
    marginBottom: 8,
  },
  questionCard: {
    height: 340,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  questionImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  contentWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 16,
    gap: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    textShadowColor: '#000000',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  titleContainer: {
    marginBottom: 4,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 22,
    textShadowColor: '#000000',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  percentageContainer: {
    gap: 6,
  },
  percentageLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  percentageLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    textShadowColor: '#000000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  yesLabel: {
    color: '#34C759',
  },
  noLabel: {
    color: '#FF3B30',
  },
  progressBarContainer: {
    position: 'relative',
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 6,
    height: 10,
    overflow: 'hidden',
  },
  progressBar: {
    position: 'absolute',
    top: 0,
    height: '100%',
    borderRadius: 6,
  },
  yesBar: {
    left: 0,
    backgroundColor: '#34C759',
  },
  noBar: {
    right: 0,
    backgroundColor: '#FF3B30',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 4,
  },
  voteButton: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 2,
    paddingVertical: 10,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
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
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  voteOdds: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    opacity: 0.9,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyEmoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sortMenuContainer: {
    width: SCREEN_WIDTH - 48,
    maxWidth: 320,
  },
  sortMenu: {
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#F3F4F6',
    overflow: 'hidden',
  },
  sortMenuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  sortMenuTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  sortMenuCloseButton: {
    padding: 4,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  sortOptionActive: {
    backgroundColor: 'rgba(67, 40, 112, 0.05)',
  },
  sortOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  sortOptionTextContainer: {
    flex: 1,
  },
  sortOptionIcon: {
    fontSize: 24,
  },
  sortOptionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  sortOptionDescription: {
    fontSize: 12,
    fontWeight: '400',
  },
  sortOptionCheck: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#432870',
  },
});

