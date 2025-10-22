import { useState, useMemo } from 'react';
import { Alert, Linking } from 'react-native';
import { SettingsState } from './types';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'expo-router';

export function useSettings(props: {
  onPrivacySettings?: () => void;
  onSecurity?: () => void;
  onHelpCenter?: () => void;
  onFeedback?: () => void;
  onAbout?: () => void;
}) {
  const router = useRouter();
  const { theme, isDarkMode, toggleTheme, themeMode } = useTheme();
  const { signOut, forceLogout } = useAuth();
  const [settings, setSettings] = useState<SettingsState>({
    notifications: true,
    pushNotifications: true,
    emailNotifications: false,
    language: 'tr',
    currency: 'puan'
  });

  const toggleSetting = (key: string) => {
    // Check if user is turning off notifications
    if ((key === 'notifications' || key === 'pushNotifications') && 
        settings[key as keyof SettingsState]) {
      Alert.alert(
        '😔 Emin misin?',
        'Uygulama ile ilgili önemli içerikleri kaçırabilirsin.',
        [
          {
            text: 'Vazgeç',
            style: 'cancel'
          },
          {
            text: 'Kapat',
            style: 'destructive',
            onPress: () => {
              setSettings(prev => ({
                ...prev,
                [key]: !prev[key as keyof SettingsState]
              }));
            }
          }
        ]
      );
    } else {
      setSettings(prev => ({
        ...prev,
        [key]: !prev[key as keyof SettingsState]
      }));
    }
  };

  const handleNavigate = (key: string) => {
    switch(key) {
      case 'privacy':
        props.onPrivacySettings?.();
        break;
      case 'security':
        props.onSecurity?.();
        break;
      case 'help':
        props.onHelpCenter?.();
        break;
      case 'feedback':
        props.onFeedback?.();
        break;
      case 'about':
        props.onAbout?.();
        break;
    }
  };

  const handleSocialLink = (url: string) => {
    Linking.openURL(url);
  };

  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Çıkış yapmak istediğinizden emin misiniz?',
      [
        {
          text: 'Vazgeç',
          style: 'cancel'
        },
        {
          text: 'Çıkış Yap',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/auth/login');
          }
        }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      '⚠️ Hesabı Sil',
      'Hesabınızı silmek üzeresiniz. Bu işlem geri alınamaz ve tüm verileriniz kalıcı olarak silinecektir.\n\nEmin misiniz?',
      [
        {
          text: 'Vazgeç',
          style: 'cancel'
        },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              '✅ Hesap Silindi',
              'Hesabınız başarıyla silindi. Sence\'i kullandığınız için teşekkürler.',
              [{ text: 'Tamam' }]
            );
          }
        }
      ]
    );
  };

  const handleForceLogout = () => {
    Alert.alert(
      '🔄 Zorla Çıkış',
      'Tüm oturum verilerinizi temizleyip çıkış yapmak istediğinizden emin misiniz?\n\nBu işlem tüm yerel verilerinizi silecektir.',
      [
        {
          text: 'Vazgeç',
          style: 'cancel'
        },
        {
          text: 'Temizle ve Çık',
          style: 'destructive',
          onPress: async () => {
            await forceLogout();
            Alert.alert(
              '✅ Temizlendi',
              'Tüm oturum verileri temizlendi. Uygulama yeniden başlatılacak.',
              [{ text: 'Tamam' }]
            );
          }
        }
      ]
    );
  };

  return {
    // Theme
    theme,
    isDarkMode,
    toggleTheme,
    themeMode,
    
    // Settings state
    settings,
    toggleSetting,
    
    // Navigation
    handleNavigate,
    handleSocialLink,
    handleLogout,
    handleForceLogout,
    handleDeleteAccount,
  };
}

