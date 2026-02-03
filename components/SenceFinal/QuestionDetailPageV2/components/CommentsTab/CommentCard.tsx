import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Theme } from '@/contexts/ThemeContext';
import type { Comment } from '../../types';

interface CommentCardProps {
  comment: Comment;
  theme: Theme;
  formatTimeAgo: (date: Date) => string;
}

export function CommentCard({ comment, theme, formatTimeAgo }: CommentCardProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: theme.surfaceCard,
        borderRadius: 16,
        padding: 16,
        marginBottom: 10,
        gap: 12,
        borderWidth: 1,
        borderColor: theme.border,
      }}
    >
      <Image source={{ uri: comment.avatar }} style={{ width: 40, height: 40, borderRadius: 20 }} />
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: theme.textPrimary }}>{comment.username}</Text>
          <Text style={{ fontSize: 12, color: theme.textMuted }}>{formatTimeAgo(comment.timestamp)}</Text>
        </View>
        <Text style={{ fontSize: 14, lineHeight: 20, color: theme.textSecondary, marginBottom: 8 }}>{comment.text}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Ionicons name="heart-outline" size={16} color={theme.textMuted + '99'} />
            <Text style={{ fontSize: 12, fontWeight: '700', color: theme.textMuted }}>{comment.likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={{ fontSize: 12, fontWeight: '700', color: theme.textMuted }}>Yanıtla</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
