import { supabase } from '@/lib/supabase';
import { Platform } from 'react-native';

// Conditional import for expo-image-picker
let ImagePicker: any = null;
if (Platform.OS !== 'web') {
  try {
    ImagePicker = require('expo-image-picker');
  } catch (error) {
    console.warn('expo-image-picker not available:', error);
  }
}

export interface UploadResult {
  data: string | null;
  error: Error | null;
}

export class StorageService {
  /**
   * Profil fotoğrafı yükle
   */
  async uploadProfileImage(userId: string, imageUri: string): Promise<UploadResult> {
    try {
      const fileExt = imageUri.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `profile-${userId}-${Date.now()}.${fileExt}`;
      const filePath = `profiles/${fileName}`;

      // Dosyayı base64'e çevir
      const response = await fetch(imageUri);
      const blob = await response.blob();

      // Supabase Storage'a yükle
      const { data, error } = await supabase.storage
        .from('user-images')
        .upload(filePath, blob, {
          contentType: `image/${fileExt}`,
          upsert: true
        });

      if (error) {
        console.error('Upload profile image error:', error);
        return { data: null, error: new Error(error.message) };
      }

      // Public URL'i al
      const { data: urlData } = supabase.storage
        .from('user-images')
        .getPublicUrl(filePath);

      return { data: urlData.publicUrl, error: null };
    } catch (error) {
      console.error('Upload profile image error:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Kapak fotoğrafı yükle
   */
  async uploadCoverImage(userId: string, imageUri: string): Promise<UploadResult> {
    try {
      const fileExt = imageUri.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `cover-${userId}-${Date.now()}.${fileExt}`;
      const filePath = `covers/${fileName}`;

      // Dosyayı base64'e çevir
      const response = await fetch(imageUri);
      const blob = await response.blob();

      // Supabase Storage'a yükle
      const { data, error } = await supabase.storage
        .from('user-images')
        .upload(filePath, blob, {
          contentType: `image/${fileExt}`,
          upsert: true
        });

      if (error) {
        console.error('Upload cover image error:', error);
        return { data: null, error: new Error(error.message) };
      }

      // Public URL'i al
      const { data: urlData } = supabase.storage
        .from('user-images')
        .getPublicUrl(filePath);

      return { data: urlData.publicUrl, error: null };
    } catch (error) {
      console.error('Upload cover image error:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Soru görseli yükle
   */
  async uploadQuestionImage(userId: string, imageUri: string): Promise<UploadResult> {
    try {
      const fileExt = imageUri.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `question-${userId}-${Date.now()}.${fileExt}`;
      const filePath = `questions/${fileName}`;

      // Dosyayı base64'e çevir
      const response = await fetch(imageUri);
      const blob = await response.blob();

      // Supabase Storage'a yükle
      const { data, error } = await supabase.storage
        .from('user-images')
        .upload(filePath, blob, {
          contentType: `image/${fileExt}`,
          upsert: true
        });

      if (error) {
        console.error('Upload question image error:', error);
        return { data: null, error: new Error(error.message) };
      }

      // Public URL'i al
      const { data: urlData } = supabase.storage
        .from('user-images')
        .getPublicUrl(filePath);

      return { data: urlData.publicUrl, error: null };
    } catch (error) {
      console.error('Upload question image error:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Image picker'ı aç
   */
  async pickImage(): Promise<{ uri: string | null; error: Error | null }> {
    try {
      // Expo Go'da çalışmıyorsa fallback
      if (!ImagePicker) {
        return { uri: null, error: new Error('Image picker not available in Expo Go. Please use development build.') };
      }

      // İzin iste
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        return { uri: null, error: new Error('Fotoğraf erişim izni verilmedi') };
      }

      // Image picker'ı aç
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled) {
        return { uri: null, error: null };
      }

      return { uri: result.assets[0].uri, error: null };
    } catch (error) {
      console.error('Pick image error:', error);
      return { uri: null, error: error as Error };
    }
  }

  /**
   * Kamera ile fotoğraf çek
   */
  async takePhoto(): Promise<{ uri: string | null; error: Error | null }> {
    try {
      // Expo Go'da çalışmıyorsa fallback
      if (!ImagePicker) {
        return { uri: null, error: new Error('Camera not available in Expo Go. Please use development build.') };
      }

      // İzin iste
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (permissionResult.granted === false) {
        return { uri: null, error: new Error('Kamera erişim izni verilmedi') };
      }

      // Kamera ile fotoğraf çek
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled) {
        return { uri: null, error: null };
      }

      return { uri: result.assets[0].uri, error: null };
    } catch (error) {
      console.error('Take photo error:', error);
      return { uri: null, error: error as Error };
    }
  }
}

export const storageService = new StorageService();
