import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { storageService } from '@/services/storage.service';

interface ImagePickerProps {
  onImageSelected: (imageUri: string) => void;
  onImageUploaded?: (imageUrl: string) => void;
  userId: string;
  uploadType: 'profile' | 'cover' | 'question';
  title?: string;
  style?: any;
}

export function ImagePicker({ 
  onImageSelected, 
  onImageUploaded, 
  userId, 
  uploadType, 
  title = 'Fotoğraf Seç',
  style 
}: ImagePickerProps) {
  const [uploading, setUploading] = useState(false);

  const handleImageSelection = async () => {
    try {
      setUploading(true);

      // Image picker'ı aç
      const { uri, error } = await storageService.pickImage();
      
      if (error) {
        Alert.alert('Hata', error.message);
        return;
      }

      if (!uri) {
        return; // Kullanıcı iptal etti
      }

      // Önce local URI'yi callback'e gönder
      onImageSelected(uri);

      // Sonra upload et
      let uploadResult;
      switch (uploadType) {
        case 'profile':
          uploadResult = await storageService.uploadProfileImage(userId, uri);
          break;
        case 'cover':
          uploadResult = await storageService.uploadCoverImage(userId, uri);
          break;
        case 'question':
          uploadResult = await storageService.uploadQuestionImage(userId, uri);
          break;
        default:
          throw new Error('Geçersiz upload type');
      }

      if (uploadResult.error) {
        Alert.alert('Upload Hatası', uploadResult.error.message);
        return;
      }

      if (uploadResult.data && onImageUploaded) {
        onImageUploaded(uploadResult.data);
      }

    } catch (error) {
      console.error('Image selection error:', error);
      Alert.alert('Hata', 'Fotoğraf seçilirken bir hata oluştu');
    } finally {
      setUploading(false);
    }
  };

  const handleCameraCapture = async () => {
    try {
      setUploading(true);

      // Kamera ile fotoğraf çek
      const { uri, error } = await storageService.takePhoto();
      
      if (error) {
        Alert.alert('Hata', error.message);
        return;
      }

      if (!uri) {
        return; // Kullanıcı iptal etti
      }

      // Önce local URI'yi callback'e gönder
      onImageSelected(uri);

      // Sonra upload et
      let uploadResult;
      switch (uploadType) {
        case 'profile':
          uploadResult = await storageService.uploadProfileImage(userId, uri);
          break;
        case 'cover':
          uploadResult = await storageService.uploadCoverImage(userId, uri);
          break;
        case 'question':
          uploadResult = await storageService.uploadQuestionImage(userId, uri);
          break;
        default:
          throw new Error('Geçersiz upload type');
      }

      if (uploadResult.error) {
        Alert.alert('Upload Hatası', uploadResult.error.message);
        return;
      }

      if (uploadResult.data && onImageUploaded) {
        onImageUploaded(uploadResult.data);
      }

    } catch (error) {
      console.error('Camera capture error:', error);
      Alert.alert('Hata', 'Fotoğraf çekilirken bir hata oluştu');
    } finally {
      setUploading(false);
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Fotoğraf Seç',
      'Expo Go\'da image picker çalışmıyor. Development build gerekli.',
      [
        { text: 'Galeriden Seç', onPress: handleImageSelection },
        { text: 'Kamera ile Çek', onPress: handleCameraCapture },
        { text: 'İptal', style: 'cancel' }
      ]
    );
  };

  // Eğer title boşsa, sadece icon göster (profil fotoğrafı için)
  if (!title) {
    return (
      <TouchableOpacity 
        style={[styles.iconButton, style]} 
        onPress={showImageOptions}
        disabled={uploading}
      >
        {uploading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Ionicons name="camera" size={20} color="white" />
        )}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      style={[styles.button, style]} 
      onPress={showImageOptions}
      disabled={uploading}
    >
      {uploading ? (
        <ActivityIndicator size="small" color="#432870" />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#432870',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  iconButton: {
    backgroundColor: '#432870',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
