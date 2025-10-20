import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator, Text, Alert } from 'react-native';
import { StatusBar } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { profileService, predictionsService } from '@/services';
import { ProfilePageProps, Prediction, CreditHistoryItem } from './types';
import { useProfileAnimations, useProfileState } from './hooks';
import { ANIMATION_CONSTANTS, profileData, creditHistory } from './utils';
import { ProfileHeader } from './components/ProfileHeader';
import { ProfileImage } from './components/ProfileImage';
import { ProfileInfo } from './components/ProfileInfo';
import { ProfileTabs } from './components/ProfileTabs';
import { PredictionsTab } from './components/PredictionsTab';
import { StatisticsTab } from './components/StatisticsTab';
import { ProfileImageModal } from './components/ProfileImageModal';

export function ProfilePage({ onBack, onMenuToggle, userProfile }: ProfilePageProps) {
  const { user, profile } = useAuth();

  // State tanımlamaları
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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
      const [predictionsResult, statsResult] = await Promise.all([
        predictionsService.getUserPredictions(user.id),
        profileService.getUserStats(user.id),
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

  // Merge userProfile with profile data
  const mergedProfileData = {
    ...profileData,
    coverImage: profile?.cover_image || userProfile.coverImage,
    profileImage: profile?.profile_image || userProfile.profileImage,
    name: profile?.full_name || userProfile.fullName,
    username: `@${profile?.username || userProfile.username}`,
    bio: profile?.bio || userProfile.bio,
    predictions: stats?.total_predictions || 0,
    credits: profile?.credits || 0,
    followers: 0, // TODO: Follower sistemi eklenince burası güncellenecek
    following: 0, // TODO: Following sistemi eklenince burası güncellenecek
  };

  // Loading durumu
  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <ActivityIndicator size="large" color="#432870" />
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
        contentContainerStyle={{ paddingTop: HEADER_MAX_HEIGHT }}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      >
        {/* Profile Info Section */}
        <ProfileInfo
          profileData={mergedProfileData}
          isFollowing={isFollowing}
          followButtonScale={followButtonScale}
          onFollow={() => {
            handleFollow();
            animateButtonPress(followButtonScale);
          }}
          onPressIn={() => animateButtonHover(followButtonScale, true)}
          onPressOut={() => animateButtonHover(followButtonScale, false)}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F3F5',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
    color: '#432870',
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
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

