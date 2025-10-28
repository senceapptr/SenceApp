import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Dimensions,
  Animated,
  Alert,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { PanGestureHandler, State, GestureHandlerRootView } from 'react-native-gesture-handler';
import { couponsService } from '@/services/coupons.service';
import { useAuth } from '../contexts/AuthContext';

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
  onCouponCreated?: () => void; // Yeni kupon oluşturulduğunda çağrılacak callback
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [betAmount, setBetAmount] = useState(10);
  const [showLeagueWarning, setShowLeagueWarning] = useState<number | null>(null);
  const [showBetModal, setShowBetModal] = useState(false);
  const [betInputValue, setBetInputValue] = useState('10');

  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const contentScale = useRef(new Animated.Value(0.95)).current;
  const panY = useRef(new Animated.Value(0)).current;
  const handleScale = useRef(new Animated.Value(1)).current;
  const closeButtonScale = useRef(new Animated.Value(1)).current;
  const headerIconRotate = useRef(new Animated.Value(0)).current;
  
  // Gesture state
  const [isDragging, setIsDragging] = useState(false);

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

  useLayoutEffect(() => {
    if (isOpen) {
      // Reset animations to initial state
      slideAnim.setValue(SCREEN_HEIGHT);
      contentScale.setValue(1);
      backdropOpacity.setValue(0);
      
      // Smooth opening animation with spring physics
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 65,
          friction: 8,
          restDisplacementThreshold: 0.01,
          restSpeedThreshold: 0.01,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
      ]).start();
    } else {
      // Reset content animations
      contentScale.setValue(1);
      
      // Çok hızlı kapanış animasyonu - ana sayfa donmasın
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: SCREEN_HEIGHT,
          useNativeDriver: true,
          tension: 200, // Çok daha hızlı
          friction: 3,  // Çok daha hızlı
          restDisplacementThreshold: 0.01,
          restSpeedThreshold: 0.01,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 100, // Çok daha hızlı
          useNativeDriver: true,
          easing: Easing.in(Easing.cubic),
        }),
      ]).start();
    }
  }, [isOpen, slideAnim, contentScale, backdropOpacity]);



  const handleSubmit = async () => {
    if (selections.length === 0) return;
    
    setIsSubmitting(true);
    
    try {
      // Backend'e kupon gönder
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

      // Başarılı kupon oluşturma
      setIsSubmitting(false);
      onClearAll();
      onClose();
      
      // Profil verilerini yenile (kredi güncellemesi için)
      await refreshProfile();
      
      // Kuponlarım sayfasını yenile
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
        'Kupon Oluşturuldu! 🎉',
        `Kuponunuz başarıyla oluşturuldu. Potansiyel kazancınız: ${Math.round(totalOdds * betAmount)} kredi`,
        [{ text: 'Tamam', style: 'default' }]
      );
      
    } catch (error) {
      setIsSubmitting(false);
      
      console.error('Coupon creation error:', error);
      
      Alert.alert(
        'Hata',
        'Kupon oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.',
        [{ text: 'Tamam', style: 'default' }]
      );
    }
  };

  const handleBackdropPress = () => {
    onClose();
  };

  // Gesture handling
  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: panY } }],
    { 
      useNativeDriver: false,
      listener: (event: any) => {
        const translationY = event.nativeEvent.translationY;
        
        // Prevent upward dragging - only allow downward
        if (translationY < 0) {
          // Micro animation for upward attempt
          Animated.sequence([
            Animated.timing(handleScale, {
              toValue: 1.2,
              duration: 100,
              useNativeDriver: true,
              easing: Easing.out(Easing.cubic),
            }),
            Animated.timing(handleScale, {
              toValue: 1,
              duration: 100,
              useNativeDriver: true,
              easing: Easing.in(Easing.cubic),
            }),
          ]).start();
          
          // Reset panY to prevent upward movement
          panY.setValue(0);
          return; // Stop processing this gesture
        }
        
        // Only allow downward dragging
        if (translationY > 0) {
          // Normal downward dragging behavior
          panY.setValue(translationY);
        }
      }
    }
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.BEGAN) {
      setIsDragging(true);
    } else if (event.nativeEvent.state === State.END) {
      const { translationY, velocityY } = event.nativeEvent;
      
      // Determine if should close based on gesture
      if (translationY > 100 || velocityY > 500) {
        // Transfer panY to slideAnim to maintain position before resetting
        slideAnim.setValue(translationY);
        panY.setValue(0);
        setIsDragging(false);
        
        // Animate from current position to closed position
        Animated.parallel([
          Animated.spring(slideAnim, {
            toValue: SCREEN_HEIGHT,
            useNativeDriver: true,
            tension: 60,
            friction: 8,
            velocity: velocityY / 2,
          }),
          Animated.timing(backdropOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
            easing: Easing.in(Easing.cubic),
          }),
        ]).start(() => {
          onClose();
        });
      } else {
        // Reset pan value first
        panY.setValue(0);
        setIsDragging(false);
        
        // Snap back to open position
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 80,
          friction: 6,
        }).start();
      }
    }
  };

  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <GestureHandlerRootView style={styles.container}>
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
        
        {/* Drawer */}
        <Animated.View
          style={[
            styles.drawer,
            {
              transform: [
                { 
                  translateY: Animated.add(
                    slideAnim,
                    isDragging ? panY : new Animated.Value(0)
                  )
                },
                { scale: contentScale }
              ],
            },
          ]}
        >
          {/* Handle */}
                      <PanGestureHandler
              onGestureEvent={onGestureEvent}
              onHandlerStateChange={onHandlerStateChange}
            >
              <Animated.View>
                <View
                  style={[styles.handleContainer, { backgroundColor: '#432870' }]}
                >
                  <Animated.View 
                    style={[
                      styles.handle,
                      {
                        transform: [{ scale: handleScale }],
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                      }
                    ]} 
                  />
                </View>
              </Animated.View>
            </PanGestureHandler>

          {/* Header - Modern Purple Design */}
          <View style={styles.header}>
            <View style={styles.headerGradient}>
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
                    <LinearGradient
                      colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.2)']}
                      style={styles.headerIcon}
                    >
                      <Ionicons name="ticket" size={20} color="#FFFFFF" />
                    </LinearGradient>
                  </Animated.View>
                  <View style={styles.headerText}>
                    <Text style={styles.headerTitle}>Kuponum</Text>
                    <View style={styles.headerSubtitle}>
                      <Text style={styles.headerSubtitleText}>
                        {selections.length}/5 tahmin
                      </Text>
                      {selections.length > 0 && (
                        <>
                          <View style={styles.headerDot} />
                          <Text style={styles.headerOdds}>
                            {totalOdds.toFixed(2)}x oran
                          </Text>
                        </>
                      )}
                    </View>
                  </View>
                </View>
                
                <TouchableOpacity
                  onPress={onClose}
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
                      { transform: [{ scale: closeButtonScale }] }
                    ]}
                  >
                    <Ionicons name="close" size={24} color="#FFFFFF" />
                  </Animated.View>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {selections.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Text style={styles.emptyIconText}>🎯</Text>
              </View>
              <Text style={styles.emptyTitle}>Kuponun Boş</Text>
              <Text style={styles.emptySubtitle}>
                Tahmin yapmak için sorulara evet veya hayır diyerek kuponunu oluştur.
              </Text>
            </View>
          ) : (
            <>
              {/* Selections List */}
              <ScrollView 
                style={styles.selectionsList}
                showsVerticalScrollIndicator={false}
              >
                {selections.map((selection) => (
                  <View key={selection.id} style={styles.selectionCard}>
                    <View style={styles.selectionGradient}>
                      <View style={styles.selectionContent}>
                        <View style={styles.selectionMain}>
                          <Text style={styles.selectionTitle} numberOfLines={2}>
                            {selection.title}
                          </Text>
                          <View style={styles.selectionMeta}>
                            <LinearGradient
                              colors={
                                selection.vote === 'yes' 
                                  ? ['#34C759', '#28A745']
                                  : ['#FF3B30', '#DC3545']
                              }
                              style={styles.voteBadge}
                            >
                              <Text style={styles.voteBadgeText}>
                                {selection.vote === 'yes' ? 'EVET' : 'HAYIR'}
                              </Text>
                            </LinearGradient>
                            <Text style={styles.oddsText}>
                              {selection.odds}x
                            </Text>
                            {selection.boosted && (
                              <LinearGradient
                                colors={['#B29EFD', '#432870']}
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

              {/* Summary - Fixed at Bottom */}
              <View style={styles.summaryContainer}>
                <View style={styles.summaryGradient}>
                  <View style={styles.summaryCard}>
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Toplam Oran</Text>
                      <Text style={styles.summaryOdds}>
                        {totalOdds.toFixed(2)}x
                      </Text>
                    </View>
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Bahis Tutarı</Text>
                      <TouchableOpacity
                        onPress={() => {
                          setShowBetModal(true);
                          setBetInputValue(betAmount.toString());
                        }}
                        style={styles.betButton}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.betButtonText}>
                          {betAmount} kredi
                        </Text>
                        <Ionicons name="pencil" size={16} color="#432870" />
                      </TouchableOpacity>
                    </View>
                    <View style={[styles.summaryRow, styles.summaryRowTotal]}>
                      <Text style={styles.summaryLabelTotal}>Potansiyel Kazanç</Text>
                      <Text style={styles.summaryTotal}>
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
                      <LinearGradient
                        colors={['#F2F3F5', '#EAEAEC']}
                        style={styles.clearButtonGradient}
                      >
                        <Text style={styles.clearButtonText}>Temizle</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      onPress={handleSubmit}
                      disabled={isSubmitting || selections.length === 0}
                      style={[
                        styles.submitButton, 
                        (isSubmitting || selections.length === 0) && styles.submitButtonDisabled,
                        { 
                          backgroundColor: isSubmitting || selections.length === 0 
                            ? '#E5E7EB' 
                            : '#432870' 
                        }
                      ]}
                      activeOpacity={0.8}
                    >
                      {isSubmitting ? (
                        <View style={styles.loadingContainer}>
                          <View style={styles.spinner} />
                          <Text style={styles.submitButtonTextDisabled}>Oluşturuluyor...</Text>
                        </View>
                      ) : (
                        <Text style={styles.submitButtonText}>Kupon Oluştur</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </>
          )}
        </Animated.View>

        {/* League Warning Modal */}
        {showLeagueWarning && (
          <Modal
            visible={true}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowLeagueWarning(null)}
          >
            <View style={styles.warningOverlay}>
              <TouchableOpacity 
                style={styles.warningBackdrop}
                onPress={() => setShowLeagueWarning(null)}
                activeOpacity={1}
              />
              <View style={styles.warningContainer}>
                <LinearGradient
                  colors={['#C9F158', '#A8D83F']}
                  style={styles.warningIcon}
                >
                  <Text style={styles.warningIconText}>⚡</Text>
                </LinearGradient>
                <Text style={styles.warningTitle}>Liga Etkisi</Text>
                <Text style={styles.warningText}>
                  Bu soru ligi etkileyecek! Doğru tahmin yaparsan ekstra puan kazanabilirsin.
                </Text>
                <TouchableOpacity
                  onPress={() => setShowLeagueWarning(null)}
                  style={styles.warningButton}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#432870', '#5A3A8B']}
                    style={styles.warningButtonGradient}
                  >
                    <Text style={styles.warningButtonText}>Anladım</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}

        {/* Bet Amount Modal */}
        {showBetModal && (
          <Modal
            visible={true}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowBetModal(false)}
          >
            <View style={styles.betModalOverlay}>
              <TouchableOpacity 
                style={styles.betModalBackdrop}
                onPress={() => setShowBetModal(false)}
                activeOpacity={1}
              />
              <View style={styles.betModalContainer}>
                <LinearGradient
                  colors={['#FFFFFF', '#FAFBFC']}
                  style={styles.betModalGradient}
                >
                  <View style={styles.betModalHeader}>
                    <Text style={styles.betModalTitle}>Bahis Tutarı</Text>
                    <TouchableOpacity
                      onPress={() => setShowBetModal(false)}
                      style={styles.betModalCloseButton}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="close" size={20} color="#432870" />
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.betInputContainer}>
                    <View style={styles.creditInfoContainer}>
                      <Text style={styles.creditInfoLabel}>Mevcut Kredin</Text>
                      <Text style={styles.creditInfoAmount}>
                        {userCredits.toLocaleString()} kredi
                      </Text>
                    </View>
                    
                    <Text style={styles.betInputLabel}>Kaç kredi bahis yapmak istiyorsun?</Text>
                    <TextInput
                      style={styles.betModalInput}
                      value={betInputValue}
                      onChangeText={setBetInputValue}
                      keyboardType="numeric"
                      autoFocus
                      placeholder="0"
                      placeholderTextColor="#B29EFD"
                    />
                    <Text style={styles.betInputSuffix}>kredi</Text>
                  </View>
                  
                  <TouchableOpacity
                    onPress={() => {
                      const numValue = parseFloat(betInputValue);
                      if (!isNaN(numValue) && numValue > 0) {
                        setBetAmount(numValue);
                      }
                      setShowBetModal(false);
                    }}
                    style={styles.betConfirmButton}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={['#432870', '#5A3A8B']}
                      style={styles.betConfirmButtonGradient}
                    >
                      <Text style={styles.betConfirmButtonText}>Onayla</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            </View>
          </Modal>
        )}
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: '#F5F5F7',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: SCREEN_HEIGHT * 0.85,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
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
    backgroundColor: '#432870',
    paddingHorizontal: 20,
    paddingVertical: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
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
    backgroundColor: '#F2F3F5',
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
    color: '#202020',
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 16,
    color: 'rgba(32,32,32,0.7)',
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
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: 'rgba(67,40,112,0.1)',
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
    color: '#202020',
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
    color: '#432870',
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
    color: '#432870',
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(67,40,112,0.1)',
  },
  summaryGradient: {
    backgroundColor: 'transparent',
    padding: 20,
    paddingTop: 12,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 4,
    borderColor: '#432870',
    shadowColor: '#432870',
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
    borderTopColor: 'rgba(67, 40, 112, 0.15)',
    marginBottom: 0,
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6B7280',
  },
  summaryLabelTotal: {
    fontSize: 16,
    fontWeight: '900',
    color: '#111827',
  },
  summaryOdds: {
    fontSize: 20,
    fontWeight: '900',
    color: '#432870',
  },

  summaryTotal: {
    fontSize: 20,
    fontWeight: '900',
    color: '#432870',
  },
  betInput: {
    width: 96,
    textAlign: 'right',
    fontSize: 18,
    fontWeight: '900',
    color: '#B29EFD',
    backgroundColor: '#F2F3F5',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 2,
    borderColor: '#B29EFD',
  },
  betButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(67, 40, 112, 0.05)',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#432870',
    borderStyle: 'dashed',
  },
  betButtonText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#432870',
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
    color: '#202020',
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
  warningBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  warningContainer: {
    backgroundColor: 'white',
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
    borderColor: 'rgba(67,40,112,0.2)',
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
    color: '#202020',
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    color: 'rgba(32,32,32,0.7)',
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
  betModalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  betModalContainer: {
    backgroundColor: 'white',
    borderRadius: 24,
    overflow: 'hidden',
    width: '100%',
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
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
    color: '#202020',
  },
  betModalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F3F5',
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
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  creditInfoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  creditInfoAmount: {
    fontSize: 24,
    fontWeight: '900',
    color: '#34C759',
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
    color: '#432870',
    textAlign: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: '#B29EFD',
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
