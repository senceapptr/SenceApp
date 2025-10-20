import React from 'react';
import { View, Text, Image, Modal, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ProfileImageModalProps {
  visible: boolean;
  profileImage: string;
  userName: string;
  onClose: () => void;
}

export const ProfileImageModal: React.FC<ProfileImageModalProps> = ({
  visible,
  profileImage,
  userName,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.profileModalContainer}>
          <View style={styles.profileModalHeader}>
            <Text style={styles.profileModalTitle}>{userName}</Text>
            <TouchableOpacity 
              onPress={onClose}
              style={styles.modalCloseButton}
            >
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <Image 
            source={{ uri: profileImage }}
            style={styles.profileModalImage}
            resizeMode="cover"
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileModalContainer: {
    width: SCREEN_WIDTH * 0.9,
    alignItems: 'center',
  },
  profileModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  profileModalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: 'white',
    flex: 1,
    textAlign: 'center',
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 0,
  },
  profileModalImage: {
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_WIDTH * 0.8,
    borderRadius: (SCREEN_WIDTH * 0.8) / 2,
    borderWidth: 4,
    borderColor: 'white',
  },
});


