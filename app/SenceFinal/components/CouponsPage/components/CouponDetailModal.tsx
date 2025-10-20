import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Image, Platform, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Coupon } from '../types';
import { getModalGradientColors } from '../utils';

interface CouponDetailModalProps {
  visible: boolean;
  coupon: Coupon | null;
  onClose: () => void;
  onClaimReward?: (couponId: number) => void;
  onQuestionDetail?: (questionId: number) => void;
}

export function CouponDetailModal({ visible, coupon, onClose, onClaimReward, onQuestionDetail }: CouponDetailModalProps) {
  if (!coupon) return null;

  const statusBarHeight = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="overFullScreen"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.modalWrapper}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity 
          activeOpacity={1} 
          style={styles.container}
          onPress={(e) => e.stopPropagation()}
        >
        {/* Header */}
        <View style={styles.headerWrapper}>
          <LinearGradient
            colors={getModalGradientColors(coupon.status)}
            style={styles.header}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <Image
                source={{ uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face" }}
                style={styles.userImage}
              />
              <View>
                <Text style={styles.title}>Kupon #{coupon.id}</Text>
                <Text style={styles.username}>{coupon.username}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
            >
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Yatırım</Text>
              <Text style={styles.statValue}>{coupon.investmentAmount}</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Toplam Oran</Text>
              <Text style={styles.statValue}>{coupon.totalOdds.toFixed(2)}x</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Potansiyel</Text>
              <Text style={styles.statValue}>₺{coupon.potentialEarnings.toLocaleString()}</Text>
            </View>
          </View>
          </LinearGradient>
        </View>

        {/* Content */}
        <ScrollView 
          style={styles.content} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.contentInner}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Tahminler ({coupon.predictions.length})
              </Text>
              <Text style={styles.sectionDate}>09.08.2025</Text>
            </View>

            <View style={styles.predictions}>
            {coupon.predictions.map((prediction) => (
              <TouchableOpacity
                key={prediction.id}
                style={[
                  styles.predictionCard,
                  prediction.result === 'won' ? styles.predictionWon :
                  prediction.result === 'lost' ? styles.predictionLost :
                  styles.predictionPending
                ]}
                onPress={() => onQuestionDetail?.(prediction.id)}
                activeOpacity={0.7}
              >
                <View style={styles.predictionHeader}>
                  <Text style={styles.predictionQuestion}>
                    {prediction.question}
                  </Text>
                  <Text style={styles.predictionOdds}>
                    {prediction.odds}x
                  </Text>
                </View>

                <View style={styles.predictionFooter}>
                  <View style={[
                    styles.choiceBadge,
                    prediction.choice === 'yes' ? styles.yesBadge : styles.noBadge
                  ]}>
                    <Text style={styles.choiceBadgeText}>
                      {prediction.choice === 'yes' ? 'EVET' : 'HAYIR'}
                    </Text>
                  </View>
                  <Text style={styles.categoryText}>{prediction.category}</Text>
                  {prediction.result && (
                    <View style={[
                      styles.resultBadge,
                      prediction.result === 'won' ? styles.resultWon :
                      prediction.result === 'lost' ? styles.resultLost :
                      styles.resultPending
                    ]}>
                      <Text style={styles.resultText}>
                        {prediction.result === 'won' ? '✅ BEKLIYOR' :
                         prediction.result === 'lost' ? '❌ KAYBETTI' : '⏳ BEKLIYOR'}
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
          <TouchableOpacity 
            style={styles.shareButton}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#432870', '#5a3a8f']}
              style={styles.shareButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.shareButtonText}>📤 Kuponu Paylaş</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalWrapper: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    maxHeight: '90%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  headerWrapper: {
  },
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
  userImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
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
    backgroundColor: '#FFFFFF',
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
    color: '#111827',
  },
  sectionDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  predictions: {
    gap: 12,
    paddingBottom: 16,
  },
  predictionCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
  },
  predictionPending: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  predictionWon: {
    backgroundColor: '#ECFDF5',
    borderColor: '#BBF7D0',
  },
  predictionLost: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
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
    color: '#111827',
    marginRight: 12,
  },
  predictionOdds: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#432870',
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
    backgroundColor: '#D1FAE5',
  },
  noBadge: {
    backgroundColor: '#FEE2E2',
  },
  choiceBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  categoryText: {
    fontSize: 12,
    color: '#6B7280',
  },
  resultBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  resultPending: {
    backgroundColor: '#DBEAFE',
  },
  resultWon: {
    backgroundColor: '#D1FAE5',
  },
  resultLost: {
    backgroundColor: '#FEE2E2',
  },
  resultText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#374151',
  },
  actions: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
  },
  shareButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  shareButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});



