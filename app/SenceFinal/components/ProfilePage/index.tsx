import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator, Text, Alert } from 'react-native';
import { StatusBar } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { profileService } from '@/services/profile.service';
import { predictionsService } from '@/services/predictions.service';
import { ProfilePageProps, Prediction } from './types';
import { useProfileAnimations, useProfileState } from './hooks';
import { ANIMATION_CONSTANTS, profileData, creditHistory } from './utils';
import { ProfileHeader } from './components/ProfileHeader';
import { ProfileImage } from './components/ProfileImage';
import { ProfileInfo } from './components/ProfileInfo';
import { ProfileTabs } from './components/ProfileTabs';
import { PredictionsTab } from './components/PredictionsTab';
import { StatisticsTab } from './components/StatisticsTab';
import { ProfileImageModal } from './components/ProfileImageModal';
import { FollowListModal, FollowUserItem } from './components/FollowListModal';

export function ProfilePage({ onBack, onMenuToggle, userProfile }: ProfilePageProps) {
  const { user, profile } = useAuth();

  // State tanımlamaları
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  // Takipçi / Takip listesi modal
  const [followListModal, setFollowListModal] = useState<'followers' | 'following' | null>(null);
  const [followListItems, setFollowListItems] = useState<FollowUserItem[]>([]);
  const [followListLoading, setFollowListLoading] = useState(false);

  const {
    scrollY,
    followButtonScale,
    profileImageScale,
    handleScroll,
    animateButtonPress,
    animateButtonHover,
  } = useProfileAnimations();

  const {
    isFollowing,
    activeTab,
    showProfileModal,
    setActiveTab,
    setShowProfileModal,
    handleFollow,
  } = useProfileState();

  const { HEADER_MAX_HEIGHT } = ANIMATION_CONSTANTS;

  // Backend'den profil verilerini yükle
  const loadProfileData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Paralel olarak tüm verileri yükle
      const [predictionsResult, statsResult, followerRes, followingRes] = await Promise.all([
        predictionsService.getUserPredictions(user.id),
        profileService.getProfileStats(user.id),
        profileService.getFollowerCount(user.id),
        profileService.getFollowingCount(user.id),
      ]);

      // Predictions
      if (predictionsResult.data) {
        const mappedPredictions: Prediction[] = predictionsResult.data.map((p: any) => ({
          id: parseInt(p.id) || 0,
          image: p.questions?.image_url || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=150&h=150&fit=crop',
          question: p.questions?.title || 'Soru',
          selectedOption: p.vote === 'yes' ? 'EVET' : 'HAYIR',
          odds: p.odds,
          status: p.status, // 'pending', 'won', 'lost'
        }));
        setPredictions(mappedPredictions);
      }

      // Stats
      if (statsResult.data) {
        setStats(statsResult.data);
      }

      setFollowerCount(followerRes.count ?? 0);
      setFollowingCount(followingRes.count ?? 0);
      
      // Debug: Takip sayılarını kontrol et
      console.log('Follower count:', followerRes.count, 'Following count:', followingRes.count);
      if (followerRes.error) console.error('Follower count error:', followerRes.error);
      if (followingRes.error) console.error('Following count error:', followingRes.error);
    } catch (err) {
      console.error('Profile data load error:', err);
      Alert.alert('Hata', 'Profil verileri yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Sayfa yüklendiğinde veriyi çek
  useEffect(() => {
    loadProfileData();
  }, [user]);

  // Refresh fonksiyonu
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadProfileData();
    setRefreshing(false);
  };

  // Takipçi listesini aç
  const handlePressFollowers = async () => {
    if (!user) return;
    setFollowListModal('followers');
    setFollowListLoading(true);
    setFollowListItems([]);
    const { data } = await profileService.getFollowersList(user.id);
    setFollowListItems(data || []);
    setFollowListLoading(false);
  };

  // Takip listesini aç
  const handlePressFollowing = async () => {
    if (!user) return;
    setFollowListModal('following');
    setFollowListLoading(true);
    setFollowListItems([]);
    const { data } = await profileService.getFollowingList(user.id);
    setFollowListItems(data || []);
    setFollowListLoading(false);
  };

  // Merge userProfile with profile data
  const mergedProfileData = {
    ...profileData,
    coverImage: profile?.cover_image || userProfile?.coverImage || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    profileImage: profile?.profile_image || userProfile?.profileImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    name: profile?.full_name || userProfile?.fullName || user?.email?.split('@')[0] || 'Kullanıcı',
    username: `@${profile?.username || userProfile?.username || user?.email?.split('@')[0] || 'kullanici'}`,
    bio: profile?.bio || userProfile?.bio || 'Henüz bio eklenmedi',
    predictions: stats?.total_predictions || 0,
    credits: profile?.credits || 10000,
    followers: followerCount,
    following: followingCount,
  };

  // Loading durumu
  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={styles.loadingText}>Profil yükleniyor...</Text>
      </View>
    );
  }

  // Giriş yapılmamış
  if (!user) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <Text style={styles.errorText}>Profil görüntülemek için giriş yapmalısınız</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Header */}
      <ProfileHeader
        scrollY={scrollY}
        coverImage={mergedProfileData.coverImage}
        userName={mergedProfileData.name}
        onBack={onBack}
        onMenuToggle={onMenuToggle}
      />

      {/* Profile Image */}
      <ProfileImage
        scrollY={scrollY}
        profileImage={mergedProfileData.profileImage}
        profileImageScale={profileImageScale}
        onPress={() => setShowProfileModal(true)}
        onPressIn={() => animateButtonHover(profileImageScale, true)}
        onPressOut={() => animateButtonHover(profileImageScale, false)}
      />

      {/* Scrollable Content */}
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: HEADER_MAX_HEIGHT, backgroundColor: '#0D1117' }}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      >
        {/* Profile Info Section */}
        <ProfileInfo
          profileData={mergedProfileData}
          isFollowing={isFollowing}
          followButtonScale={followButtonScale}
          isOwnProfile={true}
          onFollow={() => {
            handleFollow();
            animateButtonPress(followButtonScale);
          }}
          onPressIn={() => animateButtonHover(followButtonScale, true)}
          onPressOut={() => animateButtonHover(followButtonScale, false)}
          onPressFollowers={handlePressFollowers}
          onPressFollowing={handlePressFollowing}
        />

        {/* Tabs */}
        <ProfileTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === 'predictions' && (
            <PredictionsTab predictions={predictions} />
          )}

          {activeTab === 'statistics' && (
            <StatisticsTab 
              creditHistory={creditHistory} 
              stats={stats}
            />
          )}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Profile Image Modal */}
      <ProfileImageModal
        visible={showProfileModal}
        profileImage={mergedProfileData.profileImage}
        userName={mergedProfileData.name}
        onClose={() => setShowProfileModal(false)}
      />

      {/* Takipçi / Takip listesi modal */}
      <FollowListModal
        visible={followListModal !== null}
        title={followListModal === 'followers' ? 'Takipçiler' : 'Takip Ettiklerim'}
        items={followListItems}
        loading={followListLoading}
        onClose={() => setFollowListModal(null)}
      />
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
    color: '#10B981',
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  content: {
    flex: 1,
  },
  tabContent: {
    paddingHorizontal: 16,
  },
  bottomPadding: {
    height: 24,
  },
});

