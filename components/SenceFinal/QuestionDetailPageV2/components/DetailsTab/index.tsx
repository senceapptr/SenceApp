import React from 'react';
import { View, Text } from 'react-native';
import { CreatorCard } from './CreatorCard';
import { VoteStatsSection } from './VoteStatsSection';
import { RelatedQuestionsSection } from './RelatedQuestionsSection';
import type { Theme } from '@/contexts/ThemeContext';
import type { MainQuestion, RelatedQuestion } from '../../types';

interface DetailsTabProps {
  mainQuestion: MainQuestion;
  theme: Theme;
  relatedQuestions: RelatedQuestion[];
  isFollowingCreator: boolean;
  followLoading: boolean;
  isOwnQuestion: boolean;
  onFollowToggle: () => void;
  onRelatedFavoriteToggle: (id: number) => void;
}

export function DetailsTab({
  mainQuestion,
  theme,
  relatedQuestions,
  isFollowingCreator,
  followLoading,
  isOwnQuestion,
  onFollowToggle,
  onRelatedFavoriteToggle,
}: DetailsTabProps) {
  return (
    <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 0 }}>
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 16, lineHeight: 24, color: theme.textSecondary }}>{mainQuestion.fullDescription}</Text>
      </View>
      <CreatorCard
        mainQuestion={mainQuestion}
        theme={theme}
        isFollowing={isFollowingCreator}
        followLoading={followLoading}
        isOwnQuestion={isOwnQuestion}
        onFollowToggle={onFollowToggle}
      />
      <VoteStatsSection mainQuestion={mainQuestion} theme={theme} />
      <RelatedQuestionsSection relatedQuestions={relatedQuestions} theme={theme} onFavoriteToggle={onRelatedFavoriteToggle} />
    </View>
  );
}
