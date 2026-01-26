import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { PageHeaderProps } from '../types';

export function PageHeader({ title, subtitle, onBack, onMenuToggle }: PageHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color="#F0F6FC" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{title}</Text>
          {!!subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
        </View>

        <TouchableOpacity onPress={onMenuToggle} activeOpacity={0.7}>
          <LinearGradient colors={["#10B981", "#059669"]} style={styles.checkIconGradient}>
            <Ionicons name="checkmark-circle" size={24} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#161B22',
    borderBottomWidth: 1,
    borderBottomColor: '#30363D',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#21262D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#F0F6FC',
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10B981',
  },
  checkIconGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});







