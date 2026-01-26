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
  console.log('CouponCard - Coupon:', coupon);
  console.log('CouponCard - Predictions:', coupon.predictions);
  console.log('CouponCard - Predictions Length:', coupon.predictions?.length || 0);
  
  const statusBadge = getStatusBadge(coupon.status, coupon.predictions);

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
            <Text style={styles.title}>• Ticket #{coupon.id}</Text>
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
            <Text style={styles.footerValue}>{coupon.potentialEarnings.toLocaleString()} kredi</Text>
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
  resultIcon: {
    fontSize: 12,
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
});




