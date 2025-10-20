import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Coupon } from '../types';
import { getStatusColor, getStatusBorderColor, getStatusBadge } from '../utils';

interface CouponCardProps {
  coupon: Coupon;
  onPress: (coupon: Coupon) => void;
}

export function CouponCard({ coupon, onPress }: CouponCardProps) {
  const statusBadge = getStatusBadge(coupon.status);

  return (
    <TouchableOpacity
      style={[styles.card, { borderWidth: 2, borderColor: getStatusBorderColor(coupon.status) }]}
      onPress={() => onPress(coupon)}
      activeOpacity={0.95}
    >
      <LinearGradient
        colors={getStatusColor(coupon.status)}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={[styles.statusDot, { backgroundColor: statusBadge.color }]} />
            <Text style={styles.title}>Kupon #{coupon.id}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusBadge.color }]}>
            <Text style={styles.statusBadgeText}>{statusBadge.text}</Text>
          </View>
        </View>

        {/* Predictions */}
        <View style={styles.predictionsContainer}>
          {coupon.predictions.slice(0, 3).map((prediction) => (
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
                  {prediction.result && (
                    <Text style={styles.resultIcon}>
                      {prediction.result === 'won' ? '✅' : prediction.result === 'lost' ? '❌' : '⏳'}
                    </Text>
                  )}
                </View>
              </View>
              <Text style={styles.oddsText}>{prediction.odds}x</Text>
            </View>
          ))}

          {coupon.predictions.length > 3 && (
            <View style={styles.morePredictions}>
              <Text style={styles.morePredictionsText}>
                +{coupon.predictions.length - 3} tahmin daha
              </Text>
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            <Text style={styles.footerLabel}>Potansiyel Kazanç</Text>
            <Text style={styles.footerValue}>₺{coupon.potentialEarnings.toLocaleString()}</Text>
          </View>
          <View style={styles.footerRight}>
            <Text style={styles.footerLabel}>Toplam Oran</Text>
            <Text style={styles.totalOdds}>{coupon.totalOdds.toFixed(2)}x</Text>
          </View>
        </View>
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
    color: '#111827',
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
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  predictionLeft: {
    flex: 1,
  },
  predictionQuestion: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
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
    backgroundColor: '#D1FAE5',
  },
  noBadge: {
    backgroundColor: '#FEE2E2',
  },
  choiceBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  yesBadgeText: {
    color: '#065F46',
  },
  noBadgeText: {
    color: '#991B1B',
  },
  categoryText: {
    fontSize: 10,
    color: '#6B7280',
  },
  resultIcon: {
    fontSize: 12,
  },
  oddsText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#432870',
  },
  morePredictions: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  morePredictionsText: {
    fontSize: 12,
    color: '#6B7280',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.5)',
  },
  footerLeft: {
    flex: 1,
  },
  footerRight: {
    alignItems: 'flex-end',
  },
  footerLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  footerValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  totalOdds: {
    fontSize: 20,
    fontWeight: '900',
    color: '#432870',
  },
});



