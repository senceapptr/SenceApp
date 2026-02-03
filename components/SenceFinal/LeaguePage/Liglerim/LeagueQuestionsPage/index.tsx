import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Question } from '../../types';
import { CategoryFilter } from './CategoryFilter';
import { QuestionCard } from './QuestionCard';

interface LeagueQuestionsPageProps {
  onBack: () => void;
  leagueName: string;
  leagueCategories: string[];
  handleVote?: (questionId: number, vote: 'yes' | 'no', odds: number) => void;
}

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

export function LeagueQuestionsPage({ 
  onBack, 
  leagueName,
  leagueCategories,
  handleVote 
}: LeagueQuestionsPageProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredQuestions = activeCategory === 'all' 
    ? mockQuestions 
    : mockQuestions.filter(q => q.category === activeCategory);

  const handleVoteClick = (questionId: number, vote: 'yes' | 'no', odds: number) => {
    if (handleVote) {
      handleVote(questionId, vote, odds);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#10B981', '#059669', '#047857']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerSafeArea}
      >
        <SafeAreaView>
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={onBack}
                activeOpacity={0.7}
              >
                <Text style={styles.backButtonText}>←</Text>
              </TouchableOpacity>
              <View style={styles.headerTitleContainer}>
                <Text style={styles.headerTitle}>{leagueName}</Text>
              </View>
            </View>

            <CategoryFilter
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />

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
            <QuestionCard
              key={question.id}
              question={question}
              onVote={handleVoteClick}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1117',
  },
  headerSafeArea: {
    backgroundColor: 'transparent',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 12,
    position: 'relative',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  backButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  headerWave: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 24,
    backgroundColor: '#0D1117',
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
    color: '#F0F6FC',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#8B949E',
  },
});

