import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Coupon } from '../types';
import { ActiveCoupon } from '../../HomePage/types';
import { getModalGradientColors } from '../utils';

interface CouponDetailModalProps {
  visible: boolean;
  coupon: (Coupon & { display_id?: number }) | (ActiveCoupon & { display_id?: number }) | null;
  onClose: () => void;
  onClaimReward?: (couponId: number) => void;
  onQuestionDetail?: (questionId: string) => void;
}

export function CouponDetailModal({
  visible,
  coupon,
  onClose,
  onClaimReward,
  onQuestionDetail,
}: CouponDetailModalProps) {
  if (!coupon) return null;

  const status = coupon.status ?? 'pending';
  const isWon = status === 'won';
  const isClaimed = 'claimedReward' in coupon ? coupon.claimedReward : false;
  const canClaim = isWon && !isClaimed;
  const headerGradientColors: [string, string] = canClaim
    ? ['#10B981', '#059669']
    : isWon && isClaimed
      ? ['#325D49', '#274A3A']
      : getModalGradientColors(status);
  const couponId = typeof coupon.id === 'number' ? coupon.id : parseInt(String(coupon.id)) || 0;

  const handleClaimPress = () => {
    if (canClaim && onClaimReward) {
      onClaimReward(couponId);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="overFullScreen"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.modalWrapper} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity activeOpacity={1} style={styles.container} onPress={e => e.stopPropagation()}>
          {/* Header */}
          <View style={styles.headerWrapper}>
            <LinearGradient
              colors={headerGradientColors}
              style={styles.header}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View style={styles.headerContent}>
                <View style={styles.headerLeft}>
                  <View style={styles.ticketIconContainer}>
                    <Text style={styles.ticketIcon}>🎫</Text>
                  </View>
                  <View>
                    <Text style={styles.title}>Ticket #{coupon.display_id || coupon.id}</Text>
                    <Text style={styles.username}>{coupon.username || 'Kullanıcı'}</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                  <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.stats}>
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>Yatırım</Text>
                  <Text style={styles.statValue}>{coupon.investmentAmount?.toLocaleString() || '0'} kredi</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>Toplam Oran</Text>
                  <Text style={styles.statValue}>{coupon.totalOdds.toFixed(2)}x</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statLabel}>Potansiyel</Text>
                  <Text style={styles.statValue}>
                    {((coupon as any).potentialEarnings || (coupon as any).potentialWinnings || 0).toLocaleString()}{' '}
                    kredi
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Content - Dark Theme */}
          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.contentInner}>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Tahminler ({coupon.predictions?.length || 0})</Text>
              </View>

              <View style={styles.predictions}>
                {(coupon.predictions || []).map(prediction => (
                  <TouchableOpacity
                    key={prediction.id}
                    style={[
                      styles.predictionCard,
                      prediction.result === 'won'
                        ? styles.predictionWon
                        : prediction.result === 'lost'
                          ? styles.predictionLost
                          : prediction.result === 'cancelled'
                            ? styles.predictionCancelled
                            : styles.predictionPending,
                    ]}
                    onPress={() => {
                      if (!prediction.questionId) return;
                      onQuestionDetail?.(prediction.questionId);
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={styles.predictionHeader}>
                      <Text style={styles.predictionQuestion}>{prediction.question}</Text>
                      <Text
                        style={[
                          styles.predictionOdds,
                          prediction.result === 'pending' && styles.predictionOddsPending,
                          prediction.result === 'lost' && styles.predictionOddsLost,
                          prediction.result === 'won' && styles.predictionOddsWon,
                        ]}
                      >
                        {prediction.odds}x
                      </Text>
                    </View>

                    <View style={styles.predictionFooter}>
                      <View
                        style={[styles.choiceBadge, prediction.choice === 'yes' ? styles.yesBadge : styles.noBadge]}
                      >
                        <Text
                          style={[
                            styles.choiceBadgeText,
                            prediction.choice === 'yes' ? styles.yesBadgeText : styles.noBadgeText,
                          ]}
                        >
                          {prediction.choice === 'yes' ? 'EVET' : 'HAYIR'}
                        </Text>
                      </View>
                      <Text style={styles.categoryText}>{prediction.category}</Text>
                      {prediction.result && prediction.result !== 'pending' && (
                        <View
                          style={[
                            styles.resultBadge,
                            prediction.result === 'won'
                              ? styles.resultWon
                              : prediction.result === 'lost'
                                ? styles.resultLost
                                : styles.resultCancelled,
                          ]}
                        >
                          <Text style={styles.resultText}>
                            {prediction.result === 'won'
                              ? 'KAZANDI'
                              : prediction.result === 'lost'
                                ? 'KAYBETTİ'
                                : 'İPTAL'}
                          </Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Actions */}
          <View style={styles.actions}>
            {canClaim ? (
              <TouchableOpacity style={styles.claimButton} onPress={handleClaimPress} activeOpacity={0.8}>
                <LinearGradient
                  colors={['#10B981', '#059669']}
                  style={styles.claimButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.claimButtonText}>Ödülü Al</Text>
                  <Text style={styles.claimAmount}>
                    +{((coupon as any).potentialEarnings || (coupon as any).potentialWinnings || 0).toLocaleString()}{' '}
                    kredi
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ) : isWon && isClaimed ? (
              <View style={styles.claimedBadge}>
                <Text style={styles.claimedText}>Ödül Alındı ✓</Text>
              </View>
            ) : (
              <TouchableOpacity style={styles.shareButton} activeOpacity={0.8}>
                <LinearGradient
                  colors={['#21262D', '#161B22']}
                  style={styles.shareButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.shareButtonText}>Ticketı Paylaş</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalWrapper: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  container: {
    maxHeight: '90%',
    backgroundColor: '#0D1117',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  headerWrapper: {},
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ticketIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  ticketIcon: {
    fontSize: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  username: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flexShrink: 1,
    backgroundColor: '#0D1117',
  },
  scrollContent: {
    flexGrow: 1,
  },
  contentInner: {
    paddingHorizontal: 24,
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F0F6FC',
  },
  predictions: {
    gap: 12,
    paddingBottom: 16,
  },
  predictionCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  predictionPending: {
    backgroundColor: '#1A2D52',
    borderColor: '#256EFF',
  },
  predictionWon: {
    backgroundColor: '#0D1A12',
    borderColor: '#086347',
  },
  predictionLost: {
    backgroundColor: '#190D0D',
    borderColor: '#7D1F1F',
  },
  predictionCancelled: {
    backgroundColor: '#1F2937',
    borderColor: '#6B7280',
  },
  predictionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  predictionQuestion: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#F0F6FC',
    marginRight: 12,
  },
  predictionOdds: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#10B981',
  },
  predictionOddsPending: {
    color: '#7EA8FF',
  },
  predictionOddsWon: {
    color: '#107355',
  },
  predictionOddsLost: {
    color: '#914444',
  },
  predictionFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  choiceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
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
    fontSize: 12,
    color: '#8B949E',
  },
  resultBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  resultWon: {
    backgroundColor: 'rgba(8, 99, 71, 0.35)',
  },
  resultLost: {
    backgroundColor: 'rgba(125, 31, 31, 0.35)',
  },
  resultCancelled: {
    backgroundColor: 'rgba(107, 114, 128, 0.3)',
  },
  resultText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#F0F6FC',
  },
  actions: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: '#21262D',
    backgroundColor: '#0D1117',
  },
  claimButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  claimButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  claimButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  claimAmount: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  claimedBadge: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A2B22',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2B5643',
  },
  claimedText: {
    color: '#4E7A65',
    fontSize: 16,
    fontWeight: '600',
  },
  shareButton: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#30363D',
  },
  shareButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareButtonText: {
    color: '#8B949E',
    fontSize: 16,
    fontWeight: '600',
  },
});
