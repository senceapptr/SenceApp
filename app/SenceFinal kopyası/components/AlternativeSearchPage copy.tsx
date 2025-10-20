import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  TextInput,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface AlternativeSearchPageProps {
  onQuestionDetail: (question: any) => void;
  onVote: (questionId: number, vote: 'yes' | 'no', odds: number, questionTitle?: string) => void;
  onMenuToggle: () => void;
}

export function AlternativeSearchPage({ onQuestionDetail, onVote, onMenuToggle }: AlternativeSearchPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMainCategory, setSelectedMainCategory] = useState('trendler');
  const [selectedSubCategory, setSelectedSubCategory] = useState('tümü');
  const headerTranslateY = React.useRef(new Animated.Value(0)).current;
  const lastScrollY = React.useRef(0);
  const hideTimeout = React.useRef<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const handleScroll = (event: any) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    const scrollDiff = currentScrollY - lastScrollY.current;

    if (hideTimeout.current) clearTimeout(hideTimeout.current);

    if (scrollDiff > 5 && currentScrollY > 50) {
      Animated.timing(headerTranslateY, {
        toValue: -120,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else if (scrollDiff < -5) {
      Animated.timing(headerTranslateY, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();

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

  // Main category data
  const mainCategories = [
    { 
      id: 'trendler', 
      name: 'Trendler', 
      icon: '🔥', 
      colors: ['#432870', '#5A3A8B'],
      selectedColors: ['#2A1A4A', '#432870']
    },
    { 
      id: 'yeni', 
      name: 'Yeni', 
      icon: '✨', 
      colors: ['#5A3A8B', '#432870'],
      selectedColors: ['#432870', '#2A1A4A']
    },
    { 
      id: 'yakindan-bitecek', 
      name: 'Yakında Bitecek', 
      icon: '⏰', 
      colors: ['#6B4A9D', '#432870'],
      selectedColors: ['#5A3A8B', '#2A1A4A']
    },
    { 
      id: 'ozel-oranlar', 
      name: 'Özel Oranlar', 
      icon: '💎', 
      colors: ['#432870', '#6B4A9D'],
      selectedColors: ['#2A1A4A', '#432870']
    },
    { 
      id: 'editorun-secimi', 
      name: 'Editörün Seçimi', 
      icon: '⭐', 
      colors: ['#5A3A8B', '#432870'],
      selectedColors: ['#432870', '#2A1A4A']
    },
  ];

  // Sub category data
  const subCategories = [
    { id: 'tümü', name: 'Tümü', icon: '🌐' },
    { id: 'spor', name: 'Spor', icon: '⚽' },
    { id: 'müzik', name: 'Müzik', icon: '🎵' },
    { id: 'finans', name: 'Finans', icon: '💰' },
    { id: 'magazin', name: 'Magazin', icon: '✨' },
    { id: 'politika', name: 'Politika', icon: '🏛️' },
    { id: 'teknoloji', name: 'Teknoloji', icon: '💻' },
    { id: 'dizi-film', name: 'Dizi&Film', icon: '🎬' },
  ];

  // Enhanced questions data
  const enhancedQuestions = [
    {
      id: 1,
      title: "ChatGPT-5 bu yıl içinde çıkacak mı?",
      category: 'teknoloji',
      timeLeft: "3 gün 14 saat",
      votes: 127000,
      yesOdds: 2.4,
      noOdds: 1.6,
      yesPercentage: 68,
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
      mainCategory: 'trendler'
    },
    {
      id: 2,
      title: "Apple Vision Pro 2024'te Türkiye'ye gelecek mi?",
      category: 'teknoloji',
      timeLeft: "1 gün 8 saat",
      votes: 156000,
      yesOdds: 1.9,
      noOdds: 2.1,
      yesPercentage: 78,
      image: "https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=800&h=400&fit=crop",
      mainCategory: 'yeni'
    },
    {
      id: 3,
      title: "Netflix Türkiye'de abonelik fiyatları %50 artacak mı?",
      category: 'teknoloji',
      timeLeft: "2 gün 18 saat",
      votes: 67000,
      yesOdds: 2.2,
      noOdds: 1.8,
      yesPercentage: 72,
      image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=400&fit=crop",
      mainCategory: 'trendler'
    },
    {
      id: 4,
      title: "Bitcoin 2024 sonunda 100.000 doları aşacak mı?",
      category: 'finans',
      timeLeft: "12 gün 6 saat",
      votes: 234000,
      yesOdds: 2.1,
      noOdds: 2.0,
      yesPercentage: 52,
      image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=400&fit=crop",
      mainCategory: 'ozel-oranlar'
    }
  ];

  // Filter questions based on search and categories
  const filteredQuestions = enhancedQuestions.filter(question => {
    const matchesSearch = searchQuery === '' || 
      question.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesMainCategory = selectedMainCategory === 'trendler' || 
      question.mainCategory === selectedMainCategory;
    
    const matchesSubCategory = selectedSubCategory === 'tümü' || 
      question.category === selectedSubCategory;
    
    return matchesSearch && matchesMainCategory && matchesSubCategory;
  });

  const formatVotes = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(0)}k`;
    return count.toString();
  };

  // Handle refresh
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  // Progress Indicator Component
  const SemicircleProgressIndicator = ({ percentage, isYes }: { percentage: number, isYes: boolean }) => {
    const radius = 26;
    const circumference = Math.PI * radius; // yarım daire uzunluğu
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference * (1 - percentage / 100);
    
    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <Svg width={64} height={48} style={styles.progressSvg}>
            {/* Background semicircle */}
            <Path
              d="M 6 30 A 26 26 0 0 1 58 30"
              fill="none"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Progress semicircle */}
            <Path
              d="M 6 30 A 26 26 0 0 1 58 30"
              fill="none"
              stroke={isYes ? "#10B981" : "#EF4444"}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
            />
          </Svg>
          <View style={styles.progressTextContainer}>
            <Text style={styles.progressPercentage}>%{percentage}</Text>
            <Text style={styles.progressLabel}>{isYes ? 'EVET' : 'HAYIR'}</Text>
          </View>
        </View>
      </View>
    );
  };

  // Render Main Category Card
  const renderMainCategoryCard = ({ item, index }: { item: any; index: number }) => {
    const isSelected = selectedMainCategory === item.id;
    const colors = isSelected ? item.selectedColors : item.colors;
    
    return (
      <TouchableOpacity
        style={styles.mainCategoryCard}
        onPress={() => setSelectedMainCategory(item.id)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={colors}
          style={styles.mainCategoryGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.mainCategoryIcon}>{item.icon}</Text>
          <Text style={styles.mainCategoryName}>{item.name}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  // Render Sub Category Card
  const renderSubCategoryCard = ({ item }: { item: any }) => {
    const isSelected = selectedSubCategory === item.id;
    
    return (
      <TouchableOpacity
        style={[
          styles.subCategoryCard,
          isSelected ? styles.subCategorySelected : styles.subCategoryUnselected
        ]}
        onPress={() => setSelectedSubCategory(item.id)}
        activeOpacity={0.8}
      >
        <Text style={[
          styles.subCategoryIcon,
          { opacity: isSelected ? 1 : 0.5 }
        ]}>
          {item.icon}
        </Text>
        <Text style={[
          styles.subCategoryName,
          isSelected ? styles.subCategoryNameSelected : styles.subCategoryNameUnselected
        ]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  // Render Question Card
  const renderQuestionCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.questionCard}
      onPress={() => onQuestionDetail(item)}
      activeOpacity={0.95}
    >
      <Image source={{ uri: item.image }} style={styles.questionImage} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.8)']}
        style={styles.questionGradient}
      />

      {/* Time Remaining - Top Left */}
      <View style={styles.timeRemainingBadge}>
        <Text style={styles.timeRemainingText}>{item.timeLeft} kaldı</Text>
      </View>

      {/* Vote Count - Below Time */}
      <View style={styles.voteCountBadge}>
        <Text style={styles.voteCountText}>👥 {formatVotes(item.votes)}</Text>
      </View>

      {/* Progress Indicator - Top Right */}
      <View style={styles.progressIndicatorPosition}>
        <SemicircleProgressIndicator 
          percentage={item.yesPercentage} 
          isYes={item.yesPercentage > 50}
        />
      </View>

      {/* Category Badge - Bottom Right */}
      <View style={styles.categoryBadge}>
        <Text style={styles.categoryBadgeText}>
          {subCategories.find(c => c.id === item.category)?.name}
        </Text>
      </View>

      {/* Question Title */}
      <Text style={styles.questionTitle}>{item.title}</Text>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.voteButton, styles.yesButton]}
          onPress={() => onVote(item.id, 'yes', item.yesOdds)}
        >
          <Text style={styles.voteButtonText}>EVET</Text>
          <Text style={styles.voteOdds}>{item.yesOdds}x</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.voteButton, styles.noButton]}
          onPress={() => onVote(item.id, 'no', item.noOdds)}
        >
          <Text style={styles.voteButtonText}>HAYIR</Text>
          <Text style={styles.voteOdds}>{item.noOdds}x</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header cloned and animated */}
        <Animated.View style={[styles.animatedHeader, { transform: [{ translateY: headerTranslateY }] }]}>
          <SafeAreaView style={styles.headerSafeArea}>
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
        </Animated.View>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
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
          {/* Search Bar */}
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
                  <Text style={styles.searchIcon}>🔍</Text>
                </LinearGradient>
              </View>
            </View>
          </View>
          {/* Categories Section */}
          <View style={styles.categoriesSection}>
            <Text style={styles.sectionTitle}>Kategoriler</Text>
            
            {/* Main Categories */}
            <FlatList
              data={mainCategories}
              renderItem={renderMainCategoryCard}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.mainCategoriesContainer}
              removeClippedSubviews={true}
              maxToRenderPerBatch={3}
              windowSize={5}
              initialNumToRender={3}
            />
          </View>

          {/* Sub Categories */}
          <View style={styles.subCategoriesSection}>
            <FlatList
              data={subCategories}
              renderItem={renderSubCategoryCard}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.subCategoriesContainer}
              removeClippedSubviews={true}
              maxToRenderPerBatch={4}
              windowSize={6}
              initialNumToRender={4}
            />
          </View>

          {/* Questions Section */}
          <View style={styles.questionsSection}>
            <View style={styles.questionsSectionHeader}>
              <Text style={styles.questionsSectionTitle}>
                {searchQuery ? `"${searchQuery}" sonuçları` : 
                 selectedMainCategory === 'trendler' ? 'Trend Sorular' :
                 mainCategories.find(c => c.id === selectedMainCategory)?.name}
              </Text>
              <Text style={styles.questionsCount}>
                {filteredQuestions.length} soru
              </Text>
            </View>

            <FlatList
              data={filteredQuestions}
              renderItem={renderQuestionCard}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              contentContainerStyle={styles.questionsContainer}
              removeClippedSubviews={false}
              maxToRenderPerBatch={2}
              windowSize={4}
              initialNumToRender={2}
            />

            {filteredQuestions.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateIcon}>🔍</Text>
                <Text style={styles.emptyStateTitle}>
                  {searchQuery ? 'Aradığın soru bulunamadı' : 'Bu kategoride soru yok'}
                </Text>
                <Text style={styles.emptyStateSubtitle}>
                  {searchQuery ? 'Farklı kelimeler deneyebilirsin' : 'Başka bir kategori seçmeyi deneyin'}
                </Text>
                {searchQuery && (
                  <TouchableOpacity
                    style={styles.clearSearchButton}
                    onPress={() => setSearchQuery('')}
                  >
                    <LinearGradient
                      colors={['#432870', '#B29EFD']}
                      style={styles.clearSearchGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <Text style={styles.clearSearchText}>Aramayı Temizle</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  safeArea: {
    flex: 1,
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
  headerSafeArea: {
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  scrollContent: {
    paddingTop: 70,
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
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  searchInputContainer: {
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
  searchIcon: {
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
    paddingBottom: 100,
  },
  categoriesSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  mainCategoriesContainer: {
    paddingHorizontal: 20,
  },
  mainCategoryCard: {
    width: 120,
    height: 100,
    marginHorizontal: 4,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  mainCategoryGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  mainCategoryIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  mainCategoryName: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 16,
  },
  subCategoriesSection: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingVertical: 16,
    marginBottom: 24,
  },
  subCategoriesContainer: {
    paddingHorizontal: 20,
  },
  subCategoryCard: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginHorizontal: 4,
    minWidth: 80,
  },
  subCategorySelected: {
    backgroundColor: '#432870',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  subCategoryUnselected: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  subCategoryIcon: {
    fontSize: 20,
    marginBottom: 8,
  },
  subCategoryName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  subCategoryNameSelected: {
    color: '#FFFFFF',
  },
  subCategoryNameUnselected: {
    color: '#374151',
  },
  questionsSection: {
    paddingHorizontal: 0,
  },
  questionsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  questionsSectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
  },
  questionsCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#432870',
  },
  questionsContainer: {
    gap: 0,
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 0,
  },
  questionImage: {
    width: '100%',
    height: 320,
    resizeMode: 'cover',
  },
  questionGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  timeRemainingBadge: {
    position: 'absolute',
    top: 24,
    left: 0,
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  timeRemainingText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  voteCountBadge: {
    position: 'absolute',
    top: 64,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  voteCountText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressIndicatorPosition: {
    position: 'absolute',
    top: 24,
    right: 24,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressBackground: {
    width: 80,
    height: 52,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 100,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderBottomWidth: 0,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  progressSvg: {
    position: 'absolute',
    top: 6,
  },
  progressTextContainer: {
    position: 'absolute',
    bottom: 4,
    alignItems: 'center',
  },
  progressPercentage: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  progressLabel: {
    color: '#FFFFFF',
    fontSize: 10,
    
    opacity: 1,
  },
  categoryBadge: {
    position: 'absolute',
    bottom: 112,
    right: 24,
    backgroundColor: '#432870',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  categoryBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  questionTitle: {
    position: 'absolute',
    bottom: 90,
    left: 24,
    right: 120,
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 28,
  },
  actionButtons: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    flexDirection: 'row',
    gap: 16,
  },
  voteButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
  },
  yesButton: {
    backgroundColor: 'rgba(34,197,94,0.9)',
    borderColor: 'rgba(34,197,94,0.3)',
  },
  noButton: {
    backgroundColor: 'rgba(239,68,68,0.9)',
    borderColor: 'rgba(239,68,68,0.3)',
  },
  voteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  voteOdds: {
    color: '#FFFFFF',
    fontSize: 14,
    opacity: 0.9,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 24,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
    textAlign: 'center',
  },
  clearSearchButton: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  clearSearchGradient: {
    paddingHorizontal: 32,
    paddingVertical: 12,
  },
  clearSearchText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
