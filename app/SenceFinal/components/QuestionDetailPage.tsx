import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Animated,
  Share,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface QuestionDetailPageProps {
  onBack: () => void;
  onVote?: (vote: 'yes' | 'no') => void;
  questionId?: number;
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

export function QuestionDetailPage({ onBack, onVote, questionId }: QuestionDetailPageProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'comments' | 'stats'>('details');
  const [commentText, setCommentText] = useState('');
  const [timeLeft, setTimeLeft] = useState({ days: 15, hours: 8, minutes: 42 });
  const scrollY = useRef(new Animated.Value(0)).current;

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59 };
        }
        return prev;
      });
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Pulse animation for countdown
  const pulseAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.02,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Main question data
  const mainQuestion = {
    title: "Apple yeni iPhone 16'yı bu yıl piyasaya sürecek mi?",
    category: "Teknoloji",
    categoryIcon: "💻",
    image: "https://images.unsplash.com/photo-1574477942438-5db6de70fd34?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwbW9kZXJuJTIwY2l0eXxlbnwxfHx8fDE3NjAxNzQyODR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Apple'ın her yıl geleneksel olarak Eylül ayında gerçekleştirdiği etkinlikte yeni iPhone modellerini tanıtması bekleniyor. iPhone 16 serisinin gelişmiş yapay zeka özellikleri ve yeni tasarım elementleriyle geleceği konuşuluyor.",
    fullDescription: "Apple'ın her yıl geleneksel olarak Eylül ayında gerçekleştirdiği etkinlikte yeni iPhone modellerini tanıtması bekleniyor. iPhone 16 serisinin gelişmiş yapay zeka özellikleri ve yeni tasarım elementleriyle geleceği konuşuluyor. Analistler, yeni modelin özellikle kamera teknolojisi ve işlemci gücü açısından önemli yenilikler getireceğini tahmin ediyor. Ayrıca USB-C geçişinin standart hale geleceği ve batarya ömrünün artırılacağı bekleniyor.",
    rating: 4.8,
    totalVotes: 1247,
    yesPercentage: 78,
    noPercentage: 22,
    yesOdds: 1.28,
    noOdds: 3.64,
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    endDate: "15 gün",
    daysLeft: 15,
    creator: {
      username: "tech_insider",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=face"
    },
    totalPool: 125000,
    yesInvestment: 97500,
    noInvestment: 27500
  };

  // Comments data
  const [comments, setComments] = useState<Comment[]>([
  {
    id: 1,
      username: "crypto_king",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face",
      text: "Apple her sene Eylül'de tanıtıyor, kesin çıkacak!",
      timestamp: new Date(Date.now() - 3600000),
      likes: 24
  },
  {
    id: 2,
      username: "trend_hunter",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=32&h=32&fit=crop&crop=face",
      text: "USB-C geçişi çok önemli bir adım olacak",
      timestamp: new Date(Date.now() - 7200000),
      likes: 18
  },
  {
    id: 3,
      username: "market_wizard",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face",
      text: "Fiyatlar yine uçuk olacak gibi görünüyor 😅",
      timestamp: new Date(Date.now() - 10800000),
      likes: 12
    }
  ]);

  // Top investors
  const topInvestors: TopInvestor[] = [
    {
      username: "whale_master",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      amount: 15000,
      vote: 'yes'
    },
    {
      username: "tech_bull",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face",
      amount: 12500,
      vote: 'yes'
    },
    {
      username: "skeptic_bear",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
      amount: 8000,
      vote: 'no'
    },
    {
      username: "apple_fan",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      amount: 7500,
      vote: 'yes'
    }
  ];

  // Related questions
  const [relatedQuestions, setRelatedQuestions] = useState<RelatedQuestion[]>([
    {
      id: 1,
      title: "Samsung Galaxy S24 Serisi",
      category: "Teknoloji",
      image: "https://images.unsplash.com/photo-1643559247329-7254c71646f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGxhbmRzY2FwZSUyMHN1bnNldHxlbnwxfHx8fDE3NjAxODE4NjV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      daysLeft: 8,
      odds: 650,
      rating: 4.6,
      votes: 58,
      isFavorite: false
    },
    {
      id: 2,
      title: "Tesla Model Y Satışları",
      category: "Teknoloji",
      image: "https://images.unsplash.com/photo-1650289246926-ca8eaa0c3325?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBzdGFkaXVtJTIwYWN0aW9ufGVufDF8fHx8MTc2MDE3NjY2NXww&ixlib=rb-4.1.0&q=80&w=1080",
      daysLeft: 12,
      odds: 890,
      rating: 4.8,
      votes: 92,
      isFavorite: false
    },
    {
      id: 3,
      title: "Meta Quest 3 VR Kulaklık",
      category: "Teknoloji",
      image: "https://images.unsplash.com/photo-1574477942438-5db6de70fd34?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwbW9kZXJuJTIwY2l0eXxlbnwxfHx8fDE3NjAxNzQyODR8MA&ixlib=rb-4.1.0&q=80&w=1080",
      daysLeft: 5,
      odds: 450,
      rating: 4.5,
      votes: 45,
      isFavorite: true
    }
  ]);

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
        color: () => '#FF3B30', // HAYIR color
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

  const handleSendComment = () => {
    if (commentText.trim()) {
      const newComment: Comment = {
        id: comments.length + 1,
        username: "mustafa_92",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
        text: commentText,
        timestamp: new Date(),
        likes: 0
      };
      setComments([newComment, ...comments]);
      setCommentText('');
    }
  };

  const handleShare = async () => {
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
  }, []);

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
          <Text style={styles.creatorUsername}>@{mainQuestion.creator.username}</Text>
        </View>
        <TouchableOpacity style={styles.followButton}>
          <Text style={styles.followButtonText}>Takip Et</Text>
        </TouchableOpacity>
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

      {/* Vote Buttons */}
      <View style={styles.voteButtonsContainer}>
            <TouchableOpacity 
          style={styles.voteButtonYes}
          onPress={() => onVote?.('yes')}
              activeOpacity={0.8}
            >
          <LinearGradient
            colors={['#34C759', '#28A745']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.voteButtonGradient}
          >
            <Text style={styles.voteButtonLabel}>EVET</Text>
            <Text style={styles.voteButtonOdds}>{mainQuestion.yesOdds}x</Text>
          </LinearGradient>
            </TouchableOpacity>
            
              <TouchableOpacity 
          style={styles.voteButtonNo}
          onPress={() => onVote?.('no')}
                activeOpacity={0.8}
              >
          <LinearGradient
            colors={['#FF3B30', '#DC3545']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.voteButtonGradient}
          >
            <Text style={styles.voteButtonLabel}>HAYIR</Text>
            <Text style={styles.voteButtonOdds}>{mainQuestion.noOdds}x</Text>
          </LinearGradient>
              </TouchableOpacity>
                </View>

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
          {relatedQuestions.map((question) => (
            <View key={question.id} style={styles.relatedCard}>
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
                    color={question.isFavorite ? "#FF3B30" : "#202020"}
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
              source={{ uri: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" }}
              style={styles.commentUserAvatar}
            />
                  <TextInput
              value={commentText}
              onChangeText={setCommentText}
              placeholder="Yorumunuzu yazın..."
              placeholderTextColor="#202020AA"
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
          colors={['#432870', '#B29EFD']}
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
              {comments.map((comment) => (
                <View key={comment.id} style={styles.commentCard}>
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
                  <Ionicons name="heart-outline" size={16} color="#20202099" />
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
        colors={['#432870', '#5A3A8B', '#B29EFD']}
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
          <Ionicons name="trending-up" size={20} color="#432870" />
          <Text style={styles.chartTitle}>Oran Değişimi Grafiği</Text>
                  </View>
        <View style={styles.chartCard}>
          <LineChart
            data={oddsChartData}
            width={SCREEN_WIDTH - 64}
            height={250}
            chartConfig={{
              backgroundColor: '#F2F3F5',
              backgroundGradientFrom: '#F2F3F5',
              backgroundGradientTo: '#F2F3F5',
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
          <View key={index} style={styles.investorCard}>
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

  return (
    <View style={styles.container}>
      {/* Navigation Buttons - RENDER FIRST (highest priority) */}
      <SafeAreaView style={styles.headerNav}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={onBack}
          activeOpacity={0.8}
        >
          <Ionicons name="chevron-back" size={24} color="#202020" />
        </TouchableOpacity>

        <View style={styles.headerNavRight}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={handleShare}
            activeOpacity={0.8}
          >
            <Ionicons name="share-social" size={20} color="#202020" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navButton}
            onPress={toggleFavorite}
            activeOpacity={0.8}
          >
            <Ionicons 
              name={isFavorite ? "heart" : "heart-outline"}
              size={24}
              color={isFavorite ? "#FF3B30" : "#202020"}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

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
      >

        {/* Content Container */}
        <View style={styles.contentContainer}>
          {/* Question Header */}
          <View style={styles.questionHeader}>
            <View style={styles.questionTitleRow}>
              <Text style={styles.questionTitle}>{mainQuestion.title}</Text>
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={16} color="#C9F158" />
                <Text style={styles.ratingText}>{mainQuestion.rating}</Text>
                </View>
              </View>

            {/* Published Date and Vote Count */}
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={16} color="#20202080" />
                <Text style={styles.metaText}>
                  {formatPublishDate(mainQuestion.publishedAt)} yayınlandı
                </Text>
                </View>
              <View style={styles.voteCountBadge}>
                <Ionicons name="people" size={16} color="#432870" />
                <Text style={styles.voteCountText}>{mainQuestion.totalVotes}</Text>
                <Text style={styles.voteCountLabel}>oy</Text>
              </View>
            </View>

            {/* Countdown Timer */}
                    <Animated.View 
                      style={[
                styles.countdownCard,
                { transform: [{ scale: pulseAnim }] }
              ]}
            >
              <LinearGradient
                colors={['#432870', '#5A3A8B', '#B29EFD']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.countdownGradient}
              >
                <View style={styles.countdownHeader}>
                  <View style={styles.countdownDot} />
                  <Text style={styles.countdownLabel}>SONUÇLANMAK İÇİN KALAN SÜRE</Text>
                  </View>
                <View style={styles.countdownTime}>
                  <View style={styles.countdownTimeItem}>
                    <Text style={styles.countdownTimeValue}>{timeLeft.days}</Text>
                    <Text style={styles.countdownTimeLabel}>GÜN</Text>
                </View>
                  <Text style={styles.countdownTimeSeparator}>:</Text>
                  <View style={styles.countdownTimeItem}>
                    <Text style={styles.countdownTimeValue}>{timeLeft.hours}</Text>
                    <Text style={styles.countdownTimeLabel}>SAAT</Text>
                  </View>
                  <Text style={styles.countdownTimeSeparator}>:</Text>
                  <View style={styles.countdownTimeItem}>
                    <Text style={styles.countdownTimeValue}>{timeLeft.minutes}</Text>
                    <Text style={styles.countdownTimeLabel}>DAKİKA</Text>
                  </View>
                </View>
              </LinearGradient>
            </Animated.View>

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
                    size={16} 
                    color={activeTab === 'comments' ? '#432870' : '#20202066'}
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
                    size={16} 
                    color={activeTab === 'stats' ? '#432870' : '#20202066'}
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
              colors={['transparent', '#43287033', 'transparent']}
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
          source={{ uri: mainQuestion.image }}
          style={styles.headerImage}
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

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F3F5',
  },
  scrollView: {
    flex: 1,
    zIndex: 1,
  },
  scrollContent: {
    paddingTop: 400,
  },
  fixedHeaderBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 400,
    zIndex: 0,
  },
  headerImageContainer: {
    height: 400,
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
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
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
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
    bottom: 60,
    right: 24,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
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
    color: '#202020',
  },
  contentContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: -48,
    minHeight: SCREEN_HEIGHT,
    paddingBottom: 40,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
      },
      android: {
        elevation: 16,
      },
    }),
  },
  questionHeader: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 8,
  },
  questionTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  questionTitle: {
    flex: 1,
    fontSize: 24,
    fontWeight: '900',
    color: '#202020',
    lineHeight: 32,
    paddingRight: 16,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F3F5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#202020',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#202020B3',
  },
  voteCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F3F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  voteCountText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#202020',
  },
  voteCountLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#20202099',
  },
  countdownCard: {
    marginTop: 4,
    marginBottom: 20,
    borderRadius: 24,
    overflow: 'hidden',
  },
  countdownGradient: {
    padding: 20,
  },
  countdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  countdownDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#C9F158',
  },
  countdownLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ffffffCC',
    letterSpacing: 0.5,
  },
  countdownTime: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  countdownTimeItem: {
    flex: 1,
    alignItems: 'center',
  },
  countdownTimeValue: {
    fontSize: 36,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 4,
  },
  countdownTimeLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ffffffB3',
  },
  countdownTimeSeparator: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ffffff80',
    marginHorizontal: 8,
  },
  tabs: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  tab: {
    flex: 1,
    paddingTop: 8,
    paddingBottom: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    position: 'relative',
  },
  tabActive: {
    backgroundColor: '#4328700D',
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  tabEmoji: {
    fontSize: 16,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#20202066',
  },
  tabTextActive: {
    color: '#432870',
  },
  commentCountBadge: {
    backgroundColor: '#2020201A',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  commentCountBadgeActive: {
    backgroundColor: '#432870',
  },
  commentCountText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#20202099',
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
    backgroundColor: '#432870',
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
    color: '#202020CC',
    marginBottom: 12,
  },
  creatorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F3F5',
    padding: 16,
    borderRadius: 16,
    gap: 12,
    marginBottom: 20,
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
    color: '#20202099',
    marginBottom: 2,
  },
  creatorUsername: {
    fontSize: 14,
    fontWeight: '700',
    color: '#202020',
  },
  followButton: {
    backgroundColor: '#432870',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  followButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  voteStatsSection: {
    backgroundColor: '#F2F3F5',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#202020',
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
    color: '#34C759',
  },
  voteStatLabelNo: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FF3B30',
  },
  voteStatPercentageYes: {
    fontSize: 12,
    fontWeight: '900',
    color: '#34C759',
  },
  voteStatPercentageNo: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FF3B30',
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: '#fff',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  progressBarYes: {
    height: '100%',
    backgroundColor: '#34C759',
    borderRadius: 6,
  },
  progressBarNo: {
    height: '100%',
    backgroundColor: '#FF3B30',
    borderRadius: 6,
  },
  voteStatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  voteStatInfo: {
    fontSize: 12,
    color: '#20202099',
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
        shadowColor: '#FF3B30',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
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
    color: '#202020',
  },
  seeAllButton: {
    fontSize: 14,
    fontWeight: '700',
    color: '#432870',
  },
  relatedScrollContent: {
    paddingRight: 24,
  },
  relatedCard: {
    width: 280,
    backgroundColor: '#fff',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#F2F3F5',
    overflow: 'hidden',
    marginRight: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
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
    color: '#202020',
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
    color: '#202020B3',
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
    color: '#202020',
  },
  relatedCardVotes: {
    fontSize: 12,
    color: '#20202099',
  },
  relatedCardButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#202020',
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
    backgroundColor: '#F2F3F5',
    borderRadius: 16,
    padding: 16,
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
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#202020',
    minHeight: 80,
    textAlignVertical: 'top',
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
    color: '#202020',
    marginBottom: 12,
  },
  commentCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F2F3F5',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    gap: 12,
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
    color: '#202020',
  },
  commentTime: {
    fontSize: 12,
    color: '#20202080',
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#202020CC',
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
    color: '#20202099',
  },
  commentReplyButton: {
    fontSize: 12,
    fontWeight: '700',
    color: '#20202099',
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
    color: '#202020',
  },
  chartCard: {
    backgroundColor: '#F2F3F5',
    borderRadius: 16,
    padding: 20,
  },
  chart: {
    borderRadius: 16,
  },
  chartFooter: {
    borderTopWidth: 2,
    borderTopColor: '#fff',
    paddingTop: 16,
    marginTop: 16,
  },
  chartFooterText: {
    fontSize: 12,
    color: '#20202099',
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
    color: '#202020',
  },
  investorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F3F5',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    gap: 12,
  },
  investorRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
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
    color: '#202020',
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
    color: '#202020',
    marginBottom: 2,
  },
  investorAmount: {
    fontSize: 12,
    color: '#20202099',
  },
  investorVoteBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  investorVoteBadgeYes: {
    backgroundColor: '#34C75933',
  },
  investorVoteBadgeNo: {
    backgroundColor: '#FF3B3033',
  },
  investorVoteText: {
    fontSize: 12,
    fontWeight: '700',
  },
  investorVoteTextYes: {
    color: '#34C759',
  },
  investorVoteTextNo: {
    color: '#FF3B30',
  },
  voteDistributionSection: {
    marginBottom: 8,
  },
  voteDistributionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#202020',
    marginBottom: 16,
  },
  voteDistributionCard: {
    flexDirection: 'row',
    backgroundColor: '#F2F3F5',
    borderRadius: 16,
    padding: 20,
  },
  voteDistributionItem: {
    flex: 1,
    alignItems: 'center',
  },
  voteDistributionPercentageYes: {
    fontSize: 28,
    fontWeight: '900',
    color: '#34C759',
    marginBottom: 4,
  },
  voteDistributionPercentageNo: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FF3B30',
    marginBottom: 4,
  },
  voteDistributionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#20202099',
    marginBottom: 4,
  },
  voteDistributionAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#202020',
  },
  voteDistributionDivider: {
    width: 1,
    backgroundColor: '#20202033',
    marginHorizontal: 16,
  },
});
