import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface QuestionDetailSkeletonProps {
  onBack: () => void;
}

export function QuestionDetailSkeleton({ onBack }: QuestionDetailSkeletonProps) {
  const insets = useSafeAreaInsets();
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    shimmerAnimation.start();

    return () => shimmerAnimation.stop();
  }, []);

  const shimmerOpacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const SkeletonBox = ({ width, height, style }: { width: number | string; height: number; style?: any }) => (
    <Animated.View
      style={[
        styles.skeletonBox,
        { width, height, opacity: shimmerOpacity },
        style,
      ]}
    />
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <SkeletonBox width={24} height={24} style={styles.backButton} />
        </View>
        <View style={styles.headerCenter}>
          <SkeletonBox width={120} height={20} />
        </View>
        <View style={styles.headerRight}>
          <SkeletonBox width={24} height={24} style={styles.shareButton} />
        </View>
      </View>

      {/* Question Image */}
      <View style={styles.imageContainer}>
        <SkeletonBox width="100%" height={200} style={styles.questionImage} />
      </View>

      {/* Question Content */}
      <View style={styles.content}>
        {/* Question Title */}
        <SkeletonBox width="90%" height={24} style={styles.questionTitle} />
        <SkeletonBox width="70%" height={20} style={[styles.questionTitle, { marginTop: 8 }]} />

        {/* Question Description */}
        <View style={styles.descriptionContainer}>
          <SkeletonBox width="100%" height={16} style={styles.descriptionLine} />
          <SkeletonBox width="95%" height={16} style={[styles.descriptionLine, { marginTop: 4 }]} />
          <SkeletonBox width="85%" height={16} style={[styles.descriptionLine, { marginTop: 4 }]} />
        </View>

        {/* Category and Time */}
        <View style={styles.metaContainer}>
          <SkeletonBox width={80} height={20} style={styles.categoryTag} />
          <SkeletonBox width={100} height={20} style={styles.timeTag} />
        </View>

        {/* Vote Buttons */}
        <View style={styles.voteContainer}>
          <View style={styles.voteButton}>
            <SkeletonBox width="100%" height={60} style={styles.voteButtonSkeleton} />
          </View>
          <View style={styles.voteButton}>
            <SkeletonBox width="100%" height={60} style={styles.voteButtonSkeleton} />
          </View>
        </View>

        {/* Statistics */}
        <View style={styles.statsContainer}>
          <SkeletonBox width="100%" height={120} style={styles.chartSkeleton} />
        </View>

        {/* Comments Section */}
        <View style={styles.commentsContainer}>
          <SkeletonBox width={100} height={20} style={styles.commentsTitle} />
          <View style={styles.commentItem}>
            <SkeletonBox width={40} height={40} style={styles.commentAvatar} />
            <View style={styles.commentContent}>
              <SkeletonBox width="80%" height={16} style={styles.commentText} />
              <SkeletonBox width="60%" height={16} style={[styles.commentText, { marginTop: 4 }]} />
            </View>
          </View>
          <View style={styles.commentItem}>
            <SkeletonBox width={40} height={40} style={styles.commentAvatar} />
            <View style={styles.commentContent}>
              <SkeletonBox width="70%" height={16} style={styles.commentText} />
              <SkeletonBox width="90%" height={16} style={[styles.commentText, { marginTop: 4 }]} />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerLeft: {
    flex: 1,
  },
  headerCenter: {
    flex: 2,
    alignItems: 'center',
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  backButton: {
    borderRadius: 12,
  },
  shareButton: {
    borderRadius: 12,
  },
  imageContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  questionImage: {
    borderRadius: 12,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  questionTitle: {
    borderRadius: 8,
  },
  descriptionContainer: {
    marginTop: 16,
  },
  descriptionLine: {
    borderRadius: 4,
  },
  metaContainer: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
  },
  categoryTag: {
    borderRadius: 16,
  },
  timeTag: {
    borderRadius: 16,
  },
  voteContainer: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 12,
  },
  voteButton: {
    flex: 1,
  },
  voteButtonSkeleton: {
    borderRadius: 12,
  },
  statsContainer: {
    marginTop: 24,
  },
  chartSkeleton: {
    borderRadius: 12,
  },
  commentsContainer: {
    marginTop: 24,
    paddingBottom: 20,
  },
  commentsTitle: {
    borderRadius: 4,
    marginBottom: 16,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  commentAvatar: {
    borderRadius: 20,
  },
  commentContent: {
    flex: 1,
  },
  commentText: {
    borderRadius: 4,
  },
  skeletonBox: {
    backgroundColor: '#E5E7EB',
  },
});
