import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PageHeaderProps } from '../types';

export function PageHeader({ title, subtitle, onBack }: PageHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onBack}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#F0F6FC" />
        </TouchableOpacity>

        <View style={styles.titleSection}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#21262D',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  titleSection: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#F0F6FC',
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#8B949E',
    marginTop: 2,
  },
});
