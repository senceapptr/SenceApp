import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  ScrollView, 
  Image, 
  TextInput,
  StyleSheet,
  Dimensions,
  SafeAreaView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface QuestionDetailProps {
  isOpen: boolean;
  onClose: () => void;
  question: any;
  onVote: (questionId: number, vote: 'yes' | 'no', odds: number) => void;
}

export function QuestionDetail({ isOpen, onClose, question, onVote }: QuestionDetailProps) {
  const [selectedVote, setSelectedVote] = useState<'yes' | 'no' | null>(null);
  const [activeTab, setActiveTab] = useState<'comments' | 'top-bettors'>('comments');
  const [commentText, setCommentText] = useState('');

  if (!isOpen || !question) return null;

  const handleVote = (vote: 'yes' | 'no') => {
    setSelectedVote(vote);
    const odds = vote === 'yes' ? question.yesOdds : question.noOdds;
    onVote(question.id, vote, odds);
    
    setTimeout(() => {
      onClose();
      setSelectedVote(null);
    }, 1500);
  };

  const yesPercentage = question.yesPercentage || 65;
  const noPercentage = 100 - yesPercentage;

  // Mock data for comments and top bettors
  const comments = [
    { id: 1, user: 'Ali_Kaya', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face', comment: 'Bu kesinlikle gerçekleşecek! Çok güçlü sinyaller var.', time: '2 saat önce' },
    { id: 2, user: 'Zeynep_A', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b95a9cef?w=32&h=32&fit=crop&crop=face', comment: 'Bence biraz riskli ama denemeye değer.', time: '4 saat önce' },
    { id: 3, user: 'Mehmet123', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face', comment: 'Geçmiş veriler bunu destekliyor 📈', time: '6 saat önce' }
  ];

  const topBettors = {
    yes: [
      { user: 'CryptoKing', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face', bet: 2500 },
      { user: 'TahminMaster', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face', bet: 1800 },
      { user: 'ProTrader', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face', bet: 1200 }
    ],
    no: [
      { user: 'SafePlayer', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b95a9cef?w=32&h=32&fit=crop&crop=face', bet: 2000 },
      { user: 'RiskAnalyst', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=32&h=32&fit=crop&crop=face', bet: 1500 },
      { user: 'MarketBear', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face', bet: 900 }
    ]
  };

  const questionAuthor = {
    name: 'TahminExpert',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    verified: true
  };

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <SafeAreaView style={styles.container}>
        {/* Header Image */}
        <View style={styles.headerImage}>
          <Image 
            source={{ uri: question.image || 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=320&fit=crop' }}
            style={styles.image}
            resizeMode="cover"
          />
          
          {/* Header Overlay */}
          <LinearGradient
            colors={['rgba(0,0,0,0.2)', 'transparent', 'rgba(0,0,0,0.6)']}
            style={styles.imageOverlay}
          />
          
          {/* Header Controls */}
          <View style={styles.headerControls}>
            <TouchableOpacity
              onPress={onClose}
              style={styles.headerButton}
            >
              <Ionicons name="chevron-back" size={20} color="white" />
            </TouchableOpacity>
            
            <View style={styles.categoryTag}>
              <Text style={styles.categoryText}>{question.category}</Text>
            </View>
            
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="heart-outline" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Scrollable Content */}
        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* Question Title & Info */}
            <View style={styles.titleSection}>
              <Text style={styles.questionTitle}>{question.title}</Text>
            </View>
            
            {/* Vote Count, Time & Question Author */}
            <View style={styles.infoSection}>
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <Ionicons name="people" size={16} color="#666" />
                  <Text style={styles.infoText}>{question.votes || '14,6K oy'}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Ionicons name="time" size={16} color="#666" />
                  <Text style={styles.infoText}>2 gün kaldı</Text>
                </View>
              </View>

              {/* Question Author */}
              <View style={styles.authorSection}>
                <Image 
                  source={{ uri: questionAuthor.avatar }}
                  style={styles.authorAvatar}
                />
                <Text style={styles.authorName}>{questionAuthor.name}</Text>
                {questionAuthor.verified && (
                  <Ionicons name="checkmark-circle" size={16} color="#432870" />
                )}
              </View>
            </View>

            {/* Author Info */}
            <View style={styles.participantsSection}>
              <View style={styles.avatarGroup}>
                <Image 
                  source={{ uri: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" }}
                  style={styles.participantAvatar}
                />
                <Image 
                  source={{ uri: "https://images.unsplash.com/photo-1494790108755-2616b95a9cef?w=32&h=32&fit=crop&crop=face" }}
                  style={styles.participantAvatar}
                />
                <Image 
                  source={{ uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face" }}
                  style={styles.participantAvatar}
                />
              </View>
              <Text style={styles.participantsText}>+{(question.votes || 1247) - 3} katılımcı</Text>
            </View>

            {/* Odds Chart Placeholder */}
            <View style={styles.chartSection}>
              <Text style={styles.chartTitle}>Oran Değişim Grafiği</Text>
              <Text style={styles.chartSubtitle}>Gerçek zamanlı oran hareketleri</Text>
              <View style={styles.chartPlaceholder}>
                <Ionicons name="bar-chart" size={24} color="#432870" />
                <Text style={styles.chartPlaceholderText}>Yakında</Text>
              </View>
            </View>

            {/* Percentage Bars */}
            <View style={styles.percentageSection}>
              <View style={styles.percentageHeader}>
                <View style={styles.percentageItem}>
                  <Text style={styles.percentageText}>{yesPercentage}%</Text>
                  <Text style={styles.percentageLabel}>Evet</Text>
                </View>
                <View style={styles.percentageItem}>
                  <Text style={styles.percentageLabel}>Hayır</Text>
                  <Text style={styles.percentageText}>{noPercentage}%</Text>
                </View>
              </View>
              
              {/* Progress Bar */}
              <View style={styles.progressBar}>
                <View 
                  style={[styles.progressFill, { width: `${yesPercentage}%` }]} 
                />
              </View>
            </View>

            {/* Vote Buttons */}
            <View style={styles.voteSection}>
              <TouchableOpacity
                onPress={() => handleVote('yes')}
                disabled={selectedVote !== null}
                style={[
                  styles.voteButton,
                  styles.yesButton,
                  selectedVote === 'yes' && styles.selectedButton
                ]}
              >
                <Text style={styles.voteIcon}>✓</Text>
                <Text style={styles.voteText}>EVET</Text>
                <Text style={styles.voteOdds}>{question.yesOdds}x</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleVote('no')}
                disabled={selectedVote !== null}
                style={[
                  styles.voteButton,
                  styles.noButton,
                  selectedVote === 'no' && styles.selectedButton
                ]}
              >
                <Text style={styles.voteIcon}>✗</Text>
                <Text style={styles.voteText}>HAYIR</Text>
                <Text style={styles.voteOdds}>{question.noOdds}x</Text>
              </TouchableOpacity>
            </View>

            {/* Success Message */}
            {selectedVote && (
              <View style={styles.successMessage}>
                <Text style={styles.successTitle}>🎉 Tahmin Kuponuna Eklendi!</Text>
                <Text style={styles.successSubtitle}>Kuponunu görmek için ekranı kapatabilirsin</Text>
              </View>
            )}

            {/* Description */}
            {question.description && (
              <View style={styles.descriptionSection}>
                <Text style={styles.descriptionTitle}>Açıklama</Text>
                <Text style={styles.descriptionText}>{question.description}</Text>
              </View>
            )}
          </View>

          {/* Modern Tabs */}
          <View style={styles.tabsContainer}>
            <View style={styles.tabs}>
              <TouchableOpacity
                onPress={() => setActiveTab('comments')}
                style={[
                  styles.tab,
                  activeTab === 'comments' && styles.activeTab
                ]}
              >
                <Ionicons name="chatbubble" size={16} color={activeTab === 'comments' ? '#432870' : '#666'} />
                <Text style={[styles.tabText, activeTab === 'comments' && styles.activeTabText]}>
                  Yorumlar
                </Text>
                <View style={styles.tabBadge}>
                  <Text style={styles.tabBadgeText}>{comments.length}</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => setActiveTab('top-bettors')}
                style={[
                  styles.tab,
                  activeTab === 'top-bettors' && styles.activeTab
                ]}
              >
                <Ionicons name="trending-up" size={16} color={activeTab === 'top-bettors' ? '#432870' : '#666'} />
                <Text style={[styles.tabText, activeTab === 'top-bettors' && styles.activeTabText]}>
                  En Çok Bahis Yapanlar
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Tab Content */}
          <View style={styles.tabContent}>
            {activeTab === 'comments' && (
              <View style={styles.commentsSection}>
                {/* Comment Input */}
                <View style={styles.commentInput}>
                  <Image 
                    source={{ uri: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" }}
                    style={styles.commentAvatar}
                  />
                  <TextInput
                    placeholder="Yorum yaz..."
                    value={commentText}
                    onChangeText={setCommentText}
                    style={styles.commentTextInput}
                    placeholderTextColor="#666"
                  />
                  {commentText.trim() && (
                    <TouchableOpacity style={styles.sendButton}>
                      <Ionicons name="send" size={16} color="white" />
                    </TouchableOpacity>
                  )}
                </View>

                {/* Comments List */}
                {comments.map((comment) => (
                  <View key={comment.id} style={styles.commentItem}>
                    <Image 
                      source={{ uri: comment.avatar }}
                      style={styles.commentUserAvatar}
                    />
                    <View style={styles.commentContent}>
                      <View style={styles.commentHeader}>
                        <Text style={styles.commentUsername}>{comment.user}</Text>
                        <Text style={styles.commentTime}>{comment.time}</Text>
                      </View>
                      <Text style={styles.commentText}>{comment.comment}</Text>
                      
                      <View style={styles.commentActions}>
                        <TouchableOpacity style={styles.commentAction}>
                          <Text style={styles.commentActionText}>👍 Beğen</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.commentAction}>
                          <Text style={styles.commentActionText}>Yanıtla</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {activeTab === 'top-bettors' && (
              <View style={styles.bettorsSection}>
                <View style={styles.bettorGroup}>
                  <View style={styles.bettorHeader}>
                    <View style={styles.bettorIcon}>
                      <Text style={styles.bettorIconText}>✓</Text>
                    </View>
                    <Text style={styles.bettorTitle}>EVET Tarafı</Text>
                  </View>
                  {topBettors.yes.map((bettor, index) => (
                    <View key={index} style={styles.bettorItem}>
                      <View style={styles.bettorInfo}>
                        <View style={styles.bettorAvatarContainer}>
                          <Image 
                            source={{ uri: bettor.avatar }}
                            style={styles.bettorAvatar}
                          />
                          <View style={styles.bettorRank}>
                            <Text style={styles.bettorRankText}>{index + 1}</Text>
                          </View>
                        </View>
                        <View style={styles.bettorDetails}>
                          <Text style={styles.bettorName}>{bettor.user}</Text>
                          <Text style={styles.bettorType}>EVET yatırımcısı</Text>
                        </View>
                      </View>
                      <Text style={styles.bettorAmount}>{bettor.bet.toLocaleString('tr-TR')} 💎</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.bettorGroup}>
                  <View style={styles.bettorHeader}>
                    <View style={[styles.bettorIcon, styles.bettorIconNo]}>
                      <Text style={styles.bettorIconText}>✗</Text>
                    </View>
                    <Text style={styles.bettorTitle}>HAYIR Tarafı</Text>
                  </View>
                  {topBettors.no.map((bettor, index) => (
                    <View key={index} style={styles.bettorItem}>
                      <View style={styles.bettorInfo}>
                        <View style={styles.bettorAvatarContainer}>
                          <Image 
                            source={{ uri: bettor.avatar }}
                            style={styles.bettorAvatar}
                          />
                          <View style={styles.bettorRank}>
                            <Text style={styles.bettorRankText}>{index + 1}</Text>
                          </View>
                        </View>
                        <View style={styles.bettorDetails}>
                          <Text style={styles.bettorName}>{bettor.user}</Text>
                          <Text style={styles.bettorType}>HAYIR yatırımcısı</Text>
                        </View>
                      </View>
                      <Text style={styles.bettorAmount}>{bettor.bet.toLocaleString('tr-TR')} 💎</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerImage: {
    height: 320,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  headerControls: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(10px)',
  },
  categoryTag: {
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    color: '#202020',
    fontWeight: 'bold',
    fontSize: 16,
  },
  scrollContent: {
    flex: 1,
  },
  content: {
    padding: 24,
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
  },
  titleSection: {
    marginBottom: 16,
  },
  questionTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#202020',
    lineHeight: 28,
  },
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    color: '#666',
    fontWeight: 'bold',
    fontSize: 14,
  },
  authorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F2F3F5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  authorAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  authorName: {
    color: '#202020',
    fontWeight: 'bold',
    fontSize: 14,
  },
  participantsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  avatarGroup: {
    flexDirection: 'row',
  },
  participantAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'white',
    marginLeft: -8,
  },
  participantsText: {
    color: '#666',
    fontWeight: 'bold',
    fontSize: 14,
  },
  chartSection: {
    backgroundColor: '#F2F3F5',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  chartTitle: {
    color: '#202020',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
  },
  chartSubtitle: {
    color: '#666',
    fontSize: 12,
    marginBottom: 12,
  },
  chartPlaceholder: {
    height: 64,
    borderWidth: 2,
    borderColor: '#432870',
    borderStyle: 'dashed',
    borderRadius: 12,
    backgroundColor: 'rgba(67, 40, 112, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  chartPlaceholderText: {
    color: '#432870',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,
  },
  percentageSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  percentageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  percentageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  percentageText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#10b981',
  },
  percentageLabel: {
    color: '#666',
    fontSize: 14,
  },
  progressBar: {
    height: 16,
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 8,
  },
  voteSection: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  voteButton: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  yesButton: {
    backgroundColor: '#f0fdf4',
    borderWidth: 2,
    borderColor: '#bbf7d0',
  },
  noButton: {
    backgroundColor: '#fef2f2',
    borderWidth: 2,
    borderColor: '#fecaca',
  },
  selectedButton: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  voteIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  voteText: {
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 4,
  },
  voteOdds: {
    fontSize: 18,
    fontWeight: '900',
  },
  successMessage: {
    backgroundColor: 'rgba(67, 40, 112, 0.1)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  successTitle: {
    color: '#432870',
    fontWeight: '900',
    fontSize: 18,
    marginBottom: 4,
  },
  successSubtitle: {
    color: '#666',
    fontSize: 14,
  },
  descriptionSection: {
    marginBottom: 24,
  },
  descriptionTitle: {
    color: '#202020',
    fontWeight: '900',
    fontSize: 18,
    marginBottom: 12,
  },
  descriptionText: {
    color: '#666',
    lineHeight: 20,
  },
  tabsContainer: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#F2F3F5',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#F2F3F5',
    margin: 16,
    borderRadius: 16,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  activeTab: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  tabText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  activeTabText: {
    color: '#432870',
  },
  tabBadge: {
    backgroundColor: 'rgba(67, 40, 112, 0.2)',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  tabBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#432870',
  },
  tabContent: {
    padding: 16,
  },
  commentsSection: {
    gap: 16,
  },
  commentInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F3F5',
    borderRadius: 16,
    padding: 4,
    gap: 12,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  commentTextInput: {
    flex: 1,
    backgroundColor: 'transparent',
    color: '#202020',
    fontSize: 14,
    paddingVertical: 8,
  },
  sendButton: {
    backgroundColor: '#432870',
    padding: 8,
    borderRadius: 12,
  },
  commentItem: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F2F3F5',
  },
  commentUserAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  commentUsername: {
    color: '#202020',
    fontWeight: 'bold',
    fontSize: 14,
  },
  commentTime: {
    color: '#666',
    fontSize: 12,
  },
  commentText: {
    color: '#666',
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 8,
  },
  commentActions: {
    flexDirection: 'row',
    gap: 16,
  },
  commentAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  commentActionText: {
    color: '#432870',
    fontSize: 12,
    fontWeight: 'bold',
  },
  bettorsSection: {
    gap: 24,
  },
  bettorGroup: {
    gap: 12,
  },
  bettorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
  },
  bettorIcon: {
    width: 32,
    height: 32,
    backgroundColor: '#10b981',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bettorIconNo: {
    backgroundColor: '#ef4444',
  },
  bettorIconText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  bettorTitle: {
    color: '#10b981',
    fontWeight: '900',
    fontSize: 18,
  },
  bettorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  bettorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bettorAvatarContainer: {
    position: 'relative',
  },
  bettorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  bettorRank: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 24,
    height: 24,
    backgroundColor: '#10b981',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bettorRankText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  bettorDetails: {
    gap: 2,
  },
  bettorName: {
    color: '#202020',
    fontWeight: 'bold',
  },
  bettorType: {
    color: '#10b981',
    fontSize: 12,
  },
  bettorAmount: {
    color: '#10b981',
    fontWeight: '900',
    fontSize: 18,
  },
}); 