import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import type { Theme } from '@/contexts/ThemeContext';
import type { MainQuestion } from '../types';

interface QuestionDetailHeaderProps {
  mainQuestion: MainQuestion;
  theme: Theme;
  onBack: () => void;
  onShare: () => void;
  onToggleFavorite: () => void;
  isFavorite: boolean;
  insets: { top: number };
}

export function QuestionDetailHeader({
  mainQuestion,
  theme,
  onBack,
  onShare,
  onToggleFavorite,
  isFavorite,
  insets,
}: QuestionDetailHeaderProps) {
  return (
    <>
      <View style={[localStyles.headerNav, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={[localStyles.navButton, { backgroundColor: theme.surface + 'D9', borderColor: theme.border }]} onPress={onBack} activeOpacity={0.8}>
          <Ionicons name="chevron-back" size={22} color={theme.textPrimary} />
        </TouchableOpacity>
        <View style={localStyles.headerNavRight}>
          <TouchableOpacity style={[localStyles.navButton, { backgroundColor: theme.surface + 'D9', borderColor: theme.border }]} onPress={onShare} activeOpacity={0.8}>
            <Ionicons name="share-social" size={20} color={theme.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={[localStyles.navButton, { backgroundColor: theme.surface + 'D9', borderColor: theme.border }]} onPress={onToggleFavorite} activeOpacity={0.8}>
            <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={22} color={isFavorite ? theme.error : theme.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={localStyles.fixedHeaderBackground}>
        <Image
          source={{ uri: mainQuestion.image || 'https://images.unsplash.com/photo-1574477942438-5db6de70fd34?w=800&h=600&fit=crop' }}
          style={localStyles.headerImage}
          resizeMode="cover"
        />
        <LinearGradient colors={['rgba(0,0,0,0.2)', 'transparent']} style={localStyles.headerGradient} />
        <View style={localStyles.categoryBadgeContainer}>
          <View style={[localStyles.categoryBadge, { backgroundColor: theme.surface + 'D9', borderColor: theme.border }]}>
            <Text style={localStyles.categoryIcon}>{mainQuestion.categoryIcon}</Text>
            <Text style={[localStyles.categoryText, { color: theme.textPrimary }]}>{mainQuestion.category}</Text>
          </View>
        </View>
      </View>
    </>
  );
}

const localStyles = StyleSheet.create({
  headerNav: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    zIndex: 1000,
  },
  headerNavRight: { flexDirection: 'row', gap: 12 },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fixedHeaderBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 260,
    zIndex: 10,
    overflow: 'hidden',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerImage: {
    width: '100%',
    height: '100%',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  categoryBadgeContainer: { position: 'absolute', bottom: 24, right: 20 },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
    borderWidth: 1,
  },
  categoryIcon: { fontSize: 20 },
  categoryText: { fontSize: 14, fontWeight: '900' },
});
