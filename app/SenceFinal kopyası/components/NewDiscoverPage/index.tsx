import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  SafeAreaView,
  Easing,
} from 'react-native';
import { StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';
import { CategoryQuestionsPage } from '../CategoryQuestionsPage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface DiscoverPageProps {
  onBack: () => void;
  onMenuToggle: () => void;
  handleQuestionDetail: (question: any) => void;
  handleVote: (questionId: number, vote: 'yes' | 'no', odds: number) => void;
}

type FilterType = 'all' | 'trending' | 'new' | 'ending-soon' | 'special' | 'editors-choice' | null;
type CategoryType = 'spor' | 'muzik' | 'finans' | 'magazin' | 'sosyal-medya' | 'politika' | 'teknoloji' | 'dizi-film' | 'global' | null;

// Categories array (defined outside component to avoid re-creation)
const CATEGORIES = [
  { id: 'spor' as CategoryType, label: 'Spor', icon: '⚽', color: '#34C759', rotate: '-2deg' },
  { id: 'muzik' as CategoryType, label: 'Müzik', icon: '🎵', color: '#FF2D55', rotate: '3deg' },
  { id: 'finans' as CategoryType, label: 'Finans', icon: '💰', color: '#FF9500', rotate: '-1deg' },
  { id: 'magazin' as CategoryType, label: 'Magazin', icon: '🌟', color: '#FF2D55', rotate: '2deg' },
  { id: 'sosyal-medya' as CategoryType, label: 'Sosyal Medya', icon: '📱', color: '#007AFF', rotate: '-3deg' },
  { id: 'politika' as CategoryType, label: 'Politika', icon: '🏛️', color: '#5856D6', rotate: '1deg' },
  { id: 'teknoloji' as CategoryType, label: 'Teknoloji', icon: '💻', color: '#5AC8FA', rotate: '-2deg' },
  { id: 'dizi-film' as CategoryType, label: 'Dizi & Film', icon: '🎬', color: '#FF3B30', rotate: '2deg' },
  { id: 'global' as CategoryType, label: 'Global', icon: '🌍', color: '#4CD964', rotate: '-1deg' },
];

export function NewDiscoverPage({ onBack, onMenuToggle, handleQuestionDetail, handleVote }: DiscoverPageProps) {
  const { theme, isDarkMode } = useTheme();
  const [selectedFilter, setSelectedFilter] = useState<FilterType>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>(null);

  // Shine animations for gradient buttons
  const shineAnimAll = useRef(new Animated.Value(0)).current;
  const shineAnimMain = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;
  const shineAnimFeatured = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  // Pulse animations for category buttons
  const [categoryScales] = useState(() => 
    CATEGORIES.map(() => new Animated.Value(1))
  );

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

    // Main filters shine animations - staggered and smooth
    shineAnimMain.forEach((anim, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(index * 600), // More delay between each
          Animated.timing(anim, {
            toValue: 1,
            duration: 3000,
            easing: Easing.bezier(0.4, 0.0, 0.2, 1),
            useNativeDriver: true,
          }),
          Animated.delay(800),
          Animated.timing(anim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });

    // Featured filters shine animations - slower
    shineAnimFeatured.forEach((anim, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(index * 700),
          Animated.timing(anim, {
            toValue: 1,
            duration: 3200,
            easing: Easing.bezier(0.4, 0.0, 0.2, 1),
            useNativeDriver: true,
          }),
          Animated.delay(600),
          Animated.timing(anim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, []);

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
  
  // İkinci satır filtreleri (3'lü) - Koyu mor tonlarında (#432870 bazlı)
  const mainFilters = [
    { id: 'trending' as FilterType, label: 'Trendler', icon: '🔥', gradient: ['#432870', '#5A3A8B'] },
    { id: 'new' as FilterType, label: 'Yeni', icon: '✨', gradient: ['#2A1A4A', '#432870'] },
    { id: 'ending-soon' as FilterType, label: 'Yakında Bitecek', icon: '⏰', gradient: ['#432870', '#6B4A9D'] },
  ];
  
  // Üçüncü satır filtreleri (2'li) - Koyu mor tonlarında (#432870 bazlı)
  const featuredFilters = [
    { id: 'special' as FilterType, label: 'Özel Sorular', icon: '💎', gradient: ['#5A3A8B', '#432870'] },
    { id: 'editors-choice' as FilterType, label: "Editörün Seçimi", icon: '⭐', gradient: ['#2A1A4A', '#432870'] },
  ];


  // Show filter page if selected
  if (selectedFilter) {
    const allFilters = [allFilter, ...mainFilters, ...featuredFilters];
    const filterData = allFilters.find(f => f.id === selectedFilter)!;
    return (
      <CategoryQuestionsPage
        category={{
          id: filterData.id as string,
          label: filterData.label,
          icon: filterData.icon,
          color: '#432870'
        }}
        onBack={() => setSelectedFilter(null)}
        handleQuestionDetail={handleQuestionDetail}
        handleVote={handleVote}
        onMenuToggle={onMenuToggle}
      />
    );
  }

  // Show category page if selected
  if (selectedCategory) {
    const selectedCat = CATEGORIES.find(c => c.id === selectedCategory)!;
    return (
      <CategoryQuestionsPage
        category={{
          id: selectedCat.id as string,
          label: selectedCat.label,
          icon: selectedCat.icon,
          color: selectedCat.color
        }}
        onBack={() => setSelectedCategory(null)}
        handleQuestionDetail={handleQuestionDetail}
        handleVote={handleVote}
        onMenuToggle={onMenuToggle}
      />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "dark-content"} 
        backgroundColor={theme.background} 
      />
      
      {/* Header - CouponsPage Style */}
      <View style={styles.headerContainer}>
        <SafeAreaView style={styles.safeArea}>
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
        </SafeAreaView>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Tümü Button - Full Width */}
        <TouchableOpacity
          style={styles.allFilterButton}
          onPress={() => setSelectedFilter(allFilter.id)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={allFilter.gradient as any}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.allFilterGradient}
          >
            <Animated.View
              style={[
                styles.shineEffect,
                {
                  transform: [{
                    translateX: shineAnimAll.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-SCREEN_WIDTH * 0.6, SCREEN_WIDTH * 1.2],
                    }),
                  }],
                },
              ]}
            >
              <LinearGradient
                colors={['transparent', 'rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 0.25)', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ flex: 1 }}
              />
            </Animated.View>
            <View style={styles.buttonContent}>
              <Animated.Text style={styles.allFilterIcon}>{allFilter.icon}</Animated.Text>
              <Text style={styles.allFilterText}>{allFilter.label}</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Main Filters Row - 3 columns */}
        <View style={styles.mainFiltersRow}>
          {mainFilters.map((filter, index) => (
            <TouchableOpacity
              key={filter.id}
              style={styles.mainFilterButton}
              onPress={() => setSelectedFilter(filter.id)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={filter.gradient as any}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.mainFilterGradient}
              >
                <Animated.View
                  style={[
                    styles.shineEffect,
                    {
                      transform: [{
                        translateX: shineAnimMain[index].interpolate({
                          inputRange: [0, 1],
                          outputRange: [-SCREEN_WIDTH * 0.6, SCREEN_WIDTH * 1.2],
                        }),
                      }],
                    },
                  ]}
                >
                  <LinearGradient
                    colors={['transparent', 'rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.35)', 'rgba(255, 255, 255, 0.2)', 'transparent']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ flex: 1 }}
                  />
                </Animated.View>
                <View style={styles.buttonContent}>
                  <Text style={styles.mainFilterIcon}>{filter.icon}</Text>
                  <Text style={styles.mainFilterText}>{filter.label}</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* Featured Filters Row - 2 columns */}
        <View style={styles.featuredFiltersRow}>
          {featuredFilters.map((filter, index) => (
            <TouchableOpacity
              key={filter.id}
              style={styles.featuredFilterButton}
              onPress={() => setSelectedFilter(filter.id)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={filter.gradient as any}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.featuredFilterGradient}
              >
                <Animated.View
                  style={[
                    styles.shineEffect,
                    {
                      transform: [{
                        translateX: shineAnimFeatured[index].interpolate({
                          inputRange: [0, 1],
                          outputRange: [-SCREEN_WIDTH * 0.6, SCREEN_WIDTH * 1.2],
                        }),
                      }],
                    },
                  ]}
                >
                  <LinearGradient
                    colors={['transparent', 'rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.35)', 'rgba(255, 255, 255, 0.2)', 'transparent'] as any}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ flex: 1 }}
                  />
                </Animated.View>
                <View style={styles.buttonContent}>
                  <Text style={styles.featuredFilterIcon}>{filter.icon}</Text>
                  <Text style={styles.featuredFilterText}>{filter.label}</Text>
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
          {CATEGORIES.map((category, index) => (
            <Animated.View
              key={category.id}
              style={{
                transform: [
                  { scale: categoryScales[index] },
                  { rotate: category.rotate },
                ],
              }}
            >
              <TouchableOpacity
                style={[styles.categoryButton, { backgroundColor: theme.surface }]}
                onPress={() => setSelectedCategory(category.id)}
                onPressIn={() => handleCategoryPressIn(index)}
                onPressOut={() => handleCategoryPressOut(index)}
                activeOpacity={1}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={styles.categoryLabel}>
                  {category.label}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </View>
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
    height: 80,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#8b1860',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  allFilterGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  allFilterIcon: {
    fontSize: 32,
    marginBottom: 4,
  },
  allFilterText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '900',
  },
  mainFiltersRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  mainFilterButton: {
    flex: 1,
    height: 80,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  mainFilterGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  mainFilterIcon: {
    fontSize: 32,
    marginBottom: 4,
  },
  mainFilterText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  featuredFiltersRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  featuredFilterButton: {
    flex: 1,
    height: 80,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  featuredFilterGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  featuredFilterIcon: {
    fontSize: 32,
    marginBottom: 4,
  },
  featuredFilterText: {
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
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    marginHorizontal: 6,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryIcon: {
    fontSize: 32,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 12,
    color: '#432870',
  },
});

