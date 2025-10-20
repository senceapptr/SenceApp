import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Prediction } from '../types';
import { getStatusColor } from '../utils';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface PredictionsTabProps {
  predictions: Prediction[];
}

export const PredictionsTab: React.FC<PredictionsTabProps> = ({ predictions }) => {
  const renderPredictionItem = (prediction: Prediction) => (
    <TouchableOpacity key={prediction.id} style={styles.predictionCard} activeOpacity={0.8}>
      <Image 
        source={{ uri: prediction.image }}
        style={styles.predictionImage}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.predictionOverlay}
      >
        <Text style={styles.predictionQuestion} numberOfLines={2}>
          {prediction.question}
        </Text>
        <View style={styles.predictionFooter}>
          <View style={[
            styles.predictionBadge,
            prediction.selectedOption === 'EVET' ? styles.yesBadge : styles.noBadge
          ]}>
            <Text style={styles.predictionBadgeText}>{prediction.selectedOption}</Text>
          </View>
          <Text style={styles.predictionOdds}>{prediction.odds}x</Text>
        </View>
      </LinearGradient>
      <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(prediction.status) }]} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.predictionsGrid}>
      {predictions.map(renderPredictionItem)}
    </View>
  );
};

const styles = StyleSheet.create({
  predictionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  predictionCard: {
    width: (SCREEN_WIDTH - 56) / 3,
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  predictionImage: {
    width: '100%',
    height: '100%',
  },
  predictionOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
  },
  predictionQuestion: {
    color: 'white',
    fontSize: 10,
    lineHeight: 12,
    marginBottom: 4,
  },
  predictionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  predictionBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  yesBadge: {
    backgroundColor: '#34C759',
  },
  noBadge: {
    backgroundColor: '#FF3B30',
  },
  predictionBadgeText: {
    color: 'white',
    fontSize: 8,
    fontWeight: '700',
  },
  predictionOdds: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
  },
  statusIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});


