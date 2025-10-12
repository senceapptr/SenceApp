import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface LeagueQuestionsPageProps {
  onBack: () => void;
  leagueName: string;
  leagueCategories: string[];
  handleVote?: (questionId: number, vote: 'yes' | 'no', odds: number) => void;
}

interface Question {
  id: number;
  text: string;
  category: string;
  categoryEmoji: string;
  endDate: string;
  yesOdds: number;
  noOdds: number;
  totalVotes: number;
  yesPercentage: number;
  noPercentage: number;
  userVote?: 'yes' | 'no' | null;
  isTrending?: boolean;
}

export function LeagueQuestionsPage({ 
  onBack, 
  leagueName, 
  leagueCategories,
  handleVote 
}: LeagueQuestionsPageProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showVoteAnimation, setShowVoteAnimation] = useState(false);
  const [animatedQuestionId, setAnimatedQuestionId] = useState<number | null>(null);

  // Mock questions data
  const mockQuestions: Question[] = [
    {
      id: 1,
      text: "Fenerbahçe bu hafta sonu Galatasaray'ı yenecek mi?",
      category: "futbol",
      categoryEmoji: "⚽",
      endDate: "2 gün",
      yesOdds: 1.85,
      noOdds: 2.10,
      totalVotes: 1247,
      yesPercentage: 58,
      noPercentage: 42,
      userVote: null,
      isTrending: true
    },
    {
      id: 2,
      text: "Lakers bu sezon NBA şampiyonu olacak mı?",
      category: "basketbol",
      categoryEmoji: "🏀",
      endDate: "5 gün",
      yesOdds: 3.20,
      noOdds: 1.40,
      totalVotes: 892,
      yesPercentage: 35,
      noPercentage: 65,
      userVote: 'yes',
      isTrending: false
    },
    {
      id: 3,
      text: "Djokovic French Open'ı kazanacak mı?",
      category: "tenis",
      categoryEmoji: "🎾",
      endDate: "1 gün",
      yesOdds: 1.65,
      noOdds: 2.35,
      totalVotes: 543,
      yesPercentage: 62,
      noPercentage: 38,
      userVote: null,
      isTrending: true
    },
    {
      id: 4,
      text: "Beşiktaş bu sezon Avrupa kupalarına kalacak mı?",
      category: "futbol",
      categoryEmoji: "⚽",
      endDate: "3 gün",
      yesOdds: 2.10,
      noOdds: 1.80,
      totalVotes: 678,
      yesPercentage: 45,
      noPercentage: 55,
      userVote: null,
      isTrending: false
    },
    {
      id: 5,
      text: "Anadolu Efes EuroLeague finaline kalacak mı?",
      category: "basketbol",
      categoryEmoji: "🏀",
      endDate: "7 gün",
      yesOdds: 2.50,
      noOdds: 1.60,
      totalVotes: 432,
      yesPercentage: 40,
      noPercentage: 60,
      userVote: 'no',
      isTrending: false
    }
  ];

  const categories = [
    { id: 'all', name: 'Tümü', emoji: '🎯' },
    { id: 'futbol', name: 'Futbol', emoji: '⚽' },
    { id: 'basketbol', name: 'Basketbol', emoji: '🏀' },
    { id: 'tenis', name: 'Tenis', emoji: '🎾' }
  ];

  const filteredQuestions = activeCategory === 'all' 
    ? mockQuestions 
    : mockQuestions.filter(q => q.category === activeCategory);

  const handleVoteClick = (questionId: number, vote: 'yes' | 'no', odds: number) => {
    setAnimatedQuestionId(questionId);
    setShowVoteAnimation(true);
    
    setTimeout(() => {
      setShowVoteAnimation(false);
      setAnimatedQuestionId(null);
    }, 1500);

    if (handleVote) {
      handleVote(questionId, vote, odds);
    }
  };


  return (
    <View style={styles.container}>
      {/* Compact Header */}
      <LinearGradient
        colors={['#432870', '#5A3A8B', '#B29EFD']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerSafeArea}
      >
        <SafeAreaView>
        <View style={styles.headerCompact}>
        {/* Header Content */}
        <View style={styles.headerContentCompact}>
          <TouchableOpacity
            style={styles.backButtonCompact}
            onPress={onBack}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonTextCompact}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitleCompact}>{leagueName}</Text>
          </View>
        </View>

        {/* Category Filter Pills */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryPill,
                activeCategory === cat.id && styles.categoryPillActive
              ]}
              onPress={() => setActiveCategory(cat.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
              <Text
                style={[
                  styles.categoryName,
                  activeCategory === cat.id && styles.categoryNameActive
                ]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Bottom Wave */}
        <View style={styles.headerWave} />
        </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Questions List */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {filteredQuestions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🤔</Text>
            <Text style={styles.emptyTitle}>Henüz Soru Yok</Text>
            <Text style={styles.emptyText}>Bu kategoride henüz soru bulunmuyor.</Text>
          </View>
        ) : (
          filteredQuestions.map((question) => (
            <View key={question.id} style={styles.questionCard}>
              {/* Question Header */}
              <View style={styles.questionHeader}>
                <View style={styles.questionHeaderLeft}>
                  <View style={styles.questionMeta}>
                    <Text style={styles.questionCategoryEmoji}>{question.categoryEmoji}</Text>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryBadgeText}>{question.category}</Text>
                    </View>
                    {question.isTrending && (
                      <View style={styles.trendingBadge}>
                        <Text style={styles.trendingBadgeText}>🔥 Trend</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.questionText}>{question.text}</Text>
                </View>
              </View>

              {/* Stats */}
              <View style={styles.questionStats}>
                <Text style={styles.statText}>👥 {question.totalVotes} oy</Text>
                <Text style={styles.statSeparator}>•</Text>
                <Text style={styles.statText}>⏱️ {question.endDate}</Text>
              </View>

              {/* Voting Progress */}
              <View style={styles.votingProgress}>
                <View style={styles.progressLabels}>
                  <Text style={styles.progressLabelYes}>EVET {question.yesPercentage}%</Text>
                  <Text style={styles.progressLabelNo}>HAYIR {question.noPercentage}%</Text>
                </View>
                <View style={styles.progressBar}>
                  <View style={[styles.progressYes, { width: `${question.yesPercentage}%` }]} />
                  <View style={[styles.progressNo, { width: `${question.noPercentage}%` }]} />
                </View>
              </View>

              {/* Vote Buttons */}
              {question.userVote ? (
                <View style={styles.voteResult}>
                  <View
                    style={[
                      styles.voteResultButton,
                      question.userVote === 'yes' && styles.voteResultButtonYes,
                    ]}
                  >
                    <Text
                      style={[
                        styles.voteResultText,
                        question.userVote === 'yes' && styles.voteResultTextYes,
                      ]}
                    >
                      {question.userVote === 'yes' && '✓ '}EVET
                    </Text>
                    <Text style={styles.voteResultOdds}>{question.yesOdds}x</Text>
                  </View>
                  <View
                    style={[
                      styles.voteResultButton,
                      question.userVote === 'no' && styles.voteResultButtonNo,
                    ]}
                  >
                    <Text
                      style={[
                        styles.voteResultText,
                        question.userVote === 'no' && styles.voteResultTextNo,
                      ]}
                    >
                      {question.userVote === 'no' && '✓ '}HAYIR
                    </Text>
                    <Text style={styles.voteResultOdds}>{question.noOdds}x</Text>
                  </View>
                </View>
              ) : (
                <View style={styles.voteButtons}>
                  <TouchableOpacity
                    style={styles.yesButton}
                    onPress={() => handleVoteClick(question.id, 'yes', question.yesOdds)}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={['#34C759', '#28A745']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.voteButtonGradient}
                    >
                      <Text style={styles.voteButtonText}>EVET</Text>
                      <Text style={styles.voteButtonOdds}>{question.yesOdds}x</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.noButton}
                    onPress={() => handleVoteClick(question.id, 'no', question.noOdds)}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={['#FF3B30', '#DC3545']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.voteButtonGradient}
                    >
                      <Text style={styles.voteButtonText}>HAYIR</Text>
                      <Text style={styles.voteButtonOdds}>{question.noOdds}x</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              )}

              {/* Vote Animation */}
              {showVoteAnimation && animatedQuestionId === question.id && (
                <View style={styles.voteAnimation}>
                  <View style={styles.voteAnimationContent}>
                    <LinearGradient
                      colors={['#432870', '#B29EFD']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.voteAnimationGradient}
                    >
                      <Text style={styles.voteAnimationText}>✓ Tahmin Kaydedildi!</Text>
                    </LinearGradient>
                  </View>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F3F5',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
    position: 'relative',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButtonText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  headerContent: {
    alignItems: 'center',
    marginBottom: 32,
  },
  headerIcon: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerIconText: {
    fontSize: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  headerBadgeDot: {
    width: 8,
    height: 8,
    backgroundColor: '#C9F158',
    borderRadius: 4,
  },
  headerBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  categoriesScroll: {
    marginBottom: 16,
  },
  categoriesContent: {
    gap: 12,
    paddingRight: 24,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    gap: 8,
  },
  categoryPillActive: {
    backgroundColor: '#FFFFFF',
  },
  categoryEmoji: {
    fontSize: 16,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  categoryNameActive: {
    color: '#432870',
  },
  headerWave: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 24,
    backgroundColor: '#F2F3F5',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    gap: 16,
  },
  emptyState: {
    paddingVertical: 64,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#202020',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: 'rgba(32, 32, 32, 0.7)',
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 2,
    borderColor: '#F2F3F5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  questionHeader: {
    marginBottom: 16,
  },
  questionHeaderLeft: {
    flex: 1,
  },
  questionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  questionCategoryEmoji: {
    fontSize: 24,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: 'rgba(178, 158, 253, 0.2)',
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#432870',
  },
  trendingBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#C9F158',
    borderRadius: 12,
  },
  trendingBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#202020',
  },
  questionText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#202020',
    lineHeight: 22,
  },
  questionStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  statText: {
    fontSize: 14,
    color: 'rgba(32, 32, 32, 0.7)',
  },
  statSeparator: {
    fontSize: 14,
    color: 'rgba(32, 32, 32, 0.7)',
  },
  votingProgress: {
    marginBottom: 16,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabelYes: {
    fontSize: 12,
    fontWeight: '700',
    color: '#34C759',
  },
  progressLabelNo: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF3B30',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F2F3F5',
    borderRadius: 4,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  progressYes: {
    height: '100%',
    backgroundColor: '#34C759',
  },
  progressNo: {
    height: '100%',
    backgroundColor: '#FF3B30',
  },
  voteResult: {
    flexDirection: 'row',
    gap: 12,
  },
  voteResultButton: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#F2F3F5',
    backgroundColor: '#F2F3F5',
    alignItems: 'center',
  },
  voteResultButtonYes: {
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
    borderColor: '#34C759',
  },
  voteResultButtonNo: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderColor: '#FF3B30',
  },
  voteResultText: {
    fontSize: 16,
    fontWeight: '900',
    color: 'rgba(32, 32, 32, 0.4)',
    marginBottom: 4,
  },
  voteResultTextYes: {
    color: '#34C759',
  },
  voteResultTextNo: {
    color: '#FF3B30',
  },
  voteResultOdds: {
    fontSize: 12,
    color: 'rgba(32, 32, 32, 0.7)',
  },
  voteButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  yesButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  noButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  voteButtonGradient: {
    padding: 16,
    alignItems: 'center',
  },
  voteButtonText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  voteButtonOdds: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  voteAnimation: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 24,
  },
  voteAnimationContent: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  voteAnimationGradient: {
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  voteAnimationText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  // Sticky categories styles
  stickyCategories: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: '#432870',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  stickyCategoriesScroll: {
    flexGrow: 0,
  },
  stickyCategoriesContent: {
    paddingHorizontal: 24,
    gap: 12,
  },
  // Compact header styles
  headerSafeArea: {
    backgroundColor: 'transparent',
  },
  headerCompact: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 12,
    position: 'relative',
  },
  headerContentCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backButtonCompact: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  backButtonTextCompact: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitleCompact: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
  },
});

