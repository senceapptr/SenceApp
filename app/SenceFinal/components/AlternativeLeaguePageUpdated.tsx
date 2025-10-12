import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  SafeAreaView,
  Image,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LeagueQuestionsPage } from './LeagueQuestionsPage';
import { CreateLeagueWizard } from './CreateLeagueWizard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface AlternativeLeaguePageUpdatedProps {
  onBack: () => void;
  handleQuestionDetail: (question: any) => void;
  handleVote: (questionId: number, vote: 'yes' | 'no', odds: number) => void;
  onMenuToggle: () => void;
}

interface League {
  id: number;
  name: string;
  description: string;
  category: string;
  categories: string[];
  participants: number;
  maxParticipants: number;
  prize: string;
  endDate: string;
  isJoined: boolean;
  position?: number;
  creator: string;
  joinCost: number;
  isFeatured?: boolean;
  status?: 'active' | 'completed';
  isPrivate?: boolean;
  pointSystem: string;
}

interface ChatMessage {
  id: number;
  username: string;
  message: string;
  timestamp: Date;
  avatar: string;
}

export function AlternativeLeaguePageUpdated({ 
  onBack,
  handleQuestionDetail,
  handleVote,
  onMenuToggle
}: AlternativeLeaguePageUpdatedProps) {
  const [activeTab, setActiveTab] = useState<'discover' | 'my-leagues' | 'create'>('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);
  const [showLeagueDetails, setShowLeagueDetails] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showScoringModal, setShowScoringModal] = useState(false);
  const [showJoinConfirmModal, setShowJoinConfirmModal] = useState(false);
  const [showJoinSuccessAnimation, setShowJoinSuccessAnimation] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [showLeagueQuestions, setShowLeagueQuestions] = useState(false);
  const [showCreateWizard, setShowCreateWizard] = useState(false);
  const [leaderboardScrollY, setLeaderboardScrollY] = useState(0);
  
  // Animated header
  const headerTranslateY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Header animation logic
  const handleScroll = (event: any) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    const scrollDiff = currentScrollY - lastScrollY.current;
    
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
    }
    
    if (scrollDiff > 5 && currentScrollY > 50) {
      Animated.timing(headerTranslateY, {
        toValue: -200,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else if (scrollDiff < -5) {
      Animated.timing(headerTranslateY, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
      
      hideTimeout.current = setTimeout(() => {
        if (currentScrollY > 50) {
          Animated.timing(headerTranslateY, {
            toValue: -200,
            duration: 300,
            useNativeDriver: true,
          }).start();
        }
      }, 3000);
    }
    
    lastScrollY.current = currentScrollY;
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hideTimeout.current) {
        clearTimeout(hideTimeout.current);
      }
    };
  }, []);

  // User data
  const currentUser = {
    username: 'mustafa_92',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=face',
    joinedLeagues: 3,
    maxLeagues: 5,
    credits: 8500,
    tickets: 2
  };

  // Mock league data
  const [leagues, setLeagues] = useState<League[]>([
    {
      id: 1,
      name: "Haftalık Spor Ligi",
      description: "Her hafta en popüler spor maçları ve olimpiyat etkinlikleri",
      category: "spor",
      categories: ["futbol", "basketbol", "tenis"],
      participants: 1247,
      maxParticipants: 2000,
      prize: "50,000 kredi",
      endDate: "7 gün",
      isJoined: false,
      creator: "sence_official",
      joinCost: 0,
      isFeatured: true,
      status: 'active',
      isPrivate: false,
      pointSystem: "Her doğru tahmin için 100 puan kazanırsın. Yanlış tahminlerde 25 puan kaybedersin. Ardışık doğru tahminlerde bonus çarpanlar devreye girer: 3 doğru = 1.2x, 5 doğru = 1.5x, 10 doğru = 2x çarpan. Haftalık en yüksek puan alan kullanıcı özel rozet kazanır."
    },
    {
      id: 2,
      name: "Coca-Cola Ligi",
      description: "Coca-Cola sponsorluğunda mega turnuva ligi",
      category: "sponsorlu",
      categories: ["spor", "eğlence", "müzik"],
      participants: 3420,
      maxParticipants: 5000,
      prize: "100,000 kredi",
      endDate: "14 gün",
      isJoined: false,
      creator: "coca_cola_tr",
      joinCost: 500,
      isFeatured: true,
      status: 'active',
      isPrivate: false,
      pointSystem: "Weighted scoring sistemi kullanılır. Kategoriye göre farklı puanlar: Spor tahminleri 100 puan, eğlence 80 puan, müzik 60 puan. Doğru tahmin oranınıza göre haftalık multiplier uygulanır."
    },
    {
      id: 3,
      name: "Kripto Klanı",
      description: "Bitcoin, Ethereum ve altcoin tahminleri",
      category: "kripto",
      categories: ["bitcoin", "ethereum", "altcoin"],
      participants: 234,
      maxParticipants: 500,
      prize: "25,000 kredi",
      endDate: "10 gün",
      isJoined: true,
      position: 12,
      creator: "crypto_master",
      joinCost: 1000,
      isFeatured: false,
      status: 'active',
      isPrivate: false,
      pointSystem: "Kripto volatilitesine göre dinamik puanlama sistemi. Bitcoin tahminleri 150 puan, Ethereum 120 puan, altcoin tahminleri 100 puan değerinde. Market hareketlerine göre bonus puanlar hesaplanır."
    },
    {
      id: 4,
      name: "Tech Gurus",
      description: "Teknoloji şirketleri ve startup tahminleri",
      category: "teknoloji",
      categories: ["startups", "AI", "hardware"],
      participants: 567,
      maxParticipants: 1000,
      prize: "30,000 kredi",
      endDate: "5 gün",
      isJoined: true,
      position: 45,
      creator: "tech_insider",
      joinCost: 750,
      isFeatured: false,
      status: 'active',
      isPrivate: false,
      pointSystem: "Teknoloji sektörü odaklı puanlama. Startup tahminleri 120 puan, AI gelişmeleri 100 puan, hardware lansmanları 80 puan. Doğru streak için bonus puanlar: 5+ doğru = +50 bonus."
    },
    {
      id: 5,
      name: "Netflix & Chill Liga",
      description: "Dizi, film ve platformlar hakkında tahminler",
      category: "eğlence",
      categories: ["dizi", "film", "platform"],
      participants: 890,
      maxParticipants: 1500,
      prize: "20,000 kredi",
      endDate: "Tamamlandı",
      isJoined: true,
      position: 8,
      creator: "film_uzmanı",
      joinCost: 500,
      isFeatured: false,
      status: 'completed',
      isPrivate: false,
      pointSystem: "Eğlence sektörü puanlama sistemi. Dizi tahminleri 90 puan, film tahminleri 80 puan, platform gelişmeleri 70 puan değerinde."
    }
  ]);

  // Mock chat data
  const chatMessages: ChatMessage[] = [
    {
      id: 1,
      username: "crypto_king",
      message: "Bitcoin bugün 100k'yı geçecek mi sizce?",
      timestamp: new Date(Date.now() - 300000),
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face"
    },
    {
      id: 2,
      username: "trend_hunter",
      message: "Kesinlikle geçer! Bugün güçlü bir ralliye sahip",
      timestamp: new Date(Date.now() - 240000),
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=32&h=32&fit=crop&crop=face"
    },
    {
      id: 3,
      username: "market_wizard",
      message: "Ben tam tersi düşünüyorum, düşüş olacak",
      timestamp: new Date(Date.now() - 180000),
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face"
    }
  ];

  // Mock leaderboard data
  const leaderboardData = Array.from({ length: 50 }, (_, i) => {
    const isCurrentUser = i === 11;
    return {
      rank: i + 1,
      username: isCurrentUser ? 'mustafa_92' : `user_${i + 1}`,
      points: 3500 - (i * 50),
      streak: Math.max(1, 15 - i),
      correctPredictions: 90 - i,
      totalPredictions: 100,
      avatar: `https://images.unsplash.com/photo-${1472099645785 + i}?w=40&h=40&fit=crop&crop=face`,
      isCurrentUser
    };
  });

  // Filter leagues based on search
  const filteredLeagues = leagues.filter(league => {
    if (!searchQuery) return true;
    return (
      league.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      league.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      league.categories.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const featuredLeagues = filteredLeagues.filter(league => league.isFeatured);
  const communityLeagues = filteredLeagues.filter(league => !league.isFeatured);
  
  const myLeagues = leagues.filter(league => league.isJoined);
  const activeLeagues = myLeagues.filter(league => league.status === 'active');
  const completedLeagues = myLeagues.filter(league => league.status === 'completed');

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'şimdi';
    if (diffInMinutes < 60) return `${diffInMinutes}dk`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}sa`;
    return `${Math.floor(diffInMinutes / 1440)}g`;
  };

  const handleLeagueCardClick = (league: League, isMyLeague: boolean) => {
    setSelectedLeague(league);
    setShowLeagueDetails(true);
  };

  const handleChat = (league: League) => {
    setSelectedLeague(league);
    setShowChat(true);
  };

  const handleLeaderboard = (league: League) => {
    setSelectedLeague(league);
    setShowLeaderboard(true);
  };

  const handleLeagueQuestions = (league: League) => {
    setSelectedLeague(league);
    setShowLeagueQuestions(true);
  };

  const handleJoinLeagueClick = (league: League) => {
    setSelectedLeague(league);
    setShowJoinConfirmModal(true);
  };

  const confirmJoinLeague = () => {
    if (selectedLeague && currentUser.credits >= selectedLeague.joinCost) {
      setShowJoinConfirmModal(false);
      setShowLeagueDetails(false);
      setShowJoinSuccessAnimation(true);
      
      // Update league to joined
      setLeagues(prev => prev.map(l => 
        l.id === selectedLeague.id 
          ? { ...l, isJoined: true, participants: l.participants + 1, position: Math.floor(Math.random() * 50) + 1 }
          : l
      ));

      // Redirect to my leagues after animation
      setTimeout(() => {
        setShowJoinSuccessAnimation(false);
        setActiveTab('my-leagues');
      }, 2500);
    }
  };

  const sendMessage = () => {
    if (chatMessage.trim()) {
      setChatMessage('');
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'spor': return '#E0D4F7';
      case 'teknoloji': return '#DBEAFE';
      case 'sponsorlu': return '#D1FAE5';
      case 'kripto': return '#FEF3C7';
      case 'eğlence': return '#FFE4E1';
      default: return '#F3F4F6';
    }
  };

  // League Card Component
  const LeagueCard = ({ league, isMyLeague = false }: { league: League, isMyLeague?: boolean }) => (
    <TouchableOpacity
      style={[
        styles.leagueCard,
        (league.isFeatured || (isMyLeague && league.status === 'active')) && styles.featuredCard,
        league.status === 'completed' && styles.completedCard
      ]}
      onPress={() => handleLeagueCardClick(league, isMyLeague)}
      activeOpacity={0.9}
    >
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Text style={styles.leagueName}>{league.name}</Text>
            <Text style={styles.leagueDescription}>{league.description}</Text>
            <View style={styles.leagueMeta}>
              <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(league.category) }]}>
                <Text style={styles.categoryText}>
                  {league.category.charAt(0).toUpperCase() + league.category.slice(1)}
                </Text>
              </View>
              <Text style={styles.metaSeparator}>•</Text>
              <Text style={styles.creatorText}>@{league.creator}</Text>
            </View>
          </View>
          <View style={styles.cardHeaderRight}>
            {!isMyLeague ? (
              <>
                <Text style={styles.prizeText}>{league.prize}</Text>
                <Text style={styles.prizeLabel}>Ödül</Text>
              </>
            ) : (
              <>
                <Text style={styles.positionText}>#{league.position}</Text>
                <Text style={styles.positionLabel}>Sıralama</Text>
              </>
            )}
          </View>
        </View>
        
        <View style={styles.cardStats}>
          <Text style={styles.statsText}>👥 {league.participants}/{league.maxParticipants}</Text>
          <Text style={styles.statsText}>📅 {league.endDate}</Text>
        </View>

        {/* Action Buttons */}
        {!isMyLeague ? (
          <TouchableOpacity 
            style={styles.joinButtonWrapper}
            onPress={(e) => {
              e.stopPropagation();
              handleJoinLeagueClick(league);
            }}
            disabled={league.status === 'completed'}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#432870', '#5A3A8B', '#6B4A9D']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.joinButton}
            >
              <Text style={styles.joinButtonText}>Katıl</Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <View style={styles.myLeagueActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={(e) => {
                e.stopPropagation();
                handleLeagueQuestions(league);
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.actionButtonText}>📝 Sorular</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={(e) => {
                e.stopPropagation();
                handleLeaderboard(league);
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.actionButtonText}>🏆 Sıralama</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.chatActionButton}
              onPress={(e) => {
                e.stopPropagation();
                handleChat(league);
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.chatActionButtonText}>💬</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  // Show league questions page
  if (showLeagueQuestions && selectedLeague) {
    return (
      <LeagueQuestionsPage
        onBack={() => {
          setShowLeagueQuestions(false);
          setSelectedLeague(null);
        }}
        leagueName={selectedLeague.name}
        leagueCategories={selectedLeague.categories}
        handleVote={handleVote}
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* Animated Header */}
      <Animated.View
        style={[
          styles.animatedHeader,
          {
            transform: [{ translateY: headerTranslateY }],
          },
        ]}
      >
        <SafeAreaView style={styles.headerSafeArea}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Ligler</Text>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={onMenuToggle}
              activeOpacity={0.8}
            >
              <View style={styles.hamburgerIcon}>
                <View style={styles.hamburgerLine} />
                <View style={styles.hamburgerLine} />
                <View style={styles.hamburgerLine} />
              </View>
            </TouchableOpacity>
          </View>

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            <View style={styles.tabs}>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'discover' && styles.activeTab]}
                onPress={() => setActiveTab('discover')}
                activeOpacity={0.7}
              >
                <Text style={[styles.tabText, activeTab === 'discover' && styles.activeTabText]}>
                  Keşfet
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'my-leagues' && styles.activeTab]}
                onPress={() => setActiveTab('my-leagues')}
                activeOpacity={0.7}
              >
                <Text style={[styles.tabText, activeTab === 'my-leagues' && styles.activeTabText]}>
                  Liglerim
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'create' && styles.activeTab]}
                onPress={() => setActiveTab('create')}
                activeOpacity={0.7}
              >
                <Text style={[styles.tabText, activeTab === 'create' && styles.activeTabText]}>
                  Oluştur
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Animated.View>

      {/* Tab Content */}
      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {activeTab === 'discover' && (
          <View style={styles.tabContent}>
            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Lig adı ve @kullanıcıadı ara"
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="rgba(32, 32, 32, 0.5)"
              />
              <View style={styles.searchIcon}>
                <LinearGradient
                  colors={['#432870', '#B29EFD']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.searchIconGradient}
                >
                  <Text style={styles.searchIconText}>🔍</Text>
                </LinearGradient>
              </View>
            </View>

            {/* Featured Leagues */}
            {featuredLeagues.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Öne Çıkarılan Ligler</Text>
                {featuredLeagues.map((league) => (
                  <LeagueCard key={league.id} league={league} />
                ))}
              </View>
            )}

            {/* Community Leagues */}
            {communityLeagues.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Topluluk Ligleri</Text>
                {communityLeagues.map((league) => (
                  <LeagueCard key={league.id} league={league} />
                ))}
              </View>
            )}
          </View>
        )}

        {activeTab === 'my-leagues' && (
          <View style={styles.tabContent}>
            {/* League Progress Indicator - Compact */}
            <TouchableOpacity style={styles.progressCardCompact} activeOpacity={0.8}>
              <View style={styles.progressContentCompact}>
                <View style={styles.progressTextContainer}>
                  <Text style={styles.progressTitleCompact}>Lig Kotası</Text>
                  <Text style={styles.progressSubtitleCompact}>
                    {currentUser.joinedLeagues}/{currentUser.maxLeagues} lig
                  </Text>
                </View>
                <View style={styles.progressCircleCompact}>
                  <LinearGradient
                    colors={['#432870', '#B29EFD']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.progressCircleGradientCompact}
                  >
                    <Text style={styles.progressCountCompact}>{currentUser.joinedLeagues}</Text>
                    <Text style={styles.progressMaxCompact}>/{currentUser.maxLeagues}</Text>
                  </LinearGradient>
                </View>
              </View>
              <View style={styles.progressBarCompact}>
                <View 
                  style={[
                    styles.progressFillCompact,
                    { width: `${(currentUser.joinedLeagues / currentUser.maxLeagues) * 100}%` }
                  ]}
                />
              </View>
            </TouchableOpacity>

            {/* Active Leagues */}
            {activeLeagues.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Aktif Ligler</Text>
                {activeLeagues.map((league) => (
                  <LeagueCard key={league.id} league={league} isMyLeague />
                ))}
              </View>
            )}

            {/* Completed Leagues */}
            {completedLeagues.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Tamamlanan Ligler</Text>
                {completedLeagues.map((league) => (
                  <LeagueCard key={league.id} league={league} isMyLeague />
                ))}
              </View>
            )}

            {myLeagues.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>🏆</Text>
                <Text style={styles.emptyTitle}>Henüz Lig Yok</Text>
                <Text style={styles.emptyText}>Bir lige katıl veya kendi ligini oluştur!</Text>
                <TouchableOpacity
                  style={styles.emptyButton}
                  onPress={() => setActiveTab('discover')}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#432870', '#B29EFD']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.emptyButtonGradient}
                  >
                    <Text style={styles.emptyButtonText}>Ligleri Keşfet</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {activeTab === 'create' && (
          <View style={styles.tabContent}>
            <View style={styles.createSection}>
              <Text style={styles.createTitle}>Kendi Ligini Oluştur</Text>
              <Text style={styles.createSubtitle}>Arkadaşlarınla özel lig oluştur ve yarışın başlasın!</Text>
            </View>

            <View style={styles.createCard}>
              <View style={styles.createCardContent}>
                <Text style={styles.createCardIcon}>🏆</Text>
                <Text style={styles.createCardTitle}>Kendi ligin, kendi kuralların.</Text>
                <Text style={styles.createCardText}>
                  Sadece izlemekle yetinme. Arkadaşlarını topla, ligini kur, sıralamada 1. ol!
                </Text>
              </View>

              <TouchableOpacity
                style={styles.createStartButton}
                onPress={() => setShowCreateWizard(true)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#432870', '#B29EFD']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.createStartButtonGradient}
                >
                  <Text style={styles.createStartButtonText}>🚀 Lig Oluşturmaya Başla</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Info Cards */}
            <View style={styles.infoCards}>
              <View style={styles.infoCard}>
                <View style={styles.infoCardHeader}>
                  <LinearGradient
                    colors={['#432870', '#B29EFD']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.infoCardIcon}
                  >
                    <Text style={styles.infoCardEmoji}>🎯</Text>
                  </LinearGradient>
                  <View style={styles.infoCardText}>
                    <Text style={styles.infoCardTitle}>Özelleştirilebilir</Text>
                    <Text style={styles.infoCardDescription}>
                      Kategorileri, kuralları ve ödül sistemini sen belirle
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.infoCard}>
                <View style={styles.infoCardHeader}>
                  <LinearGradient
                    colors={['#C9F158', '#353831']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.infoCardIcon}
                  >
                    <Text style={styles.infoCardEmoji}>👥</Text>
                  </LinearGradient>
                  <View style={styles.infoCardText}>
                    <Text style={styles.infoCardTitle}>Arkadaşlarınla Özel</Text>
                    <Text style={styles.infoCardDescription}>
                      Public veya private lig seçenekleri
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.infoCard}>
                <View style={styles.infoCardHeader}>
                  <LinearGradient
                    colors={['#432870', '#B29EFD']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.infoCardIcon}
                  >
                    <Text style={styles.infoCardEmoji}>💰</Text>
                  </LinearGradient>
                  <View style={styles.infoCardText}>
                    <Text style={styles.infoCardTitle}>Ödül Havuzu</Text>
                    <Text style={styles.infoCardDescription}>
                      Katılım ücretlerinden oluşan büyük ödüller
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Join Confirmation Modal */}
      <Modal
        visible={showJoinConfirmModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowJoinConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <LinearGradient
              colors={['#432870', '#5A3A8B', '#B29EFD']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.modalHeader}
            >
              <Text style={styles.modalHeaderIcon}>🏆</Text>
              <Text style={styles.modalHeaderTitle}>Lige Katıl</Text>
              <Text style={styles.modalHeaderSubtitle}>{selectedLeague?.name}</Text>
            </LinearGradient>

            <View style={styles.modalBody}>
              <View style={styles.joinDetails}>
                <View style={styles.joinDetailRow}>
                  <Text style={styles.joinDetailLabel}>Katılım Ücreti:</Text>
                  <Text style={styles.joinDetailValue}>{selectedLeague?.joinCost} kredi</Text>
                </View>
                <View style={styles.joinDetailRow}>
                  <Text style={styles.joinDetailLabel}>Mevcut Kredin:</Text>
                  <Text style={styles.joinDetailValueMain}>
                    {currentUser.credits.toLocaleString('tr-TR')} kredi
                  </Text>
                </View>
                <View style={[styles.joinDetailRow, styles.joinDetailRowBorder]}>
                  <Text style={styles.joinDetailLabelBold}>Kalacak:</Text>
                  <Text style={styles.joinDetailValueRemaining}>
                    {selectedLeague && (currentUser.credits - selectedLeague.joinCost).toLocaleString('tr-TR')} kredi
                  </Text>
                </View>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => setShowJoinConfirmModal(false)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.modalCancelText}>İptal</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalConfirmButton}
                  onPress={confirmJoinLeague}
                  disabled={selectedLeague ? currentUser.credits < selectedLeague.joinCost : true}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#432870', '#B29EFD']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.modalConfirmGradient}
                  >
                    <Text style={styles.modalConfirmText}>Katıl</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* League Details Modal */}
      <Modal
        visible={showLeagueDetails}
        transparent
        animationType="slide"
        onRequestClose={() => setShowLeagueDetails(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.detailsModalContent}>
            <LinearGradient
              colors={['#432870', '#5A3A8B', '#B29EFD']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.detailsHeader}
            >
              <TouchableOpacity
                style={styles.detailsCloseButton}
                onPress={() => setShowLeagueDetails(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.detailsCloseText}>✕</Text>
              </TouchableOpacity>

              <View style={styles.detailsHeaderIcon}>
                <Text style={styles.detailsHeaderIconText}>🏆</Text>
              </View>
              <Text style={styles.detailsHeaderTitle}>{selectedLeague?.name}</Text>
              <Text style={styles.detailsHeaderSubtitle}>{selectedLeague?.description}</Text>
              
              <View style={styles.detailsCreator}>
                <Text style={styles.detailsCreatorIcon}>👤</Text>
                <Text style={styles.detailsCreatorText}>@{selectedLeague?.creator} tarafından oluşturuldu</Text>
              </View>
            </LinearGradient>

            <View style={styles.detailsBody}>
              {/* Stats Grid - 2x2 Layout */}
              <View style={styles.statsGrid2x2}>
                {/* Top Row */}
                <View style={styles.statsRow}>
                  <View style={[styles.statCard2x2, styles.statCardParticipants]}>
                    <Text style={styles.statLabel2x2}>KATILIMCI</Text>
                    <Text style={styles.statValue2x2}>{selectedLeague?.participants}</Text>
                    <Text style={styles.statSubtext2x2}>/ {selectedLeague?.maxParticipants} maksimum</Text>
                  </View>
                  
                  <View style={[styles.statCard2x2, styles.statCardReward]}>
                    <Text style={styles.statLabel2x2}>ÖDÜL</Text>
                    <Text style={styles.statValue2x2}>{selectedLeague?.prize}</Text>
                  </View>
                </View>

                {/* Bottom Row */}
                <View style={styles.statsRow}>
                  <View style={[styles.statCard2x2, styles.statCardEnd]}>
                    <Text style={styles.statLabel2x2}>BİTİŞ</Text>
                    <Text style={styles.statValue2x2}>{selectedLeague?.endDate}</Text>
                  </View>
                  
                  <View style={[styles.statCard2x2, styles.statCardParticipation]}>
                    <Text style={styles.statLabel2x2}>KATILIM</Text>
                    <Text style={styles.statValue2x2}>
                      {selectedLeague?.joinCost === 0 ? 'Ücretsiz' : `${selectedLeague?.joinCost} kredi`}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Categories */}
              <View style={styles.categoriesSection}>
                <Text style={styles.categoriesSectionTitle}>🎯 Kategoriler</Text>
                <View style={styles.categoriesList}>
                  {selectedLeague?.categories.map((cat, index) => (
                    <View key={index} style={styles.categoryTag}>
                      <Text style={styles.categoryTagText}>{cat}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Prize Pool Info - Removed from all tabs */}

              {/* Action buttons */}
              {activeTab === 'discover' ? (
                // Discover tab - always show join button regardless of isJoined status
                <View style={styles.detailsActionsNew}>
                  <TouchableOpacity
                    style={styles.detailsJoinButtonFullWidth}
                    onPress={() => {
                      setShowLeagueDetails(false);
                      selectedLeague && handleJoinLeagueClick(selectedLeague);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.detailsJoinTextNew}>🎯 Katıl</Text>
                  </TouchableOpacity>
                  <View style={styles.detailsSecondaryButtonsRow}>
                    <TouchableOpacity
                      style={styles.detailsSecondaryButtonHalf}
                      onPress={() => {
                        setShowLeagueDetails(false);
                        selectedLeague && handleLeaderboard(selectedLeague);
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.detailsSecondaryText}>🏆 Sıralama</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.detailsSecondaryButtonHalf}
                      onPress={() => {
                        setShowLeagueDetails(false);
                        setShowScoringModal(true);
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.detailsSecondaryText}>📊 Puanlama</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                // My Leagues tab - show league questions and chat in 2 rows
                <View style={styles.detailsActionsNew}>
                  <TouchableOpacity
                    style={styles.detailsJoinButtonFullWidth}
                    onPress={() => {
                      setShowLeagueDetails(false);
                      selectedLeague && handleLeagueQuestions(selectedLeague);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.detailsJoinTextNew}>📝 Lig Soruları</Text>
                  </TouchableOpacity>
                  <View style={styles.detailsSecondaryButtonsRow}>
                    <TouchableOpacity
                      style={styles.detailsSecondaryButtonHalf}
                      onPress={() => {
                        setShowLeagueDetails(false);
                        selectedLeague && handleLeaderboard(selectedLeague);
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.detailsSecondaryText}>🏆 Sıralama</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.detailsSecondaryButtonHalf}
                      onPress={() => {
                        setShowLeagueDetails(false);
                        selectedLeague && handleChat(selectedLeague);
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.detailsSecondaryText}>💬 Sohbet</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>
      </Modal>

      {/* Scoring Modal */}
      <Modal
        visible={showScoringModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowScoringModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.scoringModalContent}>
            <LinearGradient
              colors={['#432870', '#5A3A8B', '#B29EFD']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.scoringHeader}
            >
              <TouchableOpacity
                style={styles.scoringCloseButton}
                onPress={() => setShowScoringModal(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.scoringCloseText}>✕</Text>
              </TouchableOpacity>
              <Text style={styles.scoringHeaderIcon}>📊</Text>
              <Text style={styles.scoringHeaderTitle}>Puanlama Sistemi</Text>
              <Text style={styles.scoringHeaderSubtitle}>{selectedLeague?.name}</Text>
            </LinearGradient>

            <View style={styles.scoringBody}>
              <View style={styles.scoringContent}>
                <Text style={styles.scoringText}>{selectedLeague?.pointSystem}</Text>
              </View>

              <View style={styles.scoringFeatures}>
                <View style={styles.scoringFeature}>
                  <View style={styles.scoringFeatureIcon}>
                    <Text style={styles.scoringFeatureIconText}>✓</Text>
                  </View>
                  <View style={styles.scoringFeatureText}>
                    <Text style={styles.scoringFeatureTitle}>Doğru Tahmin</Text>
                    <Text style={styles.scoringFeatureDescription}>Puan kazan ve sıralamada yüksel</Text>
                  </View>
                </View>

                <View style={styles.scoringFeature}>
                  <View style={[styles.scoringFeatureIcon, styles.scoringFeatureIconRed]}>
                    <Text style={styles.scoringFeatureIconText}>✗</Text>
                  </View>
                  <View style={styles.scoringFeatureText}>
                    <Text style={styles.scoringFeatureTitle}>Yanlış Tahmin</Text>
                    <Text style={styles.scoringFeatureDescription}>Puan kaybedebilirsin</Text>
                  </View>
                </View>

                <View style={styles.scoringFeature}>
                  <View style={[styles.scoringFeatureIcon, styles.scoringFeatureIconYellow]}>
                    <Text style={styles.scoringFeatureIconText}>🔥</Text>
                  </View>
                  <View style={styles.scoringFeatureText}>
                    <Text style={styles.scoringFeatureTitle}>Streak Bonus</Text>
                    <Text style={styles.scoringFeatureDescription}>Ardışık doğrularda ekstra puan</Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={styles.scoringButton}
                onPress={() => setShowScoringModal(false)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#432870', '#B29EFD']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.scoringButtonGradient}
                >
                  <Text style={styles.scoringButtonText}>Anladım</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Leaderboard Modal */}
      <Modal
        visible={showLeaderboard}
        transparent
        animationType="slide"
        onRequestClose={() => setShowLeaderboard(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.leaderboardModalContentNew}>
            <LinearGradient
              colors={['#432870', '#5A3A8B', '#B29EFD']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.leaderboardHeaderNew}
            >
              <TouchableOpacity
                style={styles.leaderboardCloseButtonNew}
                onPress={() => setShowLeaderboard(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.leaderboardCloseTextNew}>✕</Text>
              </TouchableOpacity>
              <Text style={styles.leaderboardHeaderTitleNew}>🏆 Sıralama</Text>
              <Text style={styles.leaderboardHeaderSubtitleNew}>{selectedLeague?.name}</Text>
            </LinearGradient>

            <ScrollView 
              style={styles.leaderboardBodyNew} 
              showsVerticalScrollIndicator={true}
              onScroll={(event) => setLeaderboardScrollY(event.nativeEvent.contentOffset.y)}
              scrollEventThrottle={16}
            >
              {leaderboardData.map((user) => (
                <View
                  key={user.rank}
                  style={[
                    styles.leaderboardItemNew,
                    user.isCurrentUser && styles.leaderboardItemCurrentNew
                  ]}
                >
                  <View
                    style={[
                      styles.leaderboardRankNew,
                      user.rank === 1 && styles.leaderboardRankGoldNew,
                      user.rank === 2 && styles.leaderboardRankSilverNew,
                      user.rank === 3 && styles.leaderboardRankBronzeNew,
                    ]}
                  >
                    <Text style={styles.leaderboardRankTextNew}>#{user.rank}</Text>
                  </View>
                  <View style={styles.leaderboardAvatarNew}>
                    <Text style={styles.leaderboardAvatarText}>👤</Text>
                  </View>
                  <View style={styles.leaderboardUserInfoNew}>
                    <Text style={styles.leaderboardUsernameNew}>
                      {user.username}
                      {user.isCurrentUser && <Text style={styles.leaderboardCurrentLabelNew}> (Sen)</Text>}
                    </Text>
                    <Text style={styles.leaderboardUserStatsNew}>
                      {user.correctPredictions}/{user.totalPredictions} doğru
                    </Text>
                  </View>
                  <View style={styles.leaderboardPointsNew}>
                    <Text style={styles.leaderboardPointsValueNew}>{user.points}</Text>
                    <Text style={styles.leaderboardPointsLabelNew}>puan</Text>
                  </View>
                </View>
              ))}
            </ScrollView>

            {/* Fixed User Rank */}
            {(() => {
              const currentUser = leaderboardData.find(user => user.isCurrentUser);
              if (!currentUser) return null;
              
              const shouldShowAtTop = currentUser.rank <= 3 || leaderboardScrollY > 200;
              const shouldShowAtBottom = currentUser.rank > 10 && leaderboardScrollY < 200;
              
              if (shouldShowAtTop) {
                return (
                  <View style={styles.fixedUserRankTop}>
                    <View style={[styles.fixedUserRankItem, currentUser.rank === 1 && styles.fixedUserRankGold, currentUser.rank === 2 && styles.fixedUserRankSilver, currentUser.rank === 3 && styles.fixedUserRankBronze]}>
                      <View style={[styles.fixedUserRankNumber, currentUser.rank === 1 && styles.fixedUserRankNumberGold, currentUser.rank === 2 && styles.fixedUserRankNumberSilver, currentUser.rank === 3 && styles.fixedUserRankNumberBronze]}>
                        <Text style={styles.fixedUserRankNumberText}>#{currentUser.rank}</Text>
                      </View>
                      <View style={styles.fixedUserAvatar}>
                        <Text style={styles.fixedUserAvatarText}>👤</Text>
                      </View>
                      <View style={styles.fixedUserInfo}>
                        <Text style={styles.fixedUserName}>{currentUser.username}</Text>
                        <Text style={styles.fixedUserStats}>{currentUser.correctPredictions}/{currentUser.totalPredictions} doğru</Text>
                      </View>
                      <View style={styles.fixedUserPoints}>
                        <Text style={styles.fixedUserPointsValue}>{currentUser.points}</Text>
                        <Text style={styles.fixedUserPointsLabel}>puan</Text>
                      </View>
                    </View>
                  </View>
                );
              }
              
              if (shouldShowAtBottom) {
                return (
                  <View style={styles.fixedUserRankBottom}>
                    <View style={[styles.fixedUserRankItem, currentUser.rank === 1 && styles.fixedUserRankGold, currentUser.rank === 2 && styles.fixedUserRankSilver, currentUser.rank === 3 && styles.fixedUserRankBronze]}>
                      <View style={[styles.fixedUserRankNumber, currentUser.rank === 1 && styles.fixedUserRankNumberGold, currentUser.rank === 2 && styles.fixedUserRankNumberSilver, currentUser.rank === 3 && styles.fixedUserRankNumberBronze]}>
                        <Text style={styles.fixedUserRankNumberText}>#{currentUser.rank}</Text>
                      </View>
                      <View style={styles.fixedUserAvatar}>
                        <Text style={styles.fixedUserAvatarText}>👤</Text>
                      </View>
                      <View style={styles.fixedUserInfo}>
                        <Text style={styles.fixedUserName}>{currentUser.username}</Text>
                        <Text style={styles.fixedUserStats}>{currentUser.correctPredictions}/{currentUser.totalPredictions} doğru</Text>
                      </View>
                      <View style={styles.fixedUserPoints}>
                        <Text style={styles.fixedUserPointsValue}>{currentUser.points}</Text>
                        <Text style={styles.fixedUserPointsLabel}>puan</Text>
                      </View>
                    </View>
                  </View>
                );
              }
              
              return null;
            })()}
          </View>
        </View>
      </Modal>

      {/* Chat Modal */}
      <Modal
        visible={showChat}
        transparent
        animationType="slide"
        onRequestClose={() => setShowChat(false)}
      >
        <SafeAreaView style={styles.chatModalContainer}>
          <LinearGradient
            colors={['#432870', '#5A3A8B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.chatHeader}
          >
            <TouchableOpacity
              style={styles.chatCloseButton}
              onPress={() => setShowChat(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.chatCloseText}>✕</Text>
            </TouchableOpacity>
            <View style={styles.chatHeaderInfo}>
              <Text style={styles.chatHeaderTitle}>💬 Sohbet</Text>
              <Text style={styles.chatHeaderSubtitle}>{selectedLeague?.name}</Text>
            </View>
          </LinearGradient>

          <ScrollView style={styles.chatMessages} showsVerticalScrollIndicator={false}>
            {chatMessages.map((msg) => (
              <View key={msg.id} style={styles.chatMessageRow}>
                <Image source={{ uri: msg.avatar }} style={styles.chatAvatar} />
                <View style={styles.chatMessageContent}>
                  <View style={styles.chatMessageHeader}>
                    <Text style={styles.chatUsername}>{msg.username}</Text>
                    <Text style={styles.chatTimestamp}>{formatTimeAgo(msg.timestamp)}</Text>
                  </View>
                  <Text style={styles.chatMessageText}>{msg.message}</Text>
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={styles.chatInputContainer}>
            <TextInput
              style={styles.chatInput}
              placeholder="Mesajını yaz..."
              value={chatMessage}
              onChangeText={setChatMessage}
              placeholderTextColor="rgba(32, 32, 32, 0.5)"
              multiline
            />
            <TouchableOpacity
              style={styles.chatSendButton}
              onPress={sendMessage}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#432870', '#B29EFD']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.chatSendGradient}
              >
                <Text style={styles.chatSendText}>Gönder</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Join Success Animation */}
      <Modal
        visible={showJoinSuccessAnimation}
        transparent
        animationType="fade"
      >
        <View style={styles.successAnimationContainer}>
          <LinearGradient
            colors={['#432870', '#5A3A8B', '#B29EFD']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.successAnimationGradient}
          >
            <Text style={styles.successAnimationIcon}>🎉</Text>
            <Text style={styles.successAnimationTitle}>Lige Katıldın!</Text>
            <Text style={styles.successAnimationSubtitle}>Liglerim sayfasına yönlendiriliyorsun...</Text>
          </LinearGradient>
        </View>
      </Modal>

      {/* Create League Wizard */}
      {showCreateWizard && (
        <CreateLeagueWizard
          onClose={() => setShowCreateWizard(false)}
          onSuccess={() => {
            setShowCreateWizard(false);
            setActiveTab('my-leagues');
          }}
          currentUser={currentUser}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F3F5',
  },
  animatedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: '#F9FAFB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  headerSafeArea: {
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#111827',
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  hamburgerIcon: {
    width: 20,
    height: 16,
    justifyContent: 'space-between',
  },
  hamburgerLine: {
    width: 20,
    height: 2.5,
    backgroundColor: '#432870',
    borderRadius: 1.25,
  },
  tabsContainer: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 12,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#F2F3F5',
    borderRadius: 20,
    padding: 4,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  activeTab: {
    backgroundColor: '#432870',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 180,
  },
  tabContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 60,
  },
  searchContainer: {
    marginBottom: 24,
    position: 'relative',
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#F2F3F5',
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 24,
    paddingRight: 56,
    fontSize: 16,
    color: '#202020',
  },
  searchIcon: {
    position: 'absolute',
    right: 16,
    top: 14,
  },
  searchIconGradient: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIconText: {
    fontSize: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#202020',
    marginBottom: 16,
  },
  leagueCard: {
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#F2F3F5',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  featuredCard: {
    borderColor: '#432870',
  },
  completedCard: {
    opacity: 0.6,
  },
  cardContent: {
    padding: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardHeaderLeft: {
    flex: 1,
    marginRight: 16,
  },
  leagueName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#202020',
    marginBottom: 8,
  },
  leagueDescription: {
    fontSize: 14,
    color: 'rgba(32, 32, 32, 0.7)',
    marginBottom: 12,
  },
  leagueMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#202020',
  },
  metaSeparator: {
    fontSize: 12,
    color: 'rgba(32, 32, 32, 0.5)',
    marginHorizontal: 8,
  },
  creatorText: {
    fontSize: 12,
    color: 'rgba(32, 32, 32, 0.5)',
  },
  cardHeaderRight: {
    alignItems: 'flex-end',
  },
  prizeText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#432870',
    textAlign: 'right',
  },
  prizeLabel: {
    fontSize: 14,
    color: 'rgba(32, 32, 32, 0.5)',
    marginTop: 4,
  },
  positionText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#432870',
  },
  positionLabel: {
    fontSize: 14,
    color: 'rgba(32, 32, 32, 0.5)',
    marginTop: 4,
  },
  cardStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statsText: {
    fontSize: 14,
    color: 'rgba(32, 32, 32, 0.7)',
  },
  joinButtonWrapper: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  joinButton: {
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 24,
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  myLeagueActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#F2F3F5',
    borderRadius: 16,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#202020',
  },
  chatActionButton: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#432870',
    borderRadius: 16,
    alignItems: 'center',
  },
  chatActionButtonText: {
    fontSize: 16,
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 2,
    borderColor: '#F2F3F5',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#202020',
    marginBottom: 4,
  },
  progressSubtitle: {
    fontSize: 14,
    color: 'rgba(32, 32, 32, 0.7)',
  },
  progressCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
  },
  progressCircleGradient: {
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressCount: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  progressMax: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  progressBar: {
    width: '100%',
    height: 12,
    backgroundColor: '#F2F3F5',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#432870',
  },
  progressWarning: {
    fontSize: 12,
    color: '#FF3B30',
    fontWeight: '700',
    marginTop: 8,
  },
  emptyState: {
    paddingVertical: 64,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#202020',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: 'rgba(32, 32, 32, 0.7)',
    marginBottom: 24,
  },
  emptyButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  emptyButtonGradient: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  createSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  createTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#202020',
    marginBottom: 8,
    textAlign: 'center',
  },
  createSubtitle: {
    fontSize: 14,
    color: 'rgba(32, 32, 32, 0.7)',
    textAlign: 'center',
  },
  createCard: {
    backgroundColor: 'rgba(67, 40, 112, 0.1)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 2,
    borderColor: 'rgba(67, 40, 112, 0.3)',
    marginBottom: 16,
  },
  createCardContent: {
    alignItems: 'center',
    marginBottom: 24,
  },
  createCardIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  createCardTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#202020',
    marginBottom: 12,
    textAlign: 'center',
  },
  createCardText: {
    fontSize: 16,
    color: 'rgba(32, 32, 32, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
  },
  createStartButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  createStartButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  createStartButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  infoCards: {
    gap: 16,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#F2F3F5',
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  infoCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoCardEmoji: {
    fontSize: 18,
  },
  infoCardText: {
    flex: 1,
  },
  infoCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#202020',
    marginBottom: 4,
  },
  infoCardDescription: {
    fontSize: 14,
    color: 'rgba(32, 32, 32, 0.7)',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: '100%',
    maxWidth: 400,
    overflow: 'hidden',
  },
  modalHeader: {
    padding: 24,
    alignItems: 'center',
  },
  modalHeaderIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  modalHeaderTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  modalHeaderSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  modalBody: {
    padding: 24,
  },
  joinDetails: {
    backgroundColor: '#F2F3F5',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  joinDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  joinDetailRowBorder: {
    paddingTop: 12,
    borderTopWidth: 2,
    borderTopColor: '#FFFFFF',
  },
  joinDetailLabel: {
    fontSize: 14,
    color: 'rgba(32, 32, 32, 0.7)',
  },
  joinDetailValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#432870',
  },
  joinDetailValueMain: {
    fontSize: 18,
    fontWeight: '900',
    color: '#202020',
  },
  joinDetailLabelBold: {
    fontSize: 14,
    fontWeight: '700',
    color: '#202020',
  },
  joinDetailValueRemaining: {
    fontSize: 18,
    fontWeight: '900',
    color: '#34C759',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#F2F3F5',
    borderRadius: 16,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#202020',
  },
  modalConfirmButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalConfirmGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalConfirmText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  detailsModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    marginTop: 60,
    marginBottom: 20,
    marginHorizontal: 16,
    maxHeight: '85%',
    minHeight: '70%',
    overflow: 'hidden',
  },
  detailsHeader: {
    padding: 32,
    position: 'relative',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  detailsCloseButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  detailsCloseText: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  detailsHeaderIcon: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailsHeaderIconText: {
    fontSize: 40,
  },
  detailsHeaderTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  detailsHeaderSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  detailsCreator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
  },
  detailsCreatorIcon: {
    fontSize: 14,
  },
  detailsCreatorText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  detailsBody: {
    padding: 24,
    paddingBottom: 32,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    width: (SCREEN_WIDTH - 80) / 2,
    backgroundColor: 'rgba(67, 40, 112, 0.05)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: 'rgba(67, 40, 112, 0.2)',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(32, 32, 32, 0.7)',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#432870',
  },
  statValuePrize: {
    fontSize: 18,
    fontWeight: '900',
    color: '#202020',
  },
  statSubtext: {
    fontSize: 12,
    color: 'rgba(32, 32, 32, 0.6)',
    marginTop: 4,
  },
  categoriesSection: {
    marginBottom: 24,
  },
  categoriesSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#202020',
    marginBottom: 12,
  },
  categoriesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryTag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(178, 158, 253, 0.3)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(67, 40, 112, 0.2)',
  },
  categoryTagText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#202020',
  },
  prizePoolCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(201, 241, 88, 0.2)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: 'rgba(201, 241, 88, 0.4)',
    marginBottom: 24,
  },
  prizePoolIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  prizePoolText: {
    flex: 1,
  },
  prizePoolTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#202020',
    marginBottom: 4,
  },
  prizePoolDescription: {
    fontSize: 14,
    color: 'rgba(32, 32, 32, 0.7)',
  },
  prizePoolHighlight: {
    fontWeight: '700',
    color: '#432870',
  },
  detailsActions: {
    flexDirection: 'row',
    gap: 8,
    borderTopWidth: 2,
    borderTopColor: '#F2F3F5',
    paddingTop: 16,
  },
  detailsActionsNew: {
    borderTopWidth: 2,
    borderTopColor: '#F2F3F5',
    paddingTop: 16,
    gap: 12,
  },
  detailsJoinButtonFullWidth: {
    backgroundColor: '#432870',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#432870',
  },
  detailsSecondaryButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  detailsSecondaryButtonHalf: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F2F3F5',
    borderRadius: 16,
    alignItems: 'center',
  },
  detailsJoinButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  detailsJoinGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  detailsJoinText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  detailsSecondaryButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F2F3F5',
    borderRadius: 16,
    alignItems: 'center',
  },
  detailsSecondaryText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#202020',
  },
  scoringModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: '100%',
    maxWidth: 400,
    maxHeight: '75%',
    overflow: 'hidden',
  },
  scoringHeader: {
    padding: 24,
    alignItems: 'center',
    position: 'relative',
  },
  scoringCloseButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoringCloseText: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  scoringHeaderIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  scoringHeaderTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  scoringHeaderSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  scoringBody: {
    padding: 24,
    paddingTop: 16,
  },
  scoringContent: {
    backgroundColor: '#F2F3F5',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  scoringText: {
    fontSize: 14,
    color: 'rgba(32, 32, 32, 0.8)',
    lineHeight: 20,
  },
  scoringPrizeCard: {
    backgroundColor: 'rgba(201, 241, 88, 0.2)',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 24,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'rgba(201, 241, 88, 0.3)',
  },
  scoringPrizeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  scoringPrizeIcon: {
    fontSize: 20,
  },
  scoringPrizeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#202020',
  },
  scoringPrizeText: {
    fontSize: 14,
    color: 'rgba(32, 32, 32, 0.7)',
    marginBottom: 4,
  },
  scoringPrizeHighlight: {
    fontWeight: '700',
    color: '#432870',
  },
  scoringPrizeSubtext: {
    fontSize: 12,
    color: 'rgba(32, 32, 32, 0.6)',
  },
  scoringFeatures: {
    gap: 12,
    marginBottom: 16,
  },
  scoringFeature: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  scoringFeatureIcon: {
    width: 32,
    height: 32,
    backgroundColor: '#34C759',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoringFeatureIconRed: {
    backgroundColor: '#FF3B30',
  },
  scoringFeatureIconYellow: {
    backgroundColor: '#C9F158',
  },
  scoringFeatureIconText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  scoringFeatureText: {
    flex: 1,
  },
  scoringFeatureTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#202020',
    marginBottom: 2,
  },
  scoringFeatureDescription: {
    fontSize: 14,
    color: 'rgba(32, 32, 32, 0.7)',
  },
  scoringButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
  },
  scoringButtonGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  scoringButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  leaderboardModalContent: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: 60,
    overflow: 'hidden',
  },
  leaderboardHeader: {
    padding: 24,
    position: 'relative',
  },
  leaderboardCloseButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  leaderboardCloseText: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  leaderboardHeaderTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  leaderboardHeaderSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  leaderboardBody: {
    padding: 24,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    backgroundColor: '#F2F3F5',
    borderRadius: 16,
    marginBottom: 12,
  },
  leaderboardItemCurrent: {
    backgroundColor: 'rgba(67, 40, 112, 0.2)',
    borderWidth: 2,
    borderColor: '#432870',
  },
  leaderboardRank: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leaderboardRankGold: {
    backgroundColor: '#FFD700',
  },
  leaderboardRankSilver: {
    backgroundColor: '#C0C0C0',
  },
  leaderboardRankBronze: {
    backgroundColor: '#CD7F32',
  },
  leaderboardRankText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#202020',
  },
  leaderboardAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  leaderboardUserInfo: {
    flex: 1,
  },
  leaderboardUsername: {
    fontSize: 16,
    fontWeight: '700',
    color: '#202020',
  },
  leaderboardCurrentLabel: {
    fontSize: 12,
    color: '#432870',
  },
  leaderboardUserStats: {
    fontSize: 14,
    color: 'rgba(32, 32, 32, 0.7)',
  },
  leaderboardPoints: {
    alignItems: 'flex-end',
  },
  leaderboardPointsValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#432870',
  },
  leaderboardPointsLabel: {
    fontSize: 14,
    color: 'rgba(32, 32, 32, 0.7)',
  },
  chatModalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 16,
  },
  chatCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatCloseText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  chatHeaderInfo: {
    flex: 1,
  },
  chatHeaderTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  chatHeaderSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  chatMessages: {
    flex: 1,
    padding: 24,
  },
  chatMessageRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  chatAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  chatMessageContent: {
    flex: 1,
  },
  chatMessageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatUsername: {
    fontSize: 14,
    fontWeight: '700',
    color: '#202020',
    marginRight: 8,
  },
  chatTimestamp: {
    fontSize: 12,
    color: 'rgba(32, 32, 32, 0.5)',
  },
  chatMessageText: {
    fontSize: 14,
    color: 'rgba(32, 32, 32, 0.8)',
  },
  chatInputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 2,
    borderTopColor: '#F2F3F5',
    gap: 12,
  },
  chatInput: {
    flex: 1,
    backgroundColor: '#F2F3F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#202020',
  },
  chatSendButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  chatSendGradient: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  chatSendText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  successAnimationContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  successAnimationGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successAnimationIcon: {
    fontSize: 96,
    marginBottom: 24,
  },
  successAnimationTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  successAnimationSubtitle: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  // New 2x2 grid stats styles
  statsGrid2x2: {
    paddingHorizontal: 8,
    paddingTop: 4,
    paddingBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  statCard2x2: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
  },
  statCardParticipants: {
    backgroundColor: '#F3F4F6',
    borderColor: '#D1D5DB',
  },
  statCardReward: {
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
  },
  statCardEnd: {
    backgroundColor: '#DBEAFE',
    borderColor: '#93C5FD',
  },
  statCardParticipation: {
    backgroundColor: '#F3E8FF',
    borderColor: '#D8B4FE',
  },
  statLabel2x2: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 6,
  },
  statValue2x2: {
    fontSize: 20,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 4,
  },
  statSubtext2x2: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  detailsModalScrollContent: {
    flexGrow: 1,
  },
  // New button styles
  detailsJoinButtonNew: {
    flex: 1,
    backgroundColor: '#432870',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#432870',
  },
  detailsJoinTextNew: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  // Compact progress styles
  progressCardCompact: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  progressContentCompact: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTextContainer: {
    flex: 1,
  },
  progressTitleCompact: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  progressSubtitleCompact: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  progressCircleCompact: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
  },
  progressCircleGradientCompact: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressCountCompact: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  progressMaxCompact: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  progressBarCompact: {
    width: '100%',
    height: 8,
    backgroundColor: '#F2F3F5',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFillCompact: {
    height: '100%',
    backgroundColor: '#432870',
  },
  // New leaderboard styles
  leaderboardModalContentNew: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginTop: 60,
    marginBottom: 20,
    marginHorizontal: 8,
    maxHeight: '85%',
  },
  leaderboardHeaderNew: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  leaderboardCloseButtonNew: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leaderboardCloseTextNew: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  leaderboardHeaderTitleNew: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 8,
  },
  leaderboardHeaderSubtitleNew: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginTop: 4,
  },
  leaderboardBodyNew: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  leaderboardItemNew: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  leaderboardItemCurrentNew: {
    backgroundColor: '#FDF4FF',
    borderColor: '#432870',
    borderWidth: 2,
  },
  leaderboardRankNew: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#6B7280',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  leaderboardRankGoldNew: {
    backgroundColor: '#FFD700',
  },
  leaderboardRankSilverNew: {
    backgroundColor: '#C0C0C0',
  },
  leaderboardRankBronzeNew: {
    backgroundColor: '#CD7F32',
  },
  leaderboardRankTextNew: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  leaderboardAvatarNew: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  leaderboardAvatarText: {
    fontSize: 20,
  },
  leaderboardUserInfoNew: {
    flex: 1,
  },
  leaderboardUsernameNew: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  leaderboardCurrentLabelNew: {
    color: '#432870',
    fontWeight: '700',
  },
  leaderboardUserStatsNew: {
    fontSize: 14,
    color: '#6B7280',
  },
  leaderboardPointsNew: {
    alignItems: 'flex-end',
  },
  leaderboardPointsValueNew: {
    fontSize: 18,
    fontWeight: '900',
    color: '#432870',
  },
  leaderboardPointsLabelNew: {
    fontSize: 12,
    color: '#6B7280',
  },
  // Fixed user rank styles
  fixedUserRankTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  fixedUserRankBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  fixedUserRankItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  fixedUserRankGold: {
    backgroundColor: '#FFF8DC',
    borderColor: '#FFD700',
  },
  fixedUserRankSilver: {
    backgroundColor: '#F5F5F5',
    borderColor: '#C0C0C0',
  },
  fixedUserRankBronze: {
    backgroundColor: '#FFF2CC',
    borderColor: '#CD7F32',
  },
  fixedUserRankNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#6B7280',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  fixedUserRankNumberGold: {
    backgroundColor: '#FFD700',
  },
  fixedUserRankNumberSilver: {
    backgroundColor: '#C0C0C0',
  },
  fixedUserRankNumberBronze: {
    backgroundColor: '#CD7F32',
  },
  fixedUserRankNumberText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  fixedUserAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  fixedUserAvatarText: {
    fontSize: 16,
  },
  fixedUserInfo: {
    flex: 1,
  },
  fixedUserName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 1,
  },
  fixedUserStats: {
    fontSize: 12,
    color: '#6B7280',
  },
  fixedUserPoints: {
    alignItems: 'flex-end',
  },
  fixedUserPointsValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#432870',
  },
  fixedUserPointsLabel: {
    fontSize: 10,
    color: '#6B7280',
  },
});

