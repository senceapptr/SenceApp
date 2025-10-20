import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Animated } from 'react-native';

interface ProfileImageProps {
  scrollY: Animated.Value;
  profileImage: string;
  profileImageScale: Animated.Value;
  onPress: () => void;
  onPressIn: () => void;
  onPressOut: () => void;
}

export const ProfileImage: React.FC<ProfileImageProps> = ({
  scrollY,
  profileImage,
  profileImageScale,
  onPress,
  onPressIn,
  onPressOut,
}) => {
  return (
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
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={0.9}
      >
        <Animated.View style={{ transform: [{ scale: profileImageScale }] }}>
          <Image 
            source={{ uri: profileImage }}
            style={styles.mainProfileImage}
            resizeMode="cover"
          />
          <View style={styles.onlineIndicator} />
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  mainProfileImageContainer: {
    position: 'absolute',
    top: 280,
    alignSelf: 'center',
    zIndex: 1000,
    marginTop: -60,
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
});


