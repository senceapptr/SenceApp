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
          <Ionicons name="chevron-back" size={24} color="#202020" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{title}</Text>
          {!!subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
        </View>

        <TouchableOpacity onPress={onMenuToggle} activeOpacity={0.7}>
          <LinearGradient colors={["#c61585", "#432870"]} style={styles.checkIconGradient}>
            <Ionicons name="checkmark-circle" size={24} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F2F3F5',
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
    backgroundColor: '#F2F3F5',
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
    color: '#202020',
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#432870',
  },
  checkIconGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});






