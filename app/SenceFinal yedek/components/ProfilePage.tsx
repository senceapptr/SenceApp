import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Animated,
  Modal,
} from 'react-native';
import { StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ProfilePageProps {
  onBack: () => void;
  onMenuToggle: () => void;
}

// Mock data
const profileData = {
  name: "Ahmet Kaya",
  username: "@ahmetkaya",
  bio: "Spor tahminlerinde uzmanım. Futbol, basketbol ve tenis maçlarından kazanç sağlıyorum. Takip et ve birlikte kazanalım! 🎯",
  profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
  predictions: 124,
  followers: 892,
  following: 156,
  credits: 2850,
  isFollowing: false
};

const mockPredictions = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=150&h=150&fit=crop",
    question: "Galatasaray maçı kazanır mı?",
    selectedOption: "EVET",
    odds: 1.85,
    status: "won"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=150&h=150&fit=crop",
    question: "Lakers maçında toplam sayı 210+ olur mu?",
    selectedOption: "HAYIR",
    odds: 2.10,
    status: "lost"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=150&h=150&fit=crop",
    question: "Bitcoin bugün 50k$ üzerine çıkar mı?",
    selectedOption: "EVET",
    odds: 3.25,
    status: "pending"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=150&h=150&fit=crop",
    question: "Fenerbahçe ilk yarıda gol atar mı?",
    selectedOption: "EVET",
    odds: 1.75,
    status: "won"
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=150&h=150&fit=crop",
    question: "Hava yarın yağmurlu olacak mı?",
    selectedOption: "HAYIR",
    odds: 1.90,
    status: "pending"
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=150&h=150&fit=crop",
    question: "Real Madrid Şampiyonlar Ligi kazanır mı?",
    selectedOption: "EVET",
    odds: 2.75,
    status: "won"
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=150&h=150&fit=crop",
    question: "Barcelona La Liga'da şampiyon olur mu?",
    selectedOption: "EVET",
    odds: 2.15,
    status: "pending"
  },
  {
    id: 8,
    image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=150&h=150&fit=crop",
    question: "Ethereum bu hafta 3000$ üzerine çıkar mı?",
    selectedOption: "HAYIR",
    odds: 1.95,
    status: "pending"
  },
  {
    id: 9,
    image: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=150&h=150&fit=crop",
    question: "Beşiktaş deplasmanda gol atar mı?",
    selectedOption: "EVET",
    odds: 1.65,
    status: "pending"
  },
  {
    id: 10,
    image: "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=150&h=150&fit=crop",
    question: "Yarın güneşli olacak mı?",
    selectedOption: "EVET",
    odds: 1.45,
    status: "pending"
  },
  {
    id: 11,
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=150&h=150&fit=crop",
    question: "Golden State Warriors playoff'a kalır mı?",
    selectedOption: "HAYIR",
    odds: 2.8,
    status: "pending"
  },
  {
    id: 12,
    image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=150&h=150&fit=crop",
    question: "Tesla hissesi 200$ altına düşer mi?",
    selectedOption: "EVET",
    odds: 3.1,
    status: "pending"
  },
  {
    id: 13,
    image: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=150&h=150&fit=crop",
    question: "Trabzonspor kupayı kazanır mı?",
    selectedOption: "HAYIR",
    odds: 2.25,
    status: "pending"
  },
  {
    id: 14,
    image: "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=150&h=150&fit=crop",
    question: "Bu hafta kar yağacak mı?",
    selectedOption: "EVET",
    odds: 1.75,
    status: "pending"
  },
  {
    id: 15,
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=150&h=150&fit=crop",
    question: "Miami Heat final oynar mı?",
    selectedOption: "HAYIR",
    odds: 2.9,
    status: "pending"
  },
  {
    id: 16,
    image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=150&h=150&fit=crop",
    question: "Apple hissesi 150$ üzerine çıkar mı?",
    selectedOption: "EVET",
    odds: 2.4,
    status: "pending"
  },
  {
    id: 17,
    image: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=150&h=150&fit=crop",
    question: "Konyaspor ligde kalır mı?",
    selectedOption: "EVET",
    odds: 1.55,
    status: "pending"
  },
  {
    id: 18,
    image: "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=150&h=150&fit=crop",
    question: "Gece yağmur yağacak mı?",
    selectedOption: "HAYIR",
    odds: 1.85,
    status: "pending"
  },
  {
    id: 19,
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=150&h=150&fit=crop",
    question: "Boston Celtics şampiyon olur mu?",
    selectedOption: "EVET",
    odds: 3.2,
    status: "pending"
  },
  {
    id: 20,
    image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=150&h=150&fit=crop",
    question: "Netflix hissesi 400$ üzerine çıkar mı?",
    selectedOption: "HAYIR",
    odds: 2.7,
    status: "pending"
  }
];

const creditHistory = [
  { day: 'Pzt', credits: 2200 },
  { day: 'Sal', credits: 2350 },
  { day: 'Çar', credits: 2100 },
  { day: 'Per', credits: 2600 },
  { day: 'Cum', credits: 2850 },
  { day: 'Cmt', credits: 2750 },
  { day: 'Paz', credits: 2850 }
];

const badges = [
  {
    id: 1,
    name: "İlk Tahmin",
    description: "İlk tahminini yaptın!",
    icon: "🎯",
    earned: true,
    rarity: "common"
  },
  {
    id: 2,
    name: "Seri Kazanan",
    description: "5 tahmin üst üste kazandın!",
    icon: "🔥",
    earned: true,
    rarity: "rare"
  },
  {
    id: 3,
    name: "Yüksek Oran",
    description: "3.0+ oranı tutturdun!",
    icon: "💎",
    earned: true,
    rarity: "epic"
  },
  {
    id: 4,
    name: "Sosyal Kelebek",
    description: "50+ kişiyi takip ettin!",
    icon: "🦋",
    earned: true,
    rarity: "rare"
  },
  {
    id: 5,
    name: "Milyoner",
    description: "1000+ kredi kazandın!",
    icon: "💰",
    earned: false,
    rarity: "legendary"
  },
  {
    id: 6,
    name: "Guru",
    description: "100+ tahmin yaptın!",
    icon: "🧠",
    earned: true,
    rarity: "epic"
  }
];

export function ProfilePage({ onBack, onMenuToggle }: ProfilePageProps) {
  const [isFollowing, setIsFollowing] = useState(profileData.isFollowing);
  const [activeTab, setActiveTab] = useState<'predictions' | 'statistics' | 'badges'>('predictions');
  const [showProfileModal, setShowProfileModal] = useState(false);
  
  // Constants for header animation
  const HEADER_MAX_HEIGHT = 280;
  const HEADER_MIN_HEIGHT = 100;
  const PROFILE_IMAGE_SIZE = 80;
  const PROFILE_IMAGE_SIZE_SMALL = 32;
  
  // Scroll animations
  const scrollY = useRef(new Animated.Value(0)).current;
  
  // Button hover animations
  const followButtonScale = useRef(new Animated.Value(1)).current;
  const profileImageScale = useRef(new Animated.Value(1)).current;

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  // Scroll handler
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  // Button animations
  const animateButtonPress = (animValue: Animated.Value) => {
    Animated.sequence([
      Animated.timing(animValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(animValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateButtonHover = (animValue: Animated.Value, pressed: boolean) => {
    Animated.timing(animValue, {
      toValue: pressed ? 1.05 : 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'won': return '#34C759';
      case 'lost': return '#FF3B30';
      case 'pending': return '#C9F158';
      default: return '#F2F3F5';
    }
  };

  const getBadgeColors = (rarity: string, earned: boolean): [string, string] => {
    if (!earned) return ['rgba(53,56,49,0.2)', 'rgba(53,56,49,0.3)'];
    
    switch (rarity) {
      case 'common': return ['#F2F3F5', '#F2F3F5'];
      case 'rare': return ['#C9F158', '#C9F158'];
      case 'epic': return ['#432870', '#B29EFD'];
      case 'legendary': return ['#B29EFD', '#432870'];
      default: return ['#F2F3F5', '#F2F3F5'];
    }
  };

  const renderPredictionItem = (prediction: any, index: number) => (
    <TouchableOpacity key={prediction.id} style={styles.predictionCard} activeOpacity={0.8}>
      <Image 
        source={{ uri: prediction.image }}
        style={styles.predictionImage}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.predictionOverlay}
      >
        <Text style={styles.predictionQuestion} numberOfLines={2}>
          {prediction.question}
        </Text>
        <View style={styles.predictionFooter}>
          <View style={[
            styles.predictionBadge,
            prediction.selectedOption === 'EVET' ? styles.yesBadge : styles.noBadge
          ]}>
            <Text style={styles.predictionBadgeText}>{prediction.selectedOption}</Text>
          </View>
          <Text style={styles.predictionOdds}>{prediction.odds}x</Text>
        </View>
      </LinearGradient>
      <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(prediction.status) }]} />
    </TouchableOpacity>
  );

  const renderBadgeItem = (badge: any, index: number) => {
    const [color1, color2] = getBadgeColors(badge.rarity, badge.earned);
    
    return (
      <View key={badge.id} style={[styles.badgeCard, !badge.earned && styles.badgeCardDisabled]}>
        <LinearGradient
          colors={[color1, color2]}
          style={styles.badgeGradient}
        >
          <Text style={styles.badgeIcon}>{badge.icon}</Text>
          <Text style={[styles.badgeName, !badge.earned && styles.badgeNameDisabled]}>
            {badge.name}
          </Text>
          <Text style={[styles.badgeDescription, !badge.earned && styles.badgeDescriptionDisabled]}>
            {badge.description}
          </Text>
          {badge.rarity === 'legendary' && (
            <View style={styles.legendaryBadge}>
              <Text style={styles.legendaryText}>Efsanevi</Text>
            </View>
          )}
        </LinearGradient>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Collapsible Header */}
      <Animated.View 
        style={[
          styles.header,
          {
            height: scrollY.interpolate({
              inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
              outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
              extrapolate: 'clamp',
            }),
          },
        ]}
      >
        {/* Cover Image with Parallax */}
        <Animated.Image
          source={{ uri: profileData.coverImage }}
          style={[
            styles.coverImage,
            {
              height: scrollY.interpolate({
                inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
                outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
                extrapolate: 'clamp',
              }),
              transform: [
                {
                  translateY: scrollY.interpolate({
                    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
                    outputRange: [0, -(HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT) / 400],
                    extrapolate: 'clamp',
                  }),
                },
                {
                  scale: scrollY.interpolate({
                    inputRange: [-200, 0],
                    outputRange: [1.0, 1],
                    extrapolate: 'clamp',
                  }),
                },
              ],
            },
          ]}
          resizeMode="cover"
        />
        
        {/* Header Overlay */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.4)']}
          style={styles.headerOverlay}
        />
        
        {/* Header Content */}
        <View style={styles.headerContent}>
          {/* Top Bar */}
          <View style={styles.topBar}>
            <TouchableOpacity onPress={onBack} style={styles.headerButton} activeOpacity={0.7}>
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
            
            {/* Collapsed Title */}
            <Animated.Text
              style={[
                styles.collapsedTitle,
                {
                  opacity: scrollY.interpolate({
                    inputRange: [HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT - 40, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
                    outputRange: [0, 1],
                    extrapolate: 'clamp',
                  }),
                },
              ]}
            >
              {profileData.name}
            </Animated.Text>
            
            <TouchableOpacity onPress={onMenuToggle} style={styles.headerButton} activeOpacity={0.7}>
              <View style={styles.hamburgerIcon}>
                <View style={styles.hamburgerLine} />
                <View style={styles.hamburgerLine} />
                <View style={styles.hamburgerLine} />
              </View>
            </TouchableOpacity>
          </View>
          
          {/* Empty space for profile info that will be below header */}
        </View>
        

      </Animated.View>

      {/* Profile Image - Positioned after header, fades out on scroll */}
      <Animated.View
        style={[
          styles.mainProfileImageContainer,
          {
            opacity: scrollY.interpolate({
              inputRange: [0, 200],
              outputRange: [1, 0],
              extrapolate: 'clamp',
            }),
            transform: [
              {
                translateY: scrollY.interpolate({
                  inputRange: [0, 200],
                  outputRange: [0, -120],
                  extrapolate: 'clamp',
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity 
          onPress={() => setShowProfileModal(true)}
          onPressIn={() => animateButtonHover(profileImageScale, true)}
          onPressOut={() => animateButtonHover(profileImageScale, false)}
          activeOpacity={0.9}
        >
          <Animated.View style={{ transform: [{ scale: profileImageScale }] }}>
            <Image 
              source={{ uri: profileData.profileImage }}
              style={styles.mainProfileImage}
              resizeMode="cover"
            />
            <View style={styles.onlineIndicator} />
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: HEADER_MAX_HEIGHT }}
      >
        {/* Profile Info Section */}
        <View style={styles.profileInfoSection}>
          {/* User Details */}
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{profileData.name}</Text>
            <Text style={styles.userHandle}>{profileData.username}</Text>
            
            {/* Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{profileData.predictions}</Text>
                <Text style={styles.statLabel}>tahmin</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{profileData.followers}</Text>
                <Text style={styles.statLabel}>takipçi</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{profileData.following}</Text>
                <Text style={styles.statLabel}>takip</Text>
              </View>
            </View>
          </View>
          
          {/* Follow Button */}
          <Animated.View style={{ transform: [{ scale: followButtonScale }] }}>
            <TouchableOpacity 
              onPress={() => {
                handleFollow();
                animateButtonPress(followButtonScale);
              }}
              onPressIn={() => animateButtonHover(followButtonScale, true)}
              onPressOut={() => animateButtonHover(followButtonScale, false)}
              style={[styles.followButton, isFollowing && styles.followingButton]}
              activeOpacity={0.8}
            >
              <Ionicons name="person-add" size={16} color={isFollowing ? '#202020' : 'white'} />
              <Text style={[styles.followButtonText, isFollowing && styles.followingButtonText]}>
                {isFollowing ? 'Takip Ediliyor' : 'Takip Et'}
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Bio */}
          <Text style={styles.bio}>{profileData.bio}</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            onPress={() => setActiveTab('predictions')}
            style={[styles.tab, activeTab === 'predictions' && styles.activeTab]}
            activeOpacity={0.7}
          >
            <Ionicons name="stats-chart" size={16} color={activeTab === 'predictions' ? 'white' : '#202020'} />
            <Text style={[styles.tabText, activeTab === 'predictions' && styles.activeTabText]}>
              Tahminler
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setActiveTab('statistics')}
            style={[styles.tab, activeTab === 'statistics' && styles.activeTab]}
            activeOpacity={0.7}
          >
            <Ionicons name="trending-up" size={16} color={activeTab === 'statistics' ? 'white' : '#202020'} />
            <Text style={[styles.tabText, activeTab === 'statistics' && styles.activeTabText]}>
              İstatistikler
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setActiveTab('badges')}
            style={[styles.tab, activeTab === 'badges' && styles.activeTab]}
            activeOpacity={0.7}
          >
            <Ionicons name="trophy" size={16} color={activeTab === 'badges' ? 'white' : '#202020'} />
            <Text style={[styles.tabText, activeTab === 'badges' && styles.activeTabText]}>
              Rozetler
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === 'predictions' && (
            <View style={styles.predictionsGrid}>
              {mockPredictions.map(renderPredictionItem)}
            </View>
          )}

          {activeTab === 'statistics' && (
            <View style={styles.statisticsContainer}>
              {/* Credit History */}
              <View style={styles.creditHistoryCard}>
                <Text style={styles.cardTitle}>Kredi Değişimi</Text>
                <View style={styles.creditChart}>
                  {creditHistory.map((item, index) => (
                    <View key={index} style={styles.chartItem}>
                      <View style={styles.chartBar}>
                        <View style={[
                          styles.chartBarFill,
                          { height: `${(item.credits / 3000) * 100}%` }
                        ]} />
                      </View>
                      <Text style={styles.chartLabel}>{item.day}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Stats Cards */}
              <View style={styles.statsCardsContainer}>
                <LinearGradient
                  colors={['#C9F158', 'rgba(201,241,88,0.8)']}
                  style={styles.statCard}
                >
                  <Text style={styles.statCardLabel}>En Büyük Oran</Text>
                  <Text style={styles.statCardValue}>5.25x</Text>
                </LinearGradient>

                <LinearGradient
                  colors={['#432870', '#B29EFD']}
                  style={styles.statCard}
                >
                  <Text style={[styles.statCardLabel, { color: 'rgba(255,255,255,0.8)' }]}>Kupon Rekoru</Text>
                  <Text style={[styles.statCardValue, { color: 'white' }]}>12.8x</Text>
                </LinearGradient>
              </View>

              {/* Additional Stats */}
              <View style={styles.additionalStatsCard}>
                <Text style={styles.cardTitle}>Genel İstatistikler</Text>
                <View style={styles.statRow}>
                  <Text style={styles.statRowLabel}>Kazanma Oranı</Text>
                  <Text style={[styles.statRowValue, { color: '#34C759' }]}>68%</Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statRowLabel}>Toplam Kazanç</Text>
                  <Text style={[styles.statRowValue, { color: '#432870' }]}>+1,250 ₺</Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statRowLabel}>Ortalama Oran</Text>
                  <Text style={styles.statRowValue}>1.89x</Text>
                </View>
              </View>
            </View>
          )}

          {activeTab === 'badges' && (
            <View style={styles.badgesGrid}>
              {badges.map(renderBadgeItem)}
            </View>
          )}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Profile Image Modal */}
      <Modal
        visible={showProfileModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowProfileModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowProfileModal(false)}
        >
          <View style={styles.profileModalContainer}>
            <View style={styles.profileModalHeader}>
              <Text style={styles.profileModalTitle}>{profileData.name}</Text>
              <TouchableOpacity 
                onPress={() => setShowProfileModal(false)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>
            <Image 
              source={{ uri: profileData.profileImage }}
              style={styles.profileModalImage}
              resizeMode="cover"
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F3F5',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    overflow: 'hidden',
  },
  coverImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  headerContent: {
    flex: 1,
    paddingTop: 50,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    height: 50,
    zIndex: 2,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  collapsedTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: 'white',
    textAlign: 'center',
  },
  hamburgerIcon: {
    width: 20,
    height: 16,
    justifyContent: 'space-between',
  },
  hamburgerLine: {
    width: 20,
    height: 2.5,
    backgroundColor: 'white',
    borderRadius: 1.25,
  },
      mainProfileImageContainer: {
      position: 'absolute',
      top: 280, // HEADER_MAX_HEIGHT
      alignSelf: 'center',
      zIndex: 1000, // Higher zIndex to appear above header
      marginTop: -60, // More overlap - profile image on top of header
    },
  mainProfileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: 'white',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    backgroundColor: '#34C759',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'white',
  },
  userDetails: {
    alignItems: 'center',
    marginBottom: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: '900',
    color: '#202020',
    marginBottom: 4,
    textAlign: 'center',
  },
  userHandle: {
    fontSize: 16,
    color: 'rgba(32,32,32,0.6)',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 32,
    justifyContent: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#202020',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(32,32,32,0.6)',
  },
  followButton: {
    backgroundColor: '#432870',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 20,
  },
  followingButton: {
    backgroundColor: '#F2F3F5',
    borderWidth: 1,
    borderColor: 'rgba(32,32,32,0.2)',
  },
  followButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
  followingButtonText: {
    color: '#202020',
  },

  content: {
    flex: 1,
  },
  profileInfoSection: {
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 24,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  bio: {
    fontSize: 16,
    color: 'rgba(32,32,32,0.8)',
    lineHeight: 24,
    textAlign: 'center',
    marginTop: 4,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgba(32,32,32,0.1)',
    borderRadius: 16,
    padding: 4,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  activeTab: {
    backgroundColor: '#432870',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#202020',
  },
  activeTabText: {
    color: 'white',
  },
  tabContent: {
    paddingHorizontal: 16,
  },
  predictionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  predictionCard: {
    width: (SCREEN_WIDTH - 56) / 3,
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  predictionImage: {
    width: '100%',
    height: '100%',
  },
  predictionOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
  },
  predictionQuestion: {
    color: 'white',
    fontSize: 10,
    lineHeight: 12,
    marginBottom: 4,
  },
  predictionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  predictionBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  yesBadge: {
    backgroundColor: '#34C759',
  },
  noBadge: {
    backgroundColor: '#FF3B30',
  },
  predictionBadgeText: {
    color: 'white',
    fontSize: 8,
    fontWeight: '700',
  },
  predictionOdds: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
  },
  statusIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statisticsContainer: {
    gap: 16,
  },
  creditHistoryCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#202020',
    marginBottom: 16,
  },
  creditChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
  },
  chartItem: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  chartBar: {
    width: 20,
    height: 80,
    backgroundColor: '#F2F3F5',
    borderRadius: 10,
    justifyContent: 'flex-end',
  },
  chartBarFill: {
    backgroundColor: '#432870',
    borderRadius: 10,
    minHeight: 4,
  },
  chartLabel: {
    fontSize: 12,
    color: '#202020',
    fontWeight: '600',
  },
  statsCardsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
  },
  statCardLabel: {
    fontSize: 14,
    color: '#353831',
    marginBottom: 4,
  },
  statCardValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#353831',
  },
  additionalStatsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  statRowLabel: {
    fontSize: 16,
    color: 'rgba(32,32,32,0.6)',
  },
  statRowValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#202020',
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badgeCard: {
    width: (SCREEN_WIDTH - 60) / 2,
    borderRadius: 16,
    overflow: 'hidden',
  },
  badgeCardDisabled: {
    opacity: 0.5,
  },
  badgeGradient: {
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 16,
    borderColor: 'rgba(67,40,112,0.2)',
  },
  badgeIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  badgeName: {
    fontSize: 14,
    fontWeight: '900',
    color: '#202020',
    marginBottom: 4,
    textAlign: 'center',
  },
  badgeNameDisabled: {
    color: 'rgba(32,32,32,0.4)',
  },
  badgeDescription: {
    fontSize: 12,
    color: 'rgba(32,32,32,0.6)',
    textAlign: 'center',
  },
  badgeDescriptionDisabled: {
    color: 'rgba(32,32,32,0.3)',
  },
  legendaryBadge: {
    backgroundColor: 'rgba(178,158,253,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 8,
  },
  legendaryText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#432870',
  },
  bottomPadding: {
    height: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileModalContainer: {
    width: SCREEN_WIDTH * 0.9,
    alignItems: 'center',
  },
  profileModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  profileModalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: 'white',
    flex: 1,
    textAlign: 'center',
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 0,
  },
  profileModalImage: {
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_WIDTH * 0.8,
    borderRadius: (SCREEN_WIDTH * 0.8) / 2,
    borderWidth: 4,
    borderColor: 'white',
  },
});
