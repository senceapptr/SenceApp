import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
  Animated,
  Alert,
  Easing,
  PanResponder,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { couponsService } from '@/services/coupons.service';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface CouponDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selections: any[];
  onRemoveSelection: (id: number) => void;
  onClearAll: () => void;
  onCouponSuccess?: () => void;
  isFree?: boolean;
  userCredits?: number;
  onCouponCreated?: () => void; // Yeni ticket oluşturulduğunda çağrılacak callback
}

export function CouponDrawer({ 
  isOpen, 
  onClose, 
  selections, 
  onRemoveSelection, 
  onClearAll,
  onCouponSuccess,
  isFree = false,
  userCredits = 0,
  onCouponCreated
}: CouponDrawerProps) {
  const { refreshProfile } = useAuth();
  const { theme, isDarkMode } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [betAmount, setBetAmount] = useState(10);
  const [showLeagueWarning, setShowLeagueWarning] = useState<number | null>(null);
  const [showBetModal, setShowBetModal] = useState(false);
  const [betInputValue, setBetInputValue] = useState('10');
  const [isClosing, setIsClosing] = useState(false);
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const contentScale = useRef(new Animated.Value(0.95)).current;
  const panY = useRef(new Animated.Value(0)).current;
  const closeButtonScale = useRef(new Animated.Value(1)).current;
  const headerIconRotate = useRef(new Animated.Value(0)).current;

  const totalOdds = selections.reduce((acc, selection) => acc * selection.odds, 1);
  const potentialWin = totalOdds * betAmount;

  // Header icon subtle rotation animation
  useEffect(() => {
    if (isOpen && selections.length > 0) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(headerIconRotate, {
            toValue: 1,
            duration: 2000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(headerIconRotate, {
            toValue: 0,
            duration: 2000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isOpen, selections.length]);

  // Mock function to check if question affects league
  const affectsLeague = (questionId: number) => {
    // Some questions affect league (for demo purposes)
    return [1, 2, 6, 9, 11].includes(questionId);
  };

  const runCloseAnimationThenClose = () => {
    setIsClosing(true);
    contentScale.setValue(1);
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: SCREEN_HEIGHT,
        useNativeDriver: false,
        tension: 200,
        friction: 3,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 100,
        useNativeDriver: false,
        easing: Easing.in(Easing.cubic),
      }),
    ]).start(() => onClose());
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 5,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) panY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        const { dy, vy } = g;
        if (dy > 100 || vy > 0.5) {
          setIsClosing(true);
          slideAnim.setValue(dy);
          panY.setValue(0);
          Animated.parallel([
            Animated.spring(slideAnim, {
              toValue: SCREEN_HEIGHT,
              useNativeDriver: false,
              tension: 60,
              friction: 8,
              velocity: vy * 50,
            }),
            Animated.timing(backdropOpacity, {
              toValue: 0,
              duration: 300,
              useNativeDriver: false,
              easing: Easing.in(Easing.cubic),
            }),
          ]).start(() => onClose());
        } else {
          panY.setValue(0);
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: false,
            tension: 80,
            friction: 6,
          }).start();
        }
      },
    })
  ).current;

  useLayoutEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      slideAnim.setValue(SCREEN_HEIGHT);
      contentScale.setValue(1);
      backdropOpacity.setValue(0);
      panY.setValue(0);
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: false,
          tension: 65,
          friction: 8,
          restDisplacementThreshold: 0.01,
          restSpeedThreshold: 0.01,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: false,
          easing: Easing.out(Easing.cubic),
        }),
      ]).start();
    } else {
      contentScale.setValue(1);
      slideAnim.setValue(SCREEN_HEIGHT);
      backdropOpacity.setValue(0);
    }
  }, [isOpen, slideAnim, contentScale, backdropOpacity]);



  const handleSubmit = async () => {
    if (selections.length === 0) return;
    
    setIsSubmitting(true);
    
    try {
      // Backend'e ticket gönder
      const couponData = {
        selections: selections.map(selection => ({
          question_id: selection.questionId.toString(),
          vote: selection.vote,
          odds: selection.odds,
          is_boosted: selection.boosted || false
        })),
        stake_amount: betAmount
      };

      const result = await couponsService.createCoupon(couponData);
      
      if (result.error) {
        throw result.error;
      }

      // Başarılı ticket oluşturma
      setIsSubmitting(false);
      onClearAll();
      onClose();
      
      // Profil verilerini yenile (kredi güncellemesi için)
      await refreshProfile();
      
      // Ticketlarım sayfasını yenile
      if (onCouponCreated) {
        onCouponCreated();
      }
      
      // Trigger confetti animation
      if (onCouponSuccess) {
        setTimeout(() => {
          onCouponSuccess();
        }, 300); // Small delay to let drawer close smoothly
      }

      // Başarı mesajı
      Alert.alert(
        'Ticket Oluşturuldu! 🎉',
        `Ticketınız başarıyla oluşturuldu. Potansiyel kazancınız: ${Math.round(totalOdds * betAmount)} kredi`,
        [{ text: 'Tamam', style: 'default' }]
      );
      
    } catch (error) {
      setIsSubmitting(false);
      
      console.error('Coupon creation error:', error);
      
      Alert.alert(
        'Hata',
        'Ticket oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.',
        [{ text: 'Tamam', style: 'default' }]
      );
    }
  };

  const handleBackdropPress = () => {
    runCloseAnimationThenClose();
  };

  if (!isOpen) return null;

  return (
    <View
      style={[StyleSheet.absoluteFillObject, styles.overlayRoot]}
      pointerEvents={isClosing ? 'none' : 'box-none'}
      collapsable={false}
    >
      <View style={styles.container} collapsable={false}>
        {/* Backdrop */}
        <Animated.View 
          style={[
            styles.backdrop,
            { opacity: backdropOpacity }
          ]}
        >
          <TouchableOpacity 
            style={styles.backdropTouchable}
            onPress={handleBackdropPress}
            activeOpacity={1}
          />
        </Animated.View>
        
        {/* Drawer - PanResponder ile (dokunma bloklanmaz) */}
        <Animated.View
          style={[
            styles.drawer,
            {
              backgroundColor: isDarkMode ? theme.surfaceModal : '#161B22',
              transform: [
                { translateY: Animated.add(slideAnim, panY) },
                { scale: contentScale }
              ],
            },
          ]}
        >
          {/* Handle - sürükleyerek kapatma */}
          <View
            style={[styles.handleContainer, { backgroundColor: isDarkMode ? theme.surfaceCard : '#21262D' }]}
            {...panResponder.panHandlers}
          >
            <View
              style={[
                styles.handle,
                { backgroundColor: theme.accent },
              ]} 
            />
          </View>

          {/* Header - Ana temaya uyumlu koyu */}
          <View style={styles.header}>
            <View style={[styles.headerGradient, { backgroundColor: isDarkMode ? theme.surfaceCard : '#21262D' }]}>
              <View style={styles.headerContent}>
                <View style={styles.headerLeft}>
                  <Animated.View
                    style={{
                      transform: [{
                        rotate: headerIconRotate.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['-3deg', '3deg'],
                        })
                      }]
                    }}
                  >
                    <View style={[styles.headerIcon, { backgroundColor: '#21262D' }]}>
                      <Ionicons name="ticket" size={20} color="#10B981" />
                    </View>
                  </Animated.View>
                  <View style={styles.headerText}>
                    <Text style={[styles.headerTitle, { color: '#F0F6FC' }]}>Ticketım</Text>
                    <View style={styles.headerSubtitle}>
                      <Text style={[styles.headerSubtitleText, { color: '#8B949E' }]}>
                        {selections.length}/5 tahmin
                      </Text>
                      {selections.length > 0 && (
                        <>
                          <View style={[styles.headerDot, { backgroundColor: '#8B949E' }]} />
                          <Text style={[styles.headerOdds, { color: '#8B949E' }]}>
                            {totalOdds.toFixed(2)}x oran
                          </Text>
                        </>
                      )}
                    </View>
                  </View>
                </View>
                
                <TouchableOpacity
                  onPress={runCloseAnimationThenClose}
                  onPressIn={() => {
                    Animated.spring(closeButtonScale, {
                      toValue: 0.9,
                      useNativeDriver: true,
                      tension: 300,
                      friction: 10,
                    }).start();
                  }}
                  onPressOut={() => {
                    Animated.spring(closeButtonScale, {
                      toValue: 1,
                      useNativeDriver: true,
                      tension: 300,
                      friction: 10,
                    }).start();
                  }}
                  activeOpacity={1}
                >
                  <Animated.View 
                    style={[
                      styles.closeButton,
                      { transform: [{ scale: closeButtonScale }], backgroundColor: '#21262D', borderColor: '#30363D' }
                    ]}
                  >
                    <Ionicons name="close" size={24} color="#F0F6FC" />
                  </Animated.View>
                </TouchableOpacity>
          </View>
        </View>
      </View>

          {/* Kapanırken içerik kaldırılır – iOS dokunma blokajı önlenir */}
          {!isClosing && (selections.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={[styles.emptyIcon, { backgroundColor: '#21262D' }]}>
                <Text style={styles.emptyIconText}>🎯</Text>
              </View>
              <Text style={[styles.emptyTitle, { color: '#F0F6FC' }]}>Ticketın Boş</Text>
              <Text style={[styles.emptySubtitle, { color: '#8B949E' }]}>
                Tahmin yapmak için sorulara evet veya hayır diyerek ticketını oluştur.
              </Text>
            </View>
          ) : (
            <>
              {/* Selections List - Her zaman koyu tema renkleri */}
              <ScrollView 
                style={styles.selectionsList}
                showsVerticalScrollIndicator={false}
              >
                {selections.map((selection) => (
                  <View key={selection.id} style={styles.selectionCard}>
                    <View style={[styles.selectionGradient, { backgroundColor: '#21262D', borderColor: '#30363D' }]}>
                      <View style={styles.selectionContent}>
                        <View style={styles.selectionMain}>
                          <Text style={[styles.selectionTitle, { color: '#F0F6FC' }]} numberOfLines={2}>
                            {selection.title}
                          </Text>
                          <View style={styles.selectionMeta}>
                            <LinearGradient
                              colors={
                                selection.vote === 'yes' 
                                  ? ['#10B981', '#059669']
                                  : ['#DC2626', '#B91C1C']
                              }
                              style={styles.voteBadge}
                            >
                              <Text style={styles.voteBadgeText}>
                                {selection.vote === 'yes' ? 'EVET' : 'HAYIR'}
                              </Text>
                            </LinearGradient>
                            <Text style={[styles.oddsText, { color: '#F0F6FC' }]}>
                              {selection.odds}x
                            </Text>
                            {selection.boosted && (
                              <LinearGradient
                                colors={['#34D399', '#059669']}
                                style={styles.boostBadge}
                              >
                                <Text style={styles.boostBadgeText}>BOOST</Text>
                              </LinearGradient>
                            )}
                            {affectsLeague(selection.questionId) && (
                              <TouchableOpacity
                                onPress={() => setShowLeagueWarning(selection.id)}
                                style={styles.leagueBadge}
                                activeOpacity={0.8}
                              >
                                <LinearGradient
                                  colors={['#C9F158', '#A8D83F']}
                                  style={styles.leagueBadgeGradient}
                                >
                                  <Text style={styles.leagueBadgeText}>Liga Etki ⚡</Text>
                                </LinearGradient>
                              </TouchableOpacity>
                            )}
                          </View>
                        </View>
                        
                        <TouchableOpacity
                          onPress={() => onRemoveSelection(selection.id)}
                          style={styles.removeButton}
                          activeOpacity={0.7}
                        >
                          <Ionicons name="trash-outline" size={16} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
              </ScrollView>

              {/* Summary - Fixed at Bottom - Her zaman koyu tema renkleri */}
              <View style={[styles.summaryContainer, { borderTopColor: '#30363D' }]}>
                <View style={styles.summaryGradient}>
                  <View style={[styles.summaryCard, { backgroundColor: '#21262D', borderColor: '#30363D' }]}>
                    <View style={styles.summaryRow}>
                      <Text style={[styles.summaryLabel, { color: '#8B949E' }]}>Toplam Oran</Text>
                      <Text style={[styles.summaryOdds, { color: '#F0F6FC' }]}>
                        {totalOdds.toFixed(2)}x
                      </Text>
                    </View>
                    <View style={styles.summaryRow}>
                      <Text style={[styles.summaryLabel, { color: '#8B949E' }]}>Bahis Tutarı</Text>
                      <TouchableOpacity
                        onPress={() => {
                          setShowBetModal(true);
                          setBetInputValue(betAmount.toString());
                        }}
                        style={[styles.betButton, { backgroundColor: '#161B22', borderColor: '#10B981' }]}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.betButtonText, { color: '#F0F6FC' }]}>
                          {betAmount} kredi
                        </Text>
                        <Ionicons name="pencil" size={14} color="#10B981" />
                      </TouchableOpacity>
                    </View>
                    <View style={[styles.summaryRow, styles.summaryRowTotal, { borderTopColor: '#30363D' }]}>
                      <Text style={[styles.summaryLabelTotal, { color: '#8B949E' }]}>Potansiyel Kazanç</Text>
                      <Text style={[styles.summaryTotal, { color: '#10B981' }]}>
                        {Math.round(potentialWin)} kredi
                      </Text>
                    </View>
                  </View>

                  {/* Action Buttons */}
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      onPress={onClearAll}
                      style={styles.clearButton}
                      activeOpacity={0.8}
                    >
                      <View style={[styles.clearButtonGradient, { backgroundColor: '#21262D', borderWidth: 1, borderColor: '#30363D', borderRadius: 14 }]}>
                        <Text style={[styles.clearButtonText, { color: '#F0F6FC' }]}>Temizle</Text>
                      </View>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      onPress={handleSubmit}
                      disabled={isSubmitting || selections.length === 0}
                      style={[
                        styles.submitButton, 
                        (isSubmitting || selections.length === 0) && styles.submitButtonDisabled,
                        { 
                          backgroundColor: isSubmitting || selections.length === 0 
                            ? '#21262D'
                            : '#10B981' 
                        }
                      ]}
                      activeOpacity={0.8}
                    >
                      {isSubmitting ? (
                        <View style={styles.loadingContainer}>
                          <View style={styles.spinner} />
                          <Text style={[styles.submitButtonTextDisabled, { color: '#8B949E' }]}>Oluşturuluyor...</Text>
                        </View>
                      ) : (
                        <Text style={styles.submitButtonText}>Ticket Oluştur</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </>
          ))}
        </Animated.View>

        {/* League Warning – overlay (Modal yok, iOS dokunma sorunu önlenir) */}
        {showLeagueWarning && (
          <View style={styles.warningOverlayAbsolute} pointerEvents="box-none">
            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              onPress={() => setShowLeagueWarning(null)}
              activeOpacity={1}
            />
            <View style={[styles.warningContainer, { backgroundColor: theme.surfaceModal }]}>
              <View style={[styles.warningIcon, { backgroundColor: theme.surfaceCard }]}>
                <Text style={styles.warningIconText}>⚡</Text>
              </View>
              <Text style={[styles.warningTitle, { color: theme.textPrimary }]}>Liga Etkisi</Text>
              <Text style={[styles.warningText, { color: theme.textMuted }]}>
                Bu soru ligi etkileyecek! Doğru tahmin yaparsan ekstra puan kazanabilirsin.
              </Text>
              <TouchableOpacity
                onPress={() => setShowLeagueWarning(null)}
                style={[styles.warningButton, { backgroundColor: theme.primaryDark || '#059669', paddingHorizontal: 24, paddingVertical: 12, alignItems: 'center' }]}
                activeOpacity={0.8}
              >
                <Text style={styles.warningButtonText}>Anladım</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Bet Amount – overlay (Modal yok, iOS dokunma sorunu önlenir) */}
        {showBetModal && (
          <View style={styles.betModalOverlayAbsolute} pointerEvents="box-none">
            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              onPress={() => setShowBetModal(false)}
              activeOpacity={1}
            />
            <View style={[styles.betModalContainer, { backgroundColor: theme.surfaceModal }]}>
              <View style={styles.betModalGradient}>
                <View style={styles.betModalHeader}>
                  <Text style={[styles.betModalTitle, { color: theme.textPrimary }]}>Bahis Tutarı</Text>
                  <TouchableOpacity
                    onPress={() => setShowBetModal(false)}
                    style={[styles.betModalCloseButton, { backgroundColor: theme.surfaceElevated }]}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="close" size={20} color={theme.textPrimary} />
                  </TouchableOpacity>
                </View>
                <View style={styles.betInputContainer}>
                  <View style={[styles.creditInfoContainer, { backgroundColor: theme.surfaceElevated }]}>
                    <Text style={[styles.creditInfoLabel, { color: theme.textMuted }]}>Mevcut Kredin</Text>
                    <Text style={[styles.creditInfoAmount, { color: theme.textPrimary }]}>
                      {userCredits.toLocaleString()} kredi
                    </Text>
                  </View>
                  <Text style={[styles.betInputLabel, { color: theme.textMuted }]}>Kaç kredi bahis yapmak istiyorsun?</Text>
                  <TextInput
                    style={[styles.betModalInput, { color: theme.textPrimary, borderColor: theme.border }]}
                    value={betInputValue}
                    onChangeText={setBetInputValue}
                    keyboardType="numeric"
                    autoFocus
                    placeholder="0"
                    placeholderTextColor={theme.textMuted}
                  />
                  <Text style={[styles.betInputSuffix, { color: theme.textMuted }]}>kredi</Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    const numValue = parseFloat(betInputValue);
                    if (!isNaN(numValue) && numValue > 0) {
                      setBetAmount(numValue);
                    }
                    setShowBetModal(false);
                  }}
                  style={[styles.betConfirmButton, { backgroundColor: theme.primaryDark || '#059669', paddingVertical: 16, alignItems: 'center' }]}
                  activeOpacity={0.8}
                >
                  <Text style={styles.betConfirmButtonText}>Onayla</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlayRoot: {
    zIndex: 9998,
  },
  container: {
    flex: 1,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  backdropTouchable: {
    flex: 1,
  },
  drawer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: SCREEN_HEIGHT * 0.85,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  handleContainer: {
    alignItems: 'center',
    paddingTop: 6,
    paddingBottom: 0,
    overflow: 'hidden',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  handle: {
    width: 56,
    height: 6,
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 8,
  },
  header: {
    overflow: 'hidden',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  headerGradient: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#432870',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerSubtitleText: {
    fontSize: 14,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  headerDot: {
    width: 6,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 3,
  },
  headerOdds: {
    fontSize: 14,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  emptyIconText: {
    fontSize: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#8B949E',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 280,
  },
  selectionsList: {
    paddingHorizontal: 24,
    maxHeight: SCREEN_HEIGHT * 0.4,
  },
  selectionCard: {
    marginTop: 12,
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectionGradient: {
    borderWidth: 1.5,
    borderRadius: 16,
  },
  selectionContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    gap: 12,
  },
  selectionMain: {
    flex: 1,
  },
  selectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
    lineHeight: 20,
  },
  selectionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  voteBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  voteBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'white',
  },
  oddsText: {
    fontSize: 16,
    fontWeight: '900',
  },
  boostBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  boostBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'white',
  },
  leagueBadge: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  leagueBadgeGradient: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  leagueBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryContainer: {
    borderTopWidth: 1,
  },
  summaryGradient: {
    backgroundColor: 'transparent',
    padding: 20,
    paddingTop: 12,
  },
  summaryCard: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryRowTotal: {
    paddingTop: 12,
    borderTopWidth: 1,
    marginBottom: 0,
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  summaryLabelTotal: {
    fontSize: 16,
    fontWeight: '900',
  },
  summaryOdds: {
    fontSize: 20,
    fontWeight: '900',
  },

  summaryTotal: {
    fontSize: 20,
    fontWeight: '900',
  },
  betInput: {
    width: 96,
    textAlign: 'right',
    fontSize: 18,
    fontWeight: '900',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 2,
  },
  betButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  betButtonText: {
    fontSize: 18,
    fontWeight: '900',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  clearButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  clearButtonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  submitButton: {
    flex: 2,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#432870',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  spinner: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#6B7280',
    borderTopColor: 'transparent',
    borderRadius: 10,
  },
  submitButtonTextDisabled: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6B7280',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  warningOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  warningOverlayAbsolute: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    zIndex: 10000,
  },
  warningBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  warningContainer: {
    backgroundColor: '#161B22',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    maxWidth: 320,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#30363D',
  },
  warningIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  warningIconText: {
    fontSize: 24,
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#F0F6FC',
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    color: '#8B949E',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  warningButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  warningButtonGradient: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  warningButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  
  // Bet Modal Styles
  betModalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 320,
  },
  betModalOverlayAbsolute: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 320,
    zIndex: 10000,
  },
  betModalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  betModalContainer: {
    backgroundColor: '#161B22',
    borderRadius: 24,
    overflow: 'hidden',
    width: '100%',
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#30363D',
  },
  betModalGradient: {
    padding: 24,
  },
  betModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  betModalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#F0F6FC',
  },
  betModalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#21262D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  betInputContainer: {
    marginBottom: 24,
  },
  creditInfoContainer: {
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#21262D',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#30363D',
  },
  creditInfoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B949E',
    marginBottom: 4,
  },
  creditInfoAmount: {
    fontSize: 24,
    fontWeight: '900',
    color: '#8B5CF6',
  },
  betInputLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#432870',
    marginBottom: 12,
    textAlign: 'center',
  },
  betModalInput: {
    fontSize: 32,
    fontWeight: '900',
    color: '#10B981',
    textAlign: 'center',
    backgroundColor: '#21262D',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: '#10B981',
    marginBottom: 8,
  },
  betInputSuffix: {
    fontSize: 18,
    fontWeight: '700',
    color: '#B29EFD',
    textAlign: 'center',
  },
  betConfirmButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  betConfirmButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  betConfirmButtonText: {
    fontSize: 18,
    fontWeight: '900',
    color: 'white',
  },
});
