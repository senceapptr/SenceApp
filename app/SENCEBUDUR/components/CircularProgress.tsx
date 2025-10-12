import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface CircularProgressProps {
  percentage: number;
  majorityVote: 'yes' | 'no';
  size?: number;
  strokeWidth?: number;
}

export function CircularProgress({ 
  percentage, 
  majorityVote, 
  size = 70, 
  strokeWidth = 6 
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const progressColor = majorityVote === 'yes' ? '#10B981' : '#EF4444';
  const backgroundColor = '#E5E7EB';

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={styles.svg}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={styles.textContainer}>
        <Text style={[styles.percentageText, { color: progressColor }]}>
          {percentage}%
        </Text>
        <Text style={[styles.voteText, { color: progressColor }]}>
          {majorityVote === 'yes' ? 'evet' : 'hayır'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  svg: {
    position: 'absolute',
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentageText: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  voteText: {
    fontSize: 8,
    fontWeight: '600',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
}); 