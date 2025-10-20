import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface PredictionCard3Props {
  question: {
    id: number;
    title: string;
    image?: string;
    totalVotes: number;
    timeLeft: string;
    yesPercentage: number;
    category: string;
    isPremium?: boolean;
  };
  onVote: (questionId: number, vote: 'yes' | 'no') => void;
}

export function PredictionCard3({ question, onVote }: PredictionCard3Props) {
  const noPercentage = 100 - question.yesPercentage;
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
        toValue: question.yesPercentage,
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
  }, [question.yesPercentage, noPercentage]);

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
    <Animated.View 
      style={[
        styles.card,
        {
          transform: [{ scale: cardScale }],
        }
      ]}
    >
      {/* Background Image */}
      <Image 
        source={{ uri: question.image || defaultImage }}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      
      {/* Dark Overlay Gradient */}
      <LinearGradient
        colors={['rgba(0,0,0,0.9)', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.2)']}
        style={styles.overlay}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
      />
      
      {/* Content positioned on lower third */}
      <View style={styles.content}>
        {/* Stats positioned above question title */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="people" size={16} color="rgba(255,255,255,0.9)" />
            <Text style={styles.statText}>
              {question.totalVotes.toLocaleString()}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="time" size={16} color="rgba(255,255,255,0.9)" />
            <Text style={styles.statText}>
              {question.timeLeft}
            </Text>
          </View>
        </View>

        {/* White Bold Question Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            {question.title}
          </Text>
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
                styles.progressBar,
                styles.noBar,
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
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            onPress={() => onVote(question.id, 'yes')}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={[styles.button, styles.yesButton]}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onVote(question.id, 'no')}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={[styles.button, styles.noButton]}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>No</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: SCREEN_WIDTH * 0.9,
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
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    gap: 10,
    height: '57%', // Reduced to move content higher
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
  },
  titleContainer: {
    marginBottom: 4,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 24,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontWeight: '500',
  },
  percentageContainer: {
    gap: 6,
  },
  percentageLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  percentageLabel: {
    fontSize: 14,
    fontWeight: 'bold',
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
    height: 12,
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
    paddingTop: 8,
  },
  button: {
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
  yesButton: {
    borderColor: '#34C759',
  },
  noButton: {
    borderColor: '#FF3B30',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});