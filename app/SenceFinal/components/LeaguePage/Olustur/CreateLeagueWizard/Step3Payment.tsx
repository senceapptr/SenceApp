import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface Step3PaymentProps {
  currentUserCredits: number;
  currentUserTickets: number;
  joinCost: number;
  onCreditPayment: () => void;
  onTicketPayment: () => void;
}

export function Step3Payment({
  currentUserCredits,
  currentUserTickets,
  joinCost,
  onCreditPayment,
  onTicketPayment,
}: Step3PaymentProps) {
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const creditScaleAnim = useRef(new Animated.Value(0)).current;
  const ticketScaleAnim = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Stagger card animations
    Animated.stagger(150, [
      Animated.spring(creditScaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.spring(ticketScaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();

    // Shimmer animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const hasEnoughCredits = currentUserCredits >= joinCost;
  const hasTickets = currentUserTickets > 0;

  return (
    <Animated.ScrollView
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Info */}
      <View style={styles.headerInfo}>
        <View style={styles.infoIconContainer}>
          <Ionicons name="wallet" size={32} color="#432870" />
        </View>
        <Text style={styles.headerTitle}>Ödeme Yöntemi Seç</Text>
        <Text style={styles.headerSubtitle}>
          Ligini oluşturmak için kredi veya bilet kullanabilirsin
        </Text>
      </View>

      {/* Payment Options */}
      <View style={styles.paymentOptions}>
        {/* Credit Payment Option */}
        <Animated.View
          style={[
            styles.paymentCardWrapper,
            {
              transform: [{ scale: creditScaleAnim }],
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.paymentCard,
              !hasEnoughCredits && styles.paymentCardDisabled,
            ]}
            onPress={onCreditPayment}
            disabled={!hasEnoughCredits}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={hasEnoughCredits ? ['#10B981', '#059669'] : ['#E5E7EB', '#D1D5DB']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.paymentCardGradient}
            >
              {/* Badge */}
              {hasEnoughCredits && (
                <View style={styles.recommendedBadge}>
                  <Ionicons name="star" size={12} color="#FBBF24" />
                  <Text style={styles.recommendedText}>Önerilen</Text>
                </View>
              )}

              {/* Icon */}
              <View style={styles.paymentIconContainer}>
                <Ionicons
                  name="diamond"
                  size={48}
                  color={hasEnoughCredits ? '#FFFFFF' : '#9CA3AF'}
                />
              </View>

              {/* Title */}
              <Text style={[
                styles.paymentTitle,
                !hasEnoughCredits && styles.paymentTitleDisabled,
              ]}>
                Kredi ile Oluştur
              </Text>

              {/* Current Balance */}
              <View style={styles.balanceContainer}>
                <Text style={[
                  styles.balanceLabel,
                  !hasEnoughCredits && styles.balanceLabelDisabled,
                ]}>
                  Mevcut Kredi
                </Text>
                <Text style={[
                  styles.balanceValue,
                  !hasEnoughCredits && styles.balanceValueDisabled,
                ]}>
                  {currentUserCredits.toLocaleString('tr-TR')}
                </Text>
              </View>

              {/* Cost Info */}
              <View style={styles.costInfoContainer}>
                <View style={styles.costRow}>
                  <Text style={[
                    styles.costLabel,
                    !hasEnoughCredits && styles.costLabelDisabled,
                  ]}>
                    Oluşturma Ücreti
                  </Text>
                  <Text style={[
                    styles.costValue,
                    !hasEnoughCredits && styles.costValueDisabled,
                  ]}>
                    {joinCost > 0 ? joinCost.toLocaleString('tr-TR') : 'Ücretsiz'}
                  </Text>
                </View>
              </View>

              {/* Status */}
              {hasEnoughCredits ? (
                <View style={styles.statusContainer}>
                  <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                  <Text style={styles.statusText}>Kredi kullanıma hazır</Text>
                </View>
              ) : (
                <View style={[styles.statusContainer, styles.statusContainerWarning]}>
                  <Ionicons name="alert-circle" size={20} color="#EF4444" />
                  <Text style={styles.statusTextWarning}>Yetersiz kredi</Text>
                </View>
              )}

              {/* Shimmer Effect */}
              {hasEnoughCredits && (
                <Animated.View
                  style={[
                    styles.shimmer,
                    {
                      opacity: shimmerAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 0.3],
                      }),
                      transform: [
                        {
                          translateX: shimmerAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-300, 300],
                          }),
                        },
                      ],
                    },
                  ]}
                />
              )}
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Ticket Payment Option */}
        <Animated.View
          style={[
            styles.paymentCardWrapper,
            {
              transform: [{ scale: ticketScaleAnim }],
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.paymentCard,
              !hasTickets && styles.paymentCardDisabled,
            ]}
            onPress={onTicketPayment}
            disabled={!hasTickets}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={hasTickets ? ['#8B5CF6', '#7C3AED'] : ['#E5E7EB', '#D1D5DB']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.paymentCardGradient}
            >
              {/* Badge */}
              {hasTickets && (
                <View style={[styles.recommendedBadge, { backgroundColor: 'rgba(251, 191, 36, 0.2)' }]}>
                  <Ionicons name="ticket" size={12} color="#FBBF24" />
                  <Text style={styles.recommendedText}>Özel</Text>
                </View>
              )}

              {/* Icon */}
              <View style={styles.paymentIconContainer}>
                <Ionicons
                  name="ticket"
                  size={48}
                  color={hasTickets ? '#FFFFFF' : '#9CA3AF'}
                />
              </View>

              {/* Title */}
              <Text style={[
                styles.paymentTitle,
                !hasTickets && styles.paymentTitleDisabled,
              ]}>
                Bilet ile Oluştur
              </Text>

              {/* Current Balance */}
              <View style={styles.balanceContainer}>
                <Text style={[
                  styles.balanceLabel,
                  !hasTickets && styles.balanceLabelDisabled,
                ]}>
                  Mevcut Bilet
                </Text>
                <Text style={[
                  styles.balanceValue,
                  !hasTickets && styles.balanceValueDisabled,
                ]}>
                  {currentUserTickets}
                </Text>
              </View>

              {/* Cost Info */}
              <View style={styles.costInfoContainer}>
                <View style={styles.costRow}>
                  <Text style={[
                    styles.costLabel,
                    !hasTickets && styles.costLabelDisabled,
                  ]}>
                    Gerekli Bilet
                  </Text>
                  <Text style={[
                    styles.costValue,
                    !hasTickets && styles.costValueDisabled,
                  ]}>
                    1 Bilet
                  </Text>
                </View>
              </View>

              {/* Status */}
              {hasTickets ? (
                <View style={styles.statusContainer}>
                  <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                  <Text style={styles.statusText}>Bilet kullanıma hazır</Text>
                </View>
              ) : (
                <View style={[styles.statusContainer, styles.statusContainerWarning]}>
                  <Ionicons name="alert-circle" size={20} color="#EF4444" />
                  <Text style={styles.statusTextWarning}>Bilet satın alın</Text>
                </View>
              )}

              {/* Shimmer Effect */}
              {hasTickets && (
                <Animated.View
                  style={[
                    styles.shimmer,
                    {
                      opacity: shimmerAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 0.3],
                      }),
                      transform: [
                        {
                          translateX: shimmerAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-300, 300],
                          }),
                        },
                      ],
                    },
                  ]}
                />
              )}
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Info Cards */}
      <View style={styles.infoCards}>
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={20} color="#8B5CF6" />
          <Text style={styles.infoCardText}>
            Kredi ile oluşturduğun liglerde katılım ücreti tahsil edilir
          </Text>
        </View>
        <View style={styles.infoCard}>
          <Ionicons name="gift" size={20} color="#10B981" />
          <Text style={styles.infoCardText}>
            Bilet ile oluşturulan ligler tamamen ücretsizdir
          </Text>
        </View>
      </View>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  headerInfo: {
    alignItems: 'center',
    marginBottom: 32,
  },
  infoIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3E8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  paymentOptions: {
    gap: 16,
    marginBottom: 24,
  },
  paymentCardWrapper: {
    overflow: 'visible',
  },
  paymentCard: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  paymentCardDisabled: {
    opacity: 0.7,
  },
  paymentCardGradient: {
    padding: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  recommendedBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(251, 191, 36, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    zIndex: 2,
  },
  recommendedText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FBBF24',
  },
  paymentIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  paymentTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  paymentTitleDisabled: {
    color: '#9CA3AF',
  },
  balanceContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  balanceLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
    textAlign: 'center',
  },
  balanceLabelDisabled: {
    color: '#9CA3AF',
  },
  balanceValue: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  balanceValueDisabled: {
    color: '#6B7280',
  },
  costInfoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  costLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  costLabelDisabled: {
    color: '#9CA3AF',
  },
  costValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  costValueDisabled: {
    color: '#6B7280',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  statusContainerWarning: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statusTextWarning: {
    fontSize: 13,
    fontWeight: '700',
    color: '#EF4444',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
  },
  infoCards: {
    gap: 12,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  infoCardText: {
    flex: 1,
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
});

