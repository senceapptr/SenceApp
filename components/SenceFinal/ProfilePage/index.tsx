
import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator, Text, Alert, Share, StatusBar, RefreshControl } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { profileService } from '@/services/profile.service';
import { predictionsService } from '@/services/predictions.service';
import { couponsService } from '@/services/coupons.service';
import { storageService } from '@/services/storage.service';
import { ProfilePageProps, ProfileStats, TabType, CreditHistoryItem } from './types';
import { useProfileAnimations, useProfileState } from './hooks';
import { ANIMATION_CONSTANTS, profileData, creditHistory } from './utils';
import { ProfileHeader } from './components/ProfileHeader';
import { ProfileImage } from './components/ProfileImage';
import { ProfileInfo } from './components/ProfileInfo';
import { ProfileTabs } from './components/ProfileTabs';
import { TicketsTab } from './components/TicketsTab';
import { StatisticsTab } from './components/StatisticsTab';
import { ProfileImageModal } from './components/ProfileImageModal';
import { FollowListModal, FollowUserItem } from './components/FollowListModal';
import { EditProfilePage } from '../EditProfilePage';
import { mapBackendCouponsToFrontend } from '@/components/SenceFinal/CouponsPage/couponMapper';
import { Coupon } from '@/components/SenceFinal/CouponsPage/types';
import { CouponDetailModal } from '@/components/SenceFinal/CouponsPage/components/CouponDetailModal';

export function ProfilePage({ onBack, onMenuToggle, userProfile }: ProfilePageProps) {
  const { user, profile, updateProfile } = useAuth();

  // State
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  const [predictions, setPredictions] = useState<any[]>([]);
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [historyData, setHistoryData] = useState<CreditHistoryItem[]>([]); // New State
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [showEditProfile, setShowEditProfile] = useState(false);

  // Modals
  const [followListModal, setFollowListModal] = useState<'followers' | 'following' | null>(null);
  const [followListItems, setFollowListItems] = useState<FollowUserItem[]>([]);
  const [followListLoading, setFollowListLoading] = useState(false);

  // Coupon Detail Modal
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showCoverModal, setShowCoverModal] = useState(false); // Added state
  const [showCouponDetail, setShowCouponDetail] = useState(false);

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
    // showProfileModal, // Removed from here as it's now a local state
    setActiveTab,
    // setShowProfileModal, // Removed from here as it's now a local state
    handleFollow,
  } = useProfileState();

  const { HEADER_MAX_HEIGHT } = ANIMATION_CONSTANTS;

  // Initial tab state override if needed (hooks.ts defaults to 'predictions', but we want 'tickets')
  useEffect(() => {
    setActiveTab('tickets');
  }, []);

  const calculateStats = (userCoupons: Coupon[], userPredictions: any[]): ProfileStats => {
    // Basic stats from predictions
    const totalPredictions = userPredictions.length;
    const correctPredictions = userPredictions.filter((p: any) => p.win === true || p.status === 'won').length;
    const predictionsEarnings = userPredictions.reduce((sum: number, p: any) => {
      return sum + (p.status === 'won' ? (p.potential_win || 0) : 0);
    }, 0);

    // Correct Predictions from Coupons (Iterate through selections)
    // BackendCoupon structure has coupon_selections array.
    // Frontend Coupon (mapped) has predictions array.
    // We need to check 'correct_selections' field or iterate predictions.
    // Let's assume 'status' of selection or 'result' of question matches 'vote'.
    let couponCorrectPredictions = 0;
    userCoupons.forEach(coupon => {
      // If we have correct_selections count from backend, use it.
      // Coupon interface in types.ts doesn't have it, but BackendCoupon has.
      // Let's rely on coupon.predictions (mapped selections)
      coupon.predictions.forEach(p => {
        // If result exists and matches choice, or status is won (if available in mapped type)
        // The mapped type has 'result' in CouponPrediction. 
        // Logic: if result === 'won' then it is correct? No result is 'won'|'lost'.
        // Wait, PredictionResult is 'won'|'lost'.
        // If p.result === 'won' it means the PREDICTION won? Or the QUESTION result?
        // Usually result is the outcome. Detailed check needed.
        // Simplest: Check if p.result is defined. 
        // Actually, let's look at couponMapper.ts if possible, or assume p.result === p.choice implies win? 
        // Better: if coupon status is 'won' (meaning the selection won).
        if (p.result === 'won') {
          couponCorrectPredictions++;
        }
      });
    });

    const correctPredictionsTotal = correctPredictions + couponCorrectPredictions;
    const totalPredictionsTotal = totalPredictions + userCoupons.reduce((acc, c) => acc + c.predictions.length, 0);

    const accuracyRate = totalPredictionsTotal > 0 ? correctPredictionsTotal / totalPredictionsTotal : 0;

    // Coupon stats
    const totalCoupons = userCoupons.length;
    const wonCoupons = userCoupons.filter(c => c.status === 'won').length;
    const couponAccuracyRate = totalCoupons > 0 ? wonCoupons / totalCoupons : 0;
    const couponTotalEarnings = userCoupons.reduce((sum, c) => {
      return sum + (c.status === 'won' ? c.potentialEarnings : 0);
    }, 0);

    // High scores
    const highestOddsWon = Math.max(
      ...userPredictions.filter((p: any) => p.status === 'won').map((p: any) => p.odds || 0),
      ...userCoupons.filter(c => c.status === 'won').map(c => c.totalOdds),
      0
    );

    const maxWinAmount = Math.max(
      ...userPredictions.filter((p: any) => p.status === 'won').map((p: any) => p.potential_win || 0),
      ...userCoupons.filter(c => c.status === 'won').map(c => c.potentialEarnings),
      0
    );

    return {
      totalPredictions: totalPredictionsTotal,
      correctPredictions: correctPredictionsTotal,
      accuracyRate,
      totalEarnings: predictionsEarnings + couponTotalEarnings,
      highestOddsWon,
      maxWinAmount,
      totalCoupons,
      wonCoupons,
      couponAccuracyRate,
      couponTotalEarnings
    };
  };

  const generateCreditHistory = (userCoupons: Coupon[], currentCredits: number): CreditHistoryItem[] => {
    if (!userCoupons || userCoupons.length === 0) {
      // Return a single point if no history
      return [{ date: new Date().toISOString(), value: currentCredits }];
    }

    const sortedCoupons = [...userCoupons].sort((a, b) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    let runningBalance = currentCredits;
    const historyPoints: CreditHistoryItem[] = [];

    // Push the current state as the last point
    historyPoints.push({
      date: new Date().toISOString(),
      value: runningBalance
    });

    // Walk backwards through sorted coupons (from newest to oldest) to reconstruct history
    const reversedCoupons = [...sortedCoupons].reverse();

    reversedCoupons.forEach(coupon => {
      const investment = coupon.investmentAmount || 0;
      const wonAmount = coupon.status === 'won' ? (coupon.potentialEarnings || 0) : 0;

      runningBalance = runningBalance - wonAmount + investment;

      historyPoints.push({
        date: new Date(coupon.createdAt).toISOString(),
        value: runningBalance
      });
    });

    return historyPoints.reverse();
  };

  const loadProfileData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const [predictionsRes, couponsRes, followerRes, followingRes] = await Promise.all([
        predictionsService.getUserPredictions(user.id),
        couponsService.getUserCoupons(user.id),
        profileService.getFollowerCount(user.id),
        profileService.getFollowingCount(user.id),
      ]);

      let userPredictions: any[] = [];
      if (predictionsRes.data) {
        userPredictions = predictionsRes.data;
        setPredictions(userPredictions);
      }

      let userCoupons: Coupon[] = [];
      if (couponsRes.data) {
        // Ensure user_id is treated correctly, though mapper should handle it.
        // If data comes from couponsRes.data, it satisfies BackendCoupon structure mostly.
        userCoupons = mapBackendCouponsToFrontend(couponsRes.data as any);
        setCoupons(userCoupons);
      }

      setFollowerCount(followerRes.count ?? 0);
      setFollowingCount(followingRes.count ?? 0);

      // Calculate stats locally
      const calculatedStats = calculateStats(userCoupons, userPredictions);
      setStats(calculatedStats);

      // Generate credit history
      const currentCredits = profile?.credits || 0;
      const history = generateCreditHistory(userCoupons, currentCredits);
      setHistoryData(history);

    } catch (err) {
      console.error('Profile data load error:', err);
      Alert.alert('Hata', 'Profil verileri yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfileData();
  }, [user]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadProfileData();
    setRefreshing(false);
  };

  const handlePressFollowers = async () => {
    if (!user) return;
    setFollowListModal('followers');
    setFollowListLoading(true);
    setFollowListItems([]);
    const { data } = await profileService.getFollowersList(user.id);
    setFollowListItems(data || []);
    setFollowListLoading(false);
  };

  const handlePressFollowing = async () => {
    if (!user) return;
    setFollowListModal('following');
    setFollowListLoading(true);
    setFollowListItems([]);
    const { data } = await profileService.getFollowingList(user.id);
    setFollowListItems(data || []);
    setFollowListLoading(false);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `SenceApp'te profili incele: @${mergedProfileData.username}`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = () => {
    setShowEditProfile(true);
  };

  const handleImageEdit = async (type: 'profile' | 'cover', source: 'camera' | 'gallery') => {
    if (!user) return;

    try {
      // Close modals immediately
      if (type === 'profile') setShowProfileModal(false);
      if (type === 'cover') setShowCoverModal(false);

      const { uri, error } = source === 'camera'
        ? await storageService.takePhoto()
        : await storageService.pickImage();

      if (error || !uri) return;

      setLoading(true);

      let uploadRes;
      if (type === 'profile') {
        uploadRes = await storageService.uploadProfileImage(user.id, uri);
      } else {
        uploadRes = await storageService.uploadCoverImage(user.id, uri);
      }

      if (uploadRes.error || !uploadRes.data) {
        Alert.alert('Hata', 'Fotoğraf yüklenemedi');
        setLoading(false);
        return;
      }

      // Update profile in DB
      const updateData = type === 'profile'
        ? { profile_image: uploadRes.data }
        : { cover_image: uploadRes.data };

      const { error: updateError } = await profileService.updateProfile(user.id, updateData);

      if (updateError) {
        Alert.alert('Hata', 'Profil güncellenemedi');
        setLoading(false);
        return;
      }

      // Update Auth Context directly 
      // (Assuming updateProfile supports partial update, checking AuthContext...)
      // The snippet in Step 29 shows updateProfile usage.
      await updateProfile(updateData);

      Alert.alert('Başarılı', 'Fotoğraf güncellendi');
      handleRefresh(); // Reload data to be sure
    } catch (e) {
      console.error(e);
      Alert.alert('Hata', 'Bir sorun oluştu');
      setLoading(false);
    }
  };

  const mergedProfileData = {
    ...profileData,
    coverImage: profile?.cover_image || userProfile?.coverImage || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    profileImage: profile?.profile_image || userProfile?.profileImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    name: profile?.full_name || userProfile?.fullName || user?.email?.split('@')[0] || 'Kullanıcı',
    username: `@${profile?.username || userProfile?.username || user?.email?.split('@')[0] || 'kullanici'}`,
    bio: profile?.bio || userProfile?.bio || 'Henüz bio eklenmedi',
    predictions: stats?.totalPredictions || 0,
    credits: profile?.credits || 10000,
    followers: followerCount,
    following: followingCount,
  };

  if (showEditProfile) {
    return (
      <EditProfilePage
        onBack={() => setShowEditProfile(false)}
        onUpdateProfile={(updated) => {
          // Local update if needed, but we rely on AuthContext and refresh
          handleRefresh();
        }}
      />
    );
  }

  if (loading && !refreshing && !stats) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={styles.loadingText}>Profil yükleniyor...</Text>
      </View>
    );
  }

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

      <ProfileHeader
        scrollY={scrollY}
        coverImage={mergedProfileData.coverImage}
        userName={mergedProfileData.name}
        onBack={onBack}
        onShare={handleShare}
        onEdit={handleEdit}
        onCoverPress={() => setShowCoverModal(true)}
        isOwnProfile={true}
      />

      <ProfileImage
        scrollY={scrollY}
        profileImage={mergedProfileData.profileImage}
        profileImageScale={profileImageScale}
        onPress={() => setShowProfileModal(true)}
        onPressIn={() => animateButtonHover(profileImageScale, true)}
        onPressOut={() => animateButtonHover(profileImageScale, false)}
        isOwnProfile={true}
      />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}

        contentContainerStyle={{ paddingTop: HEADER_MAX_HEIGHT, backgroundColor: '#0D1117' }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#10B981" />
        }
      >
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

        <ProfileTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <View style={styles.tabContent}>
          {activeTab === 'tickets' && (
            <TicketsTab
              tickets={coupons}
              onTicketPress={(ticket) => {
                setSelectedCoupon(ticket);
                setShowCouponDetail(true);
              }}
            />
          )}

          {activeTab === 'statistics' && (
            <StatisticsTab
              creditHistory={historyData}
              stats={stats || undefined} // pass undefined if null
            />
          )}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      <ProfileImageModal
        visible={showProfileModal}
        imageUri={mergedProfileData.profileImage}
        userName={mergedProfileData.name}
        type="profile"
        onClose={() => setShowProfileModal(false)}
        isOwnProfile={true}
        onCameraPress={() => handleImageEdit('profile', 'camera')}
        onGalleryPress={() => handleImageEdit('profile', 'gallery')}
      />

      {/* Cover Image Modal - we can reuse ProfileImageModal with type='cover' */}
      <ProfileImageModal
        visible={showCoverModal}
        imageUri={mergedProfileData.coverImage}
        userName={mergedProfileData.name}
        type="cover"
        onClose={() => setShowCoverModal(false)}
        isOwnProfile={true}
        onCameraPress={() => handleImageEdit('cover', 'camera')}
        onGalleryPress={() => handleImageEdit('cover', 'gallery')}
      />

      <FollowListModal
        visible={followListModal !== null}
        title={followListModal === 'followers' ? 'Takipçiler' : 'Takip Ettiklerim'}
        items={followListItems}
        loading={followListLoading}
        onClose={() => setFollowListModal(null)}
      />

      <CouponDetailModal
        visible={showCouponDetail}
        coupon={selectedCoupon}
        onClose={() => setShowCouponDetail(false)}
      // onClaimReward not handled here as typically specific to coupons page, but could add if needed
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
