import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Easing,
  Image,
  Modal,
} from 'react-native';
import { StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';
import { CategoryQuestionsPage } from '../CategoryQuestionsPage';
import { AnimatedHeroGradient } from '../AnimatedHeroGradient';
import { FlameIcon } from './FlameIcon';
import { categoriesService } from '../../../../services/categories.service';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface DiscoverPageProps {
  onBack: () => void;
  onMenuToggle: () => void;
  handleQuestionDetail: (questionId: string, sourceCategory?: any) => void;
  handleVote: (questionId: string, vote: 'yes' | 'no', odds: number) => void;
  initialFilter?: FilterType;
}

type FilterType = 'all' | 'trending' | 'high-odds' | 'ending-soon' | null;
type CategoryType = 'spor' | 'eglence' | 'finans' | 'magazin' | 'sosyal-medya' | 'politika' | 'teknoloji' | 'sinema' | 'global' | null;

// Categories array (defined outside component to avoid re-creation)
const CATEGORIES = [
  { id: 'spor' as CategoryType, label: 'Spor', image: require('../../../../assets/images/spor_new.png'), color: '#34C759', icon: '⚽' },
  { id: 'eglence' as CategoryType, label: 'Müzik', image: require('../../../../assets/images/muzik_new.png'), color: '#FF2D55', icon: '🎵' },
  { id: 'finans' as CategoryType, label: 'Finans', image: require('../../../../assets/images/finans_new.png'), color: '#10B981', icon: '💰' },
  { id: 'magazin' as CategoryType, label: 'Magazin', image: require('../../../../assets/images/magazin_new.png'), color: '#FF2D55', icon: '📸' },
  { id: 'sosyal-medya' as CategoryType, label: 'Sosyal Medya', image: require('../../../../assets/images/sosyal_medya_new.png'), color: '#007AFF', icon: '📱' },
  { id: 'politika' as CategoryType, label: 'Politika', image: require('../../../../assets/images/politika_new.png'), color: '#5856D6', icon: '🏛️' },
  { id: 'teknoloji' as CategoryType, label: 'Teknoloji', image: require('../../../../assets/images/teknoloji_new.png'), color: '#5AC8FA', icon: '💻' },
  { id: 'sinema' as CategoryType, label: 'Sinema', image: require('../../../../assets/images/sinema_new.png'), color: '#FF3B30', icon: '🎬' },
  { id: 'global' as CategoryType, label: 'Global', image: require('../../../../assets/images/global_new.png'), color: '#4CD964', icon: '🌍' },
];

export function NewDiscoverPage({ onBack, onMenuToggle, handleQuestionDetail, handleVote, initialFilter }: DiscoverPageProps) {
  const { theme, isDarkMode } = useTheme();
  const [selectedFilter, setSelectedFilter] = useState<FilterType>(initialFilter || null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [backendCategories, setBackendCategories] = useState<any[]>([]);

  // Shine animations for gradient buttons
  const shineAnimAll = useRef(new Animated.Value(0)).current;

  // Pulse animations for category buttons
  const [categoryScales] = useState(() => 
    CATEGORIES.map(() => new Animated.Value(1))
  );

  // Slide animation for category modal - start at 0 for smoother opening
  const slideAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;

  useEffect(() => {
    // All filter shine animation - slower and smoother
    Animated.loop(
      Animated.sequence([
        Animated.timing(shineAnimAll, {
          toValue: 1,
          duration: 3500,
          easing: Easing.bezier(0.4, 0.0, 0.2, 1), // Smooth easing
          useNativeDriver: true,
        }),
        Animated.delay(500), // Pause between loops
        Animated.timing(shineAnimAll, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Load categories from backend
    loadCategories();

    // Eğer initialFilter varsa, sayfa açıldığında otomatik olarak o filtreyi aç
    if (initialFilter) {
      setIsAnimating(true);
      slideAnim.setValue(SCREEN_WIDTH);
      setTimeout(() => {
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 10,
          useNativeDriver: true,
          restSpeedThreshold: 0.01,
          restDisplacementThreshold: 0.01,
        }).start(() => {
          setIsAnimating(false);
        });
      }, 100); // Kısa bir delay ile daha smooth açılış
    }
  }, []);

  const loadCategories = async () => {
    try {
      const { data, error } = await categoriesService.getActiveCategories();
      
      if (error) {
        console.error('Load categories error:', error);
        return;
      }

      setBackendCategories(data || []);
    } catch (error) {
      console.error('Load categories error:', error);
    }
  };

  // Reset animation state when filter/category changes
  useEffect(() => {
    if (!selectedFilter && !selectedCategory) {
      slideAnim.setValue(SCREEN_WIDTH);
      setIsAnimating(false);
    }
  }, [selectedFilter, selectedCategory]);

  // Handle filter selection with slide animation
  const handleFilterSelect = (filterId: FilterType) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setSelectedFilter(filterId);
    slideAnim.setValue(SCREEN_WIDTH);
    Animated.spring(slideAnim, {
      toValue: 0,
      tension: 50,
      friction: 10,
      useNativeDriver: true,
      restSpeedThreshold: 0.01,
      restDisplacementThreshold: 0.01,
    }).start(() => {
      setIsAnimating(false);
    });
    // Unlock buttons early for better UX
    setTimeout(() => {
      setIsAnimating(false);
    }, 350);
  };

  // Handle category selection with slide animation
  const handleCategorySelect = (categoryId: CategoryType) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setSelectedCategory(categoryId);
    slideAnim.setValue(SCREEN_WIDTH);
    Animated.spring(slideAnim, {
      toValue: 0,
      tension: 50,
      friction: 10,
      useNativeDriver: true,
      restSpeedThreshold: 0.01,
      restDisplacementThreshold: 0.01,
    }).start(() => {
      setIsAnimating(false);
    });
    // Unlock buttons early for better UX
    setTimeout(() => {
      setIsAnimating(false);
    }, 350);
  };

  // Handle filter close with slide animation
  const handleFilterClose = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    Animated.spring(slideAnim, {
      toValue: SCREEN_WIDTH,
      tension: 90,
      friction: 9,
      useNativeDriver: true,
      restSpeedThreshold: 0.01,
      restDisplacementThreshold: 0.01,
    }).start(() => {
      setSelectedFilter(null);
      slideAnim.setValue(SCREEN_WIDTH);
      setIsAnimating(false);
    });
    // Unlock buttons quickly for responsive UX
    setTimeout(() => {
      setIsAnimating(false);
    }, 250);
  };

  // Handle category close with slide animation
  const handleCategoryClose = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    Animated.spring(slideAnim, {
      toValue: SCREEN_WIDTH,
      tension: 90,
      friction: 9,
      useNativeDriver: true,
      restSpeedThreshold: 0.01,
      restDisplacementThreshold: 0.01,
    }).start(() => {
      setSelectedCategory(null);
      slideAnim.setValue(SCREEN_WIDTH);
      setIsAnimating(false);
    });
    // Unlock buttons quickly for responsive UX
    setTimeout(() => {
      setIsAnimating(false);
    }, 250);
  };

  const handleCategoryPressIn = (index: number) => {
    Animated.spring(categoryScales[index], {
      toValue: 0.95, // Less dramatic scale
      friction: 5,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  const handleCategoryPressOut = (index: number) => {
    Animated.spring(categoryScales[index], {
      toValue: 1,
      friction: 5,
      tension: 80,
      useNativeDriver: true,
    }).start();
  };

  // Ana filtre (tümü)
  const allFilter = { 
    id: 'all' as FilterType, 
    label: 'Tümü', 
    icon: '🎯', 
    gradient: ['#2d1a4d', '#8b1860', '#2d1a4d'] 
  };
  
  // Yeni 3'lü filtre butonları - Görseldeki gibi
  const newFilters = [
    { id: 'trending' as FilterType, label: 'Trendler', icon: 'flame', isCustomSvg: true, gradient: ['#8A2BE2', '#7C3AED'] },
    { id: 'high-odds' as FilterType, label: 'Yüksek Oranlar', icon: 'trending-up', isIonicon: true, gradient: ['#432870', '#5A3A8B'] },
    { id: 'ending-soon' as FilterType, label: 'Yakında Bitecek', icon: 'alarm', isIonicon: true, gradient: ['#9333EA', '#C084FC'] },
  ];


  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "dark-content"} 
        backgroundColor={theme.background} 
      />
      
      {/* Header - CouponsPage Style */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Keşfet</Text>
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
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Tümü Button - Full Width with Animated Gradient */}
        <TouchableOpacity
          style={styles.allFilterButton}
          onPress={() => handleFilterSelect(allFilter.id)}
          activeOpacity={0.8}
          disabled={isAnimating}
        >
          <AnimatedHeroGradient
            height={(SCREEN_WIDTH - 80) / 3}
            borderRadius={20}
            speed={4000}
          >
            <View style={styles.allButtonContent}>
              <Text style={styles.allFilterMainText}>Bugün herkes bunları konuşuyor!</Text>
              <Text style={styles.allFilterSubText}>TÜMÜNÜ GÖR!</Text>
            </View>
          </AnimatedHeroGradient>
        </TouchableOpacity>

        {/* New Filters Row - 3 columns */}
        <View style={styles.newFiltersRow}>
          {newFilters.map((filter, index) => (
            <TouchableOpacity
              key={filter.id}
              style={styles.newFilterButton}
              onPress={() => handleFilterSelect(filter.id)}
              activeOpacity={0.8}
              disabled={isAnimating}
            >
              <LinearGradient
                colors={filter.gradient as any}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.newFilterGradient}
              >
                <View style={styles.buttonContent}>
                  {filter.isCustomSvg ? (
                    <View style={styles.flameIconContainer}>
                      <FlameIcon size={44} color="white" />
                    </View>
                  ) : filter.isIonicon ? (
                    <View style={styles.flameIconContainer}>
                      <Ionicons name={filter.icon as any} size={44} color="white" />
                    </View>
                  ) : (
                    <Text style={styles.newFilterIcon}>{filter.icon}</Text>
                  )}
                  <Text style={styles.newFilterText}>{filter.label}</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <View style={[styles.dividerTextContainer, { backgroundColor: theme.background }]}>
            <Text style={styles.dividerText}>ALT KATEGORİLER</Text>
          </View>
        </View>

        {/* Categories Grid - 3x3 */}
        <View style={styles.categoriesGrid}>
          {backendCategories.map((category, index) => (
            <Animated.View
              key={category.id}
              style={{
                transform: [
                  { scale: categoryScales[index] },
                ],
              }}
            >
              <TouchableOpacity
                style={[styles.categoryButton, { backgroundColor: theme.surface }]}
                onPress={() => handleCategorySelect(category.id)}
                onPressIn={() => handleCategoryPressIn(index)}
                onPressOut={() => handleCategoryPressOut(index)}
                activeOpacity={1}
                disabled={isAnimating}
              >
                <View style={styles.categoryImageContainer}>
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                </View>
                <View style={styles.categoryLabelContainer}>
                  <Text style={styles.categoryLabel}>
                    {category.name}
                  </Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </View>

      {/* Category/Filter Page Overlay */}
      {(selectedFilter || selectedCategory) && (
        <Animated.View
          pointerEvents={isAnimating ? 'none' : 'auto'}
          style={[
            styles.modalContainer,
            {
              transform: [{ translateX: slideAnim }]
            }
          ]}
        >
          <CategoryQuestionsPage
            category={{
              id: selectedFilter 
                ? (allFilter.id === selectedFilter ? allFilter.id : newFilters.find(f => f.id === selectedFilter)?.id || 'all') as string
                : (backendCategories.find(c => c.id === selectedCategory)?.id || 'spor') as string,
              label: selectedFilter
                ? (allFilter.id === selectedFilter ? allFilter.label : newFilters.find(f => f.id === selectedFilter)?.label || 'Tümü')
                : (backendCategories.find(c => c.id === selectedCategory)?.name || 'Spor'),
              icon: selectedFilter
                ? (allFilter.id === selectedFilter ? allFilter.icon : selectedFilter === 'trending' ? '🔥' : selectedFilter === 'high-odds' ? '📈' : '⏰')
                : (backendCategories.find(c => c.id === selectedCategory)?.icon || '⚽'),
              color: selectedFilter
                ? '#432870'
                : (backendCategories.find(c => c.id === selectedCategory)?.color || '#34C759')
            }}
            onBack={selectedFilter ? handleFilterClose : handleCategoryClose}
            handleQuestionDetail={(questionId, sourceCategory) => handleQuestionDetail(questionId, sourceCategory)}
            handleVote={handleVote}
            onMenuToggle={onMenuToggle}
          />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  headerContainer: {
    backgroundColor: '#F9FAFB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 1000,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 8,
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
  content: {
    flex: 1,
    padding: 16,
    paddingBottom: 100,
  },
  buttonContent: {
    position: 'relative',
    zIndex: 2,
    alignItems: 'center',
  },
  shineEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: SCREEN_WIDTH * 0.5,
    opacity: 0.15,
    zIndex: 1,
  },
  allFilterButton: {
    height: (SCREEN_WIDTH - 80) / 3,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#8A2BE2',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
  },
  allFilterGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  allButtonContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 4,
  },
  allFilterMainText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 20,
  },
  allFilterSubText: {
    color: 'white',
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  newFiltersRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  newFilterButton: {
    flex: 1,
    height: (SCREEN_WIDTH - 80) / 3,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  newFilterGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  newFilterIcon: {
    fontSize: 32,
    marginBottom: 4,
    color: 'white',
    fontWeight: '900',
  },
  newFilterIconSpacing: {
    marginBottom: 6,
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  flameIconContainer: {
    marginBottom: 6,
  },
  newFilterText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  divider: {
    position: 'relative',
    height: 32,
    justifyContent: 'center',
    marginBottom: 10,
  },
  dividerLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#F3F4F6',
  },
  dividerTextContainer: {
    alignSelf: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
  },
  dividerText: {
    fontSize: 12,
    fontWeight: '900',
    color: 'rgba(67, 40, 112, 0.6)',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginHorizontal: 0,
  },
  categoryButton: {
    width: (SCREEN_WIDTH - 80) / 3,
    aspectRatio: 1,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#432870',
    borderRadius: 16,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 8,
    marginHorizontal: 6,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  categoryImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  categoryIcon: {
    fontSize: 32,
  },
  categoryLabelContainer: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    right: 4,
    backgroundColor: 'transparent',
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 16,
    color: '#432870',
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: SCREEN_WIDTH,
    backgroundColor: '#F9FAFB',
    zIndex: 1000,
  },
});

