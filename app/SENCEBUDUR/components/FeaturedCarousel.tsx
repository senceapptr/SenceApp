import React, { useRef, useState, useEffect, useCallback } from 'react';
import { 
  View, 
  ScrollView, 
  Text, 
  TouchableOpacity, 
  Image, 
  StyleSheet,
  Dimensions,
  Animated,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Question } from '../types';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 80;
const CARD_SPACING = 20;
const VISIBLE_CARD_WIDTH = CARD_WIDTH + CARD_SPACING;

interface FeaturedCarouselProps {
  questions: Question[];
  onQuestionClick: (id: number) => void;
  onVote: (questionId: number, vote: 'yes' | 'no', odds: number) => void;
}

export function FeaturedCarousel({ questions, onQuestionClick, onVote }: FeaturedCarouselProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollOffsetRef = useRef(0);
  const isScrollingRef = useRef(false);
  const lastScrollTimeRef = useRef(0);
  
  // Scroll position animated value for fluid dot animations
  const scrollPosition = useRef(new Animated.Value(0)).current;
  
  // Use native driver for better performance
  const dotAnimations = useRef(
    questions.map(() => ({
      scale: new Animated.Value(0.8),
      opacity: new Animated.Value(0.4),
      width: new Animated.Value(8),
    }))
  ).current;

  // Create proper infinite data - start from middle set
  const infiniteData = [...questions, ...questions, ...questions];
  const startIndex = questions.length; // Start from middle set

  // Initialize scroll position to middle set
  useEffect(() => {
    if (scrollViewRef.current && questions.length > 0) {
      // Small delay to ensure ScrollView is mounted
      setTimeout(() => {
        const initialOffset = startIndex * VISIBLE_CARD_WIDTH;
        scrollViewRef.current?.scrollTo({ 
          x: initialOffset, 
          animated: false 
        });
        scrollOffsetRef.current = initialOffset;
        scrollPosition.setValue(initialOffset);
      }, 100);
    }
  }, [startIndex, questions.length, scrollPosition]);

  // Fluid dot animations based on scroll position with improved calculations
  const updateDotAnimations = useCallback((scrollX: number) => {
    const normalizedScroll = scrollX - (startIndex * VISIBLE_CARD_WIDTH);
    const progress = normalizedScroll / VISIBLE_CARD_WIDTH;
    
    dotAnimations.forEach((anim, index) => {
      const dotProgress = progress - index;
      const distance = Math.abs(dotProgress);
      
      // Improved animation calculations for smoother transitions
      const scale = Math.max(0.8, 1.2 - distance * 0.4);
      const opacity = Math.max(0.4, 1 - distance * 0.6);
      const width = Math.max(8, 24 - distance * 16);
      
      // Faster animations with 25% speed increase (higher tension, lower friction)
      Animated.parallel([
        Animated.spring(anim.scale, {
          toValue: scale,
          tension: 250,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.spring(anim.opacity, {
          toValue: opacity,
          tension: 250,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.spring(anim.width, {
          toValue: width,
          tension: 250,
          friction: 7,
          useNativeDriver: false,
        }),
      ]).start();
    });
  }, [dotAnimations, startIndex]);

  // Optimized scroll handler with better fast scrolling support
  const handleScroll = useCallback((event: any) => {
    const now = Date.now();
    const contentOffset = event.nativeEvent.contentOffset.x;
    
    // Throttle updates during fast scrolling
    if (now - lastScrollTimeRef.current < 16) { // 60fps throttling
      return;
    }
    lastScrollTimeRef.current = now;
    
    scrollOffsetRef.current = contentOffset;
    scrollPosition.setValue(contentOffset);
    
    // Always update dot animations regardless of scroll speed
    updateDotAnimations(contentOffset);
    
    if (isScrollingRef.current) return;
    
    // Use Math.floor instead of Math.round for more stable index calculation
    const index = Math.floor((contentOffset + VISIBLE_CARD_WIDTH / 2) / VISIBLE_CARD_WIDTH);
    const actualIndex = index % questions.length;
    
    if (actualIndex !== currentIndex && actualIndex >= 0 && actualIndex < questions.length) {
      setCurrentIndex(actualIndex);
    }
  }, [currentIndex, questions.length, scrollPosition, updateDotAnimations]);

  // Improved infinite scrolling with immediate dot animation update
  const handleScrollEnd = useCallback((event: any) => {
    isScrollingRef.current = false;
    
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.floor((contentOffset + VISIBLE_CARD_WIDTH / 2) / VISIBLE_CARD_WIDTH);
    
    // Reset to middle set when reaching edges
    if (index <= 0) {
      // At beginning, jump to end of middle set
      const newOffset = (questions.length + index) * VISIBLE_CARD_WIDTH;
      scrollViewRef.current?.scrollTo({ x: newOffset, animated: false });
      scrollOffsetRef.current = newOffset;
      scrollPosition.setValue(newOffset);
      
      // Immediately update dot animations after position jump
      requestAnimationFrame(() => {
        updateDotAnimations(newOffset);
      });
    } else if (index >= questions.length * 2) {
      // At end, jump to beginning of middle set
      const newOffset = (questions.length + (index % questions.length)) * VISIBLE_CARD_WIDTH;
      scrollViewRef.current?.scrollTo({ x: newOffset, animated: false });
      scrollOffsetRef.current = newOffset;
      scrollPosition.setValue(newOffset);
      
      // Immediately update dot animations after position jump
      requestAnimationFrame(() => {
        updateDotAnimations(newOffset);
      });
    }
  }, [questions.length, scrollPosition, updateDotAnimations]);

  const handleScrollBeginDrag = useCallback(() => {
    isScrollingRef.current = true;
    lastScrollTimeRef.current = 0; // Reset timing for new scroll session
  }, []);

  const FeaturedCard = React.memo(({ question }: { question: Question }) => (
    <View style={[styles.card, { width: CARD_WIDTH }]}>
      <Image 
        source={{ uri: question.image }}
        style={styles.cardImage}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.1)']}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
        style={styles.cardOverlay}
      />
      
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{question.category.toUpperCase()}</Text>
          </View>
          
          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>{question.votes}</Text>
            <Text style={styles.statsText}>•</Text>
            <Text style={styles.statsText}>{question.timeLeft}</Text>
          </View>
        </View>

        <TouchableOpacity 
          onPress={() => onQuestionClick(question.id)}
          style={styles.titleContainer}
          activeOpacity={0.8}
        >
          <Text style={styles.cardTitle}>{question.title}</Text>
        </TouchableOpacity>

        <View style={styles.voteContainer}>
          <TouchableOpacity
            onPress={() => onVote(question.id, 'yes', question.yesOdds)}
            style={[styles.voteButton, styles.yesButton]}
            activeOpacity={0.8}
          >
            <Text style={styles.voteButtonText}>EVET</Text>
            <Text style={styles.voteButtonOdds}>{question.yesOdds}x</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => onVote(question.id, 'no', question.noOdds)}
            style={[styles.voteButton, styles.noButton]}
            activeOpacity={0.8}
          >
            <Text style={styles.voteButtonText}>HAYIR</Text>
            <Text style={styles.voteButtonOdds}>{question.noOdds}x</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${question.yesPercentage}%` }
              ]} 
            />
          </View>
          
          <View style={styles.progressStats}>
            <Text style={styles.progressText}>
              %{question.yesPercentage} Evet • %{100 - question.yesPercentage} Hayır
            </Text>
          </View>
        </View>
      </View>
    </View>
  ));

  return (
    <View style={styles.container}>
      <ScrollView 
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={VISIBLE_CARD_WIDTH}
        decelerationRate={Platform.OS === 'ios' ? 0.8 : 0.9}
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        onScrollBeginDrag={handleScrollBeginDrag}
        onMomentumScrollEnd={handleScrollEnd}
        scrollEventThrottle={8}
        removeClippedSubviews={false}
        overScrollMode="never"
      >
        {infiniteData.map((question, index) => (
          <FeaturedCard key={`${question.id}-${index}`} question={question} />
        ))}
      </ScrollView>
      
      <View style={styles.dotsContainer}>
        <View style={styles.dotsBackground}>
          {questions.map((_, index) => (
            <Animated.View 
              key={index} 
              style={[
                styles.dotContainer,
                {
                  transform: [{ scale: dotAnimations[index].scale }],
                  opacity: dotAnimations[index].opacity,
                }
              ]}
            >
              <Animated.View 
                style={[
                  styles.dot,
                  {
                    width: dotAnimations[index].width,
                    backgroundColor: '#7c3aed',
                  }
                ]} 
              />
            </Animated.View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  scrollContent: {
    paddingHorizontal: (width - CARD_WIDTH) / 2,
    gap: CARD_SPACING,
  },
  dotsContainer: {
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  dotsBackground: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  dotContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#d1d5db',
  },
  card: {
    height: 300,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
  cardImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  cardOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  cardContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
    zIndex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    backgroundColor: 'rgba(107, 70, 240, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'white',
    letterSpacing: 0.5,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statsText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 16,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: 'white',
    lineHeight: 30,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  voteContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  voteButton: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  yesButton: {
    backgroundColor: '#10b981',
  },
  noButton: {
    backgroundColor: '#ef4444',
  },
  voteButtonText: {
    fontSize: 14,
    fontWeight: '900',
    color: 'white',
    marginBottom: 2,
  },
  voteButtonOdds: {
    fontSize: 12,
    fontWeight: '700',
    color: 'white',
    opacity: 0.9,
  },
  progressContainer: {
    gap: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 2,
  },
  progressStats: {
    alignItems: 'center',
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
}); 