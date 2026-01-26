import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Pressable,
  Dimensions,
  TextInput,
  Animated,
  Share,
  Platform,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Modal,
  KeyboardAvoidingView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { questionsService } from '@/services/questions.service';
import { predictionsService } from '@/services/predictions.service';
import { commentsService } from '@/services/comments.service';
import { profileService } from '@/services/profile.service';
import { QuestionDetailSkeleton } from './QuestionDetailSkeleton';
// Image color analyzer artık kullanılmıyor

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface QuestionDetailPageProps {
  onBack: () => void;
  onMenuToggle: () => void;
  question: any;
  onVote: (questionId: number, vote: 'yes' | 'no', odds: number, questionTitle?: string) => void;
  sourceCategory?: any; // Hangi kategoriden geldiğini belirtir
}

interface RelatedQuestion {
    id: number;
    title: string;
    category: string;
    image: string;
  daysLeft: number;
  odds: number;
  rating: number;
  votes: number;
  isFavorite: boolean;
}

interface Comment {
  id: number;
  username: string;
  avatar: string;
  text: string;
  timestamp: Date;
  likes: number;
}

interface TopInvestor {
  username: string;
  avatar: string;
  amount: number;
  vote: 'yes' | 'no';
}

export function QuestionDetailPage({ onBack, onMenuToggle, question, onVote, sourceCategory }: QuestionDetailPageProps) {
  const { user, profile } = useAuth();
  const { theme, isDarkMode } = useTheme();
  const insets = useSafeAreaInsets();
  
  // State tanımlamaları
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
  
  // Ticket Modal State'leri
  const [ticketModalVisible, setTicketModalVisible] = useState(false);
  const [selectedVote, setSelectedVote] = useState<'yes' | 'no' | null>(null);
  const [betAmount, setBetAmount] = useState('100');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Follow State'leri
  const [isFollowingCreator, setIsFollowingCreator] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  
  // Success modal animation
  const successScaleAnim = useRef(new Animated.Value(0)).current;
  const confettiAnim = useRef(new Animated.Value(0)).current;
  
  const scrollY = useRef(new Animated.Value(0)).current;

  // Backend'den soru detaylarını yükle
  const loadQuestionDetails = async () => {
    if (!question?.id) return;

    try {
      setLoading(true);

      // Paralel olarak tüm verileri yükle
      const [detailsResult, commentsResult, relatedResult, investorsResult, predictionResult] = await Promise.all([
        questionsService.getQuestionById(question.id.toString()),
        commentsService.getQuestionComments(question.id.toString()),
        questionsService.getRelatedQuestions(question.id.toString()),
        questionsService.getTopInvestors(question.id.toString()),
        user ? predictionsService.getUserPredictionForQuestion(user.id, question.id.toString()) : { data: null, error: null },
      ]);

      // Soru detayları
      if (detailsResult.data) {
        const q = detailsResult.data;
        setQuestionDetails(q);
        
        // Countdown artık sadece gün olarak küçük badge'de gösteriliyor
        
        // Countdown hesapla
        const endDate = new Date(q.end_date);
        const now = new Date();
        const diff = endDate.getTime() - now.getTime();
        
        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          setTimeLeft({ days, hours, minutes });
        }
      }

      // Yorumlar
      if (commentsResult.data) {
        const mappedComments: Comment[] = commentsResult.data.map((c: any, index: number) => ({
          id: parseInt(c.id) || index,
          username: c.profiles?.username || 'Anonim',
          avatar: c.profiles?.profile_image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
          text: c.content,
          timestamp: new Date(c.created_at),
          likes: c.likes_count || 0,
        }));
        setComments(mappedComments);
      }

      // İlgili sorular
      if (relatedResult.data) {
        const mappedRelated: RelatedQuestion[] = relatedResult.data.map((q: any, index: number) => ({
          id: parseInt(q.id) || index,
          title: q.title,
          category: q.categories?.name || 'Genel',
          image: q.image_url || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=150&h=150&fit=crop',
          daysLeft: Math.ceil((new Date(q.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
          odds: q.yes_odds || 1.5,
          rating: 4.5, // TODO: Rating sistemi eklenince
          votes: q.total_votes || 0,
          isFavorite: false, // TODO: Favori sistemi eklenince
        }));
        setRelatedQuestions(mappedRelated);
      }

      // Top yatırımcılar
      if (investorsResult.data) {
        const mappedInvestors: TopInvestor[] = investorsResult.data.map((i: any) => ({
          username: i.profiles?.username || 'Anonim',
          avatar: i.profiles?.profile_image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
          amount: i.amount || 0,
          vote: i.vote === 'yes' ? 'yes' : 'no',
        }));
        setTopInvestors(mappedInvestors);
      }

      // Kullanıcının tahmini
      if (predictionResult.data) {
        setUserPrediction(predictionResult.data);
      }

    } catch (err) {
      console.error('Question details load error:', err);
      Alert.alert('Hata', 'Soru detayları yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Sayfa yüklendiğinde veriyi çek
  useEffect(() => {
    loadQuestionDetails();
  }, [question?.id, user]);

  // Countdown timer effect - her saniye güncelle
  useEffect(() => {
    if (!questionDetails?.end_date) return;

    const updateCountdown = () => {
      const endDate = new Date(questionDetails.end_date);
      const now = new Date();
      const diff = endDate.getTime() - now.getTime();
      
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        setTimeLeft({ days, hours, minutes });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
      }
    };

    // İlk güncelleme
    updateCountdown();

    // Her saniye güncelle
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, [questionDetails?.end_date]);

  // Countdown artık sadece gün olarak gösteriliyor, animasyon gerekmiyor

  // Kategori ikonu fonksiyonu
  const getCategoryIcon = (category: string): string => {
    const icons: { [key: string]: string } = {
      'Teknoloji': '💻',
      'Spor': '⚽',
      'Finans': '💰',
      'Politika': '🏛️',
      'Magazin': '📰',
      'Müzik': '🎵',
      'Sinema': '🎬',
      'Sosyal Medya': '📱',
      'Genel': '📊'
    };
    return icons[category] || '📊';
  };

  // Main question data - Backend'den gelen verilerle merge et
  const mainQuestion = questionDetails ? {
    title: questionDetails.title,
    category: sourceCategory?.name || questionDetails.categories?.name || 'Genel',
    categoryIcon: getCategoryIcon(sourceCategory?.name || questionDetails.categories?.name || 'Genel'),
    image: (questionDetails.image_url && String(questionDetails.image_url).trim() !== '') 
      ? questionDetails.image_url 
      : (question?.image && String(question.image).trim() !== '')
        ? question.image
        : 'https://images.unsplash.com/photo-1574477942438-5db6de70fd34?w=800&h=600&fit=crop',
    description: questionDetails.description || '',
    fullDescription: questionDetails.description || '',
    rating: 4.8, // TODO: Rating sistemi eklenince
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
      avatar: questionDetails.profiles?.profile_image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=face'
    },
    totalPool: questionDetails.total_pool || 0,
    yesInvestment: questionDetails.yes_investment || 0,
    noInvestment: questionDetails.no_investment || 0
  } : null;

  // Check if user is following the creator
  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!user || !mainQuestion?.creator?.id) return;
      
      // Don't show follow button for own questions
      if (user.id === mainQuestion.creator.id) {
        setIsFollowingCreator(true); // Hide follow button by showing "following"
        return;
      }
      
      const { isFollowing } = await profileService.isFollowing(mainQuestion.creator.id);
      setIsFollowingCreator(isFollowing);
    };
    
    checkFollowStatus();
  }, [user, mainQuestion?.creator?.id]);

  // Handle follow/unfollow toggle
  const handleFollowToggle = async () => {
    if (!user || !mainQuestion?.creator?.id || followLoading) return;
    
    // Don't allow following yourself
    if (user.id === mainQuestion.creator.id) {
      Alert.alert('Bilgi', 'Kendi kendinizi takip edemezsiniz.');
      return;
    }
    
    setFollowLoading(true);
    try {
      const { isFollowing, error } = await profileService.toggleFollow(mainQuestion.creator.id);
      
      if (error) {
        Alert.alert('Hata', 'İşlem sırasında bir hata oluştu.');
        console.error('Follow toggle error:', error);
      } else {
        setIsFollowingCreator(isFollowing);
      }
    } catch (error) {
      Alert.alert('Hata', 'İşlem sırasında bir hata oluştu.');
      console.error('Follow toggle error:', error);
    } finally {
      setFollowLoading(false);
    }
  };

  // Refresh fonksiyonu
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadQuestionDetails();
    setRefreshing(false);
  };

  // Ticket Modal'ı aç
  const openTicketModal = (vote: 'yes' | 'no') => {
    if (!user || !mainQuestion) {
      Alert.alert('Hata', 'Ticket almak için giriş yapmalısınız');
      return;
    }

    // Kullanıcının bu soruya daha önce tahmin yapıp yapmadığını kontrol et
    if (userPrediction) {
      Alert.alert(
        'Uyarı',
        'Bu soruya zaten ticket aldınız. Aynı soruya birden fazla ticket alamazsınız.',
        [{ text: 'Tamam', style: 'default' }]
      );
      return;
    }

    setSelectedVote(vote);
    setBetAmount('100');
    setTicketModalVisible(true);
  };

  // Potansiyel kazanç hesaplama
  const calculatePotentialWin = () => {
    if (!mainQuestion || !selectedVote || !betAmount) return 0;
    const amount = parseFloat(betAmount) || 0;
    const odds = selectedVote === 'yes' ? mainQuestion.yesOdds : mainQuestion.noOdds;
    return amount * odds;
  };

  // Ticket alma işlemi
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
        amount: amount,
        odds: odds,
        potential_win: amount * odds,
      });

      if (result.data) {
        setUserPrediction(result.data);
        setTicketModalVisible(false);
        
        // Success modal göster
        setShowSuccessModal(true);
        
        // Success animasyonu
        Animated.parallel([
          Animated.spring(successScaleAnim, {
            toValue: 1,
            friction: 4,
            tension: 50,
            useNativeDriver: true,
          }),
          Animated.timing(confettiAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]).start();

        // Verileri yenile
        loadQuestionDetails();
      } else if (result.error) {
        const errorMessage = result.error.message || 'Ticket alınırken bir hata oluştu';
        if (errorMessage.includes('already') || errorMessage.includes('duplicate') || errorMessage.includes('zaten')) {
          Alert.alert(
            'Uyarı',
            'Bu soruya zaten ticket aldınız. Aynı soruya birden fazla ticket alamazsınız.',
            [{ text: 'Tamam', style: 'default' }]
          );
        } else {
          Alert.alert('Hata', errorMessage);
        }
      }
    } catch (err: any) {
      console.error('Ticket error:', err);
      const errorMessage = err?.message || 'Ticket alınırken bir hata oluştu';
      if (errorMessage.includes('already') || errorMessage.includes('duplicate') || errorMessage.includes('zaten')) {
        Alert.alert(
          'Uyarı',
          'Bu soruya zaten ticket aldınız. Aynı soruya birden fazla ticket alamazsınız.',
          [{ text: 'Tamam', style: 'default' }]
        );
      } else {
        Alert.alert('Hata', errorMessage);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Success modal kapat
  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    successScaleAnim.setValue(0);
    confettiAnim.setValue(0);
  };

  // Odds change chart data
  const oddsChartData = {
    labels: ['7d', '6d', '5d', '4d', '3d', '2d', '1d', 'Bugün'],
    datasets: [
      {
        data: [1.45, 1.42, 1.38, 1.35, 1.32, 1.30, 1.29, 1.28],
        color: () => '#34C759', // EVET color
        strokeWidth: 3,
      },
      {
        data: [2.80, 2.95, 3.20, 3.35, 3.45, 3.55, 3.60, 3.64],
        color: () => theme.error, // HAYIR color
        strokeWidth: 3,
      },
    ],
    legend: ['EVET Oranı', 'HAYIR Oranı'],
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const toggleRelatedFavorite = (id: number) => {
    setRelatedQuestions(prev =>
      prev.map(q => q.id === id ? { ...q, isFavorite: !q.isFavorite } : q)
    );
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'şimdi';
    if (diffInMinutes < 60) return `${diffInMinutes}dk`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}sa`;
    return `${Math.floor(diffInMinutes / 1440)}g`;
  };

  const formatPublishDate = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Bugün';
    if (diffInDays === 1) return 'Dün';
    if (diffInDays < 7) return `${diffInDays} gün önce`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} hafta önce`;
    return `${Math.floor(diffInDays / 30)} ay önce`;
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
        const newComment: Comment = {
          id: parseInt(result.data.id) || 0,
          username: user.user_metadata?.username || 'Anonim',
          avatar: user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
          text: commentText.trim(),
          timestamp: new Date(),
          likes: 0
        };
        setComments([newComment, ...comments]);
        setCommentText('');
      }
    } catch (err) {
      console.error('Comment error:', err);
      Alert.alert('Hata', 'Yorum gönderilirken bir hata oluştu');
    }
  };

  const handleShare = async () => {
    if (!mainQuestion) return;
    
    try {
      await Share.share({
        message: `${mainQuestion.title}\n\n${mainQuestion.description}`,
        title: mainQuestion.title,
      });
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  const yesProgressAnim = useRef(new Animated.Value(0)).current;
  const noProgressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (mainQuestion) {
      Animated.parallel([
        Animated.timing(yesProgressAnim, {
          toValue: mainQuestion.yesPercentage,
          duration: 1000,
          delay: 300,
          useNativeDriver: false,
        }),
        Animated.timing(noProgressAnim, {
          toValue: mainQuestion.noPercentage,
          duration: 1000,
          delay: 300,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [mainQuestion]);

  const renderDetailsTab = () => (
    <View style={styles.detailsTabContainer}>
      {/* Description */}
      <View style={styles.descriptionSection}>
        <Text style={styles.descriptionText}>{mainQuestion.fullDescription}</Text>
      </View>

      {/* Creator Info */}
      <View style={styles.creatorCard}>
        <Image 
          source={{ uri: mainQuestion.creator.avatar }}
          style={styles.creatorAvatar}
        />
        <View style={styles.creatorInfo}>
          <Text style={styles.creatorLabel}>Soruyu Yazan</Text>
          <Text style={styles.creatorUsername}>
            <Text style={styles.creatorUsernameAt}>@</Text>
            {mainQuestion.creator.username}
          </Text>
        </View>
        {user?.id !== mainQuestion.creator?.id && (
          <TouchableOpacity 
            style={styles.followButton} 
            activeOpacity={0.8}
            onPress={handleFollowToggle}
            disabled={followLoading}
          >
            <LinearGradient
              colors={isFollowingCreator ? ['#30363D', '#21262D'] : ['#10B981', '#059669']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.followButtonGradient}
            >
              {followLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.followButtonText}>
                  {isFollowingCreator ? 'Takiptesin' : 'Takip Et'}
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>

      {/* Vote Stats */}
      <View style={styles.voteStatsSection}>
        <Text style={styles.sectionTitle}>Oy Dağılımı</Text>
        
        <View style={styles.voteStatsVerticalContainer}>
          {/* Yes Votes */}
          <View style={styles.voteStatVerticalRow}>
            <View style={styles.voteStatHeader}>
              <Text style={styles.voteStatLabelYes}>EVET</Text>
              <Text style={styles.voteStatPercentageYes}>{mainQuestion.yesPercentage}%</Text>
      </View>
            <View style={styles.progressBarContainer}>
              <Animated.View 
                style={[
                  styles.progressBarYes,
                  {
                    width: yesProgressAnim.interpolate({
                      inputRange: [0, 100],
                      outputRange: ['0%', '100%'],
                    }),
                  }
                ]}
              />
    </View>
            <View style={styles.voteStatFooter}>
              <Text style={styles.voteStatInfo}>{mainQuestion.yesOdds}x oran</Text>
              <Text style={styles.voteStatInfo}>{mainQuestion.yesInvestment.toLocaleString('tr-TR')} ₺</Text>
            </View>
          </View>

          {/* No Votes */}
          <View style={styles.voteStatVerticalRow}>
            <View style={styles.voteStatHeader}>
              <Text style={styles.voteStatLabelNo}>HAYIR</Text>
              <Text style={styles.voteStatPercentageNo}>{mainQuestion.noPercentage}%</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <Animated.View 
                style={[
                  styles.progressBarNo,
                  {
                    width: noProgressAnim.interpolate({
                      inputRange: [0, 100],
                      outputRange: ['0%', '100%'],
                    }),
                  }
                ]}
              />
            </View>
            <View style={styles.voteStatFooter}>
              <Text style={styles.voteStatInfo}>{mainQuestion.noOdds}x oran</Text>
              <Text style={styles.voteStatInfo}>{mainQuestion.noInvestment.toLocaleString('tr-TR')} ₺</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Vote Buttons moved to fixed bottom */}

      {/* Related Questions */}
      <View style={styles.relatedSection}>
        <View style={styles.relatedHeader}>
          <Text style={styles.relatedTitle}>Benzer Sorular</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllButton}>Tümünü Gör</Text>
              </TouchableOpacity>
      </View>
      
      <ScrollView 
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.relatedScrollContent}
        >
          {relatedQuestions.map((question, index) => (
            <View key={`related-${question.id}-${index}`} style={styles.relatedCard}>
              <View style={styles.relatedImageContainer}>
          <Image 
            source={{ uri: question.image }}
                  style={styles.relatedImage}
                />
            <TouchableOpacity
                  style={styles.relatedFavoriteButton}
                  onPress={() => toggleRelatedFavorite(question.id)}
            >
              <Ionicons 
                    name={question.isFavorite ? "heart" : "heart-outline"}
                    size={20}
                    color={question.isFavorite ? theme.error : theme.textPrimary}
                  />
            </TouchableOpacity>
        </View>

              <View style={styles.relatedCardContent}>
                <Text style={styles.relatedCardTitle} numberOfLines={2}>
                  {question.title}
                </Text>
                <View style={styles.relatedCardStats}>
                  <Text style={styles.relatedCardStat}>{question.daysLeft} gün</Text>
                  <Text style={styles.relatedCardStat}>₺{question.odds}/kişi</Text>
        </View>

                <View style={styles.relatedCardFooter}>
                  <View style={styles.relatedCardRating}>
                    <Ionicons name="star" size={16} color="#C9F158" />
                    <Text style={styles.relatedCardRatingText}>{question.rating}</Text>
                    <Text style={styles.relatedCardVotes}>{question.votes} oy</Text>
          </View>
                  <TouchableOpacity style={styles.relatedCardButton}>
                    <Ionicons name="arrow-forward" size={20} color="#fff" />
                  </TouchableOpacity>
          </View>
        </View>
                </View>
          ))}
        </ScrollView>
                  </View>
                    </View>
  );

  const renderCommentsTab = () => (
    <View style={styles.detailsTabContainer}>
      {/* Comment Input */}
      <View style={styles.commentInputSectionNoPadding}>
        <View style={styles.commentInputCard}>
          <View style={styles.commentInputRow}>
            <Image
              source={{ uri: user?.user_metadata?.avatar_url || profile?.profile_image || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" }}
              style={styles.commentUserAvatar}
            />
                  <TextInput
              value={commentText}
              onChangeText={setCommentText}
              placeholder="Yorumunuzu yazın..."
              placeholderTextColor={theme.textMuted + 'AA'}
                    style={styles.commentInput}
                    multiline
              numberOfLines={3}
                  />
          </View>
          <View style={styles.commentInputFooter}>
                  <TouchableOpacity
              style={[styles.sendButton, !commentText.trim() && styles.sendButtonDisabled]}
              onPress={handleSendComment}
              disabled={!commentText.trim()}
                    activeOpacity={0.8}
                  >
        <LinearGradient
          colors={['#10B981', '#059669']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.sendButtonGradient}
              >
                <Ionicons name="send" size={16} color="#fff" />
                    <Text style={styles.sendButtonText}>Gönder</Text>
              </LinearGradient>
                  </TouchableOpacity>
            </View>
            </View>
          </View>

            {/* Comments List */}
      <View style={styles.commentsListSectionNoPadding}>
        <Text style={styles.commentsListTitle}>Tüm Yorumlar ({comments.length})</Text>
              {comments.map((comment, index) => (
                <View key={`comment-${comment.id}-${index}`} style={styles.commentCard}>
                    <Image 
              source={{ uri: comment.avatar }}
                      style={styles.commentAvatar}
            />
            <View style={styles.commentContent}>
              <View style={styles.commentHeader}>
                <Text style={styles.commentUsername}>{comment.username}</Text>
                <Text style={styles.commentTime}>{formatTimeAgo(comment.timestamp)}</Text>
                  </View>
                  <Text style={styles.commentText}>{comment.text}</Text>
              <View style={styles.commentActions}>
                <TouchableOpacity style={styles.commentLikeButton}>
                  <Ionicons name="heart-outline" size={16} color={theme.textMuted + '99'} />
                  <Text style={styles.commentLikeCount}>{comment.likes}</Text>
            </TouchableOpacity>
                <TouchableOpacity>
                  <Text style={styles.commentReplyButton}>Yanıtla</Text>
                  </TouchableOpacity>
              </View>
            </View>
                </View>
          ))}
        </View>
          </View>
  );

  const renderStatsTab = () => (
    <View style={styles.detailsTabContainer}>
      {/* Total Pool Card */}
      <LinearGradient
        colors={['#10B981', '#059669', '#047857']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.totalPoolCard}
      >
              <View style={styles.totalPoolContent}>
          <View style={styles.totalPoolHeader}>
            <View style={styles.totalPoolIconContainer}>
              <Ionicons name="trending-up" size={28} color="#fff" />
            </View>
            <View style={styles.totalPoolInfo}>
              <Text style={styles.totalPoolLabel}>TOPLAM ÖDÜL HAVUZU</Text>
              <View style={styles.totalPoolAmountRow}>
                <Text style={styles.totalPoolAmount}>
                  {mainQuestion.totalPool.toLocaleString('tr-TR')}
                </Text>
                <Text style={styles.totalPoolCurrency}>₺</Text>
              </View>
            </View>
            </View>

          <View style={styles.totalPoolDivider} />

          <View style={styles.totalPoolFooter}>
            <View style={styles.totalPoolStat}>
              <Text style={styles.totalPoolStatLabel}>EVET Yatırım</Text>
              <Text style={styles.totalPoolStatValue}>
                {mainQuestion.yesInvestment.toLocaleString('tr-TR')} ₺
              </Text>
                  </View>
            <View style={styles.totalPoolDividerVertical} />
            <View style={styles.totalPoolStat}>
              <Text style={styles.totalPoolStatLabel}>HAYIR Yatırım</Text>
              <Text style={styles.totalPoolStatValue}>
                {mainQuestion.noInvestment.toLocaleString('tr-TR')} ₺
              </Text>
                    </View>
                  </View>
                </View>
      </LinearGradient>

      {/* Line Chart */}
      <View style={styles.chartSection}>
        <View style={styles.chartHeader}>
          <Ionicons name="trending-up" size={20} color="#10B981" />
          <Text style={styles.chartTitle}>Oran Değişimi Grafiği</Text>
                  </View>
        <View style={styles.chartCard}>
          <LineChart
            data={oddsChartData}
            width={SCREEN_WIDTH - 64}
            height={250}
            chartConfig={{
              backgroundColor: theme.surface,
              backgroundGradientFrom: theme.surface,
              backgroundGradientTo: theme.surface,
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(67, 40, 112, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(32, 32, 32, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '5',
                strokeWidth: '2',
              },
              propsForLabels: {
                fontSize: 10,
                fontWeight: 'bold',
              },
            }}
            bezier
            style={styles.chart}
            withShadow={false}
            withInnerLines={true}
            withOuterLines={true}
            withVerticalLines={true}
            withHorizontalLines={true}
            withVerticalLabels={true}
            withHorizontalLabels={true}
          />
          <View style={styles.chartFooter}>
            <Text style={styles.chartFooterText}>
              Oranlar, toplam yatırım miktarlarına göre dinamik olarak değişmektedir
            </Text>
                    </View>
                  </View>
                </View>

            {/* Top Investors */}
      <View style={styles.topInvestorsSection}>
        <View style={styles.topInvestorsHeader}>
          <Ionicons name="trophy" size={20} color="#C9F158" />
          <Text style={styles.topInvestorsTitle}>En Çok Yatırım Yapanlar</Text>
              </View>
        {topInvestors.map((investor, index) => (
          <View key={`investor-${index}-${investor.username}`} style={styles.investorCard}>
            <View style={[
              styles.investorRank,
              index === 0 && styles.investorRankGold,
              index === 1 && styles.investorRankSilver,
              index === 2 && styles.investorRankBronze,
            ]}>
              <Text style={[
                styles.investorRankText,
                index < 3 && styles.investorRankTextColored
              ]}>
                #{index + 1}
              </Text>
            </View>
            <Image
              source={{ uri: investor.avatar }}
              style={styles.investorAvatar}
            />
            <View style={styles.investorInfo}>
              <Text style={styles.investorUsername}>{investor.username}</Text>
              <Text style={styles.investorAmount}>
                {investor.amount.toLocaleString('tr-TR')} ₺ yatırım
              </Text>
          </View>
            <View style={[
              styles.investorVoteBadge,
              investor.vote === 'yes' ? styles.investorVoteBadgeYes : styles.investorVoteBadgeNo
            ]}>
              <Text style={[
                styles.investorVoteText,
                investor.vote === 'yes' ? styles.investorVoteTextYes : styles.investorVoteTextNo
              ]}>
                {investor.vote === 'yes' ? 'EVET' : 'HAYIR'}
              </Text>
            </View>
          </View>
        ))}
              </View>

      {/* Vote Distribution */}
      <View style={styles.voteDistributionSection}>
        <Text style={styles.voteDistributionTitle}>Oy Dağılımı</Text>
        <View style={styles.voteDistributionCard}>
          <View style={styles.voteDistributionItem}>
            <Text style={styles.voteDistributionPercentageYes}>
              {mainQuestion.yesPercentage}%
            </Text>
            <Text style={styles.voteDistributionLabel}>EVET</Text>
            <Text style={styles.voteDistributionAmount}>
              {mainQuestion.yesInvestment.toLocaleString('tr-TR')} ₺
            </Text>
                </View>
          <View style={styles.voteDistributionDivider} />
          <View style={styles.voteDistributionItem}>
            <Text style={styles.voteDistributionPercentageNo}>
              {mainQuestion.noPercentage}%
            </Text>
            <Text style={styles.voteDistributionLabel}>HAYIR</Text>
            <Text style={styles.voteDistributionAmount}>
              {mainQuestion.noInvestment.toLocaleString('tr-TR')} ₺
            </Text>
                </View>
              </View>
            </View>
    </View>
  );

  // Dinamik stiller theme'e göre (ana tema koyu – açık modda bile #0D1117)
  const dynamicStyles = {
    container: {
      ...styles.container,
      backgroundColor: isDarkMode ? theme.background : '#0D1117',
    },
    loadingText: {
      ...styles.loadingText,
      color: theme.accent,
    },
    errorText: {
      ...styles.errorText,
      color: theme.error,
    },
  };

  // Loading durumu - Skeleton göster
  if (loading && !mainQuestion) {
    return <QuestionDetailSkeleton onBack={onBack} />;
  }

  // Soru bulunamadı
  if (!mainQuestion) {
    return (
      <View style={[dynamicStyles.container, styles.loadingContainer]}>
        <Text style={dynamicStyles.errorText}>Soru bulunamadı</Text>
      </View>
    );
  }

  return (
    <View style={dynamicStyles.container}>
      {/* Navigation Buttons - RENDER FIRST (highest priority) */}
      <View style={[styles.headerNav, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={onBack}
          activeOpacity={0.8}
        >
          <Ionicons name="chevron-back" size={22} color="#F0F6FC" />
        </TouchableOpacity>

        <View style={styles.headerNavRight}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={handleShare}
            activeOpacity={0.8}
          >
            <Ionicons name="share-social" size={20} color="#F0F6FC" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navButton}
            onPress={toggleFavorite}
            activeOpacity={0.8}
          >
            <Ionicons 
              name={isFavorite ? "heart" : "heart-outline"}
              size={22}
              color={isFavorite ? '#EF4444' : '#F0F6FC'}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.accent, theme.primary]}
            tintColor={theme.accent}
          />
        }
      >

        {/* Content Container */}
        <View style={styles.contentContainer}>
          {/* Question Header */}
          <View style={styles.questionHeader}>
            <View style={styles.questionTitleRow}>
              <Text style={styles.questionTitle}>{mainQuestion.title}</Text>
              <View style={styles.rightColumn}>
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={16} color="#C9F158" />
                  <Text style={styles.ratingText}>{mainQuestion.rating}</Text>
                </View>
                {/* Countdown - Sadece Gün (Yıldızın altında) */}
                <View style={styles.countdownBadge}>
                  <Text style={styles.countdownBadgeValue}>{timeLeft.days}</Text>
                  <Text style={styles.countdownBadgeLabel}>GÜN</Text>
                </View>
              </View>
            </View>

            {/* Published Date and Vote Count */}
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={16} color={theme.textMuted + '80'} />
                <Text style={styles.metaText}>
                  {formatPublishDate(mainQuestion.publishedAt)} yayınlandı
                </Text>
              </View>
              <View style={styles.voteCountBadge}>
                <Ionicons name="people" size={16} color={theme.accent} />
                <Text style={styles.voteCountText}>{mainQuestion.totalVotes}</Text>
                <Text style={styles.voteCountLabel}>oy</Text>
              </View>
            </View>

            {/* Tabs */}
            <View style={styles.tabs}>
          <TouchableOpacity
                style={[styles.tab, activeTab === 'details' && styles.tabActive]}
                onPress={() => setActiveTab('details')}
              >
                <View style={styles.tabContent}>
                  <Text style={styles.tabEmoji}>📝</Text>
                  <Text style={[styles.tabText, activeTab === 'details' && styles.tabTextActive]}>
                    Soru Detay
                  </Text>
              </View>
                {activeTab === 'details' && <View style={styles.tabIndicator} />}
          </TouchableOpacity>

          <TouchableOpacity
                style={[styles.tab, activeTab === 'comments' && styles.tabActive]}
                onPress={() => setActiveTab('comments')}
              >
                <View style={styles.tabContent}>
                  <Ionicons 
                    name="chatbubble-outline" 
                    size={14} 
                    color={activeTab === 'comments' ? theme.accent : theme.textMuted + '66'}
                  />
                  <Text style={[styles.tabText, activeTab === 'comments' && styles.tabTextActive]}>
                    Yorumlar
                  </Text>
                  <View style={[
                    styles.commentCountBadge,
                    activeTab === 'comments' && styles.commentCountBadgeActive
                  ]}>
                    <Text style={[
                      styles.commentCountText,
                      activeTab === 'comments' && styles.commentCountTextActive
                    ]}>
                      {comments.length}
                    </Text>
                  </View>
                </View>
                {activeTab === 'comments' && <View style={styles.tabIndicator} />}
          </TouchableOpacity>

          <TouchableOpacity
                style={[styles.tab, activeTab === 'stats' && styles.tabActive]}
                onPress={() => setActiveTab('stats')}
              >
                <View style={styles.tabContent}>
                  <Ionicons 
                    name="bar-chart" 
                    size={14} 
                    color={activeTab === 'stats' ? theme.accent : theme.textMuted + '66'}
                  />
                  <Text style={[styles.tabText, activeTab === 'stats' && styles.tabTextActive]}>
                    İstatistikler
                  </Text>
        </View>
                {activeTab === 'stats' && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        </View>

            {/* Divider */}
            <LinearGradient
              colors={['transparent', 'rgba(16, 185, 129, 0.2)', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.divider}
            />
      </View>

          {/* Tab Content */}
          {activeTab === 'details' && renderDetailsTab()}
          {activeTab === 'comments' && renderCommentsTab()}
          {activeTab === 'stats' && renderStatsTab()}
        </View>
      </ScrollView>

      {/* Fixed Header Background - Behind everything */}
      <View style={styles.fixedHeaderBackground} pointerEvents="box-none">
        <Image 
          source={{ uri: mainQuestion.image || question?.image || 'https://images.unsplash.com/photo-1574477942438-5db6de70fd34?w=800&h=600&fit=crop' }}
          style={styles.headerImage}
          resizeMode="cover"
        />
        
        <LinearGradient
          colors={['rgba(0,0,0,0.2)', 'transparent']}
          style={styles.headerGradient}
        />

        <View style={styles.categoryBadgeContainer}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryIcon}>{mainQuestion.categoryIcon}</Text>
            <Text style={styles.categoryText}>{mainQuestion.category}</Text>
          </View>
        </View>
      </View>

      {/* Fixed Bottom Vote Bar - Yan yana, ortalı, basınca yeşil/kırmızı effect */}
      <View style={[styles.compactVoteBar, { paddingBottom: insets.bottom }]}>
        <View style={styles.compactVoteRow}>
          {/* EVET Button */}
          <Pressable
            onPress={() => openTicketModal('yes')}
            style={({ pressed }) => [
              styles.compactVoteBtn,
              styles.compactVoteBtnYes,
              pressed && styles.compactVoteBtnYesPressed,
            ]}
          >
            <View style={styles.compactVoteLabelBlockYes}>
              <Text style={styles.compactVoteLabelYes}>EVET</Text>
              <Text style={styles.compactVoteOddsYes}>{mainQuestion?.yesOdds || 2}x</Text>
            </View>
          </Pressable>

          <View style={styles.compactVoteDivider} />

          {/* HAYIR Button */}
          <Pressable
            onPress={() => openTicketModal('no')}
            style={({ pressed }) => [
              styles.compactVoteBtn,
              styles.compactVoteBtnNo,
              pressed && styles.compactVoteBtnNoPressed,
            ]}
          >
            <View style={styles.compactVoteLabelBlockNo}>
              <Text style={styles.compactVoteLabelNo}>HAYIR</Text>
              <Text style={styles.compactVoteOddsNo}>{mainQuestion?.noOdds || 2}x</Text>
            </View>
          </Pressable>
        </View>
      </View>

      {/* Ticket Alma Modal */}
      <Modal
        visible={ticketModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setTicketModalVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <Pressable 
            style={styles.modalBackdrop} 
            onPress={() => setTicketModalVisible(false)}
          />
          <View style={styles.ticketModalContainer}>
            {/* Modal Header */}
            <View style={styles.ticketModalHeader}>
              <View style={styles.ticketModalHandle} />
              <Text style={styles.ticketModalTitle}>Ticket Al</Text>
              <TouchableOpacity 
                style={styles.ticketModalCloseBtn}
                onPress={() => setTicketModalVisible(false)}
              >
                <Ionicons name="close" size={24} color={theme.textMuted} />
              </TouchableOpacity>
            </View>

            {/* Seçilen Oy */}
            <View style={[
              styles.selectedVoteContainer,
              selectedVote === 'yes' ? styles.selectedVoteYes : styles.selectedVoteNo
            ]}>
              <View style={styles.selectedVoteIcon}>
                <Ionicons 
                  name={selectedVote === 'yes' ? 'checkmark-circle' : 'close-circle'} 
                  size={32} 
                  color={selectedVote === 'yes' ? theme.accent : theme.error} 
                />
              </View>
              <View style={styles.selectedVoteInfo}>
                <Text style={styles.selectedVoteLabel}>Seçiminiz</Text>
                <Text style={[
                  styles.selectedVoteText,
                  selectedVote === 'yes' ? styles.selectedVoteTextYes : styles.selectedVoteTextNo
                ]}>
                  {selectedVote === 'yes' ? 'EVET' : 'HAYIR'}
                </Text>
              </View>
              <View style={styles.selectedVoteOdds}>
                <Text style={styles.selectedVoteOddsValue}>
                  {selectedVote === 'yes' ? mainQuestion?.yesOdds : mainQuestion?.noOdds}x
                </Text>
                <Text style={styles.selectedVoteOddsLabel}>oran</Text>
              </View>
            </View>

            {/* Miktar Girişi */}
            <View style={styles.amountInputSection}>
              <Text style={styles.amountInputLabel}>Yatırmak İstediğiniz Kredi</Text>
              <View style={styles.amountInputContainer}>
                <TextInput
                  style={styles.amountInput}
                  value={betAmount}
                  onChangeText={setBetAmount}
                  keyboardType="numeric"
                  placeholder="100"
                  placeholderTextColor={theme.textMuted}
                />
                <Text style={styles.amountInputCurrency}>Kredi</Text>
              </View>
              
              {/* Hızlı Seçim Butonları */}
              <View style={styles.quickAmountButtons}>
                {['50', '100', '250', '500', '1000'].map((amount) => (
                  <TouchableOpacity
                    key={amount}
                    style={[
                      styles.quickAmountBtn,
                      betAmount === amount && styles.quickAmountBtnActive
                    ]}
                    onPress={() => setBetAmount(amount)}
                  >
                    <Text style={[
                      styles.quickAmountBtnText,
                      betAmount === amount && styles.quickAmountBtnTextActive
                    ]}>
                      {amount}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Potansiyel Kazanç */}
            <View style={styles.potentialWinSection}>
              <View style={styles.potentialWinRow}>
                <Text style={styles.potentialWinLabel}>Yatırım</Text>
                <Text style={styles.potentialWinValue}>{betAmount || '0'} Kredi</Text>
              </View>
              <View style={styles.potentialWinRow}>
                <Text style={styles.potentialWinLabel}>Oran</Text>
                <Text style={styles.potentialWinValue}>
                  {selectedVote === 'yes' ? mainQuestion?.yesOdds : mainQuestion?.noOdds}x
                </Text>
              </View>
              <View style={styles.potentialWinDivider} />
              <View style={styles.potentialWinRow}>
                <Text style={styles.potentialWinTotalLabel}>Potansiyel Kazanç</Text>
                <Text style={styles.potentialWinTotalValue}>
                  {calculatePotentialWin().toFixed(0)} Kredi
                </Text>
              </View>
            </View>

            {/* Ticket Al Butonu */}
            <TouchableOpacity
              style={[
                styles.confirmTicketBtn,
                isProcessing && styles.confirmTicketBtnDisabled
              ]}
              onPress={handleConfirmTicket}
              disabled={isProcessing}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={selectedVote === 'yes' ? ['#10B981', '#059669'] : ['#DC2626', '#B91C1C']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.confirmTicketBtnGradient}
              >
                {isProcessing ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <Ionicons name="ticket" size={22} color="#fff" />
                    <Text style={styles.confirmTicketBtnText}>Ticket Al</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Success Modal - Happy End */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={closeSuccessModal}
      >
        <View style={styles.successModalOverlay}>
          {/* Confetti Animation */}
          <Animated.View style={[styles.confettiContainer, {
            opacity: confettiAnim,
            transform: [{ translateY: confettiAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [-100, 0],
            })}],
          }]}>
            {[...Array(20)].map((_, i) => (
              <Animated.View
                key={i}
                style={[
                  styles.confettiPiece,
                  {
                    left: `${Math.random() * 100}%`,
                    backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#9B59B6', '#3498DB'][i % 5],
                    transform: [{
                      translateY: confettiAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, SCREEN_HEIGHT * 0.6 + Math.random() * 200],
                      }),
                    }, {
                      rotate: confettiAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', `${Math.random() * 720}deg`],
                      }),
                    }],
                  }
                ]}
              />
            ))}
          </Animated.View>

          <Animated.View style={[
            styles.successModalCard,
            { transform: [{ scale: successScaleAnim }] }
          ]}>
            {/* Success Icon */}
            <View style={styles.successIconContainer}>
              <LinearGradient
                colors={selectedVote === 'yes' ? ['#10B981', '#059669'] : ['#DC2626', '#B91C1C']}
                style={styles.successIconGradient}
              >
                <Ionicons name="checkmark" size={48} color="#fff" />
              </LinearGradient>
            </View>

            {/* Success Text */}
            <Text style={styles.successTitle}>🎉 Tebrikler!</Text>
            <Text style={styles.successSubtitle}>Ticketınız Başarıyla Alındı</Text>

            {/* Ticket Details */}
            <View style={styles.successTicketDetails}>
              <View style={styles.successTicketRow}>
                <Text style={styles.successTicketLabel}>Tahmin</Text>
                <Text style={[
                  styles.successTicketValue,
                  selectedVote === 'yes' ? styles.successTicketValueYes : styles.successTicketValueNo
                ]}>
                  {selectedVote === 'yes' ? 'EVET' : 'HAYIR'}
                </Text>
              </View>
              <View style={styles.successTicketRow}>
                <Text style={styles.successTicketLabel}>Yatırım</Text>
                <Text style={styles.successTicketValue}>{betAmount} Kredi</Text>
              </View>
              <View style={styles.successTicketRow}>
                <Text style={styles.successTicketLabel}>Potansiyel Kazanç</Text>
                <Text style={styles.successTicketValueHighlight}>
                  {calculatePotentialWin().toFixed(0)} Kredi
                </Text>
              </View>
            </View>

            {/* Close Button */}
            <TouchableOpacity
              style={styles.successCloseBtn}
              onPress={closeSuccessModal}
              activeOpacity={0.8}
            >
              <Text style={styles.successCloseBtnText}>Tamam</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1117',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
    color: '#A78BFA',
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  scrollView: {
    flex: 1,
    zIndex: 1,
    backgroundColor: '#0D1117',
  },
  scrollContent: {
    paddingTop: 260,
    paddingBottom: 140, // Space for fixed bottom buttons + safe area (küçültüldü)
    backgroundColor: '#0D1117',
  },
  fixedHeaderBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 260,
    zIndex: 10,
    overflow: 'hidden',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerImageContainer: {
    height: 260,
  },
  headerImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#21262D',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  headerNav: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    zIndex: 1000,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(13, 17, 23, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(48, 54, 61, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  headerNavRight: {
    flexDirection: 'row',
    gap: 12,
  },
  categoryBadgeContainer: {
    position: 'absolute',
    bottom: 24,
    right: 20,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(13, 17, 23, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(48, 54, 61, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  categoryIcon: {
    fontSize: 20,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#F0F6FC',
  },
  contentContainer: {
    backgroundColor: '#161B22',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: -32,
    minHeight: SCREEN_HEIGHT,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: '#30363D',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -8 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
      },
      android: {
        elevation: 20,
      },
    }),
  },
  questionHeader: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 8,
  },
  questionTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  questionTitle: {
    flex: 1,
    fontSize: 24,
    fontWeight: '900',
    color: '#F0F6FC',
    lineHeight: 32,
    paddingRight: 16,
  },
  rightColumn: {
    alignItems: 'flex-end',
    gap: 6,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#21262D',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
    borderWidth: 1,
    borderColor: '#30363D',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#F0F6FC',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8B949E',
  },
  voteCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#21262D',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: '#30363D',
  },
  voteCountText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#F0F6FC',
  },
  voteCountLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8B949E',
  },
  countdownBadge: {
    backgroundColor: 'rgba(33, 38, 45, 0.8)',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'rgba(48, 54, 61, 0.6)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  countdownBadgeValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F0F6FC',
    textAlign: 'center',
    marginBottom: 1,
  },
  countdownBadgeLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#8B949E',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  tabs: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  tab: {
    flex: 1,
    paddingTop: 6,
    paddingBottom: 12,
    paddingHorizontal: 4,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    position: 'relative',
  },
  tabActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  tabEmoji: {
    fontSize: 14,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#8B949E',
  },
  tabTextActive: {
    color: '#10B981',
  },
  commentCountBadge: {
    backgroundColor: '#21262D',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  commentCountBadgeActive: {
    backgroundColor: '#10B981',
  },
  commentCountText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8B949E',
  },
  commentCountTextActive: {
    color: '#fff',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#10B981',
    borderRadius: 2,
  },
  divider: {
    height: 1,
    marginBottom: 0,
  },
  detailsTabContainer: {
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: 24,
    paddingTop: 0,
  },
  descriptionSection: {
    marginBottom: 20,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#B1BAC4',
    marginBottom: 12,
  },
  creatorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#21262D',
    padding: 16,
    borderRadius: 16,
    gap: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#30363D',
  },
  creatorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#fff',
  },
  creatorInfo: {
    flex: 1,
  },
  creatorLabel: {
    fontSize: 10,
    color: '#8B949E',
    marginBottom: 2,
  },
  creatorUsername: {
    fontSize: 14,
    fontWeight: '700',
    color: '#10B981',
  },
  creatorUsernameAt: {
    color: '#10B981',
  },
  followButton: {
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  followButtonGradient: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  followButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  voteStatsSection: {
    backgroundColor: '#21262D',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#30363D',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#F0F6FC',
    marginBottom: 12,
  },
  voteStatsContainer: {
    flexDirection: 'column',
    gap: 16,
  },
  voteStatsVerticalContainer: {
    flexDirection: 'column',
    gap: 12,
  },
  voteStatRow: {
    flex: 1,
  },
  voteStatVerticalRow: {
    width: '100%',
  },
  voteStatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  voteStatLabelYes: {
    fontSize: 12,
    fontWeight: '900',
    color: '#10B981',
  },
  voteStatLabelNo: {
    fontSize: 12,
    fontWeight: '900',
    color: '#DC2626',
  },
  voteStatPercentageYes: {
    fontSize: 12,
    fontWeight: '900',
    color: '#10B981',
  },
  voteStatPercentageNo: {
    fontSize: 12,
    fontWeight: '900',
    color: '#DC2626',
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: '#0D1117',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressBarYes: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 6,
  },
  progressBarNo: {
    height: '100%',
    backgroundColor: '#DC2626',
    borderRadius: 6,
  },
  voteStatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  voteStatInfo: {
    fontSize: 12,
    color: '#8B949E',
  },
  voteButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  voteButtonYes: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#34C759',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  voteButtonNo: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#DC2626',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  // Compact Vote Bar - Yan yana, ortalı, birbirinden uzak
  compactVoteBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#161B22',
    borderTopWidth: 1,
    borderTopColor: '#30363D',
    zIndex: 1000,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  compactVoteRow: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 4,
    minHeight: 68,
  },
  compactVoteBtn: {
    flex: 1,
    maxWidth: 160,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 12,
    borderWidth: 2,
    gap: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  compactVoteBtnYes: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.5)',
    alignItems: 'flex-start',
    paddingLeft: 10,
    paddingRight: 62,
  },
  compactVoteBtnNo: {
    backgroundColor: 'rgba(220, 38, 38, 0.12)',
    borderColor: 'rgba(220, 38, 38, 0.5)',
    alignItems: 'flex-end',
    paddingLeft: 62,
    paddingRight: 10,
  },
  compactVoteDivider: {
    width: 1,
    height: 34,
    backgroundColor: '#30363D',
    marginHorizontal: 62,
    borderRadius: 1,
    alignSelf: 'center',
  },
  compactVoteBtnYesPressed: {
    backgroundColor: 'rgba(16, 185, 129, 0.35)',
    borderColor: '#10B981',
    transform: [{ scale: 0.98 }],
    ...Platform.select({
      ios: { shadowColor: '#10B981', shadowOpacity: 0.35, shadowRadius: 8 },
      android: { elevation: 6 },
    }),
  },
  compactVoteBtnNoPressed: {
    backgroundColor: 'rgba(220, 38, 38, 0.35)',
    borderColor: '#DC2626',
    transform: [{ scale: 0.98 }],
    ...Platform.select({
      ios: { shadowColor: '#DC2626', shadowOpacity: 0.35, shadowRadius: 8 },
      android: { elevation: 6 },
    }),
  },
  compactVoteLabelBlockYes: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactVoteLabelBlockNo: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactVoteLabelYes: {
    fontSize: 18,
    fontWeight: '800',
    color: '#10B981',
    letterSpacing: 0.5,
    lineHeight: 22,
  },
  compactVoteLabelNo: {
    fontSize: 18,
    fontWeight: '800',
    color: '#DC2626',
    letterSpacing: 0.5,
    lineHeight: 22,
  },
  compactVoteOddsYes: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8B949E',
    marginTop: 0,
  },
  compactVoteOddsNo: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8B949E',
    marginTop: 0,
  },
  voteButtonGradient: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  voteButtonLabel: {
    fontSize: 18,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 4,
  },
  voteButtonOdds: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffffE6',
  },
  relatedSection: {
    marginBottom: 8,
  },
  relatedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  relatedTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#F0F6FC',
  },
  seeAllButton: {
    fontSize: 14,
    fontWeight: '700',
    color: '#10B981',
  },
  relatedScrollContent: {
    paddingRight: 24,
  },
  relatedCard: {
    width: 280,
    backgroundColor: '#21262D',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#30363D',
    overflow: 'hidden',
    marginRight: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  relatedImageContainer: {
    height: 192,
    position: 'relative',
  },
  relatedImage: {
    width: '100%',
    height: '100%',
  },
  relatedFavoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  relatedCardContent: {
    padding: 16,
  },
  relatedCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F0F6FC',
    marginBottom: 8,
    lineHeight: 22,
  },
  relatedCardStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  relatedCardStat: {
    fontSize: 14,
    color: '#8B949E',
  },
  relatedCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  relatedCardRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  relatedCardRatingText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F0F6FC',
  },
  relatedCardVotes: {
    fontSize: 12,
    color: '#8B949E',
  },
  relatedCardButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  commentInputSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  commentInputSectionNoPadding: {
    marginBottom: 20,
  },
  commentInputCard: {
    backgroundColor: '#21262D',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#30363D',
  },
  commentInputRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 10,
  },
  commentUserAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#0D1117',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#F0F6FC',
    minHeight: 80,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#30363D',
  },
  commentInputFooter: {
    alignItems: 'flex-end',
  },
  sendButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 10,
    gap: 8,
  },
  sendButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  commentsListSection: {
    paddingHorizontal: 24,
  },
  commentsListSectionNoPadding: {
    // No padding since parent container has padding
  },
  commentsListTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#F0F6FC',
    marginBottom: 12,
  },
  commentCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#21262D',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    gap: 12,
    borderWidth: 1,
    borderColor: '#30363D',
  },
  commentAvatar: {
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
    fontSize: 14,
    fontWeight: '700',
    color: '#F0F6FC',
  },
  commentTime: {
    fontSize: 12,
    color: '#8B949E',
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#B1BAC4',
    marginBottom: 8,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  commentLikeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  commentLikeCount: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8B949E',
  },
  commentReplyButton: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8B949E',
  },
  totalPoolCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
  },
  totalPoolContent: {
    padding: 24,
  },
  totalPoolHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  totalPoolIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalPoolInfo: {
    flex: 1,
  },
  totalPoolLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#ffffffB3',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  totalPoolAmountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  totalPoolAmount: {
    fontSize: 36,
    fontWeight: '900',
    color: '#fff',
  },
  totalPoolCurrency: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffffE6',
  },
  totalPoolDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginVertical: 16,
  },
  totalPoolFooter: {
    flexDirection: 'row',
  },
  totalPoolStat: {
    flex: 1,
    alignItems: 'center',
  },
  totalPoolStatLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffffB3',
    marginBottom: 4,
  },
  totalPoolStatValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#fff',
  },
  totalPoolDividerVertical: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 16,
  },
  chartSection: {
    marginBottom: 20,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#F0F6FC',
  },
  chartCard: {
    backgroundColor: '#21262D',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#30363D',
  },
  chart: {
    borderRadius: 16,
  },
  chartFooter: {
    borderTopWidth: 1,
    borderTopColor: '#30363D',
    paddingTop: 16,
    marginTop: 16,
  },
  chartFooterText: {
    fontSize: 12,
    color: '#8B949E',
    textAlign: 'center',
  },
  topInvestorsSection: {
    marginBottom: 20,
  },
  topInvestorsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  topInvestorsTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#F0F6FC',
  },
  investorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#21262D',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    gap: 12,
    borderWidth: 1,
    borderColor: '#30363D',
  },
  investorRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0D1117',
    alignItems: 'center',
    justifyContent: 'center',
  },
  investorRankGold: {
    backgroundColor: '#F59E0B',
  },
  investorRankSilver: {
    backgroundColor: '#94A3B8',
  },
  investorRankBronze: {
    backgroundColor: '#EA580C',
  },
  investorRankText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#F0F6FC',
  },
  investorRankTextColored: {
    color: '#fff',
  },
  investorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  investorInfo: {
    flex: 1,
  },
  investorUsername: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F0F6FC',
    marginBottom: 2,
  },
  investorAmount: {
    fontSize: 12,
    color: '#8B949E',
  },
  investorVoteBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  investorVoteBadgeYes: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  investorVoteBadgeNo: {
    backgroundColor: 'rgba(220, 38, 38, 0.2)',
  },
  investorVoteText: {
    fontSize: 12,
    fontWeight: '700',
  },
  investorVoteTextYes: {
    color: '#10B981',
  },
  investorVoteTextNo: {
    color: '#DC2626',
  },
  voteDistributionSection: {
    marginBottom: 8,
  },
  voteDistributionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#F0F6FC',
    marginBottom: 16,
  },
  voteDistributionCard: {
    flexDirection: 'row',
    backgroundColor: '#21262D',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#30363D',
  },
  voteDistributionItem: {
    flex: 1,
    alignItems: 'center',
  },
  voteDistributionPercentageYes: {
    fontSize: 28,
    fontWeight: '900',
    color: '#10B981',
    marginBottom: 4,
  },
  voteDistributionPercentageNo: {
    fontSize: 28,
    fontWeight: '900',
    color: '#DC2626',
    marginBottom: 4,
  },
  voteDistributionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8B949E',
    marginBottom: 4,
  },
  voteDistributionAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F0F6FC',
  },
  voteDistributionDivider: {
    width: 1,
    backgroundColor: '#30363D',
    marginHorizontal: 16,
  },
  
  // Ticket Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  ticketModalContainer: {
    backgroundColor: '#161B22',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: '#30363D',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -8 },
        shadowOpacity: 0.4,
        shadowRadius: 24,
      },
      android: {
        elevation: 24,
      },
    }),
  },
  ticketModalHeader: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#30363D',
    marginBottom: 20,
  },
  ticketModalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#484F58',
    borderRadius: 2,
    marginBottom: 16,
  },
  ticketModalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#F0F6FC',
  },
  ticketModalCloseBtn: {
    position: 'absolute',
    right: 0,
    top: 20,
    padding: 8,
  },
  selectedVoteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  selectedVoteYes: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  selectedVoteNo: {
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.3)',
  },
  selectedVoteIcon: {
    marginRight: 12,
  },
  selectedVoteInfo: {
    flex: 1,
  },
  selectedVoteLabel: {
    fontSize: 12,
    color: '#8B949E',
    marginBottom: 2,
  },
  selectedVoteText: {
    fontSize: 18,
    fontWeight: '800',
  },
  selectedVoteTextYes: {
    color: '#10B981',
  },
  selectedVoteTextNo: {
    color: '#DC2626',
  },
  selectedVoteOdds: {
    alignItems: 'center',
    backgroundColor: '#21262D',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  selectedVoteOddsValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#F0F6FC',
  },
  selectedVoteOddsLabel: {
    fontSize: 10,
    color: '#8B949E',
  },
  amountInputSection: {
    marginBottom: 20,
  },
  amountInputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B949E',
    marginBottom: 12,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0D1117',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#30363D',
  },
  amountInput: {
    flex: 1,
    fontSize: 28,
    fontWeight: '800',
    color: '#F0F6FC',
  },
  amountInputCurrency: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B949E',
  },
  quickAmountButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 8,
  },
  quickAmountBtn: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#21262D',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#30363D',
  },
  quickAmountBtnActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  quickAmountBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8B949E',
  },
  quickAmountBtnTextActive: {
    color: '#fff',
  },
  potentialWinSection: {
    backgroundColor: '#21262D',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#30363D',
  },
  potentialWinRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  potentialWinLabel: {
    fontSize: 14,
    color: '#8B949E',
  },
  potentialWinValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F0F6FC',
  },
  potentialWinDivider: {
    height: 1,
    backgroundColor: '#30363D',
    marginVertical: 12,
  },
  potentialWinTotalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F0F6FC',
  },
  potentialWinTotalValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#10B981',
  },
  confirmTicketBtn: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  confirmTicketBtnDisabled: {
    opacity: 0.7,
  },
  confirmTicketBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 10,
  },
  confirmTicketBtnText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
  },

  // Success Modal Styles
  successModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confettiContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  confettiPiece: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 2,
    top: -20,
  },
  successModalCard: {
    backgroundColor: '#161B22',
    borderRadius: 24,
    padding: 32,
    width: SCREEN_WIDTH - 48,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#30363D',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.5,
        shadowRadius: 32,
      },
      android: {
        elevation: 32,
      },
    }),
  },
  successIconContainer: {
    marginBottom: 20,
  },
  successIconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#F0F6FC',
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 16,
    color: '#8B949E',
    marginBottom: 24,
  },
  successTicketDetails: {
    width: '100%',
    backgroundColor: '#21262D',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#30363D',
  },
  successTicketRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  successTicketLabel: {
    fontSize: 14,
    color: '#8B949E',
  },
  successTicketValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F0F6FC',
  },
  successTicketValueYes: {
    color: '#10B981',
  },
  successTicketValueNo: {
    color: '#DC2626',
  },
  successTicketValueHighlight: {
    fontSize: 18,
    fontWeight: '900',
    color: '#10B981',
  },
  successCloseBtn: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 16,
  },
  successCloseBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
  },
});
