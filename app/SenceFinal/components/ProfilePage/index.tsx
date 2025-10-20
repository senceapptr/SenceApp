import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { StatusBar } from 'react-native';
import { ProfilePageProps } from './types';
import { useProfileAnimations, useProfileState } from './hooks';
import { ANIMATION_CONSTANTS, profileData, mockPredictions, creditHistory } from './utils';
import { ProfileHeader } from './components/ProfileHeader';
import { ProfileImage } from './components/ProfileImage';
import { ProfileInfo } from './components/ProfileInfo';
import { ProfileTabs } from './components/ProfileTabs';
import { PredictionsTab } from './components/PredictionsTab';
import { StatisticsTab } from './components/StatisticsTab';
import { ProfileImageModal } from './components/ProfileImageModal';

export function ProfilePage({ onBack, onMenuToggle, userProfile }: ProfilePageProps) {
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

  // Merge userProfile with profileData
  const mergedProfileData = {
    ...profileData,
    coverImage: userProfile.coverImage,
    profileImage: userProfile.profileImage,
    name: userProfile.fullName,
    bio: userProfile.bio,
  };

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
            <PredictionsTab predictions={mockPredictions} />
          )}

          {activeTab === 'statistics' && (
            <StatisticsTab creditHistory={creditHistory} />
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

