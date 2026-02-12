import React, { useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useCountdown } from './hooks/useCountdown';

const AnimatedVoteButton = ({
  label,
  odds,
  color,
  onPress,
}: {
  label: string;
  odds: number;
  color: string;
  onPress: () => void;
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;
  const sheenTranslate = useRef(new Animated.Value(-140)).current;
  const ringOpacity = useRef(new Animated.Value(0)).current;
  const ringScale = useRef(new Animated.Value(0.92)).current;
  const isNo = label.toLowerCase() === 'hayır';

  const handlePressIn = () => {
    sheenTranslate.setValue(-140);
    ringScale.setValue(0.92);

    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
        tension: 260,
        friction: 11,
      }),
      Animated.timing(glowOpacity, {
        toValue: 1,
        duration: 150,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(sheenTranslate, {
        toValue: 160,
        duration: 430,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(ringOpacity, {
          toValue: 0.35,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(ringScale, {
          toValue: 1.1,
          duration: 260,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 280,
        friction: 14,
      }),
      Animated.timing(glowOpacity, {
        toValue: 0,
        duration: 160,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(ringOpacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <TouchableOpacity
      style={styles.voteButtonPressArea}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
    >
      <Animated.View
        style={[
          styles.voteButton,
          {
            borderColor: color,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <LinearGradient
          colors={['rgba(255,255,255,0.18)', 'rgba(255,255,255,0.08)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
        <Animated.View style={[styles.voteButtonGlow, { backgroundColor: color, opacity: glowOpacity }]} />
        <Animated.View
          style={[
            styles.voteButtonRing,
            {
              borderColor: color,
              opacity: ringOpacity,
              transform: [{ scale: ringScale }],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.voteSheen,
            {
              transform: [{ translateX: sheenTranslate }, { skewX: isNo ? '-12deg' : '12deg' }],
            },
          ]}
        />
        <View style={styles.voteButtonContent}>
          <Text style={styles.voteButtonText}>{label}</Text>
          <Text style={styles.voteOdds}>{odds}x</Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

/**
 * Ana sayfa ve Kategori sayfalarında kullanılan standart soru kartı.
 * Kendi içindeki useCountdown hook'u sayesinde her saniye kendini güncelleyerek saniye saniye akar.
 */
export default function CategoryQuestionCard({ question, onDetail, onVote, theme, dynamicStyles }: any) {
  const liveTimeLeft = useCountdown(question.end_date);
  const noPercentage = 100 - (question.yesPercentage || 50);
  const cardScale = useRef(new Animated.Value(1)).current;

  const handleCardPressIn = () => Animated.spring(cardScale, { toValue: 0.97, useNativeDriver: true }).start();
  const handleCardPressOut = () => Animated.spring(cardScale, { toValue: 1, useNativeDriver: true }).start();

  const formatVotes = (votes: number) => {
    if (votes >= 1000) return `${(votes / 1000).toFixed(1)}k`;
    return votes.toString();
  };

  const endDateMs = question.end_date ? new Date(question.end_date).getTime() : 0;
  const isExpired = endDateMs > 0 && endDateMs <= Date.now();
  const showResult = question.result && (isExpired || question.status === 'resolved' || question.status === 'closed');

  let displayTime = liveTimeLeft;
  if (showResult) {
    displayTime = 'Sonuçlandı';
  } else if (isExpired && !showResult) {
    displayTime = 'Sonuç Bekleniyor';
  }

  const stylesOrFallback = dynamicStyles || {
    yesLabel: { color: theme?.yes || '#34C759' },
    noLabel: { color: theme?.no || '#FF3B30' },
    yesBar: { backgroundColor: theme?.yes || '#34C759' },
    noBar: { backgroundColor: theme?.no || '#FF3B30' },
    yesButton: { borderColor: theme?.yes || '#34C759' },
    noButton: { borderColor: theme?.no || '#FF3B30' },
  };

  const themeAccent = theme?.accent || '#34C759';
  const themeError = theme?.error || '#FF3B30';
  const yesColor = stylesOrFallback.yesButton?.borderColor || theme?.yes || '#34C759';
  const noColor = stylesOrFallback.noButton?.borderColor || theme?.no || '#FF3B30';

  const resultColor = question.result === 'yes' ? themeAccent : question.result === 'no' ? themeError : '#8E8E93';
  const resultText = question.result === 'yes' ? 'EVET' : 'HAYIR';
  const resultIcon = question.result === 'yes' ? 'checkmark-circle' : 'close-circle';

  return (
    <TouchableOpacity
      onPress={() => onDetail(question.id, question.category)}
      onPressIn={handleCardPressIn}
      onPressOut={handleCardPressOut}
      activeOpacity={0.95}
      style={styles.cardContainer}
    >
      <Animated.View style={[styles.questionCard, { transform: [{ scale: cardScale }] }]}>
        <Image
          source={{ uri: question.image || 'https://images.unsplash.com/photo-1574477942438-5db6de70fd34?w=600' }}
          style={styles.questionImage}
          resizeMode="cover"
        />

        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.85)', 'rgba(0,0,0,0.95)']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />

        {showResult && (
          <View style={styles.resultOverlay}>
            <View style={[styles.resultBadge, { backgroundColor: resultColor }]}>
              <Ionicons name={resultIcon} size={20} color="#FFF" style={{ marginRight: 6 }} />
              <Text style={styles.resultBadgeText}>SONUÇ: {resultText}</Text>
            </View>
          </View>
        )}

        <View style={styles.contentWrapper}>
          <View style={styles.statsRow}>
            <View style={styles.statBadge}>
              <Ionicons name="people" size={13} color="#FFFFFF" />
              <Text style={styles.statBadgeText}>{formatVotes(question.votes)} Oy</Text>
            </View>
            {!showResult && (
              <View style={styles.statBadge}>
                <Ionicons name="time-outline" size={13} color="#FFFFFF" />
                <Text style={[styles.statBadgeText, isExpired && { color: '#FF453A' }]}>{displayTime}</Text>
              </View>
            )}
          </View>

          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={2}>
              {question.title}
            </Text>
          </View>

          <View style={styles.progressSection}>
            <View style={styles.percentagesRow}>
              <Text style={[styles.percentLabel, { color: stylesOrFallback.yesLabel.color }]}>
                Evet %{question.yesPercentage}
              </Text>
              <Text style={[styles.percentLabel, { color: stylesOrFallback.noLabel.color }]}>
                Hayır %{noPercentage}
              </Text>
            </View>

            <View style={styles.trackContainer}>
              <View
                style={[
                  styles.trackSegment,
                  {
                    flex: question.yesPercentage,
                    backgroundColor: stylesOrFallback.yesBar.backgroundColor,
                    marginRight: 1,
                  },
                ]}
              />
              <View
                style={[
                  styles.trackSegment,
                  {
                    flex: noPercentage,
                    backgroundColor: stylesOrFallback.noBar.backgroundColor,
                    marginLeft: 1,
                  },
                ]}
              />
            </View>
          </View>

          {!showResult ? (
            <View style={styles.buttonsContainer}>
              <AnimatedVoteButton
                label="Evet"
                odds={question.yesOdds}
                color={yesColor}
                onPress={() => onVote(question.id, 'yes', question.yesOdds)}
              />
              <AnimatedVoteButton
                label="Hayır"
                odds={question.noOdds}
                color={noColor}
                onPress={() => onVote(question.id, 'no', question.noOdds)}
              />
            </View>
          ) : (
            <View style={styles.resultInfoContainer}>
              <Text style={styles.resultInfoText}>Bu tahmin etkinliği sona erdi.</Text>
            </View>
          )}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  questionCard: {
    height: 380,
    borderRadius: 28,
    backgroundColor: '#1C1C1E',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  questionImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.9,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  resultOverlay: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  resultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#34C759',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  resultBadgeText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  contentWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 18,
    gap: 10,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16,18,24,0.82)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    gap: 6,
  },
  statBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  titleContainer: {
    marginBottom: 2,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 21,
    letterSpacing: 0.2,
    textShadowColor: 'rgba(0,0,0,0.45)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  progressSection: {
    gap: 4,
  },
  percentagesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 1,
  },
  percentLabel: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.95,
  },
  trackContainer: {
    flexDirection: 'row',
    height: 6,
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 99,
    overflow: 'hidden',
  },
  trackSegment: {
    height: '100%',
    borderRadius: 99,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 2,
  },
  voteButtonPressArea: {
    flex: 1,
  },
  voteButton: {
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    backgroundColor: 'rgba(13,17,23,0.55)',
    borderWidth: 2,
    overflow: 'hidden',
  },
  voteButtonGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 14,
  },
  voteButtonRing: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 14,
    borderWidth: 2,
  },
  voteSheen: {
    position: 'absolute',
    top: -10,
    bottom: -10,
    width: 72,
    backgroundColor: 'rgba(255,255,255,0.24)',
    borderRadius: 14,
  },
  voteButtonContent: {
    zIndex: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  voteButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  voteOdds: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
    fontWeight: '600',
  },
  resultInfoContainer: {
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
  },
  resultInfoText: {
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
    fontSize: 14,
  },
});
