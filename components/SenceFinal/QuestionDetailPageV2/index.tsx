import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Animated,
  Share,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { questionsService } from '@/services/questions.service';
import { predictionsService } from '@/services/predictions.service';
import { commentsService } from '@/services/comments.service';
import { profileService } from '@/services/profile.service';
import { createStyles } from './styles';
import type { QuestionDetailPageV2Props, MainQuestion, Comment, RelatedQuestion, TopInvestor } from './types';
import { QuestionDetailHeader } from './components/QuestionDetailHeader';
import { QuestionDetailTabs } from './components/QuestionDetailTabs';
import { VoteActionBar } from './components/VoteActionBar';
import { TicketModal } from './components/TicketModal';
import { SuccessModal } from './components/SuccessModal';
import { QuestionDetailSkeletonV2 } from './QuestionDetailSkeletonV2';

const getCategoryIcon = (category: string): string => {
  const icons: Record<string, string> = {
    Teknoloji: '💻',
    Spor: '⚽',
    Finans: '💰',
    Politika: '🏛️',
    Magazin: '📰',
    Müzik: '🎵',
    Sinema: '🎬',
    'Sosyal Medya': '📱',
    Genel: '📊',
  };
  return icons[category] || '📊';
};

const formatTimeAgo = (timestamp: Date) => {
  const diffInMinutes = Math.floor((new Date().getTime() - timestamp.getTime()) / (1000 * 60));
  if (diffInMinutes < 1) return 'şimdi';
  if (diffInMinutes < 60) return `${diffInMinutes}dk`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}sa`;
  return `${Math.floor(diffInMinutes / 1440)}g`;
};

const formatPublishDate = (date: Date) => {
  const diffInDays = Math.floor((new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffInDays === 0) return 'Bugün';
  if (diffInDays === 1) return 'Dün';
  if (diffInDays < 7) return `${diffInDays} gün önce`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} hafta önce`;
  return `${Math.floor(diffInDays / 30)} ay önce`;
};

export function QuestionDetailPageV2({ onBack, onMenuToggle, question, onVote, sourceCategory }: QuestionDetailPageV2Props) {
  const { user, profile } = useAuth();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(theme);

  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'comments' | 'stats'>('details');
  const [commentText, setCommentText] = useState('');
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [questionDetails, setQuestionDetails] = useState<any>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [relatedQuestions, setRelatedQuestions] = useState<RelatedQuestion[]>([]);
  const [topInvestors, setTopInvestors] = useState<TopInvestor[]>([]);
  const [userPrediction, setUserPrediction] = useState<any>(null);
  const [ticketModalVisible, setTicketModalVisible] = useState(false);
  const [selectedVote, setSelectedVote] = useState<'yes' | 'no' | null>(null);
  const [betAmount, setBetAmount] = useState('100');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFollowingCreator, setIsFollowingCreator] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const successScaleAnim = useRef(new Animated.Value(0)).current;
  const confettiAnim = useRef(new Animated.Value(0)).current;

  const loadQuestionDetails = async () => {
    if (!question?.id) return;
    try {
      setLoading(true);
      const [detailsResult, commentsResult, relatedResult, investorsResult, predictionResult] = await Promise.all([
        questionsService.getQuestionById(question.id.toString()),
        commentsService.getQuestionComments(question.id.toString()),
        questionsService.getRelatedQuestions(question.id.toString()),
        questionsService.getTopInvestors(question.id.toString()),
        user ? predictionsService.getUserPredictionForQuestion(user.id, question.id.toString()) : { data: null, error: null },
      ]);

      if (detailsResult.data) {
        const q = detailsResult.data;
        setQuestionDetails(q);
        const endDate = new Date(q.end_date);
        const diff = endDate.getTime() - Date.now();
        if (diff > 0) {
          setTimeLeft({
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          });
        }
      }
      if (commentsResult.data) {
        setComments(
          commentsResult.data.map((c: any, i: number) => ({
            id: parseInt(c.id) || i,
            username: c.profiles?.username || 'Anonim',
            avatar: c.profiles?.profile_image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
            text: c.content,
            timestamp: new Date(c.created_at),
            likes: c.likes_count || 0,
          }))
        );
      }
      if (relatedResult.data) {
        setRelatedQuestions(
          relatedResult.data.map((q: any, i: number) => ({
            id: parseInt(q.id) || i,
            title: q.title,
            category: q.categories?.name || 'Genel',
            image: q.image_url || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=150&h=150&fit=crop',
            daysLeft: Math.ceil((new Date(q.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
            odds: q.yes_odds || 1.5,
            rating: 4.5,
            votes: q.total_votes || 0,
            isFavorite: false,
          }))
        );
      }
      if (investorsResult.data) {
        setTopInvestors(
          investorsResult.data.map((i: any) => ({
            username: i.profiles?.username || 'Anonim',
            avatar: i.profiles?.profile_image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
            amount: i.amount || 0,
            vote: i.vote === 'yes' ? 'yes' : 'no',
          }))
        );
      }
      if (predictionResult.data) setUserPrediction(predictionResult.data);
    } catch (err) {
      console.error('Question details load error:', err);
      Alert.alert('Hata', 'Soru detayları yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestionDetails();
  }, [question?.id, user]);

  useEffect(() => {
    if (!questionDetails?.end_date) return;
    const update = () => {
      const diff = new Date(questionDetails.end_date).getTime() - Date.now();
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        });
      } else setTimeLeft({ days: 0, hours: 0, minutes: 0 });
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, [questionDetails?.end_date]);

  const mainQuestion: MainQuestion | null = questionDetails
    ? {
      title: questionDetails.title,
      category: sourceCategory?.name || questionDetails.categories?.name || 'Genel',
      categoryIcon: getCategoryIcon(sourceCategory?.name || questionDetails.categories?.name || 'Genel'),
      image:
        questionDetails.image_url && String(questionDetails.image_url).trim()
          ? questionDetails.image_url
          : question?.image && String(question.image).trim()
            ? question.image
            : 'https://images.unsplash.com/photo-1574477942438-5db6de70fd34?w=800&h=600&fit=crop',
      description: questionDetails.description || '',
      fullDescription: questionDetails.description || '',
      rating: 4.8,
      totalVotes: questionDetails.total_votes || 0,
      yesPercentage: questionDetails.yes_percentage || 50,
      noPercentage: questionDetails.no_percentage || 50,
      yesOdds: questionDetails.yes_odds || 1.5,
      noOdds: questionDetails.no_odds || 1.5,
      publishedAt: new Date(questionDetails.created_at),
      endDate: questionDetails.end_date,
      daysLeft: timeLeft.days,
      creator: {
        id: questionDetails.created_by || questionDetails.profiles?.id || null,
        username: questionDetails.profiles?.username || 'Anonim',
        avatar: questionDetails.profiles?.profile_image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=face',
      },
      totalPool: questionDetails.total_pool || 0,
      yesInvestment: questionDetails.yes_investment || 0,
      noInvestment: questionDetails.no_investment || 0,
      result: questionDetails.result,
      status: questionDetails.status,
    }
    : null;

  useEffect(() => {
    if (!user || !mainQuestion?.creator?.id) return;
    if (user.id === mainQuestion.creator.id) {
      setIsFollowingCreator(true);
      return;
    }
    profileService.isFollowing(mainQuestion.creator.id).then(({ isFollowing }) => setIsFollowingCreator(isFollowing));
  }, [user, mainQuestion?.creator?.id]);

  const handleFollowToggle = async () => {
    if (!user || !mainQuestion?.creator?.id || followLoading) return;
    if (user.id === mainQuestion.creator.id) {
      Alert.alert('Bilgi', 'Kendi kendinizi takip edemezsiniz.');
      return;
    }
    setFollowLoading(true);
    try {
      const { isFollowing, error } = await profileService.toggleFollow(mainQuestion.creator.id);
      if (error) Alert.alert('Hata', 'İşlem sırasında bir hata oluştu.');
      else setIsFollowingCreator(isFollowing);
    } catch {
      Alert.alert('Hata', 'İşlem sırasında bir hata oluştu.');
    } finally {
      setFollowLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadQuestionDetails();
    setRefreshing(false);
  };

  const openTicketModal = (vote: 'yes' | 'no') => {
    if (!user || !mainQuestion) {
      Alert.alert('Hata', 'Ticket almak için giriş yapmalısınız');
      return;
    }
    if (userPrediction) {
      Alert.alert('Uyarı', 'Bu soruya zaten ticket aldınız.');
      return;
    }
    setSelectedVote(vote);
    setBetAmount('100');
    setTicketModalVisible(true);
  };

  const calculatePotentialWin = () => {
    if (!mainQuestion || !selectedVote || !betAmount) return 0;
    const amount = parseFloat(betAmount) || 0;
    const odds = selectedVote === 'yes' ? mainQuestion.yesOdds : mainQuestion.noOdds;
    return amount * odds;
  };

  const handleConfirmTicket = async () => {
    if (!user || !mainQuestion || !selectedVote) return;
    const amount = parseFloat(betAmount) || 0;
    if (amount < 10) {
      Alert.alert('Hata', 'Minimum ticket miktarı 10 kredidir');
      return;
    }
    setIsProcessing(true);
    try {
      const odds = selectedVote === 'yes' ? mainQuestion.yesOdds : mainQuestion.noOdds;
      const result = await predictionsService.createPrediction({
        question_id: question.id.toString(),
        vote: selectedVote,
        amount,
        odds,
        potential_win: amount * odds,
      });
      if (result.data) {
        setUserPrediction(result.data);
        setTicketModalVisible(false);
        setShowSuccessModal(true);
        Animated.parallel([
          Animated.spring(successScaleAnim, { toValue: 1, friction: 4, tension: 50, useNativeDriver: true }),
          Animated.timing(confettiAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        ]).start();
        loadQuestionDetails();
      } else if (result.error) {
        const msg = result.error.message || 'Ticket alınırken bir hata oluştu';
        if (msg.includes('already') || msg.includes('duplicate') || msg.includes('zaten')) {
          Alert.alert('Uyarı', 'Bu soruya zaten ticket aldınız.');
        } else Alert.alert('Hata', msg);
      }
    } catch (err: any) {
      const msg = err?.message || 'Ticket alınırken bir hata oluştu';
      if (msg.includes('already') || msg.includes('duplicate') || msg.includes('zaten')) {
        Alert.alert('Uyarı', 'Bu soruya zaten ticket aldınız.');
      } else Alert.alert('Hata', msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    successScaleAnim.setValue(0);
    confettiAnim.setValue(0);
  };

  const toggleFavorite = () => setIsFavorite(!isFavorite);
  const toggleRelatedFavorite = (id: number) => {
    setRelatedQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, isFavorite: !q.isFavorite } : q)));
  };

  const handleSendComment = async () => {
    if (!commentText.trim() || !user || !question?.id) return;
    try {
      const result = await commentsService.createComment({
        user_id: user.id,
        question_id: question.id.toString(),
        content: commentText.trim(),
      });
      if (result.data) {
        setComments([
          {
            id: parseInt(result.data.id) || 0,
            username: user.user_metadata?.username || 'Anonim',
            avatar: user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
            text: commentText.trim(),
            timestamp: new Date(),
            likes: 0,
          },
          ...comments,
        ]);
        setCommentText('');
      }
    } catch {
      Alert.alert('Hata', 'Yorum gönderilirken bir hata oluştu');
    }
  };

  const handleShare = async () => {
    if (!mainQuestion) return;
    try {
      await Share.share({ message: `${mainQuestion.title}\n\n${mainQuestion.description}`, title: mainQuestion.title });
    } catch { }
  };

  const userAvatar = user?.user_metadata?.avatar_url || profile?.profile_image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face';

  if (loading && !mainQuestion) {
    return <QuestionDetailSkeletonV2 onBack={onBack} />;
  }
  if (!mainQuestion) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.errorText}>Soru bulunamadı</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <QuestionDetailHeader
        mainQuestion={mainQuestion}
        theme={theme}
        onBack={onBack}
        onShare={handleShare}
        onToggleFavorite={toggleFavorite}
        isFavorite={isFavorite}
        insets={insets}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[theme.accent]} tintColor={theme.accent} />
        }
      >
        <View style={styles.contentContainer}>
          <View style={styles.questionHeader}>
            <View style={styles.questionTitleRow}>
              <Text style={styles.questionTitle}>{mainQuestion.title}</Text>
              <View style={styles.rightColumn}>
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={16} color={theme.accent} />
                  <Text style={styles.ratingText}>{mainQuestion.rating}</Text>
                </View>
                <View style={styles.countdownBadge}>
                  <Text style={styles.countdownBadgeValue}>{timeLeft.days}</Text>
                  <Text style={styles.countdownBadgeLabel}>GÜN</Text>
                </View>
              </View>
            </View>
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={16} color={theme.textMuted + '80'} />
                <Text style={styles.metaText}>{formatPublishDate(mainQuestion.publishedAt)} yayınlandı</Text>
              </View>
              <View style={styles.voteCountBadge}>
                <Ionicons name="people" size={16} color={theme.accent} />
                <Text style={styles.voteCountText}>{mainQuestion.totalVotes}</Text>
                <Text style={styles.voteCountLabel}>oy</Text>
              </View>
            </View>

            {/* WINNER BANNER */}
            {mainQuestion.result && (
              <Animated.View
                style={{
                  marginTop: 24,
                  marginBottom: 8,
                  borderRadius: 24,
                  overflow: 'hidden',
                  marginHorizontal: 4,
                  shadowColor: mainQuestion.result === 'yes' ? '#34C759' : '#FF3B30',
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.35,
                  shadowRadius: 16,
                  elevation: 10,
                }}
              >
                <LinearGradient
                  colors={
                    mainQuestion.result === 'yes'
                      ? ['#34C759', '#2E8B57']
                      : ['#FF3B30', '#C41E3A']
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    paddingVertical: 28,
                    paddingHorizontal: 24,
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  {/* Background Texture/Icons */}
                  <Ionicons
                    name={mainQuestion.result === 'yes' ? 'checkmark-circle' : 'close-circle'}
                    size={180}
                    color="rgba(255,255,255,0.12)"
                    style={{ position: 'absolute', right: -40, bottom: -60, transform: [{ rotate: '-15deg' }] }}
                  />

                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 12,
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    paddingVertical: 6,
                    paddingHorizontal: 16,
                    borderRadius: 20
                  }}>
                    <Ionicons
                      name="trophy"
                      size={20}
                      color="#FFD700"
                      style={{ marginRight: 8 }}
                    />
                    <Text style={{
                      color: '#FFD700',
                      fontSize: 13,
                      fontWeight: '800',
                      letterSpacing: 1.5,
                      textTransform: 'uppercase'
                    }}>
                      SONUÇ AÇIKLANDI
                    </Text>
                  </View>

                  <Text style={{
                    color: '#FFF',
                    fontSize: 36,
                    fontWeight: '900',
                    textAlign: 'center',
                    letterSpacing: 0.5,
                    textShadowColor: 'rgba(0,0,0,0.3)',
                    textShadowOffset: { width: 0, height: 4 },
                    textShadowRadius: 8,
                    marginBottom: 8
                  }}>
                    {mainQuestion.result === 'yes' ? 'EVET' : 'HAYIR'} KAZANDI
                  </Text>

                  <View style={{
                    height: 4,
                    width: 60,
                    backgroundColor: 'rgba(255,255,255,0.4)',
                    borderRadius: 2,
                    marginBottom: 12
                  }} />

                  <Text style={{
                    color: 'rgba(255,255,255,0.95)',
                    fontSize: 15,
                    fontWeight: '600',
                    textAlign: 'center',
                    lineHeight: 22
                  }}>
                    Bu tahmin etkinliği sona ermiştir.{'\n'}Kazananlar ödüllerini profil sayfasından talep edebilir.
                  </Text>
                </LinearGradient>
              </Animated.View>
            )}

            <QuestionDetailTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              theme={theme}
              mainQuestion={mainQuestion}
              relatedQuestions={relatedQuestions}
              comments={comments}
              topInvestors={topInvestors}
              commentText={commentText}
              onCommentTextChange={setCommentText}
              onSendComment={handleSendComment}
              formatTimeAgo={formatTimeAgo}
              isFollowingCreator={isFollowingCreator}
              followLoading={followLoading}
              isOwnQuestion={user?.id === mainQuestion.creator?.id}
              onFollowToggle={handleFollowToggle}
              onRelatedFavoriteToggle={toggleRelatedFavorite}
              userAvatar={userAvatar}
              isLoggedIn={!!user}
            />
          </View>
        </View>
      </ScrollView>
      <VoteActionBar
        mainQuestion={mainQuestion}
        theme={theme}
        userPrediction={userPrediction}
        onPressYes={() => openTicketModal('yes')}
        onPressNo={() => openTicketModal('no')}
        insets={insets}
        styles={styles}
      />
      <TicketModal
        visible={ticketModalVisible}
        onClose={() => setTicketModalVisible(false)}
        theme={theme}
        mainQuestion={mainQuestion}
        selectedVote={selectedVote}
        betAmount={betAmount}
        onBetAmountChange={setBetAmount}
        onConfirm={handleConfirmTicket}
        isProcessing={isProcessing}
        calculatePotentialWin={calculatePotentialWin}
      />
      <SuccessModal
        visible={showSuccessModal}
        onClose={closeSuccessModal}
        theme={theme}
        selectedVote={selectedVote}
        betAmount={betAmount}
        potentialWin={calculatePotentialWin()}
        successScaleAnim={successScaleAnim}
        confettiAnim={confettiAnim}
      />
    </View>
  );
}
