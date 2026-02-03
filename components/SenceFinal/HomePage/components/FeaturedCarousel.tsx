import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Dimensions, FlatList } from 'react-native';
import { FeaturedQuestion } from '../types';
import { FeaturedCard } from './FeaturedCard';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface FeaturedCarouselProps {
  questions: FeaturedQuestion[];
  onQuestionPress: (id: string) => void;
  onVote: (questionId: string, vote: 'yes' | 'no', odds: number, questionTitle?: string) => void;
}

export function FeaturedCarousel({ questions, onQuestionPress, onVote }: FeaturedCarouselProps) {
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(1); // Start at 1 (first real item)
  const carouselScrollX = useRef(new Animated.Value(SCREEN_WIDTH)).current;
  
  // Create infinite loop data: [last, ...questions, first]
  // Use unique keys for clones to prevent re-rendering issues
  const infiniteData = questions.length > 0 ? [
    { ...questions[questions.length - 1], _isClone: true, _cloneType: 'last', _originalId: questions[questions.length - 1].id },
    ...questions.map(q => ({ ...q, _isClone: false })),
    { ...questions[0], _isClone: true, _cloneType: 'first', _originalId: questions[0].id }
  ] : [];

  // Initialize scroll position to first real item
  useEffect(() => {
    if (infiniteData.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToOffset({
          offset: SCREEN_WIDTH,
          animated: false,
        });
      }, 0);
    }
  }, [infiniteData.length]);

  const handleMomentumScrollEnd = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    
    // If at clone of last item (index 0), jump to real last item
    if (index === 0) {
      flatListRef.current?.scrollToOffset({
        offset: SCREEN_WIDTH * questions.length,
        animated: false,
      });
      setCurrentIndex(questions.length);
    }
    // If at clone of first item (index = infiniteData.length - 1), jump to real first item
    else if (index === infiniteData.length - 1) {
      flatListRef.current?.scrollToOffset({
        offset: SCREEN_WIDTH,
        animated: false,
      });
      setCurrentIndex(1);
    }
    else {
      setCurrentIndex(index);
    }
  };

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={flatListRef}
        data={infiniteData}
        renderItem={({ item }) => (
          <FeaturedCard
            question={item}
            onQuestionPress={onQuestionPress}
            onVote={onVote}
          />
        )}
        keyExtractor={(item, index) => {
          // Use consistent keys for clones to prevent re-rendering
          if (item._isClone && item._cloneType === 'last') {
            return `clone-last-${item._originalId}`;
          } else if (item._isClone && item._cloneType === 'first') {
            return `clone-first-${item._originalId}`;
          }
          return `real-${item.id}`;
        }}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: carouselScrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        removeClippedSubviews={false}
        maxToRenderPerBatch={5}
        windowSize={10}
        initialNumToRender={infiniteData.length}
        maintainVisibleContentPosition={{
          minIndexForVisible: 1,
        }}
        getItemLayout={(data, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
      />
      
      {/* Carousel Indicators */}
      <View style={styles.indicators}>
        {questions.map((_, index) => {
          // Adjust for clone offset (real items start at index 1)
          const realIndex = index + 1;
          const inputRange = [
            (realIndex - 1) * SCREEN_WIDTH,
            realIndex * SCREEN_WIDTH,
            (realIndex + 1) * SCREEN_WIDTH,
          ];
          const width = carouselScrollX.interpolate({
            inputRange,
            outputRange: [8, 24, 8],
            extrapolate: 'clamp',
          });
          const opacity = carouselScrollX.interpolate({
            inputRange,
            outputRange: [0.5, 1, 0.5],
            extrapolate: 'clamp',
          });
          return (
            <Animated.View
              key={index}
              style={[
                styles.indicator,
                {
                  width,
                  opacity,
                  backgroundColor: '#ffffff',
                },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: SCREEN_HEIGHT * 0.55,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
  },
  indicators: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  indicator: {
    height: 8,
    borderRadius: 4,
  },
});




