import React from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { Theme } from '@/contexts/ThemeContext';
import type { MainQuestion } from '../../types';

interface CreatorCardProps {
  mainQuestion: MainQuestion;
  theme: Theme;
  isFollowing: boolean;
  followLoading: boolean;
  isOwnQuestion: boolean;
  onFollowToggle: () => void;
}

export function CreatorCard({ mainQuestion, theme, isFollowing, followLoading, isOwnQuestion, onFollowToggle }: CreatorCardProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.surfaceCard,
        padding: 16,
        borderRadius: 16,
        gap: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: theme.border,
      }}
    >
      <Image source={{ uri: mainQuestion.creator.avatar }} style={{ width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: theme.textInverse }} />
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 10, color: theme.textMuted, marginBottom: 2 }}>Soruyu Yazan</Text>
        <Text style={{ fontSize: 14, fontWeight: '700', color: theme.accent }}>
          <Text style={{ color: theme.accent }}>@</Text>
          {mainQuestion.creator.username}
        </Text>
      </View>
      {!isOwnQuestion && (
        <TouchableOpacity onPress={onFollowToggle} disabled={followLoading} activeOpacity={0.8} style={{ borderRadius: 20, overflow: 'hidden' }}>
          <LinearGradient
            colors={isFollowing ? [theme.border, theme.surfaceCard] : [theme.accent, theme.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ paddingHorizontal: 16, paddingVertical: 8 }}
          >
            {followLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#fff' }}>{isFollowing ? 'Takiptesin' : 'Takip Et'}</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );
}
