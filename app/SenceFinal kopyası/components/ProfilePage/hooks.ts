import { useRef, useState } from 'react';
import { Animated } from 'react-native';
import { TabType } from './types';
import { ANIMATION_CONSTANTS, profileData } from './utils';

export const useProfileAnimations = () => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const followButtonScale = useRef(new Animated.Value(1)).current;
  const profileImageScale = useRef(new Animated.Value(1)).current;

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

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

  return {
    scrollY,
    followButtonScale,
    profileImageScale,
    handleScroll,
    animateButtonPress,
    animateButtonHover,
  };
};

export const useProfileState = () => {
  const [isFollowing, setIsFollowing] = useState(profileData.isFollowing);
  const [activeTab, setActiveTab] = useState<TabType>('predictions');
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  return {
    isFollowing,
    activeTab,
    showProfileModal,
    setActiveTab,
    setShowProfileModal,
    handleFollow,
  };
};


