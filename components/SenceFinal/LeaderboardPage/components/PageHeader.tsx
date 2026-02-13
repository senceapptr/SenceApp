import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { PageHeaderProps } from '../types';

export function PageHeader({ onBack, onMenuToggle: _onMenuToggle }: PageHeaderProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.actionButton} onPress={onBack} activeOpacity={0.85}>
          <Ionicons name="chevron-back" size={22} color="#E2E8F0" />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Liderlik Tablosu</Text>
        </View>

        <View style={styles.rightSpacer} />
      </View>

      <View style={styles.metaRow}>
        <LinearGradient
          colors={['rgba(47, 79, 140, 0.28)', 'rgba(47, 79, 140, 0.08)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.liveBadge}
        >
          <View style={styles.liveDot} />
          <Text style={styles.liveBadgeText}>Canlı Sıralama</Text>
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    alignItems: 'center',
    backgroundColor: '#141D2C',
    borderColor: 'rgba(148, 163, 184, 0.22)',
    borderRadius: 21,
    borderWidth: 1,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  liveBadge: {
    alignItems: 'center',
    borderColor: 'rgba(47, 79, 140, 0.44)',
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  liveBadgeText: {
    color: '#C8D7F2',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  liveDot: {
    backgroundColor: '#6FA2FF',
    borderRadius: 3,
    height: 6,
    width: 6,
  },
  metaRow: {
    alignItems: 'center',
    marginTop: 10,
  },
  rightSpacer: {
    height: 42,
    width: 42,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 21,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  titleContainer: {
    alignItems: 'center',
    flex: 1,
  },
  wrapper: {
    borderBottomColor: 'rgba(148, 163, 184, 0.08)',
    borderBottomWidth: 1,
    paddingBottom: 8,
  },
});
