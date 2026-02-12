import React from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CategoryButtonProps } from '../types';

const PRIMARY_BLUE = '#256EFF';
const ACCENT_DARK = '#2F4F8C';
const TAB_RAIL = '#0F172A';
const BORDER = '#30363D';
const TEXT_PRIMARY = '#F0F6FC';
const TEXT_MUTED = '#9CA3AF';

export function CategoryButton({ category, isActive, onPress }: CategoryButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, isActive && styles.activeButton]}
      activeOpacity={0.7}
    >
      <View style={[styles.iconWrap, isActive && styles.activeIconWrap]}>
        <Ionicons name={category.iconName as any} size={16} color={isActive ? '#FFFFFF' : TEXT_MUTED} />
      </View>
      <Text style={[styles.text, isActive && styles.activeText]}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: TAB_RAIL,
    borderWidth: 1,
    borderColor: BORDER,
  },
  activeButton: {
    backgroundColor: ACCENT_DARK,
    borderColor: PRIMARY_BLUE,
  },
  iconWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    backgroundColor: 'rgba(148, 163, 184, 0.14)',
  },
  activeIconWrap: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
  },
  text: {
    fontSize: 14,
    fontWeight: '700',
    color: TEXT_PRIMARY,
  },
  activeText: {
    color: '#FFFFFF',
  },
});
