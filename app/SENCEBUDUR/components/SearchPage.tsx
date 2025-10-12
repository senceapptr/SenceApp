import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions,
  SafeAreaView,
  StatusBar,
  Image,
  StyleSheet,
  Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { QuestionCard } from './QuestionCard';
import { Header } from './Header';
import { featuredQuestions, questions } from '../constants/questions';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2; // 2 columns with padding and gap

interface SearchPageProps {
  questions: any[];
  onQuestionClick: (id: number) => void;
  onVote: (questionId: number, vote: 'yes' | 'no', odds: number) => void;
  showHeader?: boolean;
  gameCredits: number;
  setProfileDrawerOpen: (open: boolean) => void;
  hasNotifications: boolean;
}

export function SearchPage({ 
  questions: propQuestions, 
  onQuestionClick, 
  onVote, 
  showHeader = true,
  gameCredits,
  setProfileDrawerOpen,
  hasNotifications
}: SearchPageProps) {
  const [selectedCategory, setSelectedCategory] = useState('tümü');
  const [showQuestions, setShowQuestions] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // Combine featured and regular questions with unique IDs
  const allQuestions = [
    ...featuredQuestions.map(q => ({ ...q, id: `featured_${q.id}` })),
    ...propQuestions.map(q => ({ ...q, id: `regular_${q.id}` }))
  ];

  // Category data with icons and counts - matching the Figma design
  const categoryData = [
    { id: 'tümü', name: 'Tümü', icon: '📂', count: allQuestions.length, isSpecial: true },
    { id: 'trendler', name: 'Trendler', icon: '🔥', count: allQuestions.filter(q => q.votes && parseInt(q.votes.replace(/[^\d]/g, '')) > 1000).length, isSpecial: true },
    { id: 'spor', name: 'Spor', icon: '⚽', count: allQuestions.filter(q => q.category === 'spor').length },
    { id: 'müzik', name: 'Müzik', icon: '🎵', count: allQuestions.filter(q => q.category === 'müzik').length },
    { id: 'finans', name: 'Finans', icon: '💰', count: allQuestions.filter(q => q.category === 'ekonomi').length },
    { id: 'yeni', name: 'Yeni', icon: '✨', count: allQuestions.filter(q => q.id && q.id.toString().includes('regular_') && parseInt(q.id.toString().replace('regular_', '')) > 15).length, isSpecial: true },
    { id: 'magazin', name: 'Magazin', icon: '📺', count: allQuestions.filter(q => q.category === 'magazin').length },
    { id: 'politika', name: 'Politika', icon: '🏛️', count: allQuestions.filter(q => q.category === 'politika').length },
    { id: 'yakında-bitecek', name: 'Yakında Bitecek', icon: '⏰', count: allQuestions.filter(q => q.timeLeft && q.timeLeft.includes('saat')).length, isSpecial: true },
    { id: 'teknoloji', name: 'Teknoloji', icon: '💻', count: allQuestions.filter(q => q.category === 'teknoloji').length },
    { id: 'dizi&film', name: 'Dizi&Film', icon: '🎬', count: allQuestions.filter(q => q.category === 'eğlence').length },
    { id: 'sosyal-medya', name: 'Sosyal Medya', icon: '📱', count: allQuestions.filter(q => q.category === 'teknoloji').length },
    { id: 'özel-oranlar', name: 'Özel Oranlar', icon: '🎯', count: allQuestions.filter(q => q.yesOdds > 2.5 || q.noOdds > 2.5).length, isSpecial: true },
    { id: 'dünya', name: 'Dünya', icon: '🌍', count: allQuestions.filter(q => q.category === 'politika').length }
  ];

  // Filter questions based on selected category
  const filteredQuestions = selectedCategory === 'tümü' 
    ? allQuestions 
    : allQuestions.filter(q => {
        switch (selectedCategory) {
          case 'trendler': return q.votes && parseInt(q.votes.replace(/[^\d]/g, '')) > 1000;
          case 'yeni': return q.id && q.id.toString().includes('regular_') && parseInt(q.id.toString().replace('regular_', '')) > 15;
          case 'yakında-bitecek': return q.timeLeft && q.timeLeft.includes('saat');
          case 'özel-oranlar': return q.yesOdds > 2.5 || q.noOdds > 2.5;
          case 'finans': return q.category === 'ekonomi';
          case 'dizi&film': return q.category === 'eğlence';
          case 'sosyal-medya': return q.category === 'teknoloji';
          case 'dünya': return q.category === 'politika';
          default: return q.category === selectedCategory;
        }
      });

  // Create category layout matching the Figma design
  const createCategoryLayout = () => {
    return [
      // Row 1: Tümü + Trendler (2 kutucuk)
      [
        { ...categoryData[0], size: 'small' },
        { ...categoryData[1], size: 'large' }
      ],
      // Row 2: Spor, Müzik, Finans
      [
        { ...categoryData[2], size: 'small' },
        { ...categoryData[3], size: 'small' },
        { ...categoryData[4], size: 'small' }
      ],
      // Row 3: Yeni (2 kutucuk) + Magazin
      [
        { ...categoryData[5], size: 'large' },
        { ...categoryData[6], size: 'small' }
      ],
      // Row 4: Politika + Yakında Bitecek (2 kutucuk)
      [
        { ...categoryData[7], size: 'small' },
        { ...categoryData[8], size: 'large' }
      ],
      // Row 5: Teknoloji, Dizi&Film, Sosyal Medya
      [
        { ...categoryData[9], size: 'small' },
        { ...categoryData[10], size: 'small' },
        { ...categoryData[11], size: 'small' }
      ],
      // Row 6: Özel Oranlar (2 kutucuk) + Dünya
      [
        { ...categoryData[12], size: 'large' },
        { ...categoryData[13], size: 'small' }
      ]
    ];
  };

  const categoryLayout = createCategoryLayout();

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setShowQuestions(true);
    
    // Animate fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    
    // Scroll to questions after a short delay
    setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: 600, animated: true });
      }
    }, 100);
  };

  const handleClearCategory = () => {
    setSelectedCategory('tümü');
    setShowQuestions(false);
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const CategoryCard = ({ category, isSelected }: { category: any; isSelected: boolean }) => {
    const isTrend = category.isSpecial;
    const isLarge = category.size === 'large';
    
    return (
      <TouchableOpacity
        onPress={() => handleCategorySelect(category.id)}
        style={[
          styles.categoryCard,
          isLarge && styles.largeCard,
          isTrend && styles.trendCard,
          isSelected && styles.selectedCard,
          !isTrend && !isSelected && styles.regularCard
        ]}
        activeOpacity={0.95}
      >
        <LinearGradient
          colors={isTrend || isSelected 
            ? ['#432870', '#5A3A8B'] 
            : ['#FFFFFF', '#FFFFFF']
          }
          style={[styles.categoryGradient, isLarge && styles.largeGradient]}
        >
          {/* Background Pattern */}
          <View style={styles.backgroundPattern}>
            <View style={[styles.patternCircle, { top: 6, right: 6 }]} />
            <View style={[styles.patternCircle, { bottom: 12, left: 12, width: 32, height: 32 }]} />
          </View>

          {/* Trend/Special Badge */}
          {(isTrend || isSelected) && (
            <View style={styles.badgeContainer}>
              <View style={styles.badgeIcon}>
                <Text style={styles.badgeText}>
                  {isTrend ? '🔥' : '✓'}
                </Text>
              </View>
              <View style={styles.badgeCount}>
                <Text style={styles.badgeCountText}>{category.count}</Text>
              </View>
            </View>
          )}

          {/* Content */}
          <View style={styles.categoryContent}>
            <View style={styles.categoryHeader}>
              <Text style={[styles.categoryIcon, isLarge && styles.largeIcon]}>
                {category.icon}
              </Text>
              {isLarge && (
                <View style={styles.largeCategoryText}>
                  <Text style={styles.largeCategoryName}>{category.name}</Text>
                  {isTrend && (
                    <Text style={styles.largeCategorySubtitle}>Popüler</Text>
                  )}
                </View>
              )}
            </View>
            
            <View style={styles.categoryFooter}>
              <Text style={[styles.categoryCount, isLarge && styles.largeCount]}>
                {category.count}
              </Text>
              {!isLarge && (
                <Text style={styles.categoryName}>{category.name}</Text>
              )}
            </View>
          </View>

          {/* Hover Effect */}
          <View style={styles.hoverEffect} />
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const QuestionCardComponent = ({ question }: { question: any }) => (
    <View style={styles.questionCardContainer}>
      <QuestionCard
        question={question}
        onVote={onVote}
        onQuestionClick={onQuestionClick}
        isCompact={true}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F2F3F5" />
      
      {/* Header */}
      {showHeader && (
        <Header
          title="Keşfet"
          gameCredits={gameCredits}
          setProfileDrawerOpen={setProfileDrawerOpen}
          hasNotifications={hasNotifications}
        />
      )}

      <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Category Grid */}
        <View style={styles.categorySection}>
          {categoryLayout.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.categoryRow}>
              {row.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  isSelected={selectedCategory === category.id}
                />
              ))}
            </View>
          ))}
        </View>

        {/* Selected Category Info */}
        {selectedCategory !== 'tümü' && (
          <Animated.View 
            style={[
              styles.selectedCategoryInfo,
              { opacity: fadeAnim }
            ]}
          >
            <View style={styles.selectedCategoryContent}>
              <View style={styles.selectedCategoryLeft}>
                <View style={styles.selectedCategoryIcon}>
                  <Text style={styles.selectedCategoryIconText}>
                    {categoryData.find(c => c.id === selectedCategory)?.icon}
                  </Text>
                </View>
                <View style={styles.selectedCategoryText}>
                  <Text style={styles.selectedCategoryName}>
                    {categoryData.find(c => c.id === selectedCategory)?.name}
                  </Text>
                  <Text style={styles.selectedCategorySubtitle}>
                    {filteredQuestions.length} soru bulundu
                  </Text>
                </View>
              </View>
              
              <TouchableOpacity
                onPress={handleClearCategory}
                style={styles.clearButton}
              >
                <Text style={styles.clearButtonText}>Temizle</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}

        {/* Questions List */}
        <Animated.View 
          style={[
            styles.questionsSection,
            { opacity: fadeAnim }
          ]}
        >
          {filteredQuestions.length > 0 ? (
            <View style={styles.questionsContainer}>
              <View style={styles.questionsHeader}>
                <Text style={styles.questionsTitle}>
                  {selectedCategory === 'tümü' ? 'Tüm Sorular' : `${categoryData.find(c => c.id === selectedCategory)?.name} Soruları`}
                </Text>
                <Text style={styles.questionsCount}>
                  {filteredQuestions.length} soru
                </Text>
              </View>
              
              {/* 2 Column Grid Layout */}
              <View style={styles.questionsGrid}>
                {filteredQuestions.map((question) => (
                  <QuestionCardComponent key={question.id} question={question} />
                ))}
              </View>
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>🔍</Text>
              <Text style={styles.emptyStateTitle}>Bu kategoride soru yok</Text>
              <Text style={styles.emptyStateSubtitle}>
                Başka bir kategori seçmeyi deneyin
              </Text>
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F3F5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  categorySection: {
    padding: 24,
    paddingTop: 0,
  },
  categoryRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 16,
    height: 100,
    alignItems: 'stretch',
    justifyContent: 'space-between',
  },
  categoryCard: {
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    minHeight: 100,
    maxHeight: 100,
    minWidth: 80,
    overflow: 'hidden',
  },
  largeCard: {
    flex: 2,
    height: 100,
    minHeight: 100,
    maxHeight: 100,
  },
  regularCard: {
    flex: 1,
    height: 100,
    minHeight: 100,
    maxHeight: 100,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#F2F3F5',
  },
  trendCard: {
    shadowColor: '#432870',
    shadowOpacity: 0.3,
    shadowRadius: 40,
    elevation: 20,
  },
  selectedCard: {
    shadowColor: '#432870',
    shadowOpacity: 0.3,
    shadowRadius: 40,
    elevation: 20,
  },
  categoryGradient: {
    height: 100,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  largeGradient: {
    height: 100,
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
  },
  patternCircle: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'currentColor',
    opacity: 0.2,
  },
  badgeContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badgeIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 10,
    color: '#FFFFFF',
  },
  badgeCount: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  badgeCountText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  categoryContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryIcon: {
    fontSize: 20,
  },
  largeIcon: {
    fontSize: 20,
  },
  largeCategoryText: {
    flexDirection: 'column',
  },
  largeCategoryName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  largeCategorySubtitle: {
    fontSize: 11,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  categoryFooter: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  categoryCount: {
    fontSize: 18,
    fontWeight: '900',
    color: '#202020',
  },
  largeCount: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  categoryName: {
    fontSize: 11,
    color: '#202020',
    opacity: 0.8,
    fontWeight: 'bold',
  },
  hoverEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    opacity: 0,
  },
  selectedCategoryInfo: {
    marginHorizontal: 24,
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F2F3F5',
  },
  selectedCategoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  selectedCategoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  selectedCategoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#432870',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCategoryIconText: {
    fontSize: 18,
  },
  selectedCategoryText: {
    flexDirection: 'column',
  },
  selectedCategoryName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#202020',
  },
  selectedCategorySubtitle: {
    fontSize: 14,
    color: '#202020',
    opacity: 0.7,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#432870',
  },
  questionsSection: {
    paddingHorizontal: 24,
  },
  questionsContainer: {
    marginBottom: 24,
  },
  questionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  questionsTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#202020',
  },
  questionsCount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#432870',
  },
  questionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  questionCardContainer: {
    width: CARD_WIDTH,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyStateIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#202020',
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#202020',
    opacity: 0.7,
  },
}); 