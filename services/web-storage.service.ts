import { supabase } from '@/lib/supabase';

export interface UploadResult {
  data: string | null;
  error: Error | null;
}

export class WebStorageService {
  /**
   * Web tabanlı image picker (Expo Go uyumlu)
   */
  async pickImage(): Promise<{ uri: string | null; error: Error | null }> {
    try {
      // Web tabanlı file input oluştur
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      
      return new Promise((resolve) => {
        input.onchange = (event: any) => {
          const file = event.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
              resolve({ uri: e.target.result, error: null });
            };
            reader.readAsDataURL(file);
          } else {
            resolve({ uri: null, error: null });
          }
        };
        input.click();
      });
    } catch (error) {
      console.error('Web image picker error:', error);
      return { uri: null, error: error as Error };
    }
  }

  /**
   * Profil fotoğrafı yükle
   */
  async uploadProfileImage(userId: string, imageUri: string): Promise<UploadResult> {
    try {
      const fileExt = 'jpg';
      const fileName = `profile-${userId}-${Date.now()}.${fileExt}`;
      const filePath = `profiles/${fileName}`;

      // Base64'ü blob'a çevir
      const response = await fetch(imageUri);
      const blob = await response.blob();

      // Supabase Storage'a yükle
      const { data, error } = await supabase.storage
        .from('user-images')
        .upload(filePath, blob, {
          contentType: 'image/jpeg',
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
      const fileExt = 'jpg';
      const fileName = `cover-${userId}-${Date.now()}.${fileExt}`;
      const filePath = `covers/${fileName}`;

      // Base64'ü blob'a çevir
      const response = await fetch(imageUri);
      const blob = await response.blob();

      // Supabase Storage'a yükle
      const { data, error } = await supabase.storage
        .from('user-images')
        .upload(filePath, blob, {
          contentType: 'image/jpeg',
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
}

export const webStorageService = new WebStorageService();
