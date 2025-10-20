import React, { useState, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, FlatList } from 'react-native';
import { FeaturedQuestion } from '../types';
import { FeaturedCard } from './FeaturedCard';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface FeaturedCarouselProps {
  questions: FeaturedQuestion[];
  onQuestionPress: (id: number) => void;
  onVote: (questionId: number, vote: 'yes' | 'no', odds: number, questionTitle?: string) => void;
}

export function FeaturedCarousel({ questions, onQuestionPress, onVote }: FeaturedCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselScrollX = useRef(new Animated.Value(0)).current;

  return (
    <View style={styles.container}>
      <Animated.FlatList
        data={questions}
        renderItem={({ item }) => (
          <FeaturedCard
            question={item}
            onQuestionPress={onQuestionPress}
            onVote={onVote}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: carouselScrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
          setCurrentIndex(index);
        }}
        removeClippedSubviews={true}
        maxToRenderPerBatch={3}
        windowSize={5}
        initialNumToRender={2}
        getItemLayout={(data, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
      />
      
      {/* Carousel Indicators */}
      <View style={styles.indicators}>
        {questions.map((_, index) => {
          const inputRange = [
            (index - 1) * SCREEN_WIDTH,
            index * SCREEN_WIDTH,
            (index + 1) * SCREEN_WIDTH,
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



