import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ANIMATION_CONSTANTS } from '../utils';

interface ProfileHeaderProps {
  scrollY: Animated.Value;
  coverImage: string;
  userName: string;
  onBack: () => void;
  onMenuToggle: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  scrollY,
  coverImage,
  userName,
  onBack,
  onMenuToggle,
}) => {
  const { HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT } = ANIMATION_CONSTANTS;

  return (
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
        source={{ uri: coverImage }}
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
            {userName}
          </Animated.Text>
          
          <TouchableOpacity onPress={onMenuToggle} style={styles.headerButton} activeOpacity={0.7}>
            <View style={styles.hamburgerIcon}>
              <View style={styles.hamburgerLine} />
              <View style={styles.hamburgerLine} />
              <View style={styles.hamburgerLine} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
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
});


