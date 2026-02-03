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
  Easing,
  ActivityIndicator,
  Alert,
  Switch,
} from 'react-native';
import { StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { questionsService } from '@/services/questions.service';
import { categoriesService } from '@/services/categories.service';
import { useCountdown } from '@/hooks/useCountdown';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Category {
  id: string;
  label: string;
  icon: string;
  color: string;
}

interface Question {
  id: string;
  title: string;
  description?: string;
  category: {
    id: string;
    name: string;
    slug: string;
    icon: string;
    color: string;
  };
  votes: number;
  timeLeft: string;
  yesOdds: number;
  noOdds: number;
  yesPercentage: number;
  image?: string;
  end_date: string;
  total_amount: number;
  is_trending: boolean;
  is_featured: boolean;
  status?: string;
  result?: 'yes' | 'no' | null;
}

interface CategoryQuestionsPageProps {
  category: Category;
  onBack: () => void;
  handleQuestionDetail: (questionId: string, sourceCategory?: any) => void;
  handleVote: (questionId: string, vote: 'yes' | 'no', odds: number) => void;
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
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [includeExpired, setIncludeExpired] = useState(false);

  // Header animation values
  const headerTranslateY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Backend functions (overrideIncludeExpired: toggle anında güncel değeri geçmek için)
  const loadQuestions = async (reset: boolean = false, overrideIncludeExpired?: boolean) => {
    try {
      if (reset) {
        setOffset(0);
        setQuestions([]);
        setHasMore(true);
      }

      const includeExpiredToUse = overrideIncludeExpired ?? includeExpired;
      let result;

      // Determine if this is a filter or category
      if (category.id === 'all') {
        result = await questionsService.getAllQuestions({
          limit: 20,
          offset: reset ? 0 : offset,
          includeExpired: includeExpiredToUse,
        });
      } else if (category.id === 'trending') {
        result = await questionsService.getAllQuestions({
          trending: true,
          limit: 20,
          offset: reset ? 0 : offset,
        });
      } else if (category.id === 'high-odds') {
        result = await questionsService.getAllQuestions({
          highOdds: true,
          limit: 20,
          offset: reset ? 0 : offset,
        });
      } else if (category.id === 'ending-soon') {
        result = await questionsService.getAllQuestions({
          endingSoon: true,
          limit: 20,
          offset: reset ? 0 : offset,
        });
      } else {
        // Category-based questions
        result = await questionsService.getQuestionsByCategory(
          category.id,
          20,
          reset ? 0 : offset
        );
      }

      if (result.error) {
        console.error('Load questions error:', result.error);
        Alert.alert('Hata', 'Sorular yüklenirken bir hata oluştu.');
        return;
      }

      const newQuestions = result.data || [];

      // Transform backend data to frontend format
      const transformedQuestions: Question[] = newQuestions.map((q: any) => {
        // Kategoriye göre doğru kategoriyi seç
        let displayCategory;
        if (q.category_id === category.id) {
          displayCategory = q.categories;
        } else if (q.secondary_category_id === category.id) {
          displayCategory = q.secondary_category;
        } else if (q.third_category_id === category.id) {
          displayCategory = q.third_category;
        } else {
          displayCategory = q.categories; // fallback
        }

        return {
          id: q.id,
          title: q.title,
          description: q.description,
          category: displayCategory,
          votes: q.total_votes || 0,
          timeLeft: calculateTimeLeft(q.end_date),
          yesOdds: q.yes_odds || 2.0,
          noOdds: q.no_odds || 2.0,
          yesPercentage: q.yes_percentage || 50,
          image: (q.image_url && String(q.image_url).trim() !== '') ? q.image_url : 'https://images.unsplash.com/photo-1574477942438-5db6de70fd34?w=600',
          end_date: q.end_date,
          total_amount: q.total_amount || 0,
          is_trending: q.is_trending || false,
          is_featured: q.is_featured || false,
          status: q.status,
          result: q.result ?? null,
        };
      });

      if (reset) {
        setQuestions(transformedQuestions);
      } else {
        setQuestions(prev => [...prev, ...transformedQuestions]);
      }

      setOffset(prev => prev + 20);
      setHasMore(newQuestions.length === 20);

    } catch (error) {
      console.error('Load questions error:', error);
      Alert.alert('Hata', 'Sorular yüklenirken bir hata oluştu.');
    }
  };

  const searchQuestions = async (query: string) => {
    try {
      const result = await questionsService.searchQuestions(query, 20, 0);

      if (result.error) {
        console.error('Search questions error:', result.error);
        return;
      }

      const newQuestions = result.data || [];

      // Transform backend data to frontend format
      const transformedQuestions: Question[] = newQuestions.map((q: any) => {
        // Kategoriye göre doğru kategoriyi seç
        let displayCategory;
        if (q.category_id === category.id) {
          displayCategory = q.categories;
        } else if (q.secondary_category_id === category.id) {
          displayCategory = q.secondary_category;
        } else if (q.third_category_id === category.id) {
          displayCategory = q.third_category;
        } else {
          displayCategory = q.categories; // fallback
        }

        return {
          id: q.id,
          title: q.title,
          description: q.description,
          category: displayCategory,
          votes: q.total_votes || 0,
          timeLeft: calculateTimeLeft(q.end_date),
          yesOdds: q.yes_odds || 2.0,
          noOdds: q.no_odds || 2.0,
          yesPercentage: q.yes_percentage || 50,
          image: (q.image_url && String(q.image_url).trim() !== '') ? q.image_url : 'https://images.unsplash.com/photo-1574477942438-5db6de70fd34?w=600',
          end_date: q.end_date,
          total_amount: q.total_amount || 0,
          is_trending: q.is_trending || false,
          is_featured: q.is_featured || false,
          status: q.status,
          result: q.result ?? null,
        };
      });

      setQuestions(transformedQuestions);
      setOffset(20);
      setHasMore(newQuestions.length === 20);

    } catch (error) {
      console.error('Search questions error:', error);
    }
  };

  const calculateTimeLeft = (endDate: string): string => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return 'Süre doldu';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}g ${hours}s`;
    if (hours > 0) return `${hours}s ${minutes}d`;
    if (minutes > 0) return `${minutes}dk`;
    return '< 1dk';
  };

  /** Süre bitmişse Evet/Hayır veya Sonuç Bekleniyor; değilse countdown. */
  const getTimeLeftOrResult = (q: Question): string => {
    // 1. Check for explicit result first (Admin pre-approval)
    if (q.result === 'yes' || q.result === 'no') return 'Sonuçlandı';

    // 2. Check time
    const end = new Date(q.end_date).getTime();
    const now = Date.now();
    if (end <= now) {
      return 'Sonuç Bekleniyor';
    }

    // 3. Return countdown
    return q.timeLeft;
  };

  // Filter questions based on search query
  const filteredQuestions = questions.filter(question => {
    if (searchQuery === '') return true;
    return question.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Animation values for question cards
  const cardAnimationsRef = useRef<{
    [key: number]: {
      yesBarWidth: Animated.Value;
      noBarWidth: Animated.Value;
      cardScale: Animated.Value;
      yesFillAnim: Animated.Value;
      noFillAnim: Animated.Value;
    }
  }>({});

  // Load questions on component mount
  useEffect(() => {
    setLoading(true);
    loadQuestions(true).finally(() => setLoading(false));
  }, [category.id]);

  // Handle search
  useEffect(() => {
    if (searchQuery.trim()) {
      searchQuestions(searchQuery);
    } else {
      loadQuestions(true);
    }
  }, [searchQuery]);

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

  // Dinamik stiller
  const dynamicStyles = {
    animatedHeader: {
      ...styles.animatedHeader,
      backgroundColor: theme.background,
    },
    backButton: {
      ...styles.backButton,
      backgroundColor: theme.surfaceElevated,
      borderColor: theme.border,
    },
    headerTitle: {
      ...styles.headerTitle,
      color: theme.textPrimary,
    },
    menuButton: {
      ...styles.menuButton,
      backgroundColor: theme.surfaceElevated,
      borderColor: theme.border,
    },
    hamburgerLine: {
      ...styles.hamburgerLine,
      backgroundColor: theme.textPrimary,
    },
    searchInput: {
      ...styles.searchInput,
      backgroundColor: theme.surfaceCard,
      borderColor: theme.border,
      color: theme.textPrimary,
    },
    // Card styles - only passing specific overrides or colors
    yesLabel: {
      color: theme.accent,
    },
    noLabel: {
      color: theme.error,
    },
    yesBar: {
      backgroundColor: theme.accent,
    },
    noBar: {
      backgroundColor: theme.error,
    },
    yesButton: {
      borderColor: theme.accent,
    },
    noButton: {
      borderColor: theme.error,
    },
    sortMenu: {
      ...styles.sortMenu,
      backgroundColor: theme.surfaceModal,
      borderColor: theme.border,
    },
    sortMenuTitle: {
      ...styles.sortMenuTitle,
      color: theme.textPrimary,
    },
    sortOptionActive: {
      ...styles.sortOptionActive,
      backgroundColor: theme.accent + '15',
    },
    loadingText: {
      ...styles.loadingText,
      color: theme.textMuted,
    },
    emptyText: {
      ...styles.emptyText,
      color: theme.textMuted,
    },
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#0D1117"
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
              <Ionicons name="chevron-back" size={20} color="#F0F6FC" />
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
              placeholderTextColor="#8B949E"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <View style={styles.searchIconContainer}>
              <LinearGradient
                colors={[theme.accent, theme.success]}
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
              colors={[theme.accent, theme.success]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.sortGradient}
            >
              <Ionicons name="swap-vertical" size={20} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Süresi bitmiş soruları da göster - sadece Tümü sayfasında (test için) */}
        {category.id === 'all' && (
          <View style={[styles.includeExpiredRow, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}>
            <Text style={[styles.includeExpiredLabel, { color: theme.textPrimary }]}>
              Süresi bitmiş soruları da göster (test)
            </Text>
            <Switch
              value={includeExpired}
              onValueChange={(value) => {
                setIncludeExpired(value);
                setLoading(true);
                loadQuestions(true, value).finally(() => setLoading(false));
              }}
              trackColor={{ false: theme.border, true: theme.accent + '99' }}
              thumbColor={includeExpired ? theme.accent : theme.textMuted}
            />
          </View>
        )}

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.accent} />
            <Text style={dynamicStyles.loadingText}>Sorular yükleniyor...</Text>
          </View>
        ) : filteredQuestions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={dynamicStyles.emptyText}>Bu kategoride henüz soru bulunmuyor.</Text>
          </View>
        ) : (
          filteredQuestions.map((question, index) => (
            <CategoryQuestionCard
              key={question.id}
              question={question}
              onDetail={handleQuestionDetail}
              onVote={handleVote}
              theme={theme}
              dynamicStyles={dynamicStyles}
            />
          ))
        )}

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
            <View style={dynamicStyles.sortMenu}>
              <View style={styles.sortMenuHeader}>
                <Text style={dynamicStyles.sortMenuTitle}>Sıralama Seçenekleri</Text>
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
                    sortBy === option.id && dynamicStyles.sortOptionActive,
                    { borderBottomColor: theme.border },
                    index === sortOptions.length - 1 && { borderBottomWidth: 0 }
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
                        { color: sortBy === option.id ? theme.accent : theme.textPrimary }
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
                    <Ionicons name="checkmark-circle" size={24} color={theme.accent} />
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

/**
 * Kart bileşenini bağımsız hale getirdik, böylece kendi içindeki useCountdown hook'u
 * sayesinde her saniye kendini güncelleyerek saniye saniye akıyor.
 */
import CategoryQuestionCard from '../CategoryQuestionCard';

// ... (other imports)

// ... (inside the component) Use the imported component instead of the local one.
// No changes needed in usage, just removal of the definition.

// Cleaning up styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1117',
  },
  // ... (keeping page layout styles)
  animatedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: '#0D1117',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  safeArea: {
    flex: 0,
    backgroundColor: '#0D1117',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 8,
    backgroundColor: '#0D1117',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    backgroundColor: '#1A1F2A',
    borderColor: '#30363D',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#F0F6FC',
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    backgroundColor: '#1A1F2A',
    borderColor: '#30363D',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  hamburgerIcon: {
    width: 20,
    height: 16,
    justifyContent: 'space-between',
  },
  hamburgerLine: {
    width: 20,
    height: 2.5,
    borderRadius: 1.25,
    backgroundColor: '#F0F6FC',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 4,
    paddingVertical: 12,
    gap: 8,
    alignItems: 'center',
    backgroundColor: '#0D1117',
  },
  includeExpiredRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 4,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  includeExpiredLabel: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  searchInputContainer: {
    flex: 1,
    position: 'relative',
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 24,
    paddingRight: 64,
    fontSize: 16,
    backgroundColor: '#21262D',
    borderColor: '#30363D',
    color: '#F0F6FC',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
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
    backgroundColor: '#0D1117',
  },
  scrollContent: {
    paddingTop: 120, // Header height compensation
    padding: 16,
    gap: 8,
    backgroundColor: '#0D1117',
  },
  // Removed card-specific styles here as they are now in the component
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
  // ... (keeping other styles)
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
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  sortMenuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  sortMenuTitle: {
    fontSize: 18,
    fontWeight: '700',
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
  },
  sortOptionActive: {},
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
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});

