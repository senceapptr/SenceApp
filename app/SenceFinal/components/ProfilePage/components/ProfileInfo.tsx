import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProfileData } from '../types';

interface ProfileInfoProps {
  profileData: ProfileData;
  isFollowing: boolean;
  followButtonScale: Animated.Value;
  isOwnProfile?: boolean;
  onFollow: () => void;
  onPressIn: () => void;
  onPressOut: () => void;
  onPressFollowers?: () => void;
  onPressFollowing?: () => void;
}

export const ProfileInfo: React.FC<ProfileInfoProps> = ({
  profileData,
  isFollowing,
  followButtonScale,
  isOwnProfile = true,
  onFollow,
  onPressIn,
  onPressOut,
  onPressFollowers,
  onPressFollowing,
}) => {
  return (
    <View style={styles.profileInfoSection}>
      <View style={styles.userDetails}>
        <Text style={styles.userName}>{profileData.name}</Text>
        <Text style={styles.userHandle}>{profileData.username}</Text>

        {/* Stats - tıklanabilir */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{profileData.predictions}</Text>
            <Text style={styles.statLabel}>tahmin</Text>
          </View>
          <TouchableOpacity
            style={styles.statItem}
            onPress={onPressFollowers}
            activeOpacity={onPressFollowers ? 0.6 : 1}
            disabled={!onPressFollowers}
          >
            <Text style={styles.statValue}>{profileData.followers}</Text>
            <Text style={styles.statLabel}>takipçi</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.statItem}
            onPress={onPressFollowing}
            activeOpacity={onPressFollowing ? 0.6 : 1}
            disabled={!onPressFollowing}
          >
            <Text style={styles.statValue}>{profileData.following}</Text>
            <Text style={styles.statLabel}>takip</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Follow Button - sadece başkasının profilinde */}
      {!isOwnProfile && (
        <Animated.View style={{ transform: [{ scale: followButtonScale }] }}>
          <TouchableOpacity
            onPress={onFollow}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            style={[styles.followButton, isFollowing && styles.followingButton]}
            activeOpacity={0.8}
          >
            <Ionicons name="person-add" size={16} color={isFollowing ? '#8B949E' : '#fff'} />
            <Text style={[styles.followButtonText, isFollowing && styles.followingButtonText]}>
              {isFollowing ? 'Takip Ediliyor' : 'Takip Et'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      <Text style={styles.bio}>{profileData.bio}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  profileInfoSection: {
    backgroundColor: '#161B22',
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 24,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#30363D',
    alignItems: 'center',
  },
  userDetails: {
    alignItems: 'center',
    marginBottom: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: '900',
    color: '#F0F6FC',
    marginBottom: 4,
    textAlign: 'center',
  },
  userHandle: {
    fontSize: 16,
    color: '#8B949E',
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
    color: '#F0F6FC',
  },
  statLabel: {
    fontSize: 12,
    color: '#8B949E',
  },
  followButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 20,
  },
  followingButton: {
    backgroundColor: '#21262D',
    borderWidth: 1,
    borderColor: '#30363D',
  },
  followButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  followingButtonText: {
    color: '#8B949E',
  },
  bio: {
    fontSize: 16,
    color: '#8B949E',
    lineHeight: 24,
    textAlign: 'center',
    marginTop: 4,
  },
});
