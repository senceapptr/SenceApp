import React, { useState, useRef, useEffect } from 'react';
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
import { Ionicons } from '@expo/vector-icons';

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
      totalVotes: 127000,
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
      totalVotes: 156000,
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
      totalVotes: 67000,
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
      totalVotes: 234000,
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

  // Question Card Component
  const QuestionCard = ({ item }: { item: any }) => {
    const noPercentage = 100 - item.yesPercentage;
    const defaultImage = "https://images.unsplash.com/photo-1610114435855-cec05b128dfc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwZnV0dXJpc3RpYyUyMGNpdHlzY2FwZXxlbnwxfHx8fDE3NTg5MjE3Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080";

    // Animation values
    const yesBarWidth = useRef(new Animated.Value(0)).current;
    const noBarWidth = useRef(new Animated.Value(0)).current;
    const cardScale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
      // Animate progress bars
      Animated.sequence([
        Animated.delay(200),
        Animated.timing(yesBarWidth, {
          toValue: item.yesPercentage,
          duration: 800,
          useNativeDriver: false,
        }),
        Animated.delay(200),
        Animated.timing(noBarWidth, {
          toValue: noPercentage,
          duration: 800,
          useNativeDriver: false,
        }),
      ]).start();
    }, [item.yesPercentage, noPercentage]);

    const handlePressIn = () => {
      Animated.spring(cardScale, {
        toValue: 0.97,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(cardScale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    };

    return (
      <TouchableOpacity
        onPress={() => onQuestionDetail(item)}
        activeOpacity={0.95}
        style={styles.questionCardContainer}
      >
        <Animated.View 
          style={[
            styles.questionCard,
            {
              transform: [{ scale: cardScale }],
            }
          ]}
        >
          {/* Background Image */}
          <Image 
            source={{ uri: item.image || defaultImage }}
            style={styles.questionImage}
            resizeMode="cover"
          />
          
          {/* Dark Overlay Gradient */}
          <LinearGradient
            colors={['rgba(0,0,0,0.9)', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.2)']}
            style={styles.questionGradient}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
          />
          
          {/* Content positioned on lower third */}
          <View style={styles.questionContent}>
            {/* Stats positioned above question title */}
            <View style={styles.questionStatsRow}>
              <View style={styles.questionStatItem}>
                <Ionicons name="people" size={16} color="rgba(255,255,255,0.9)" />
                <Text style={styles.questionStatText}>
                  {item.totalVotes.toLocaleString()}
                </Text>
              </View>
              <View style={styles.questionStatItem}>
                <Ionicons name="time" size={16} color="rgba(255,255,255,0.9)" />
                <Text style={styles.questionStatText}>
                  {item.timeLeft}
                </Text>
              </View>
            </View>

            {/* White Bold Question Title */}
            <View style={styles.questionTitleContainer}>
              <Text style={styles.questionTitle}>
                {item.title}
              </Text>
            </View>

            {/* Combined Percentage Bar */}
            <View style={styles.questionPercentageContainer}>
              {/* Percentage Labels */}
              <View style={styles.questionPercentageLabels}>
                <Text style={[styles.questionPercentageLabel, styles.questionYesLabel]}>
                  Yes {item.yesPercentage}%
                </Text>
                <Text style={[styles.questionPercentageLabel, styles.questionNoLabel]}>
                  No {noPercentage}%
                </Text>
              </View>
              
              {/* Single Combined Progress Bar */}
              <View style={styles.questionProgressBarContainer}>
                {/* Yes bar from left */}
                <Animated.View 
                  style={[
                    styles.questionProgressBar,
                    styles.questionYesBar,
                    {
                      width: yesBarWidth.interpolate({
                        inputRange: [0, 100],
                        outputRange: ['0%', '100%'],
                      }),
                    }
                  ]}
                />
                {/* No bar from right */}
                <Animated.View 
                  style={[
                    styles.questionProgressBar,
                    styles.questionNoBar,
                    {
                      width: noBarWidth.interpolate({
                        inputRange: [0, 100],
                        outputRange: ['0%', '100%'],
                      }),
                    }
                  ]}
                />
              </View>
            </View>

            {/* Semi-transparent Rounded Buttons */}
            <View style={styles.questionButtonsContainer}>
              <TouchableOpacity
                onPress={() => onVote(item.id, 'yes', item.yesOdds)}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={[styles.questionButton, styles.questionYesButton]}
                activeOpacity={0.8}
              >
                <Text style={styles.questionButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onVote(item.id, 'no', item.noOdds)}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={[styles.questionButton, styles.questionNoButton]}
                activeOpacity={0.8}
              >
                <Text style={styles.questionButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  // Render Question Card function
  const renderQuestionCard = ({ item }: { item: any }) => {
    return <QuestionCard item={item} />;
  };

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
              ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
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
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  questionCardContainer: {
    // Container for question card
  },
  questionCard: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
    minHeight: 400,
  },
  questionImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  questionGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  questionContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    gap: 10,
    height: '57%',
  },
  questionStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
  },
  questionStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  questionStatText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontWeight: '500',
  },
  questionTitleContainer: {
    marginBottom: 4,
  },
  questionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 24,
  },
  questionPercentageContainer: {
    gap: 6,
  },
  questionPercentageLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  questionPercentageLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  questionYesLabel: {
    color: '#34C759',
  },
  questionNoLabel: {
    color: '#FF3B30',
  },
  questionProgressBarContainer: {
    position: 'relative',
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 6,
    height: 12,
    overflow: 'hidden',
  },
  questionProgressBar: {
    position: 'absolute',
    top: 0,
    height: '100%',
    borderRadius: 6,
  },
  questionYesBar: {
    left: 0,
    backgroundColor: '#34C759',
  },
  questionNoBar: {
    right: 0,
    backgroundColor: '#FF3B30',
  },
  questionButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 8,
  },
  questionButton: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 2,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  questionYesButton: {
    borderColor: '#34C759',
  },
  questionNoButton: {
    borderColor: '#FF3B30',
  },
  questionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
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
