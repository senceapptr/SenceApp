import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Theme } from '@/contexts/ThemeContext';
import type { RelatedQuestion } from '../../types';

interface RelatedQuestionsSectionProps {
  relatedQuestions: RelatedQuestion[];
  theme: Theme;
  onFavoriteToggle: (id: number) => void;
  onQuestionPress?: (id: number) => void;
}

export function RelatedQuestionsSection({ relatedQuestions, theme, onFavoriteToggle }: RelatedQuestionsSectionProps) {
  if (relatedQuestions.length === 0) {
    return (
      <View style={{ marginBottom: 8 }}>
        <Text style={{ fontSize: 20, fontWeight: '900', color: theme.textPrimary, marginBottom: 12 }}>Benzer Sorular</Text>
        <View
          style={{
            backgroundColor: theme.surfaceCard,
            borderRadius: 16,
            padding: 24,
            borderWidth: 1,
            borderColor: theme.border,
            alignItems: 'center',
          }}
        >
          <Ionicons name="document-text-outline" size={40} color={theme.textMuted} />
          <Text style={{ fontSize: 14, color: theme.textMuted, marginTop: 8 }}>Henüz benzer soru bulunamadı</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ marginBottom: 8 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <Text style={{ fontSize: 20, fontWeight: '900', color: theme.textPrimary }}>Benzer Sorular</Text>
        <TouchableOpacity>
          <Text style={{ fontSize: 14, fontWeight: '700', color: theme.accent }}>Tümünü Gör</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 24 }}>
        {relatedQuestions.map((q, index) => (
          <View
            key={`related-${q.id}-${index}`}
            style={{
              width: 280,
              backgroundColor: theme.surfaceCard,
              borderRadius: 24,
              borderWidth: 1,
              borderColor: theme.border,
              overflow: 'hidden',
              marginRight: 16,
            }}
          >
            <View style={{ height: 192, position: 'relative' }}>
              <Image source={{ uri: q.image }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: theme.surface + 'E6',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => onFavoriteToggle(q.id)}
              >
                <Ionicons name={q.isFavorite ? 'heart' : 'heart-outline'} size={20} color={q.isFavorite ? theme.error : theme.textPrimary} />
              </TouchableOpacity>
            </View>
            <View style={{ padding: 16 }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: theme.textPrimary, marginBottom: 8, lineHeight: 22 }} numberOfLines={2}>
                {q.title}
              </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                <Text style={{ fontSize: 14, color: theme.textMuted }}>{q.daysLeft} gün</Text>
                <Text style={{ fontSize: 14, color: theme.textMuted }}>₺{q.odds}/kişi</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Ionicons name="star" size={16} color={theme.accent} />
                  <Text style={{ fontSize: 14, fontWeight: '700', color: theme.textPrimary }}>{q.rating}</Text>
                  <Text style={{ fontSize: 12, color: theme.textMuted }}>{q.votes} oy</Text>
                </View>
                <TouchableOpacity style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: theme.accent, alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name="arrow-forward" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
