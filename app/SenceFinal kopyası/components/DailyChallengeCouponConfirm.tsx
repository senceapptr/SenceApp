import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar, TextInput, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  withSequence,
  withRepeat
} from 'react-native-reanimated';

interface DailyChallengeCouponConfirmProps {
  selections: any[];
  triviaMultiplier: number;
  onConfirm: (stake: number) => void;
  onBack: () => void;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export function DailyChallengeCouponConfirm({ 
  selections, 
  triviaMultiplier, 
  onConfirm, 
  onBack 
}: DailyChallengeCouponConfirmProps) {
  const [stake, setStake] = useState(50);
  const [isEditingStake, setIsEditingStake] = useState(false);

  const bannerScale = useSharedValue(1);
  const buttonScale = useSharedValue(1);

  React.useEffect(() => {
    bannerScale.value = withSequence(
      withTiming(1.02, { duration: 200 }),
      withTiming(1, { duration: 200 })
    );
  }, []);

  const totalOdds = selections.reduce((acc, selection) => acc * selection.odds, 1);
  const baseWinnings = totalOdds * stake;
  const multipliedWinnings = baseWinnings * triviaMultiplier;

  const handleStakeChange = (value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      setStake(numValue);
    }
    setIsEditingStake(false);
  };

  const handleConfirm = () => {
    buttonScale.value = withSequence(
      withSpring(0.95, { duration: 100 }),
      withSpring(1, { duration: 100 })
    );
    setTimeout(() => {
      onConfirm(stake);
    }, 200);
  };

  const bannerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bannerScale.value }],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F2F3F5" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={onBack}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>‹</Text>
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Challenge Kuponu</Text>
            <Text style={styles.headerSubtitle}>
              {triviaMultiplier}x Trivia Çarpanı
            </Text>
          </View>

          <View style={styles.spacer} />
        </View>

        {/* Trivia Bonus Banner */}
        <View style={styles.bannerContainer}>
          <Animated.View style={[bannerAnimatedStyle]}>
            <LinearGradient
              colors={['#C9F158', '#B29EFD']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.banner}
            >
              <View style={styles.bannerContent}>
                <View style={styles.bannerLeft}>
                  <View style={styles.bannerIcon}>
                    <Text style={styles.bannerIconText}>🧠</Text>
                  </View>
                  <View>
                    <Text style={styles.bannerTitle}>Trivia Bonusu Aktif!</Text>
                    <Text style={styles.bannerDescription}>Ödüllerin {triviaMultiplier}x ile çarpılacak</Text>
                  </View>
                </View>
                <Text style={styles.bannerMultiplier}>{triviaMultiplier}x</Text>
              </View>
            </LinearGradient>
          </Animated.View>
        </View>

        {/* Selected Predictions */}
        <View style={styles.selectionsContainer}>
          <Text style={styles.sectionTitle}>Seçilen Tahminler</Text>
          <View style={styles.selectionsList}>
            {selections.map((selection, index) => (
              <Animated.View
                key={selection.id}
                style={[
                  styles.selectionItem,
                  {
                    transform: [
                      { 
                        translateX: withTiming(0, { 
                          duration: 300, 
                          delay: index * 100 
                        }) 
                      }
                    ],
                    opacity: withTiming(1, { 
                      duration: 300, 
                      delay: index * 100 
                    })
                  }
                ]}
              >
                <Image
                  source={{ uri: selection.image }}
                  style={styles.selectionImage}
                />
                <View style={styles.selectionContent}>
                  <Text style={styles.selectionTitle} numberOfLines={2}>
                    {selection.title}
                  </Text>
                  <View style={styles.selectionMeta}>
                    <View style={[
                      styles.voteBadge,
                      selection.vote === 'yes' ? styles.yesBadge : styles.noBadge
                    ]}>
                      <Text style={styles.voteBadgeText}>
                        {selection.vote === 'yes' ? 'EVET' : 'HAYIR'}
                      </Text>
                    </View>
                    <Text style={styles.oddsText}>{selection.odds}x</Text>
                  </View>
                </View>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Betting Section */}
        <View style={styles.bettingContainer}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Bahis Detayları</Text>
            
            <View style={styles.bettingDetails}>
              {/* Stake Input */}
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Bahis Tutarı</Text>
                {isEditingStake ? (
                  <TextInput
                    defaultValue={stake.toString()}
                    onBlur={(e) => handleStakeChange(e.nativeEvent.text)}
                    onSubmitEditing={(e) => handleStakeChange(e.nativeEvent.text)}
                    style={styles.stakeInput}
                    keyboardType="numeric"
                    autoFocus
                    selectTextOnFocus
                  />
                ) : (
                  <TouchableOpacity
                    onPress={() => setIsEditingStake(true)}
                    style={styles.stakeButton}
                  >
                    <Text style={styles.stakeButtonText}>{stake} kredi</Text>
                    <Text style={styles.editIcon}>✎</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Base Odds */}
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Toplam Oran</Text>
                <Text style={styles.detailValue}>{totalOdds.toFixed(2)}x</Text>
              </View>

              {/* Base Winnings */}
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Temel Kazanç</Text>
                <Text style={styles.baseWinnings}>{Math.round(baseWinnings)} kredi</Text>
              </View>

              {/* Trivia Multiplier */}
              <LinearGradient
                colors={['rgba(201, 241, 88, 0.2)', 'rgba(178, 158, 253, 0.2)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.multiplierRow}
              >
                <View style={styles.multiplierContent}>
                  <Text style={styles.multiplierLabel}>
                    🧠 Trivia Çarpanı
                  </Text>
                  <Text style={styles.multiplierValue}>{triviaMultiplier}x</Text>
                </View>
              </LinearGradient>

              {/* Final Winnings */}
              <View style={styles.finalRow}>
                <Text style={styles.finalLabel}>Toplam Potansiyel Kazanç</Text>
                <Text style={styles.finalValue}>
                  {Math.round(multipliedWinnings)} kredi
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Confirm Button */}
        <View style={styles.confirmContainer}>
          <AnimatedTouchableOpacity
            onPress={handleConfirm}
            style={[styles.confirmButton, buttonAnimatedStyle]}
          >
            <LinearGradient
              colors={['#432870', '#5A3A8B', '#B29EFD']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.confirmButtonGradient}
            >
              {/* Animated Background */}
              <View style={styles.confirmButtonContent}>
                <Text style={styles.confirmButtonIcon}>🚀</Text>
                <Text style={styles.confirmButtonText}>Challenge Kuponu Oluştur</Text>
                <View style={styles.confirmButtonBadge}>
                  <Text style={styles.confirmButtonBadgeText}>{triviaMultiplier}x</Text>
                </View>
              </View>
            </LinearGradient>
          </AnimatedTouchableOpacity>

          {/* Info Text */}
          <Text style={styles.infoText}>
            Sonuçlar 1-2 gün içinde açıklanacak. Trivia çarpanın sayesinde daha fazla ödül kazanabilirsin! 🎯
          </Text>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F3F5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  backButtonText: {
    fontSize: 20,
    color: '#432870',
    fontWeight: 'bold',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#202020',
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#432870',
    marginTop: 4,
  },
  spacer: {
    width: 40,
  },
  bannerContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  banner: {
    borderRadius: 16,
    padding: 16,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bannerIcon: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  bannerIconText: {
    fontSize: 24,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#432870',
  },
  bannerDescription: {
    fontSize: 14,
    color: 'rgba(67, 40, 112, 0.8)',
  },
  bannerMultiplier: {
    fontSize: 24,
    fontWeight: '900',
    color: '#432870',
  },
  selectionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#202020',
    marginBottom: 16,
  },
  selectionsList: {
    gap: 12,
  },
  selectionItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    shadowColor: '#432870',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(67, 40, 112, 0.1)',
  },
  selectionImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
    marginRight: 12,
  },
  selectionContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  selectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#202020',
    lineHeight: 18,
    marginBottom: 8,
  },
  selectionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  voteBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  yesBadge: {
    backgroundColor: '#34C759',
  },
  noBadge: {
    backgroundColor: '#FF3B30',
  },
  voteBadgeText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  oddsText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#432870',
  },
  bettingContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#432870',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(67, 40, 112, 0.1)',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#202020',
    marginBottom: 20,
  },
  bettingDetails: {
    gap: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#202020',
  },
  detailValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#432870',
  },
  baseWinnings: {
    fontSize: 18,
    fontWeight: '700',
    color: 'rgba(32, 32, 32, 0.7)',
  },
  stakeInput: {
    width: 120,
    textAlign: 'right',
    fontSize: 18,
    fontWeight: '900',
    color: '#432870',
    backgroundColor: '#F2F3F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: '#432870',
  },
  stakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F3F5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#432870',
    borderStyle: 'dashed',
    gap: 8,
  },
  stakeButtonText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#432870',
  },
  editIcon: {
    fontSize: 16,
    color: '#432870',
  },
  multiplierRow: {
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  multiplierContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  multiplierLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#432870',
  },
  multiplierValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#432870',
  },
  finalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F2F3F5',
  },
  finalLabel: {
    fontSize: 18,
    fontWeight: '900',
    color: '#202020',
  },
  finalValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#432870',
  },
  confirmContainer: {
    paddingHorizontal: 20,
  },
  confirmButton: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#432870',
    shadowOffset: {
      width: 0,
      height: 25,
    },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 25,
    marginBottom: 16,
  },
  confirmButtonGradient: {
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  confirmButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  confirmButtonIcon: {
    fontSize: 24,
  },
  confirmButtonText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  confirmButtonBadge: {
    backgroundColor: '#C9F158',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  confirmButtonBadgeText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#432870',
  },
  infoText: {
    fontSize: 14,
    color: 'rgba(32, 32, 32, 0.6)',
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 32,
  },
});


