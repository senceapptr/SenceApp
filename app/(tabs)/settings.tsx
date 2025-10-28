import React, { useState, useEffect } from 'react';
import { useColorScheme } from 'nativewind';
import { StatusBar } from 'expo-status-bar';
import { Platform, Text, View, ScrollView, TouchableOpacity, Switch, Alert, ActivityIndicator, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/app/SenceFinal/contexts/AuthContext';
import { settingsService, UserSettings, NotificationSettings } from '@/services/settings.service';
import { profileService, Profile } from '@/services/profile.service';
import ToggleTheme from '@/components/ToggleTheme';

export default function TabTwoScreen() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    full_name: '',
    bio: '',
    username: ''
  });

  // Ayarları yükle
  const loadSettings = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      const [userSettingsResult, notificationSettingsResult, profileResult] = await Promise.all([
        settingsService.getUserSettings(user.id),
        settingsService.getNotificationSettings(user.id),
        profileService.getProfile(user.id)
      ]);

      if (userSettingsResult.data) {
        setUserSettings(userSettingsResult.data);
      } else {
        // Varsayılan ayarları oluştur
        const defaultResult = await settingsService.createDefaultSettings(user.id);
        if (defaultResult.data) {
          // Tekrar yükle
          const reloadResult = await settingsService.getUserSettings(user.id);
          if (reloadResult.data) {
            setUserSettings(reloadResult.data);
          }
        }
      }

      if (notificationSettingsResult.data) {
        setNotificationSettings(notificationSettingsResult.data);
      } else {
        // Varsayılan bildirim ayarlarını oluştur
        const defaultResult = await settingsService.createDefaultSettings(user.id);
        if (defaultResult.data) {
          const reloadResult = await settingsService.getNotificationSettings(user.id);
          if (reloadResult.data) {
            setNotificationSettings(reloadResult.data);
          }
        }
      }

      if (profileResult.data) {
        setProfile(profileResult.data);
        setProfileForm({
          full_name: profileResult.data.full_name || '',
          bio: profileResult.data.bio || '',
          username: profileResult.data.username || ''
        });
      }
    } catch (error) {
      console.error('Load settings error:', error);
      Alert.alert('Hata', 'Ayarlar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Tema değiştir
  const handleThemeChange = async (theme: 'light' | 'dark' | 'system') => {
    if (!user || saving) return;

    try {
      setSaving(true);
      const result = await settingsService.updateTheme(user.id, theme);
      
      if (result.data) {
        setUserSettings(prev => prev ? { ...prev, theme } : null);
        setColorScheme(theme === 'system' ? undefined : theme);
      } else {
        Alert.alert('Hata', 'Tema ayarı güncellenemedi');
      }
    } catch (error) {
      console.error('Theme update error:', error);
      Alert.alert('Hata', 'Tema ayarı güncellenemedi');
    } finally {
      setSaving(false);
    }
  };

  // Bildirim ayarını değiştir
  const handleNotificationChange = async (setting: keyof NotificationSettings, value: boolean) => {
    if (!user || saving) return;

    try {
      setSaving(true);
      const result = await settingsService.updateNotificationSetting(user.id, setting, value);
      
      if (result.data) {
        setNotificationSettings(prev => prev ? { ...prev, [setting]: value } : null);
      } else {
        Alert.alert('Hata', 'Bildirim ayarı güncellenemedi');
      }
    } catch (error) {
      console.error('Notification update error:', error);
      Alert.alert('Hata', 'Bildirim ayarı güncellenemedi');
    } finally {
      setSaving(false);
    }
  };

  // Profil düzenlemeyi başlat
  const startEditingProfile = () => {
    setEditingProfile(true);
  };

  // Profil düzenlemeyi iptal et
  const cancelEditingProfile = () => {
    setEditingProfile(false);
    if (profile) {
      setProfileForm({
        full_name: profile.full_name || '',
        bio: profile.bio || '',
        username: profile.username || ''
      });
    }
  };

  // Profil güncelle
  const handleProfileUpdate = async () => {
    if (!user || saving) return;

    try {
      setSaving(true);
      
      // Username kontrolü
      if (profileForm.username !== profile?.username) {
        const usernameCheck = await profileService.checkUsernameAvailable(profileForm.username);
        if (!usernameCheck.available) {
          Alert.alert('Hata', 'Bu kullanıcı adı zaten kullanılıyor');
          return;
        }
      }

      const result = await profileService.updateProfile(user.id, {
        full_name: profileForm.full_name,
        bio: profileForm.bio,
        username: profileForm.username
      });

      if (result.data) {
        setProfile(result.data);
        setEditingProfile(false);
        Alert.alert('Başarılı', 'Profil bilgileriniz güncellendi');
      } else {
        Alert.alert('Hata', 'Profil güncellenemedi');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      Alert.alert('Hata', 'Profil güncellenemedi');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, [user]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white dark:bg-black">
        <ActivityIndicator size="large" color="#432870" />
        <Text className="mt-4 text-dark dark:text-white">Ayarlar yükleniyor...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <ScrollView className="flex-1 px-4">
        <Text className="text-2xl font-bold text-dark dark:text-white mb-6 mt-4">Ayarlar</Text>
        
        {/* PROFİL DÜZENLEME */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-dark dark:text-white mb-4">Profil Bilgileri</Text>
          <View className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
            {/* Profil Resmi */}
            <View className="items-center mb-4">
              <View className="w-20 h-20 rounded-full bg-gray-300 dark:bg-gray-600 items-center justify-center mb-2">
                {profile?.profile_image ? (
                  <Image 
                    source={{ uri: profile.profile_image }} 
                    className="w-20 h-20 rounded-full"
                  />
                ) : (
                  <Text className="text-2xl text-gray-500">👤</Text>
                )}
              </View>
              <TouchableOpacity 
                className="bg-blue-500 px-4 py-2 rounded-lg"
                onPress={() => Alert.alert('Bilgi', 'Profil resmi yükleme özelliği yakında eklenecek')}
              >
                <Text className="text-white text-sm">Profil Resmi Değiştir</Text>
              </TouchableOpacity>
            </View>

            {/* Kapak Fotoğrafı */}
            <View className="mb-4">
              <View className="w-full h-24 rounded-lg bg-gray-300 dark:bg-gray-600 items-center justify-center mb-2">
                {profile?.cover_image ? (
                  <Image 
                    source={{ uri: profile.cover_image }} 
                    className="w-full h-24 rounded-lg"
                  />
                ) : (
                  <Text className="text-gray-500">Kapak Fotoğrafı</Text>
                )}
              </View>
              <TouchableOpacity 
                className="bg-gray-500 px-4 py-2 rounded-lg"
                onPress={() => Alert.alert('Bilgi', 'Kapak fotoğrafı yükleme özelliği yakında eklenecek')}
              >
                <Text className="text-white text-sm">Kapak Fotoğrafı Değiştir</Text>
              </TouchableOpacity>
            </View>

            {!editingProfile ? (
              // Profil Bilgilerini Göster
              <View>
                <View className="mb-3">
                  <Text className="text-sm text-gray-600 dark:text-gray-400 mb-1">Ad Soyad</Text>
                  <Text className="text-dark dark:text-white">{profile?.full_name || 'Belirtilmemiş'}</Text>
                </View>
                <View className="mb-3">
                  <Text className="text-sm text-gray-600 dark:text-gray-400 mb-1">Kullanıcı Adı</Text>
                  <Text className="text-dark dark:text-white">@{profile?.username || 'kullaniciadi'}</Text>
                </View>
                <View className="mb-4">
                  <Text className="text-sm text-gray-600 dark:text-gray-400 mb-1">Bio</Text>
                  <Text className="text-dark dark:text-white">{profile?.bio || 'Bio yazılmamış'}</Text>
                </View>
                <TouchableOpacity 
                  className="bg-blue-500 px-4 py-2 rounded-lg"
                  onPress={startEditingProfile}
                >
                  <Text className="text-white text-center">Düzenle</Text>
                </TouchableOpacity>
              </View>
            ) : (
              // Profil Düzenleme Formu
              <View>
                <View className="mb-3">
                  <Text className="text-sm text-gray-600 dark:text-gray-400 mb-1">Ad Soyad</Text>
                  <TextInput
                    value={profileForm.full_name}
                    onChangeText={(text) => setProfileForm(prev => ({ ...prev, full_name: text }))}
                    className="bg-white dark:bg-gray-700 text-dark dark:text-white px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                    placeholder="Adınızı ve soyadınızı girin"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
                <View className="mb-3">
                  <Text className="text-sm text-gray-600 dark:text-gray-400 mb-1">Kullanıcı Adı</Text>
                  <TextInput
                    value={profileForm.username}
                    onChangeText={(text) => setProfileForm(prev => ({ ...prev, username: text }))}
                    className="bg-white dark:bg-gray-700 text-dark dark:text-white px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                    placeholder="Kullanıcı adınızı girin"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
                <View className="mb-4">
                  <Text className="text-sm text-gray-600 dark:text-gray-400 mb-1">Bio</Text>
                  <TextInput
                    value={profileForm.bio}
                    onChangeText={(text) => setProfileForm(prev => ({ ...prev, bio: text }))}
                    className="bg-white dark:bg-gray-700 text-dark dark:text-white px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                    placeholder="Kendiniz hakkında bir şeyler yazın"
                    placeholderTextColor="#9CA3AF"
                    multiline
                    numberOfLines={3}
                  />
                </View>
                <View className="flex-row space-x-2">
                  <TouchableOpacity 
                    className="flex-1 bg-green-500 px-4 py-2 rounded-lg"
                    onPress={handleProfileUpdate}
                    disabled={saving}
                  >
                    <Text className="text-white text-center">Kaydet</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    className="flex-1 bg-gray-500 px-4 py-2 rounded-lg"
                    onPress={cancelEditingProfile}
                    disabled={saving}
                  >
                    <Text className="text-white text-center">İptal</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
        
        {/* TEMA AYARLARI */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-dark dark:text-white mb-4">Tema</Text>
          <View className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-dark dark:text-white">Açık Tema</Text>
              <TouchableOpacity
                onPress={() => handleThemeChange('light')}
                className={`px-4 py-2 rounded-lg ${userSettings?.theme === 'light' ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                disabled={saving}
              >
                <Text className={`${userSettings?.theme === 'light' ? 'text-white' : 'text-dark dark:text-white'}`}>
                  Açık
                </Text>
              </TouchableOpacity>
            </View>
            
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-dark dark:text-white">Koyu Tema</Text>
              <TouchableOpacity
                onPress={() => handleThemeChange('dark')}
                className={`px-4 py-2 rounded-lg ${userSettings?.theme === 'dark' ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                disabled={saving}
              >
                <Text className={`${userSettings?.theme === 'dark' ? 'text-white' : 'text-dark dark:text-white'}`}>
                  Koyu
                </Text>
              </TouchableOpacity>
            </View>
            
            <View className="flex-row justify-between items-center">
              <Text className="text-dark dark:text-white">Sistem</Text>
              <TouchableOpacity
                onPress={() => handleThemeChange('system')}
                className={`px-4 py-2 rounded-lg ${userSettings?.theme === 'system' ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                disabled={saving}
              >
                <Text className={`${userSettings?.theme === 'system' ? 'text-white' : 'text-dark dark:text-white'}`}>
                  Sistem
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* BİLDİRİM AYARLARI */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-dark dark:text-white mb-4">Bildirimler</Text>
          <View className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-dark dark:text-white">Tahmin Sonuçları</Text>
              <Switch
                value={notificationSettings?.prediction_results || false}
                onValueChange={(value) => handleNotificationChange('prediction_results', value)}
                disabled={saving}
              />
            </View>
            
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-dark dark:text-white">Kupon Sonuçları</Text>
              <Switch
                value={notificationSettings?.coupon_results || false}
                onValueChange={(value) => handleNotificationChange('coupon_results', value)}
                disabled={saving}
              />
            </View>
            
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-dark dark:text-white">Lig Güncellemeleri</Text>
              <Switch
                value={notificationSettings?.league_updates || false}
                onValueChange={(value) => handleNotificationChange('league_updates', value)}
                disabled={saving}
              />
            </View>
            
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-dark dark:text-white">Görev Tamamlamaları</Text>
              <Switch
                value={notificationSettings?.task_completions || false}
                onValueChange={(value) => handleNotificationChange('task_completions', value)}
                disabled={saving}
              />
            </View>
            
            <View className="flex-row justify-between items-center">
              <Text className="text-dark dark:text-white">Sistem Duyuruları</Text>
              <Switch
                value={notificationSettings?.system_announcements || false}
                onValueChange={(value) => handleNotificationChange('system_announcements', value)}
                disabled={saving}
              />
            </View>
          </View>
        </View>

        {/* GİZLİLİK AYARLARI */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-dark dark:text-white mb-4">Gizlilik</Text>
          <View className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-dark dark:text-white">Çevrimiçi Durumu Göster</Text>
              <Switch
                value={userSettings?.show_online_status || false}
                onValueChange={(value) => {
                  if (user) {
                    settingsService.updateUserSettings(user.id, { show_online_status: value });
                    setUserSettings(prev => prev ? { ...prev, show_online_status: value } : null);
                  }
                }}
                disabled={saving}
              />
            </View>
            
            <View className="flex-row justify-between items-center">
              <Text className="text-dark dark:text-white">Arkadaşlık İsteklerine İzin Ver</Text>
              <Switch
                value={userSettings?.allow_friend_requests || false}
                onValueChange={(value) => {
                  if (user) {
                    settingsService.updateUserSettings(user.id, { allow_friend_requests: value });
                    setUserSettings(prev => prev ? { ...prev, allow_friend_requests: value } : null);
                  }
                }}
                disabled={saving}
              />
            </View>
          </View>
        </View>

        {saving && (
          <View className="flex-row items-center justify-center py-4">
            <ActivityIndicator size="small" color="#432870" />
            <Text className="ml-2 text-dark dark:text-white">Kaydediliyor...</Text>
          </View>
        )}
      </ScrollView>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </SafeAreaView>
  );
}
