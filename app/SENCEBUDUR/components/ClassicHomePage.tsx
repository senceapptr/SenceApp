import React from 'react';
import { 
  View, 
  ScrollView, 
  Text, 
  TouchableOpacity, 
  Image,
  StyleSheet,
  Dimensions,
  Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { FeaturedCarousel } from './FeaturedCarousel';
import { FilterPills } from './FilterPills';
import { CircularProgress } from './CircularProgress';
import { Header } from './Header';
import { featuredQuestions } from '../constants/questions';
import { getFilteredQuestions } from '../utils/questionHelpers';
import { AppPage } from '../types';

const { width } = Dimensions.get('window');

interface ClassicHomePageProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  setCurrentPage: (page: AppPage) => void;
  handleQuestionDetail: (id: number) => void;
  handleVote: (questionId: number, vote: 'yes' | 'no', odds: number) => void;
  gameCredits: number;
  setProfileDrawerOpen: (open: boolean) => void;
  hasNotifications: boolean;
}

export function ClassicHomePage({
  selectedCategory,
  setSelectedCategory,
  setCurrentPage,
  handleQuestionDetail,
  handleVote,
  gameCredits,
  setProfileDrawerOpen,
  hasNotifications
}: ClassicHomePageProps) {
  const filteredQuestions = getFilteredQuestions(selectedCategory);

  const ActionButtons = () => {
    const [triviaScale] = React.useState(new Animated.Value(1));
    const [predictScale] = React.useState(new Animated.Value(1));

    const animatePress = (scale: Animated.Value, callback: () => void) => {
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 0.92,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 120,
          useNativeDriver: true,
        }),
      ]).start(callback);
    };

    return (
      <View style={styles.actionButtons}>
        <View style={styles.actionButtonsRow}>
          <Animated.View style={{ transform: [{ scale: triviaScale }], flex: 1 }}>
            <TouchableOpacity
              onPress={() => animatePress(triviaScale, () => setCurrentPage('trivia'))}
              style={styles.actionButton}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#432870', '#5A3A8B']}
                style={styles.actionButtonGradient}
              >
                {/* Content */}
                <View style={styles.actionButtonContent}>
                  <Ionicons name="game-controller" size={20} color="white" />
                  <Text style={styles.actionButtonTitle}>Trivia</Text>
                </View>

                {/* Hover Effect */}
                <View style={styles.hoverEffect} />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={{ transform: [{ scale: predictScale }], flex: 1 }}>
            <TouchableOpacity
              onPress={() => animatePress(predictScale, () => setCurrentPage('predict'))}
              style={styles.actionButton}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#432870', '#5A3A8B']}
                style={styles.actionButtonGradient}
              >
                {/* Content */}
                <View style={styles.actionButtonContent}>
                  <Ionicons name="speedometer" size={20} color="white" />
                  <Text style={styles.actionButtonTitle}>Swipe</Text>
                </View>

                {/* Hover Effect */}
                <View style={styles.hoverEffect} />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    );
  };

  const QuestionCard = ({ question, index }: { question: any; index: number }) => (
    <View style={[styles.questionCard, { marginTop: index * 2 }]}>
      <Image 
        source={{ uri: question.image }}
        style={styles.questionImage}
      />
      <LinearGradient
        colors={['rgba(0,0,0,0.9)', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.3)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.questionOverlay}
      />
      
      <View style={styles.questionContent}>
        <View style={styles.questionTop}>
          <View style={styles.questionLeftContent}>
            <TouchableOpacity onPress={() => handleQuestionDetail(question.id)}>
              <Text style={styles.questionTitle}>{question.title}</Text>
            </TouchableOpacity>
            
            <View style={styles.categoryPill}>
              <Text style={styles.categoryText}>{question.category.toUpperCase()}</Text>
            </View>
          </View>

          <View style={styles.questionRightContent}>
            <CircularProgress 
              percentage={question.yesPercentage}
              majorityVote={question.yesPercentage > 50 ? 'yes' : 'no'}
              size={70}
              strokeWidth={6}
            />
          </View>
        </View>

        <View style={styles.questionBottom}>
          <View style={styles.questionMeta}>
            <Text style={styles.metaText}>{question.votes}</Text>
            <Text style={styles.metaText}>{question.timeLeft}</Text>
          </View>
          
          <View style={styles.voteButtons}>
            <TouchableOpacity
              onPress={() => handleVote(question.id, 'yes', question.yesOdds)}
              style={[styles.voteButton, styles.yesButton]}
            >
              <Text style={styles.voteButtonText}>EVET</Text>
              <Text style={styles.voteButtonOdds}>{question.yesOdds}x</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => handleVote(question.id, 'no', question.noOdds)}
              style={[styles.voteButton, styles.noButton]}
            >
              <Text style={styles.voteButtonText}>HAYIR</Text>
              <Text style={styles.voteButtonOdds}>{question.noOdds}x</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header 
        gameCredits={gameCredits}
        setProfileDrawerOpen={setProfileDrawerOpen}
        hasNotifications={hasNotifications}
        isHomePage={true}
      />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >


        {/* Featured Carousel */}
        <View style={styles.carouselContainer}>
          <FeaturedCarousel 
            questions={featuredQuestions} 
            onQuestionClick={handleQuestionDetail}
            onVote={handleVote}
          />
        </View>

        {/* Action Buttons */}
        <ActionButtons />

        {/* Filter Pills */}
        <View style={styles.filterContainer}>
          <FilterPills 
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </View>

        {/* Question Cards */}
        <View style={styles.questionsContainer}>
          {filteredQuestions.map((question, index) => (
            <QuestionCard key={question.id} question={question} index={index} />
          ))}
        </View>
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
  carouselContainer: {
    marginTop: 16,
    marginBottom: 24,
  },
  actionButtons: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 0,
  },
  actionButton: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#432870',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  actionButtonGradient: {
    padding: 16,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  actionButtonTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
    textAlign: 'center',
    color: 'white',
  },
  filterContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  questionsContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  questionCard: {
    height: 200,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
  questionImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  questionOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  questionContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
    zIndex: 1,
  },
  questionTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  questionLeftContent: {
    flex: 1,
    paddingRight: 16,
  },
  questionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: 'white',
    lineHeight: 20,
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  categoryPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '700',
    color: 'white',
    letterSpacing: 0.5,
  },
  questionRightContent: {
    alignItems: 'center',
  },
  questionBottom: {
    gap: 8,
  },
  questionMeta: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  voteButtons: {
    flexDirection: 'row',
    borderRadius: 12,
    overflow: 'hidden',
    height: 40,
  },
  voteButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  yesButton: {
    backgroundColor: '#10b981',
  },
  noButton: {
    backgroundColor: '#ef4444',
  },
  voteButtonText: {
    fontSize: 12,
    fontWeight: '900',
    color: 'white',
  },
  voteButtonOdds: {
    fontSize: 10,
    fontWeight: '700',
    color: 'white',
    opacity: 0.9,
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
});