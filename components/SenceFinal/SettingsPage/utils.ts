import { SettingSection, SocialLink } from './types';

/**
 * Mock social media links
 */
export const socialLinks: SocialLink[] = [
  { platform: 'Instagram', icon: 'logo-instagram', url: 'https://instagram.com/senceapp', color: '#E1306C' },
  { platform: 'Twitter', icon: 'logo-twitter', url: 'https://twitter.com/senceapp', color: '#1DA1F2' },
  { platform: 'LinkedIn', icon: 'logo-linkedin', url: 'https://linkedin.com/company/sence', color: '#0A66C2' },
];

/**
 * Get setting sections configuration
 */
export const getSettingSections = (themeMode: string, isDarkMode: boolean): SettingSection[] => [
  {
    title: 'Bildirimler',
    items: [
      {
        key: 'notifications',
        label: 'Bildirimler',
        description: 'Uygulama bildirimleri',
        type: 'toggle'
      },
      {
        key: 'pushNotifications',
        label: 'Push Bildirimleri',
        description: 'Anlık bildirimler',
        type: 'toggle'
      },
      {
        key: 'emailNotifications',
        label: 'E-posta Bildirimleri',
        description: 'E-posta ile bildirim al',
        type: 'toggle'
      }
    ]
  },
  {
    title: 'Görünüm',
    items: [
      {
        key: 'darkMode',
        label: 'Karanlık Mod',
        description: themeMode === 'system' ? 'Sistem ayarını takip et' : (isDarkMode ? 'Aktif' : 'Kapalı'),
        type: 'toggle'
      }
    ]
  },
  {
    title: 'Hesap',
    items: [
      {
        key: 'privacy',
        label: 'Gizlilik Ayarları',
        description: 'Profil gizliliği ve veri ayarları',
        type: 'navigate'
      },
      {
        key: 'security',
        label: 'Güvenlik',
        description: 'Şifre ve güvenlik ayarları',
        type: 'navigate'
      }
    ]
  },
  {
    title: 'Destek',
    items: [
      {
        key: 'help',
        label: 'Yardım Merkezi',
        description: 'SSS ve destek',
        type: 'navigate'
      },
      {
        key: 'feedback',
        label: 'Geri Bildirim',
        description: 'Önerilerin bizim için değerli',
        type: 'navigate'
      },
      {
        key: 'about',
        label: 'Uygulama Hakkında',
        description: 'Sürüm 1.0.0',
        type: 'navigate'
      }
    ]
  }
];

/**
 * Default user info
 */
export const defaultUserInfo = {
  username: '@mehmet_k',
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
};

