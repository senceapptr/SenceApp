import { MaterialCommunityIcons, Ionicons, FontAwesome, Feather } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';

interface QuestionDetailSheetProps {
  isOpen: boolean;
  onClose: () => void;
  question: {
    id: string;
    image: string;
    question: string;
    description: string;
    yesPercentage: number;
    noPercentage: number;
  } | null;
}

export default function QuestionDetailSheet({ isOpen, onClose, question }: QuestionDetailSheetProps) {
  if (!isOpen || !question) return null;

  const XIcon = (props: any) => <Feather name="x" {...props} />;
  const TrendingUpIcon = (props: any) => <Feather name="trending-up" {...props} />;
  const UsersIcon = (props: any) => <Feather name="users" {...props} />;
  const MessageCircleIcon = (props: any) => <Feather name="message-circle" {...props} />;
  const Share2Icon = (props: any) => <Feather name="share-2" {...props} />;

  return (
    <View style={styles.overlay}>
      {/* Backdrop */}
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
      {/* Bottom sheet */}
      <View style={styles.sheet}>
        {/* Handle bar */}
        <View style={styles.handleBar} />
        <ScrollView contentContainerStyle={styles.contentScroll}>
          {/* Header with image */}
          <View style={styles.headerImageBox}>
            <Image
              source={{ uri: question.image }}
              style={styles.headerImage}
              resizeMode="cover"
            />
            {/* Header controls */}
            <View style={styles.headerControls}>
              <TouchableOpacity style={styles.iconButton} onPress={onClose}>
                <XIcon size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Share2Icon size={18} color="#fff" />
              </TouchableOpacity>
            </View>
            {/* Stats overlay */}
            <View style={styles.statsOverlay}>
              <View style={styles.statBadge}>
                <TrendingUpIcon size={14} color="#F59E42" />
                <Text style={styles.statBadgeText}>Trending</Text>
              </View>
              <View style={styles.statBadge}>
                <UsersIcon size={14} color="#fff" />
                <Text style={styles.statBadgeText}>15.2K votes</Text>
              </View>
            </View>
          </View>
          {/* Content */}
          <View style={styles.contentBox}>
            <Text style={styles.questionTitle}>{question.question}</Text>
            {/* Prediction stats */}
            <View style={styles.predictionBox}>
              <View style={styles.predictionHeader}>
                <Text style={styles.predictionHeaderText}>Current Predictions</Text>
                <View style={styles.predictionLiveRow}>
                  <TrendingUpIcon size={14} color="#6b7280" />
                  <Text style={styles.predictionLiveText}>Live</Text>
                </View>
              </View>
              {/* Progress bar */}
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarYes, { width: `${question.yesPercentage}%` }]} />
                <View style={[styles.progressBarNo, { width: `${question.noPercentage}%` }]} />
              </View>
              <View style={styles.predictionPercentsRow}>
                <View style={styles.percentBox}><Text style={styles.percentYes}>{question.yesPercentage}%</Text><Text style={styles.percentLabel}>Yes</Text></View>
                <View style={styles.percentBox}><Text style={styles.percentNo}>{question.noPercentage}%</Text><Text style={styles.percentLabel}>No</Text></View>
              </View>
            </View>
            {/* Action buttons */}
            <View style={styles.actionRow}>
              <TouchableOpacity style={[styles.actionButton, styles.actionButtonYes]}><Text style={styles.actionButtonText}>Yes {question.yesPercentage}%</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, styles.actionButtonNo]}><Text style={styles.actionButtonText}>No {question.noPercentage}%</Text></TouchableOpacity>
            </View>
            {/* Description */}
            <View style={styles.descBox}>
              <Text style={styles.descTitle}>About This Prediction</Text>
              <Text style={styles.descText}>{question.description}</Text>
            </View>
            {/* Chart placeholder */}
            <View style={styles.chartBox}>
              <Text style={styles.chartTitle}>Prediction Trends</Text>
              <View style={styles.chartInnerBox}>
                <TrendingUpIcon size={32} color="#7C3AED" style={{ marginBottom: 12 }} />
                <Text style={styles.chartText}>Live Chart Coming Soon</Text>
                <Text style={styles.chartSubText}>Real-time analytics</Text>
              </View>
            </View>
            {/* Comments section */}
            <View style={styles.commentsBox}>
              <View style={styles.commentsHeader}>
                <Text style={styles.commentsTitle}>Discussion</Text>
                <View style={styles.commentsCountRow}>
                  <MessageCircleIcon size={14} color="#6b7280" />
                  <Text style={styles.commentsCount}>234</Text>
                </View>
              </View>
              {/* Sample comments */}
              <View style={styles.commentRow}>
                <View style={styles.commentAvatar}><Text style={styles.commentAvatarText}>AM</Text></View>
                <View style={styles.commentContentBox}>
                  <View style={styles.commentBubble}>
                    <View style={styles.commentMetaRow}>
                      <Text style={styles.commentAuthor}>Alex M.</Text>
                      <Text style={styles.commentTime}>2h</Text>
                      <Text style={styles.commentYes}>YES</Text>
                    </View>
                    <Text style={styles.commentText}>I think this is very likely based on recent trends...</Text>
                  </View>
                </View>
              </View>
              <View style={styles.commentRow}>
                <View style={[styles.commentAvatar, { backgroundColor: '#F59E42' }]}><Text style={styles.commentAvatarText}>SK</Text></View>
                <View style={styles.commentContentBox}>
                  <View style={styles.commentBubble}>
                    <View style={styles.commentMetaRow}>
                      <Text style={styles.commentAuthor}>Sarah K.</Text>
                      <Text style={styles.commentTime}>5h</Text>
                      <Text style={styles.commentNo}>NO</Text>
                    </View>
                    <Text style={styles.commentText}>Not sure about this. Data suggests otherwise...</Text>
                  </View>
                </View>
              </View>
              {/* Load more */}
              <TouchableOpacity style={styles.loadMoreButton}><Text style={styles.loadMoreText}>Load more comments</Text></TouchableOpacity>
            </View>
            {/* Bottom padding for safe area */}
            <View style={{ height: 16 }} />
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 50,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    width: '100%',
    maxWidth: 420,
    height: '75%',
    backgroundColor: '#F5F3FF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    position: 'relative',
  },
  handleBar: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    marginTop: 12,
    marginBottom: 8,
  },
  contentScroll: {
    paddingBottom: 24,
  },
  headerImageBox: {
    height: 180,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  headerControls: {
    position: 'absolute',
    top: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    zIndex: 10,
  },
  iconButton: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 24,
    padding: 10,
  },
  statsOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 24,
    right: 24,
    flexDirection: 'row',
    gap: 8,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  statBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  contentBox: {
    padding: 24,
  },
  questionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 16,
  },
  predictionBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#F3F3F3',
  },
  predictionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  predictionHeaderText: {
    fontWeight: 'bold',
    color: '#222',
    fontSize: 13,
  },
  predictionLiveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  predictionLiveText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 2,
  },
  progressBarBg: {
    flexDirection: 'row',
    height: 10,
    backgroundColor: '#E5E7EB',
    borderRadius: 5,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBarYes: {
    backgroundColor: '#22C55E',
    height: '100%',
  },
  progressBarNo: {
    backgroundColor: '#EF4444',
    height: '100%',
  },
  predictionPercentsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  percentBox: {
    alignItems: 'center',
    flex: 1,
  },
  percentYes: {
    color: '#22C55E',
    fontWeight: 'bold',
    fontSize: 18,
  },
  percentNo: {
    color: '#EF4444',
    fontWeight: 'bold',
    fontSize: 18,
  },
  percentLabel: {
    fontSize: 12,
    color: '#666',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  actionButtonYes: {
    backgroundColor: '#22C55E',
  },
  actionButtonNo: {
    backgroundColor: '#EF4444',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  descBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F3F3F3',
  },
  descTitle: {
    fontWeight: 'bold',
    color: '#222',
    fontSize: 13,
    marginBottom: 4,
  },
  descText: {
    color: '#444',
    fontSize: 13,
  },
  chartBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F3F3F3',
  },
  chartTitle: {
    fontWeight: 'bold',
    color: '#222',
    fontSize: 13,
    marginBottom: 8,
  },
  chartInnerBox: {
    backgroundColor: '#F3E8FF',
    borderRadius: 10,
    padding: 18,
    alignItems: 'center',
  },
  chartText: {
    color: '#222',
    fontWeight: '500',
    fontSize: 14,
    marginBottom: 2,
  },
  chartSubText: {
    color: '#888',
    fontSize: 12,
  },
  commentsBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F3F3F3',
  },
  commentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  commentsTitle: {
    fontWeight: 'bold',
    color: '#222',
    fontSize: 13,
  },
  commentsCountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  commentsCount: {
    fontSize: 12,
    color: '#666',
    marginLeft: 2,
  },
  commentRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  commentAvatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  commentContentBox: {
    flex: 1,
  },
  commentBubble: {
    backgroundColor: '#F3F3F3',
    borderRadius: 10,
    padding: 10,
  },
  commentMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  commentAuthor: {
    fontWeight: '500',
    color: '#222',
    fontSize: 12,
  },
  commentTime: {
    fontSize: 11,
    color: '#888',
  },
  commentYes: {
    backgroundColor: '#22C55E',
    color: '#fff',
    fontSize: 11,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 4,
  },
  commentNo: {
    backgroundColor: '#EF4444',
    color: '#fff',
    fontSize: 11,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 4,
  },
  commentText: {
    color: '#444',
    fontSize: 12,
  },
  loadMoreButton: {
    marginTop: 8,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#EDE7F6',
  },
  loadMoreText: {
    color: '#7C3AED',
    fontWeight: '500',
    fontSize: 13,
  },
});