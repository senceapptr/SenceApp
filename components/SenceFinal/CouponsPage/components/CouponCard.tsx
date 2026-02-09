import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Coupon } from '../types';
import { getStatusColor, getStatusBorderColor, getStatusBadge } from '../utils';

interface CouponCardProps {
  coupon: Coupon;
  onPress: (coupon: Coupon) => void;
  onClaim?: (coupon: Coupon) => void;
}

// Claim butonu için parlayan animasyon
function ClaimGlowButton({ onPress, amount }: { onPress: () => void; amount: number }) {
  const glowAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Parlama animasyonu
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: false,
        }),
      ])
    ).start();

    // Hafif pulse animasyonu
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.02,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <Animated.View style={[styles.claimGlow, { opacity: glowOpacity }]} />
        <LinearGradient
          colors={['#10B981', '#059669', '#047857']}
          style={styles.claimButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="gift" size={20} color="#FFFFFF" />
          <View style={styles.claimTextContainer}>
            <Text style={styles.claimButtonText}>Ödülü Al</Text>
            <Text style={styles.claimAmountText}>+{amount.toLocaleString()} kredi</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.7)" />
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

// Claimed badge
function ClaimedBadge({ amount }: { amount: number }) {
  return (
    <View style={styles.claimedContainer}>
      <View style={styles.claimedBadge}>
        <Ionicons name="checkmark-circle" size={18} color="#10B981" />
        <Text style={styles.claimedText}>Ödül Alındı</Text>
        <Text style={styles.claimedAmount}>+{amount.toLocaleString()} kredi</Text>
      </View>
    </View>
  );
}

export function CouponCard({ coupon, onPress, onClaim }: CouponCardProps) {
  const predictions = coupon.predictions ?? [];
  const statusBadge = getStatusBadge(coupon.status, predictions);
  const isWon = coupon.status === 'won';
  const isClaimed = coupon.claimedReward;
  const canClaim = isWon && !isClaimed;

  const handleClaim = () => {
    if (canClaim && onClaim) {
      onClaim(coupon);
    }
  };

  const handlePress = () => {
    // Claim edilebilir kuponlara tıklayınca claim et
    if (canClaim && onClaim) {
      onClaim(coupon);
    } else {
      // Diğer kuponlar için detay aç
      onPress(coupon);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          borderWidth: 2,
          borderColor: canClaim ? '#10B981' : isClaimed ? '#1A2E1A' : getStatusBorderColor(coupon.status)
        },
        canClaim && styles.cardGlow,
      ]}
      onPress={handlePress}
      activeOpacity={0.95}
    >
      <LinearGradient
        colors={canClaim ? ['#0F2419', '#0D1F17'] : isClaimed ? ['#1A2E1A', '#152515'] : getStatusColor(coupon.status)}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={[styles.statusDot, { backgroundColor: statusBadge.color }]} />
            <Text style={styles.title}>• Ticket #{coupon.id}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusBadge.color }]}>
            <Text style={styles.statusBadgeText}>{statusBadge.text}</Text>
          </View>
        </View>

        {/* Predictions */}
        <View style={styles.predictionsContainer}>
          {predictions.length === 0 ? (
            <View style={styles.predictionRow}>
              <Text style={styles.predictionQuestion}>Tahminler yükleniyor...</Text>
            </View>
          ) : (
            predictions.slice(0, 3).map((prediction) => (
              <View key={prediction.id} style={styles.predictionRow}>
                <View style={styles.predictionLeft}>
                  <Text style={styles.predictionQuestion} numberOfLines={1}>
                    {prediction.question}
                  </Text>
                  <View style={styles.predictionMeta}>
                    <View style={[
                      styles.choiceBadge,
                      prediction.choice === 'yes' ? styles.yesBadge : styles.noBadge
                    ]}>
                      <Text style={[
                        styles.choiceBadgeText,
                        prediction.choice === 'yes' ? styles.yesBadgeText : styles.noBadgeText
                      ]}>
                        {prediction.choice === 'yes' ? 'EVET' : 'HAYIR'}
                      </Text>
                    </View>
                    <Text style={styles.categoryText}>{prediction.category}</Text>
                    {prediction.result && prediction.result !== 'pending' && (
                      <View style={[
                        styles.resultIndicator,
                        prediction.result === 'won' && styles.resultWon,
                        prediction.result === 'lost' && styles.resultLost,
                        prediction.result === 'cancelled' && styles.resultCancelled,
                      ]}>
                        <Text style={styles.resultIndicatorText}>
                          {prediction.result === 'won' ? '✓' : prediction.result === 'lost' ? '✗' : '−'}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
                <Text style={styles.oddsText}>{prediction.odds}x</Text>
              </View>
            ))
          )}

          {predictions.length > 3 && (
            <View style={styles.morePredictions}>
              <Text style={styles.morePredictionsText}>
                +{predictions.length - 3} tahmin daha
              </Text>
            </View>
          )}
        </View>

        {/* Footer - Claim edilebilir kuponlar için özel tasarım */}
        {canClaim ? (
          <ClaimGlowButton onPress={handleClaim} amount={coupon.potentialEarnings} />
        ) : isClaimed ? (
          <ClaimedBadge amount={coupon.potentialEarnings} />
        ) : (
          <View style={styles.footer}>
            <View style={styles.footerLeft}>
              <Text style={styles.footerLabel}>Potansiyel Kazanç</Text>
              <Text style={styles.footerValue}>{coupon.potentialEarnings.toLocaleString()} kredi</Text>
            </View>
            <View style={styles.footerRight}>
              <Text style={styles.footerLabel}>Toplam Oran</Text>
              <Text style={styles.totalOdds}>{coupon.totalOdds.toFixed(2)}x</Text>
            </View>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  cardGlow: {
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  gradient: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F0F6FC',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  predictionsContainer: {
    marginBottom: 16,
  },
  predictionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(13, 17, 23, 0.5)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#30363D',
  },
  predictionLeft: {
    flex: 1,
  },
  predictionQuestion: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F0F6FC',
    marginBottom: 6,
  },
  predictionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  choiceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  yesBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  noBadge: {
    backgroundColor: 'rgba(220, 38, 38, 0.2)',
  },
  choiceBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  yesBadgeText: {
    color: '#10B981',
  },
  noBadgeText: {
    color: '#DC2626',
  },
  categoryText: {
    fontSize: 10,
    color: '#8B949E',
  },
  resultIndicator: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultWon: {
    backgroundColor: 'rgba(16, 185, 129, 0.3)',
  },
  resultLost: {
    backgroundColor: 'rgba(220, 38, 38, 0.3)',
  },
  resultCancelled: {
    backgroundColor: 'rgba(107, 114, 128, 0.3)',
  },
  resultIndicatorText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#F0F6FC',
  },
  oddsText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#10B981',
  },
  morePredictions: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  morePredictionsText: {
    fontSize: 12,
    color: '#8B949E',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#30363D',
  },
  footerLeft: {
    flex: 1,
  },
  footerRight: {
    alignItems: 'flex-end',
  },
  footerLabel: {
    fontSize: 12,
    color: '#8B949E',
    marginBottom: 4,
  },
  footerValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F0F6FC',
  },
  totalOdds: {
    fontSize: 20,
    fontWeight: '900',
    color: '#10B981',
  },
  // Claim Button Styles
  claimGlow: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    backgroundColor: '#10B981',
    borderRadius: 20,
  },
  claimButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    gap: 12,
  },
  claimTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  claimButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  claimAmountText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },
  // Claimed Badge Styles
  claimedContainer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#1A3D29',
  },
  claimedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  claimedText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  claimedAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#059669',
  },
});
