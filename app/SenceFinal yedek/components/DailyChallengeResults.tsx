import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  withSequence,
  withDelay
} from 'react-native-reanimated';

interface DailyChallengeResultsProps {
  results: {
    selections: any[];
    triviaScore: number;
    triviaMultiplier: number;
    stake: number;
    finalWinnings: number;
    correctPredictions: number;
    totalPredictions: number;
    completedDate: string;
  };
  onClose: () => void;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export function DailyChallengeResults({ results, onClose }: DailyChallengeResultsProps) {
  const winRate = Math.round((results.correctPredictions / results.totalPredictions) * 100);
  const isWinner = results.finalWinnings > results.stake;
  const profit = results.finalWinnings - results.stake;

  // Animation values
  const resultIconScale = useSharedValue(0);
  const resultIconRotation = useSharedValue(-180);
  const contentOpacity = useSharedValue(0);
  const contentY = useSharedValue(20);
  const progressWidth = useSharedValue(0);

  React.useEffect(() => {
    // Animate result icon
    resultIconScale.value = withDelay(200, withSpring(1, { damping: 15, stiffness: 200 }));
    resultIconRotation.value = withDelay(200, withTiming(0, { duration: 300 }));

    // Animate content
    contentOpacity.value = withDelay(400, withTiming(1, { duration: 300 }));
    contentY.value = withDelay(400, withTiming(0, { duration: 300 }));

    // Animate progress
    setTimeout(() => {
      progressWidth.value = withTiming((results.triviaScore / 20) * 100, { duration: 1000 });
    }, 1000);
  }, []);

  const resultIconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: resultIconScale.value },
      { rotate: `${resultIconRotation.value}deg` }
    ],
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentY.value }],
  }));

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#432870" />
      
      <LinearGradient
        colors={['#432870', '#5A3A8B', '#B29EFD']}
        style={styles.gradient}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={onClose}
              style={styles.backButton}
            >
              <Text style={styles.backButtonText}>‹</Text>
            </TouchableOpacity>
            
            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>Challenge Sonuçları</Text>
              <Text style={styles.headerDate}>
                {new Date(results.completedDate).toLocaleDateString('tr-TR')}
              </Text>
            </View>

            <View style={styles.spacer} />
          </View>

          {/* Main Result Card */}
          <View style={styles.resultCardContainer}>
            <View style={styles.resultCard}>
              {/* Result Icon */}
              <Animated.View style={[styles.resultIconContainer, resultIconAnimatedStyle]}>
                <LinearGradient
                  colors={
                    isWinner 
                      ? ['#34C759', '#28A745'] 
                      : ['#FF3B30', '#DC3545']
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.resultIconGradient}
                >
                  <Text style={styles.resultIcon}>
                    {isWinner ? '🎉' : '😔'}
                  </Text>
                </LinearGradient>
              </Animated.View>

              <Animated.View style={contentAnimatedStyle}>
                <Text style={[
                  styles.resultTitle,
                  { color: isWinner ? '#34C759' : '#FF3B30' }
                ]}>
                  {isWinner ? 'Tebrikler!' : 'Bu Sefer Olmadı'}
                </Text>

                <Text style={styles.resultDescription}>
                  {results.correctPredictions}/{results.totalPredictions} doğru tahmin
                </Text>

                {/* Winnings */}
                <LinearGradient
                  colors={
                    isWinner 
                      ? ['rgba(52, 199, 89, 0.2)', 'rgba(40, 167, 69, 0.2)']
                      : ['rgba(255, 59, 48, 0.2)', 'rgba(220, 53, 69, 0.2)']
                  }
                  style={styles.winningsContainer}
                >
                  <Text style={styles.winningsLabel}>
                    {isWinner ? 'Toplam Kazanç' : 'Toplam Kayıp'}
                  </Text>
                  <Text style={[
                    styles.winningsAmount,
                    { color: isWinner ? '#34C759' : '#FF3B30' }
                  ]}>
                    {isWinner ? '+' : ''}{profit} kredi
                  </Text>
                  {isWinner && (
                    <Text style={styles.winningsBonus}>
                      Trivia bonusu ile {results.triviaMultiplier}x çarpıldı!
                    </Text>
                  )}
                </LinearGradient>

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{winRate}%</Text>
                    <Text style={styles.statLabel}>Başarı Oranı</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{results.triviaMultiplier}x</Text>
                    <Text style={styles.statLabel}>Trivia Çarpanı</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{results.stake}</Text>
                    <Text style={styles.statLabel}>Bahis Tutarı</Text>
                  </View>
                </View>
              </Animated.View>
            </View>
          </View>

          {/* Trivia Performance */}
          <View style={styles.sectionContainer}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionIcon}>🧠</Text>
                <Text style={styles.sectionTitle}>Trivia Performansı</Text>
              </View>
              
              <View style={styles.triviaStats}>
                <View style={styles.triviaRow}>
                  <Text style={styles.triviaLabel}>Doğru Cevaplar</Text>
                  <Text style={styles.triviaValue}>{results.triviaScore}/20</Text>
                </View>
                
                <View style={styles.progressContainer}>
                  <View style={styles.progressBackground}>
                    <Animated.View style={[styles.progressFill, progressAnimatedStyle]} />
                  </View>
                </View>

                <Text style={styles.triviaDescription}>
                  Bu performans ile {results.triviaMultiplier}x çarpan kazandın!
                </Text>
              </View>
            </View>
          </View>

          {/* Predictions Results */}
          <View style={styles.sectionContainer}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionIcon}>🎯</Text>
                <Text style={styles.sectionTitle}>Tahmin Detayları</Text>
              </View>
              
              <View style={styles.predictionsList}>
                {results.selections.map((selection, index) => {
                  const isCorrect = Math.random() > 0.4; // Mock result for demo
                  return (
                    <Animated.View
                      key={selection.id}
                      style={[
                        styles.predictionItem,
                        {
                          opacity: withDelay(1100 + index * 100, withTiming(1, { duration: 300 })),
                          transform: [
                            { 
                              translateX: withDelay(1100 + index * 100, withTiming(0, { duration: 300 }))
                            }
                          ]
                        }
                      ]}
                    >
                      <View style={[
                        styles.resultIndicator,
                        { backgroundColor: isCorrect ? '#34C759' : '#FF3B30' }
                      ]}>
                        <Text style={styles.resultIndicatorText}>
                          {isCorrect ? '✓' : '✗'}
                        </Text>
                      </View>
                      
                      <View style={styles.predictionContent}>
                        <Text style={styles.predictionTitle} numberOfLines={1}>
                          {selection.title}
                        </Text>
                        <View style={styles.predictionMeta}>
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
                      
                      <Text style={[
                        styles.predictionResult,
                        { color: isCorrect ? '#34C759' : '#FF3B30' }
                      ]}>
                        {isCorrect ? 'Doğru' : 'Yanlış'}
                      </Text>
                    </Animated.View>
                  );
                })}
              </View>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actionsContainer}>
            <AnimatedTouchableOpacity
              onPress={onClose}
              style={styles.primaryAction}
            >
              <LinearGradient
                colors={['#C9F158', '#B29EFD']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.primaryActionGradient}
              >
                <Text style={styles.primaryActionText}>Ana Sayfaya Dön</Text>
              </LinearGradient>
            </AnimatedTouchableOpacity>

            {isWinner && (
              <TouchableOpacity style={styles.secondaryAction}>
                <Text style={styles.secondaryActionText}>Sonucu Paylaş 🎉</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
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
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  headerDate: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  spacer: {
    width: 40,
  },
  resultCardContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 20,
  },
  resultIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  resultIconGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultIcon: {
    fontSize: 40,
    color: '#FFFFFF',
  },
  resultTitle: {
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 8,
  },
  resultDescription: {
    fontSize: 18,
    color: 'rgba(32, 32, 32, 0.7)',
    textAlign: 'center',
    marginBottom: 24,
  },
  winningsContainer: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: 'rgba(52, 199, 89, 0.3)',
  },
  winningsLabel: {
    fontSize: 14,
    color: 'rgba(32, 32, 32, 0.6)',
    marginBottom: 4,
  },
  winningsAmount: {
    fontSize: 32,
    fontWeight: '900',
  },
  winningsBonus: {
    fontSize: 14,
    color: 'rgba(52, 199, 89, 0.7)',
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#432870',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(32, 32, 32, 0.6)',
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  section: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  triviaStats: {
    gap: 12,
  },
  triviaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  triviaLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  triviaValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#C9F158',
  },
  progressContainer: {
    marginVertical: 8,
  },
  progressBackground: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#C9F158',
    borderRadius: 4,
  },
  triviaDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
  predictionsList: {
    gap: 12,
  },
  predictionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },
  resultIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultIndicatorText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  predictionContent: {
    flex: 1,
  },
  predictionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  predictionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  voteBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
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
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  predictionResult: {
    fontSize: 14,
    fontWeight: '700',
  },
  actionsContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  primaryAction: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  primaryActionGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryActionText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#432870',
  },
  secondaryAction: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  secondaryActionText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bottomSpacing: {
    height: 32,
  },
});


