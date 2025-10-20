import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProfileData } from '../types';

interface ProfileInfoProps {
  profileData: ProfileData;
  isFollowing: boolean;
  followButtonScale: Animated.Value;
  onFollow: () => void;
  onPressIn: () => void;
  onPressOut: () => void;
}

export const ProfileInfo: React.FC<ProfileInfoProps> = ({
  profileData,
  isFollowing,
  followButtonScale,
  onFollow,
  onPressIn,
  onPressOut,
}) => {
  return (
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
          onPress={onFollow}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
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
  );
};

const styles = StyleSheet.create({
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
  bio: {
    fontSize: 16,
    color: 'rgba(32,32,32,0.8)',
    lineHeight: 24,
    textAlign: 'center',
    marginTop: 4,
  },
});


