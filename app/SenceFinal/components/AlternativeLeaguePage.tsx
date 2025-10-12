import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  FlatList,
  Modal,
  SafeAreaView,
  Image,
  Animated,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';


interface League {
  id: number;
  name: string;
  description: string;
  category: string;
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
  ranking?: number;
}

interface ChatMessage {
  id: number;
  username: string;
  message: string;
  timestamp: Date;
  avatar: string;
}

interface AlternativeLeaguePageProps {
  onMenuToggle: () => void;
}

export function AlternativeLeaguePage({ onMenuToggle }: AlternativeLeaguePageProps) {
  const [activeTab, setActiveTab] = useState<'discover' | 'my-leagues' | 'create'>('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showCreateStep, setShowCreateStep] = useState(1);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const headerTranslateY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Header animation logic
  const handleScroll = (event: any) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    const scrollDiff = currentScrollY - lastScrollY.current;
    
    // Clear existing timeout
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
    }
    
    if (scrollDiff > 5 && currentScrollY > 50) {
      // Scrolling down - hide header
      Animated.timing(headerTranslateY, {
        toValue: -140,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else if (scrollDiff < -5) {
      // Scrolling up - show header
      Animated.timing(headerTranslateY, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
      
      // Auto-hide after 3 seconds of no scrolling
      hideTimeout.current = setTimeout(() => {
        if (currentScrollY > 50) {
          Animated.timing(headerTranslateY, {
            toValue: -140,
            duration: 300,
            useNativeDriver: true,
          }).start();
        }
      }, 3000);
    }
    
    lastScrollY.current = currentScrollY;
  };

  // Check if user has visited leagues before
  useEffect(() => {
    const checkFirstVisit = async () => {
      try {
        const hasVisited = await AsyncStorage.getItem('hasVisitedLeagues');
        if (!hasVisited) {
          setShowWelcomeModal(true);
          await AsyncStorage.setItem('hasVisitedLeagues', 'true');
        }
      } catch (error) {
        console.log('Error checking first visit:', error);
      }
    };
    
    checkFirstVisit();
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hideTimeout.current) {
        clearTimeout(hideTimeout.current);
      }
    };
  }, []);

  // Create league config
  const [leagueConfig, setLeagueConfig] = useState({
    name: '',
    description: '',
    coverEmoji: '🏆',
    categories: [] as string[],
    joinCost: 100,
    maxParticipants: 20,
    duration: '7 gün'
  });

  // User data
  const currentUser = {
    username: 'mustafa_92',
    joinedLeagues: 3,
    maxLeagues: 5,
    credits: 8500,
    tickets: 2
  };

  // Mock leagues data
  const leagues: League[] = [
    {
      id: 1,
      name: "Haftalık Spor Ligi",
      description: "Her hafta en popüler spor maçları ve olimpiyat etkinlikleri",
      category: "Spor",
      participants: 1247,
      maxParticipants: 2000,
      prize: "50,000 kredi +\nSürpriz",
      endDate: "7 gün",
      isJoined: false,
      creator: "sence_official",
      joinCost: 0,
      isFeatured: true,
      status: 'active'
    },
    {
      id: 2,
      name: "Coca-Cola Ligi",
      description: "Coca-Cola sponsorluğunda mega turnuva ligi",
      category: "Sponsorlu",
      participants: 3420,
      maxParticipants: 5000,
      prize: "100,000 kredi\n+ Sürpriz",
      endDate: "14 gün",
      isJoined: false,
      creator: "coca_cola_tr",
      joinCost: 0,
      isFeatured: true,
      status: 'active'
    },
    {
      id: 3,
      name: "Kripto Klanı",
      description: "Bitcoin, Ethereum ve altcoin tahminleri",
      category: "Kripto",
      participants: 234,
      maxParticipants: 500,
      prize: "25,000 kredi\n+ Sürpriz",
      endDate: "10 gün",
      isJoined: true,
      position: 12,
      creator: "crypto_master",
      joinCost: 0,
      isFeatured: false,
      status: 'active',
      ranking: 12
    },
    {
      id: 4,
      name: "Tech Gurus",
      description: "Teknoloji şirketleri ve startup tahminleri",
      category: "Teknoloji",
      participants: 567,
      maxParticipants: 1000,
      prize: "30,000 kredi\n+ Sürpriz",
      endDate: "5 gün",
      isJoined: true,
      position: 45,
      creator: "tech_insider",
      joinCost: 0,
      isFeatured: false,
      status: 'active',
      ranking: 45
    }
  ];

  const communityLeagues = leagues.filter(l => !l.isFeatured);


  // Mock chat messages
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

  const filteredLeagues = leagues.filter(league => {
    if (!searchQuery) return true;
    return (
      league.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      league.creator.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Derived lists for My Leagues and Featured (from filtered)
  const featuredLeaguesFiltered = filteredLeagues.filter(league => league.isFeatured);
  const myLeagues = leagues.filter(league => league.isJoined);

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'şimdi';
    if (diffInMinutes < 60) return `${diffInMinutes}dk`;
    return `${Math.floor(diffInMinutes / 60)}sa`;
  };

  const handleLeagueDetails = (league: League) => {
    setSelectedLeague(league);
  };

  const handleChat = (league: League) => {
    setSelectedLeague(league);
    setShowChat(true);
  };

  const sendMessage = () => {
    if (chatMessage.trim()) {
      setChatMessage('');
    }
  };



  // Handle refresh
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  // League Card Component
  const LeagueCard = ({ item, isMyLeague = false }: { item: League, isMyLeague?: boolean }) => (
    <TouchableOpacity
      style={[
        styles.leagueCard,
        item.isFeatured && styles.featuredCard
      ]}
      onPress={() => handleLeagueDetails(item)}
      activeOpacity={0.95}
    >
      <LinearGradient
        colors={item.isFeatured ? ['#F8FAFC', '#EFF6FF'] : ['#FFFFFF', '#F9FAFB']}
        style={styles.cardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Text style={styles.leagueName}>{item.name}</Text>
            <Text style={styles.leagueDescription}>{item.description}</Text>
            <View style={styles.leagueMeta}>
              <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(item.category) }]}>
                <Text style={styles.categoryText}>{item.category}</Text>
              </View>
              <Text style={styles.creatorText}>• @{item.creator}</Text>
            </View>
          </View>
          <View style={styles.cardHeaderRight}>
            {!isMyLeague ? (
              <>
                <Text style={styles.prizeText}>{item.prize}</Text>
                <Text style={styles.prizeLabel}>Ödül</Text>
              </>
            ) : (
              <>
                <Text style={styles.rankingText}>#{item.ranking}</Text>
                <Text style={styles.rankingLabel}>Sıralama</Text>
              </>
            )}
          </View>
        </View>

        <View style={styles.cardStats}>
          <Text style={styles.statsText}>👥 {item.participants}/{item.maxParticipants}</Text>
          <Text style={styles.statsText}>📅 {item.endDate}</Text>
        </View>

        <View style={styles.cardActions}>
          {!isMyLeague ? (
            <View style={styles.actionButtonsRow}>
              <TouchableOpacity style={styles.joinButton} activeOpacity={0.8}>
                <LinearGradient
                  colors={['#432870', '#5A3A8B']}
                  style={styles.joinButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.joinButtonText}>Katıl</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity style={styles.detailButton} activeOpacity={0.8}>
                <Text style={styles.detailButtonText}>Detay</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.myLeagueActions}>
              <TouchableOpacity style={styles.myLeagueButton} activeOpacity={0.8}>
                <Text style={styles.myLeagueButtonText}>Lig Detayları</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.myLeagueButton} activeOpacity={0.8}>
                <Text style={styles.myLeagueButtonText}>Sıralama</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.chatButton} 
                onPress={() => handleChat(item)}
                activeOpacity={0.8}
              >
                <Text style={styles.chatButtonText}>💬</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const getCategoryColor = (category: string): string => {
    switch (category.toLowerCase()) {
      case 'spor': return '#E0E7FF';
      case 'teknoloji': return '#DBEAFE';
      case 'sponsorlu': return '#D1FAE5';
      case 'kripto': return '#FEF3C7';
      default: return '#F3F4F6';
    }
  };

  // Welcome Modal Component
  const WelcomeModal = () => (
    <Modal
      visible={showWelcomeModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowWelcomeModal(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <LinearGradient
          colors={['#432870', '#5A3A8B', '#B29EFD']}
          style={styles.welcomeHeader}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.welcomeEmoji}>🏆</Text>
          <Text style={styles.welcomeTitle}>Ligler Dünyasına Hoş Geldin!</Text>
          <Text style={styles.welcomeSubtitle}>
            Arkadaşlarınla, toplulukla ve başka kullanıcılarla rekabet et
          </Text>
        </LinearGradient>

        <ScrollView style={styles.welcomeContent} showsVerticalScrollIndicator={false}>
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <LinearGradient
                colors={['#B29EFD', '#432870']}
                style={styles.featureIcon}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.featureIconText}>🎯</Text>
              </LinearGradient>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Tahminlerini Yarıştır</Text>
                <Text style={styles.featureDescription}>
                  En iyi tahmin yapanlar sıralamada üste çıkar. Sen de yerini al!
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <LinearGradient
                colors={['#C9F158', '#353831']}
                style={styles.featureIcon}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.featureIconText}>💰</Text>
              </LinearGradient>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Ödüller Kazan</Text>
                <Text style={styles.featureDescription}>
                  Liglerin birincileri büyük ödüller kazanır. Krediler, rozetler ve daha fazlası!
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <LinearGradient
                colors={['#432870', '#B29EFD']}
                style={styles.featureIcon}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.featureIconText}>👥</Text>
              </LinearGradient>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Özel Liglerini Oluştur</Text>
                <Text style={styles.featureDescription}>
                  Arkadaşlarınla özel liglerinde sadece sizin aranızda yarışın.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.welcomeActions}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => setShowWelcomeModal(false)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#432870', '#5A3A8B', '#6B4A9D']}
              style={styles.startButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.startButtonText}>Hemen Başla 🚀</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.laterButton}
            onPress={() => setShowWelcomeModal(false)}
            activeOpacity={0.8}
          >
            <Text style={styles.laterButtonText}>Daha Sonra</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );

  // Chat Modal Component
  const ChatModal = () => (
    <Modal
      visible={showChat}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowChat(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        {selectedLeague && (
          <>
            <LinearGradient
              colors={['#432870', '#5A3A8B']}
              style={styles.chatHeader}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View style={styles.chatHeaderContent}>
                <TouchableOpacity
                  style={styles.chatCloseButton}
                  onPress={() => setShowChat(false)}
                >
                  <Text style={styles.chatCloseText}>✕</Text>
                </TouchableOpacity>
                <View style={styles.chatHeaderInfo}>
                  <Text style={styles.chatTitle}>{selectedLeague.name}</Text>
                  <Text style={styles.chatSubtitle}>💬 Lig Sohbeti</Text>
                </View>
              </View>
            </LinearGradient>

            <ScrollView style={styles.chatMessages} showsVerticalScrollIndicator={false}>
              {chatMessages.map((msg) => (
                <View key={msg.id} style={styles.messageRow}>
                  <Image source={{ uri: msg.avatar }} style={styles.messageAvatar} />
                  <View style={styles.messageContent}>
                    <View style={styles.messageHeader}>
                      <Text style={styles.messageUsername}>{msg.username}</Text>
                      <Text style={styles.messageTime}>{formatTimeAgo(msg.timestamp)}</Text>
                    </View>
                    <Text style={styles.messageText}>{msg.message}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>

            <View style={styles.chatInput}>
              <TextInput
                style={styles.messageInput}
                placeholder="Mesajını yaz..."
                value={chatMessage}
                onChangeText={setChatMessage}
                placeholderTextColor="#9CA3AF"
                multiline
              />
              <TouchableOpacity
                style={styles.sendButton}
                onPress={sendMessage}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#432870', '#5A3A8B']}
                  style={styles.sendButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.sendButtonText}>⚡</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </>
        )}
      </SafeAreaView>
    </Modal>
  );

  // Create League Steps
  const CreateStep1 = () => (
    <ScrollView style={styles.createContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.createProgress}>
        <Text style={styles.createStepText}>Adım 1/3</Text>
        <Text style={styles.createStepTitle}>Temel Bilgiler</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '33%' }]} />
        </View>
      </View>

      <Text style={styles.createTitle}>Temel Bilgiler</Text>
      <Text style={styles.createSubtitle}>Liginin adını, açıklamasını ve kapak emojisini belirle</Text>

      <View style={styles.createForm}>
        <View style={styles.formField}>
          <Text style={styles.formLabel}>Lig Adı</Text>
          <TextInput
            style={styles.formInput}
            value={leagueConfig.name}
            onChangeText={(text) => setLeagueConfig(prev => ({...prev, name: text}))}
            placeholder="lig adı"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.formField}>
          <Text style={styles.formLabel}>Açıklama</Text>
          <TextInput
            style={[styles.formInput, styles.textArea]}
            value={leagueConfig.description}
            onChangeText={(text) => setLeagueConfig(prev => ({...prev, description: text}))}
            placeholder="açıklama"
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.formField}>
          <Text style={styles.formLabel}>Kapak Emojisi</Text>
          <View style={styles.emojiGrid}>
            {['🏆', '⚽', '💻', '₿', '🎬', '📈', '🎯', '🔥', '⭐', '💎', '🚀', '🎪'].map((emoji) => (
              <TouchableOpacity
                key={emoji}
                style={[
                  styles.emojiButton,
                  leagueConfig.coverEmoji === emoji && styles.selectedEmoji
                ]}
                onPress={() => setLeagueConfig(prev => ({...prev, coverEmoji: emoji}))}
                activeOpacity={0.8}
              >
                <Text style={styles.emojiText}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.continueButton,
          (!leagueConfig.name || !leagueConfig.description) && styles.disabledButton
        ]}
        onPress={() => setShowCreateStep(2)}
        disabled={!leagueConfig.name || !leagueConfig.description}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={
            leagueConfig.name && leagueConfig.description
              ? ['#432870', '#B29EFD']
              : ['#F3F4F6', '#E5E7EB']
          }
          style={styles.continueButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={[
            styles.continueButtonText,
            (!leagueConfig.name || !leagueConfig.description) && styles.disabledButtonText
          ]}>
            Devam Et
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );

  // Payment Modal Component
  const PaymentModal = () => (
    <Modal
      visible={showPaymentModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowPaymentModal(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.paymentHeader}>
          <Text style={styles.paymentTitle}>Lig Oluşturma Yöntemi</Text>
          <Text style={styles.paymentSubtitle}>Ligini nasıl oluşturmak istiyorsun?</Text>
        </View>

        <View style={styles.paymentOptions}>
          <TouchableOpacity style={styles.paymentOption} activeOpacity={0.8}>
            <LinearGradient
              colors={['#B29EFD', '#A688F7']}
              style={styles.paymentOptionGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.paymentOptionEmoji}>💰</Text>
              <Text style={styles.paymentOptionTitle}>Kredi ile</Text>
              <Text style={styles.paymentOptionPrice}>5,000 kredi</Text>
              <Text style={styles.paymentOptionDesc}>Hızlı ve kolay</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.paymentOption} activeOpacity={0.8}>
            <LinearGradient
              colors={['#432870', '#5A3A8B']}
              style={styles.paymentOptionGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.paymentOptionEmoji}>🎫</Text>
              <Text style={[styles.paymentOptionTitle, { color: '#FFFFFF' }]}>Bilet ile</Text>
              <Text style={[styles.paymentOptionPrice, { color: '#FFFFFF' }]}>1 bilet kullan</Text>
              <Text style={[styles.paymentOptionDesc, { color: 'rgba(255,255,255,0.8)' }]}>Premium özellikler</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setShowPaymentModal(false)}
          activeOpacity={0.8}
        >
          <Text style={styles.backButtonText}>Geri</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Animated Header */}
        <Animated.View style={[
          styles.animatedHeader,
          {
            transform: [{ translateY: headerTranslateY }],
          }
        ]}>
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

            {/* Categories Row */}
            <View style={styles.categoriesContainer}>
              <TouchableOpacity 
                style={[styles.categoryTab, activeTab === 'discover' && styles.categoryTabActive]}
                onPress={() => setActiveTab('discover')}
              >
                <Text style={[styles.categoryTabText, activeTab === 'discover' && styles.categoryTabTextActive]}>
                  Keşfet
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.categoryTab, activeTab === 'my-leagues' && styles.categoryTabActive]}
                onPress={() => setActiveTab('my-leagues')}
              >
                <Text style={[styles.categoryTabText, activeTab === 'my-leagues' && styles.categoryTabTextActive]}>
                  Liglerim
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.categoryTab, activeTab === 'create' && styles.categoryTabActive]}
                onPress={() => setActiveTab('create')}
              >
                <Text style={[styles.categoryTabText, activeTab === 'create' && styles.categoryTabTextActive]}>
                  Oluştur
                </Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Animated.View>

        {/* Tabs */}


        {/* Content */}
        <ScrollView 
          style={styles.content} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#432870', '#5A3A8B']}
              tintColor="#432870"
              progressBackgroundColor="#FFFFFF"
              title="Yenileniyor..."
              titleColor="#432870"
            />
          }
        >
          {activeTab === 'discover' && (
            <>
              {/* Search Bar */}
              <View style={styles.searchContainer}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Lig adı ve @kullanıcıadı ara"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholderTextColor="#9CA3AF"
                />
                <View style={styles.searchIcon}>
                  <LinearGradient
                    colors={['#432870', '#B29EFD']}
                    style={styles.searchIconGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.searchIconText}>🔍</Text>
                  </LinearGradient>
                </View>
              </View>

              {/* Featured Leagues */}
              {(featuredLeaguesFiltered.length > 0) && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Öne Çıkarılan Ligler</Text>
                  <FlatList
                    data={featuredLeaguesFiltered}
                    renderItem={({ item }) => <LeagueCard item={item} />}
                    keyExtractor={(item) => item.id.toString()}
                    scrollEnabled={false}
                    contentContainerStyle={styles.leaguesList}
                    showsVerticalScrollIndicator={false}
                  />
                </View>
              )}

              {/* Community Leagues */}
              {communityLeagues.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Topluluk Ligleri</Text>
                  <FlatList
                    data={communityLeagues}
                    renderItem={({ item }) => <LeagueCard item={item} />}
                    keyExtractor={(item) => item.id.toString()}
                    scrollEnabled={false}
                    contentContainerStyle={styles.leaguesList}
                    showsVerticalScrollIndicator={false}
                  />
                </View>
              )}
            </>
          )}

          {activeTab === 'my-leagues' && (
            <>
              {/* League Participation */}
              <View style={styles.participationCard}>
                <LinearGradient
                  colors={['rgba(67, 40, 112, 0.1)', 'rgba(67, 40, 112, 0.2)']}
                  style={styles.participationGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <View style={styles.participationContent}>
                    <View>
                      <Text style={styles.participationTitle}>Lig Katılımın</Text>
                      <Text style={styles.participationSubtitle}>Maksimum 5 lige katılabilirsin</Text>
                    </View>
                    <View style={styles.participationRight}>
                      <Text style={styles.participationCount}>
                        {currentUser.joinedLeagues}/{currentUser.maxLeagues}
                      </Text>
                      <View style={styles.participationProgressBar}>
                        <View 
                          style={[
                            styles.participationProgress,
                            { width: `${(currentUser.joinedLeagues / currentUser.maxLeagues) * 100}%` }
                          ]} 
                        />
                      </View>
                    </View>
                  </View>
                </LinearGradient>
              </View>

              {/* My Active Leagues */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Aktif Liglerin</Text>
                <FlatList
                  data={myLeagues}
                  renderItem={({ item }) => <LeagueCard item={item} isMyLeague={true} />}
                  keyExtractor={(item) => item.id.toString()}
                  scrollEnabled={false}
                  contentContainerStyle={styles.leaguesList}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            </>
          )}

          {activeTab === 'create' && (
            <>
              {showCreateStep === 1 && <CreateStep1 />}
              {showCreateStep === 2 && (
                <TouchableOpacity
                  style={styles.paymentTrigger}
                  onPress={() => setShowPaymentModal(true)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.paymentTriggerText}>Ödeme Yöntemini Seç</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </ScrollView>

        {/* Modals */}
        <WelcomeModal />
        <ChatModal />
        <PaymentModal />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F3F5',
  },
  safeArea: {
    flex: 1,
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
  categoriesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 8,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    flex: 1,
    alignItems: 'center',
  },
  categoryTabActive: {
    backgroundColor: '#432870',
  },
  categoryTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  categoryTabTextActive: {
    color: '#FFFFFF',
  },
  scrollContent: {
    paddingTop: 120, // Header height compensation (header + categories)
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  searchContainer: {
    position: 'relative',
    marginBottom: 24,
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
    color: '#111827',
  },
  searchIcon: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: -16,
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
    color: '#FFFFFF',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 16,
  },
  leaguesList: {
    gap: 16,
  },
  leagueCard: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 4,
  },
  featuredCard: {
    borderWidth: 2,
    borderColor: '#432870',
  },
  cardGradient: {
    padding: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardHeaderLeft: {
    flex: 1,
  },
  leagueName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111827',
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
    marginRight: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
  },
  creatorText: {
    fontSize: 12,
    color: 'rgba(32, 32, 32, 0.5)',
  },
  cardHeaderRight: {
    alignItems: 'flex-end',
  },
  prizeText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#432870',
    textAlign: 'right',
    lineHeight: 20,
  },
  prizeLabel: {
    fontSize: 12,
    color: 'rgba(32, 32, 32, 0.5)',
    marginTop: 4,
  },
  rankingText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#432870',
  },
  rankingLabel: {
    fontSize: 12,
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
  cardActions: {
    marginTop: 8,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  joinButton: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
  },
  joinButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailButton: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#F2F3F5',
    borderRadius: 16,
  },
  detailButtonText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: 'bold',
  },
  myLeagueActions: {
    flexDirection: 'row',
    gap: 8,
  },
  myLeagueButton: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#F2F3F5',
    borderRadius: 16,
    alignItems: 'center',
  },
  myLeagueButtonText: {
    color: '#111827',
    fontSize: 14,
    fontWeight: 'bold',
  },
  chatButton: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#432870',
    borderRadius: 16,
    alignItems: 'center',
  },
  chatButtonText: {
    fontSize: 16,
  },
  participationCard: {
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(67, 40, 112, 0.3)',
  },
  participationGradient: {
    padding: 16,
  },
  participationContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  participationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  participationSubtitle: {
    fontSize: 14,
    color: 'rgba(32, 32, 32, 0.7)',
  },
  participationRight: {
    alignItems: 'flex-end',
  },
  participationCount: {
    fontSize: 24,
    fontWeight: '900',
    color: '#432870',
  },
  participationProgressBar: {
    width: 64,
    height: 8,
    backgroundColor: '#F2F3F5',
    borderRadius: 4,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  participationProgress: {
    height: '100%',
    backgroundColor: '#432870',
    borderRadius: 4,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  welcomeHeader: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  welcomeEmoji: {
    fontSize: 80,
    marginBottom: 12,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
  },
  welcomeContent: {
    flex: 1,
    paddingHorizontal: 24,
  },
  featuresList: {
    gap: 16,
    paddingVertical: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureIconText: {
    fontSize: 18,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: 'rgba(32, 32, 32, 0.7)',
    lineHeight: 20,
  },
  welcomeActions: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 12,
  },
  startButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  startButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  laterButton: {
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(67, 40, 112, 0.2)',
    borderRadius: 16,
  },
  laterButtonText: {
    color: '#432870',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Chat Modal Styles
  chatHeader: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  chatHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
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
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  chatHeaderInfo: {
    flex: 1,
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  chatSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  chatMessages: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  messageUsername: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
    marginRight: 8,
  },
  messageTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  messageText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  chatInput: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    alignItems: 'flex-end',
  },
  messageInput: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    maxHeight: 100,
    fontSize: 16,
    color: '#111827',
  },
  sendButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  sendButtonGradient: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    fontSize: 20,
  },
  // Create League Styles
  createContainer: {
    flex: 1,
  },
  createProgress: {
    marginBottom: 24,
  },
  createStepText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  createStepTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'right',
    marginTop: -22,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#F2F3F5',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#432870',
    borderRadius: 4,
  },
  createTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  createSubtitle: {
    fontSize: 16,
    color: 'rgba(32, 32, 32, 0.7)',
    textAlign: 'center',
    marginBottom: 24,
  },
  createForm: {
    gap: 16,
    marginBottom: 32,
  },
  formField: {
    gap: 8,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  formInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#F2F3F5',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#111827',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  emojiButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#F2F3F5',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedEmoji: {
    borderColor: '#432870',
    backgroundColor: 'rgba(67, 40, 112, 0.1)',
  },
  emojiText: {
    fontSize: 24,
  },
  continueButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  disabledButton: {
    opacity: 0.5,
  },
  continueButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButtonText: {
    color: 'rgba(32, 32, 32, 0.5)',
  },
  paymentTrigger: {
    backgroundColor: '#432870',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  paymentTriggerText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Payment Modal Styles
  paymentHeader: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    alignItems: 'center',
  },
  paymentTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 8,
  },
  paymentSubtitle: {
    fontSize: 16,
    color: 'rgba(32, 32, 32, 0.7)',
  },
  paymentOptions: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 16,
    marginBottom: 32,
  },
  paymentOption: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
  },
  paymentOptionGradient: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  paymentOptionEmoji: {
    fontSize: 32,
    marginBottom: 12,
  },
  paymentOptionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 8,
  },
  paymentOptionPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  paymentOptionDesc: {
    fontSize: 14,
    color: 'rgba(32, 32, 32, 0.7)',
  },
  backButton: {
    marginHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#F2F3F5',
    borderRadius: 16,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
