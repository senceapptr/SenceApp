import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PageHeaderProps } from '../types';

const HEADER_BG = '#0D1117';
const SURFACE = '#161B22';
const BORDER = '#30363D';
const TEXT = '#F0F6FC';

export function PageHeader({ onBack }: PageHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={20} color={TEXT} />
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Market</Text>
        </View>

        <View style={styles.rightSpacer} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: HEADER_BG,
    borderBottomColor: BORDER,
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 14,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: SURFACE,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER,
  },
  headerInfo: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: TEXT,
  },
  rightSpacer: {
    width: 40,
    height: 40,
  },
});
