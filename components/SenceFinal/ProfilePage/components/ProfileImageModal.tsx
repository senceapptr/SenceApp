
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image, StatusBar, Platform, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ProfileImageModalProps {
  visible: boolean;
  imageUri: string;
  userName: string;
  type: 'profile' | 'cover';
  onClose: () => void;
  onCameraPress?: () => void;
  onGalleryPress?: () => void;
  isOwnProfile?: boolean;
}

export const ProfileImageModal: React.FC<ProfileImageModalProps> = ({
  visible,
  imageUri,
  userName,
  type,
  onClose,
  onCameraPress,
  onGalleryPress,
  isOwnProfile,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.container}>
        <BlurView intensity={Platform.OS === 'ios' ? 70 : 80} tint="dark" style={StyleSheet.absoluteFill} />

        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Main Content */}
          <View style={styles.content}>
            <Image
              source={{ uri: imageUri }}
              style={[
                styles.image,
                type === 'profile' ? styles.profileImage : styles.coverImage
              ]}
              resizeMode="contain"
            />
          </View>

          {/* Actions - Only for own profile */}
          {isOwnProfile && (
            <View style={styles.footer}>
              <View style={styles.actionContainer}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={onCameraPress}
                  activeOpacity={0.7}
                >
                  <View style={styles.iconCircle}>
                    <Ionicons name="camera-outline" size={28} color="white" />
                  </View>
                  <Text style={styles.actionText}>Kamera</Text>
                </TouchableOpacity>

                <View style={styles.divider} />

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={onGalleryPress}
                  activeOpacity={0.7}
                >
                  <View style={styles.iconCircle}>
                    <Ionicons name="images-outline" size={28} color="white" />
                  </View>
                  <Text style={styles.actionText}>Galeri</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    zIndex: 10,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: SCREEN_WIDTH,
  },
  profileImage: {
    height: SCREEN_WIDTH,
    borderRadius: 0,
  },
  coverImage: {
    height: SCREEN_WIDTH * 0.6,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 0 : 24,
    width: '100%',
    alignItems: 'center',
  },
  actionContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(30, 30, 30, 0.6)',
    borderRadius: 24,
    padding: 16,
    width: '80%',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 40,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 4,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
});
