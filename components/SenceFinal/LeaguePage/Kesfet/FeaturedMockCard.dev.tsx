import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { PRIMARY_BLUE } from '../shared/theme';

export function FeaturedMockCardDev() {
  return (
    <View style={styles.card}>
      <View style={styles.titleRow}>
        <View style={styles.iconWrap}>
          <Ionicons name="rocket" size={18} color="#FFFFFF" />
        </View>
        <Text style={styles.title}>Prime Gece Ligi</Text>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons name="people-outline" size={15} color="#A7B7D8" />
          <Text style={styles.metaText}>24 katılımcı</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="time-outline" size={15} color="#A7B7D8" />
          <Text style={styles.metaText}>Bitmesine 2 gün 5 saat</Text>
        </View>
      </View>

      <View style={styles.footerRow}>
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Katılım</Text>
          <Text style={styles.infoValue}>150 kredi</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Ödül</Text>
          <Text style={styles.infoValue}>3.600 kredi</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.joinButton} activeOpacity={0.9}>
        <Ionicons name="rocket-outline" size={18} color="#FFFFFF" />
        <Text style={styles.joinText}>Lige Katıl</Text>
        <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.9)" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#161B22',
    borderColor: 'rgba(47,79,140,0.85)',
    borderRadius: 24,
    borderWidth: 1.5,
    marginBottom: 14,
    padding: 20,
  },
  footerRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  iconWrap: {
    alignItems: 'center',
    backgroundColor: PRIMARY_BLUE,
    borderRadius: 12,
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  infoBox: {
    backgroundColor: 'rgba(47,79,140,0.16)',
    borderColor: 'rgba(47,79,140,0.35)',
    borderRadius: 14,
    borderWidth: 1,
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  infoLabel: {
    color: '#9CA3AF',
    fontSize: 12,
    marginBottom: 4,
  },
  infoValue: {
    color: '#F0F6FC',
    fontSize: 15,
    fontWeight: '800',
  },
  joinButton: {
    alignItems: 'center',
    backgroundColor: PRIMARY_BLUE,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  joinText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  metaItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  metaRow: {
    gap: 8,
  },
  metaText: {
    color: '#A7B7D8',
    fontSize: 13,
    fontWeight: '600',
  },
  title: {
    color: '#F0F6FC',
    flex: 1,
    fontSize: 20,
    fontWeight: '900',
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
});
