import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import type { Theme } from '@/contexts/ThemeContext';
import type { TabType } from '../types';
import { DetailsTab } from './DetailsTab';
import { CommentsTab } from './CommentsTab';
import { StatsTab } from './StatsTab';
import type { MainQuestion, RelatedQuestion, Comment, TopInvestor } from '../types';

interface QuestionDetailTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  theme: Theme;
  mainQuestion: MainQuestion;
  relatedQuestions: RelatedQuestion[];
  comments: Comment[];
  topInvestors: TopInvestor[];
  commentText: string;
  onCommentTextChange: (text: string) => void;
  onSendComment: () => void;
  formatTimeAgo: (date: Date) => string;
  isFollowingCreator: boolean;
  followLoading: boolean;
  isOwnQuestion: boolean;
  onFollowToggle: () => void;
  onRelatedFavoriteToggle: (id: number) => void;
  userAvatar: string;
  isLoggedIn: boolean;
}

export function QuestionDetailTabs({
  activeTab,
  onTabChange,
  theme,
  mainQuestion,
  relatedQuestions,
  comments,
  topInvestors,
  commentText,
  onCommentTextChange,
  onSendComment,
  formatTimeAgo,
  isFollowingCreator,
  followLoading,
  isOwnQuestion,
  onFollowToggle,
  onRelatedFavoriteToggle,
  userAvatar,
  isLoggedIn,
}: QuestionDetailTabsProps) {
  return (
    <>
      <View style={{ flexDirection: 'row', gap: 4, marginBottom: 4, paddingHorizontal: 4 }}>
        <TouchableOpacity
          style={[{ flex: 1, paddingTop: 6, paddingBottom: 12, paddingHorizontal: 4, borderTopLeftRadius: 16, borderTopRightRadius: 16, position: 'relative' }, activeTab === 'details' && { backgroundColor: theme.accent + '1A' }]}
          onPress={() => onTabChange('details')}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <Text style={{ fontSize: 14 }}>📝</Text>
            <Text style={[{ fontSize: 12, fontWeight: '900', color: theme.textMuted }, activeTab === 'details' && { color: theme.accent }]}>Soru Detay</Text>
          </View>
          {activeTab === 'details' && <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, backgroundColor: theme.accent, borderRadius: 2 }} />}
        </TouchableOpacity>
        <TouchableOpacity
          style={[{ flex: 1, paddingTop: 6, paddingBottom: 12, paddingHorizontal: 4, borderTopLeftRadius: 16, borderTopRightRadius: 16, position: 'relative' }, activeTab === 'comments' && { backgroundColor: theme.accent + '1A' }]}
          onPress={() => onTabChange('comments')}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <Ionicons name="chatbubble-outline" size={14} color={activeTab === 'comments' ? theme.accent : theme.textMuted + '99'} />
            <Text style={[{ fontSize: 12, fontWeight: '900', color: theme.textMuted }, activeTab === 'comments' && { color: theme.accent }]}>Yorumlar</Text>
            <View style={[{ backgroundColor: theme.surfaceCard, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 }, activeTab === 'comments' && { backgroundColor: theme.accent }]}>
              <Text style={[{ fontSize: 12, fontWeight: '700', color: theme.textMuted }, activeTab === 'comments' && { color: theme.textInverse }]}>{comments.length}</Text>
            </View>
          </View>
          {activeTab === 'comments' && <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, backgroundColor: theme.accent, borderRadius: 2 }} />}
        </TouchableOpacity>
        <TouchableOpacity
          style={[{ flex: 1, paddingTop: 6, paddingBottom: 12, paddingHorizontal: 4, borderTopLeftRadius: 16, borderTopRightRadius: 16, position: 'relative' }, activeTab === 'stats' && { backgroundColor: theme.accent + '1A' }]}
          onPress={() => onTabChange('stats')}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <Ionicons name="bar-chart" size={14} color={activeTab === 'stats' ? theme.accent : theme.textMuted + '99'} />
            <Text style={[{ fontSize: 12, fontWeight: '900', color: theme.textMuted }, activeTab === 'stats' && { color: theme.accent }]}>İstatistikler</Text>
          </View>
          {activeTab === 'stats' && <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, backgroundColor: theme.accent, borderRadius: 2 }} />}
        </TouchableOpacity>
      </View>
      <LinearGradient colors={['transparent', theme.accent + '33', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ height: 1, marginBottom: 0 }} />
      {activeTab === 'details' && (
        <DetailsTab
          mainQuestion={mainQuestion}
          theme={theme}
          relatedQuestions={relatedQuestions}
          isFollowingCreator={isFollowingCreator}
          followLoading={followLoading}
          isOwnQuestion={isOwnQuestion}
          onFollowToggle={onFollowToggle}
          onRelatedFavoriteToggle={onRelatedFavoriteToggle}
        />
      )}
      {activeTab === 'comments' && (
        <CommentsTab
          theme={theme}
          userAvatar={userAvatar}
          comments={comments}
          commentText={commentText}
          onCommentTextChange={onCommentTextChange}
          onSendComment={onSendComment}
          formatTimeAgo={formatTimeAgo}
          isLoggedIn={isLoggedIn}
        />
      )}
      {activeTab === 'stats' && <StatsTab mainQuestion={mainQuestion} theme={theme} topInvestors={topInvestors} />}
    </>
  );
}
