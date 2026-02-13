import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Modal,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ProfileImageModalProps {
  visible: boolean;
  imageUri: string;
  userName: string;
  onClose: () => void;
  isOwnProfile?: boolean;
  type: 'profile' | 'cover';
  onCameraPress?: () => void;
  onGalleryPress?: () => void;
}

export const ProfileImageModal: React.FC<ProfileImageModalProps> = ({
  imageUri,
  isOwnProfile,
  onCameraPress,
  onClose,
  onGalleryPress,
  type,
  userName,
  visible,
}) => {
  const [modalVisible, setModalVisible] = useState(visible);
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setModalVisible(true);
      Animated.spring(progress, {
        damping: 18,
        mass: 0.75,
        stiffness: 230,
        toValue: 1,
        useNativeDriver: true,
      }).start();
      return;
    }

    if (!modalVisible) return;

    Animated.timing(progress, {
      duration: 220,
      easing: Easing.out(Easing.cubic),
      toValue: 0,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setModalVisible(false);
      }
    });
  }, [modalVisible, progress, visible]);

  if (!modalVisible) {
    return null;
  }

  const backdropOpacity = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const contentOpacity = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  const imageScale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.82, 1],
  });

  const imageTranslateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [26, 0],
  });

  const controlsTranslateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  });

  const headerTitle = type === 'profile' ? userName : 'Kapak Fotoğrafı';

  return (
    <Modal visible={modalVisible} transparent={true} animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.container}>
        <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, { opacity: backdropOpacity }]} />

        <Animated.View style={[StyleSheet.absoluteFill, { opacity: backdropOpacity }]}>
          <BlurView intensity={Platform.OS === 'ios' ? 78 : 88} tint="dark" style={StyleSheet.absoluteFill} />
        </Animated.View>

        <SafeAreaView style={styles.safeArea}>
          <Animated.View style={[styles.header, { opacity: contentOpacity }]}>
            <View style={styles.headerTitleContainer}>
              <Text numberOfLines={1} style={styles.headerTitle}>
                {headerTitle}
              </Text>
            </View>

            <TouchableOpacity onPress={onClose} style={styles.closeButton} activeOpacity={0.75}>
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </Animated.View>

          <View style={styles.content}>
            <Animated.Image
              source={{ uri: imageUri }}
              style={[
                styles.image,
                type === 'profile' ? styles.profileImage : styles.coverImage,
                {
                  opacity: contentOpacity,
                  transform: [{ scale: imageScale }, { translateY: imageTranslateY }],
                },
              ]}
              resizeMode="contain"
            />
          </View>

          {isOwnProfile && (
            <Animated.View
              style={[styles.footer, { opacity: contentOpacity, transform: [{ translateY: controlsTranslateY }] }]}
            >
              <View style={styles.actionContainer}>
                <TouchableOpacity style={styles.actionButton} onPress={onCameraPress} activeOpacity={0.75}>
                  <View style={styles.iconCircle}>
                    <Ionicons name="camera-outline" size={28} color="white" />
                  </View>
                  <Text style={styles.actionText}>Kamera</Text>
                </TouchableOpacity>

                <View style={styles.divider} />

                <TouchableOpacity style={styles.actionButton} onPress={onGalleryPress} activeOpacity={0.75}>
                  <View style={styles.iconCircle}>
                    <Ionicons name="images-outline" size={28} color="white" />
                  </View>
                  <Text style={styles.actionText}>Galeri</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  actionButton: {
    alignItems: 'center',
    gap: 8,
    justifyContent: 'center',
  },
  actionContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(17, 24, 39, 0.68)',
    borderColor: 'rgba(147, 197, 253, 0.16)',
    borderRadius: 24,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 40,
    padding: 16,
    width: '80%',
  },
  actionText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 4,
  },
  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.94)',
  },
  closeButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  container: {
    backgroundColor: 'transparent',
    flex: 1,
  },
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  coverImage: {
    borderRadius: 18,
    height: SCREEN_WIDTH * 0.74,
  },
  divider: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    height: 40,
    width: 1,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 0 : 24,
    paddingHorizontal: 24,
    width: '100%',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    zIndex: 10,
  },
  headerTitle: {
    color: '#E2E8F0',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  headerTitleContainer: {
    alignItems: 'flex-start',
    flex: 1,
    justifyContent: 'center',
    paddingRight: 12,
  },
  iconCircle: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  image: {
    width: SCREEN_WIDTH - 28,
  },
  profileImage: {
    borderRadius: SCREEN_WIDTH / 2,
    height: SCREEN_WIDTH - 28,
  },
  safeArea: {
    flex: 1,
  },
});
