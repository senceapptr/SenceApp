import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CommentInput } from './CommentInput';
import { CommentCard } from './CommentCard';
import type { Theme } from '@/contexts/ThemeContext';
import type { Comment } from '../../types';

interface CommentsTabProps {
  theme: Theme;
  userAvatar: string;
  comments: Comment[];
  commentText: string;
  onCommentTextChange: (text: string) => void;
  onSendComment: () => void;
  formatTimeAgo: (date: Date) => string;
  isLoggedIn: boolean;
}

export function CommentsTab({
  theme,
  userAvatar,
  comments,
  commentText,
  onCommentTextChange,
  onSendComment,
  formatTimeAgo,
  isLoggedIn,
}: CommentsTabProps) {
  return (
    <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 0 }}>
      {isLoggedIn && (
        <CommentInput
          theme={theme}
          avatarUri={userAvatar}
          value={commentText}
          onChangeText={onCommentTextChange}
          onSend={onSendComment}
          disabled={!commentText.trim()}
        />
      )}
      <Text style={{ fontSize: 18, fontWeight: '900', color: theme.textPrimary, marginBottom: 12 }}>Tüm Yorumlar ({comments.length})</Text>
      {comments.length === 0 ? (
        <View
          style={{
            backgroundColor: theme.surfaceCard,
            borderRadius: 16,
            padding: 32,
            borderWidth: 1,
            borderColor: theme.border,
            alignItems: 'center',
          }}
        >
          <Ionicons name="chatbubble-outline" size={48} color={theme.textMuted} />
          <Text style={{ fontSize: 16, color: theme.textMuted, marginTop: 12, textAlign: 'center' }}>Henüz yorum yok</Text>
          <Text style={{ fontSize: 14, color: theme.textMuted + 'AA', marginTop: 4 }}>İlk yorumu sen yap!</Text>
        </View>
      ) : (
        comments.map((comment, index) => (
          <CommentCard key={`comment-${comment.id}-${index}`} comment={comment} theme={theme} formatTimeAgo={formatTimeAgo} />
        ))
      )}
    </View>
  );
}
