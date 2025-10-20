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
  Easing,
  FlatList,
} from 'react-native';
import { StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { League } from './types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

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

interface LeagueQuestionsPageProps {
  league: League;
  onClose: () => void;
  handleQuestionDetail: (question: any) => void;
  handleVote: (questionId: number, vote: 'yes' | 'no', odds: number) => void;
}

export function LeagueQuestionsPage({
  league,
  onClose,
  handleQuestionDetail,
  handleVote
}: LeagueQuestionsPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tümü');

  // Mock questions data
  const mockQuestions: Question[] = [
    {
      id: 1,
      title: `${league.name} liginde örnek soru 1`,
      category: league.name,
      votes: 12500,
      timeLeft: '2g 14s',
      yesOdds: 2.4,
      noOdds: 1.6,
      yesPercentage: 62,
      image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop'
    },
    {
      id: 2,
      title: `${league.name} liginde örnek soru 2`,
      category: league.name,
      votes: 8900,
      timeLeft: '1g 8s',
      yesOdds: 1.8,
      noOdds: 2.2,
      yesPercentage: 45,
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=600&fit=crop'
    },
    {
      id: 3,
      title: `${league.name} liginde örnek soru 3`,
      category: league.name,
      votes: 15600,
      timeLeft: '3g 22s',
      yesOdds: 3.2,
      noOdds: 1.4,
      yesPercentage: 78,
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop'
    },
  ];

  // Animation values for question cards
  const cardAnimationsRef = useRef<{[key: number]: {
    yesBarWidth: Animated.Value;
    noBarWidth: Animated.Value;
    cardScale: Animated.Value;
    yesFillAnim: Animated.Value;
    noFillAnim: Animated.Value;
  }}>({});

  // Ensure animations exist for all questions
  mockQuestions.forEach((question, index) => {
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

  useEffect(() => {
    // Animate progress bars
    mockQuestions.forEach((question, index) => {
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
  }, []);

  const categories = ['Tümü', ...league.categories];
  
  const filteredQuestions = selectedCategory === 'Tümü' 
    ? mockQuestions 
    : mockQuestions.filter(q => q.category === selectedCategory);

  const formatVotes = (votes: number) => {
    if (votes >= 1000) {
      return `${(votes / 1000).toFixed(1)}K`;
    }
    return votes.toString();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#432870" translucent={false} />
      
      {/* Header */}
      <LinearGradient
        colors={['#432870', '#5a3a8f', '#c61585']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity
            onPress={onClose}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>{league.name}</Text>
          </View>
          
          <View style={styles.placeholder} />
        </View>

        {/* Category Filter */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryScrollContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => setSelectedCategory(category)}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonActive
              ]}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.categoryButtonText,
                selectedCategory === category && styles.categoryButtonTextActive
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>

      {/* Questions List */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.questionsHeader}>
          <Text style={styles.questionsTitle}>
            Lig Soruları ({filteredQuestions.length})
          </Text>
          <Text style={styles.questionsSubtitle}>
            {selectedCategory === 'Tümü' ? 'Bu ligeye özel sorular' : `${selectedCategory} kategorisi`}
          </Text>
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingTop: 44,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  leagueIcon: {
    fontSize: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: 'white',
  },
  placeholder: {
    width: 40,
  },
  categoryScroll: {
    maxHeight: 50,
  },
  categoryScrollContent: {
    paddingHorizontal: 24,
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  categoryButtonActive: {
    backgroundColor: 'white',
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  categoryButtonTextActive: {
    color: '#432870',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 8,
  },
  questionsHeader: {
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  questionsTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 4,
  },
  questionsSubtitle: {
    fontSize: 14,
    color: '#6B7280',
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
});

