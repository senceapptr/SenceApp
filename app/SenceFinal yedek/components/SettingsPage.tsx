import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Switch,
  Animated,
} from 'react-native';
import { StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../contexts/ThemeContext';

interface SettingsPageProps {
  onBack: () => void;
  onMenuToggle: () => void;
}

interface SettingItem {
  key: string;
  label: string;
  description: string;
  type: 'toggle' | 'select' | 'navigate';
}

interface SettingSection {
  title: string;
  items: SettingItem[];
}

export function SettingsPage({ onBack, onMenuToggle }: SettingsPageProps) {
  const { theme, isDarkMode, toggleTheme, themeMode, setThemeMode } = useTheme();
  const [settings, setSettings] = useState({
    notifications: true,
    pushNotifications: true,
    emailNotifications: false,
    language: 'tr',
    currency: 'puan'
  });

  const toggleSetting = (key: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  const settingSections: SettingSection[] = [
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
        },
        {
          key: 'language',
          label: 'Dil',
          description: 'Türkçe',
          type: 'select'
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
        },
        {
          key: 'backup',
          label: 'Veri Yedekleme',
          description: 'Verilerini yedekle',
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

  const renderSettingItem = (item: SettingItem) => (
    <View key={item.key} style={[styles.settingCard, { 
      backgroundColor: theme.surface, 
      borderColor: theme.border,
      shadowColor: isDarkMode ? 'transparent' : '#000'
    }]}>
      <View style={styles.settingContent}>
        <View style={styles.settingInfo}>
          <Text style={[styles.settingLabel, { color: theme.textPrimary }]}>{item.label}</Text>
          <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>{item.description}</Text>
        </View>
        
        {item.type === 'toggle' && (
          <Switch
            value={item.key === 'darkMode' ? isDarkMode : settings[item.key as keyof typeof settings] as boolean}
            onValueChange={() => {
              if (item.key === 'darkMode') {
                toggleTheme();
              } else {
                toggleSetting(item.key);
              }
            }}
            trackColor={{ 
              false: isDarkMode ? theme.border : '#D1D5DB', 
              true: theme.primary 
            }}
            thumbColor={isDarkMode ? theme.surface : '#FFFFFF'}
            ios_backgroundColor={isDarkMode ? theme.border : '#D1D5DB'}
          />
        )}
        
        {item.type === 'select' && (
          <TouchableOpacity style={[styles.selectButton, { backgroundColor: theme.hover }]} activeOpacity={0.7}>
            <Text style={[styles.selectButtonText, { color: theme.textPrimary }]}>{item.description}</Text>
            <Ionicons name="chevron-down" size={16} color={theme.textSecondary} />
          </TouchableOpacity>
        )}
        
        {item.type === 'navigate' && (
          <TouchableOpacity style={styles.navigateButton} activeOpacity={0.7}>
            <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "dark-content"} 
        backgroundColor={theme.background} 
      />
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <TouchableOpacity
          onPress={onBack}
          style={[styles.backButton, { backgroundColor: theme.hover }]}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={20} color={theme.textSecondary} />
        </TouchableOpacity>
        
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Ayarlar</Text>
        
        <TouchableOpacity 
          style={[styles.menuButton, { 
            backgroundColor: theme.surface, 
            borderColor: theme.border,
            shadowColor: isDarkMode ? 'transparent' : '#000'
          }]}
          onPress={onMenuToggle}
          activeOpacity={0.8}
        >
          <View style={styles.hamburgerIcon}>
            <View style={[styles.hamburgerLine, { backgroundColor: theme.primary }]} />
            <View style={[styles.hamburgerLine, { backgroundColor: theme.primary }]} />
            <View style={[styles.hamburgerLine, { backgroundColor: theme.primary }]} />
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Info */}
        <View style={styles.userSection}>
          <LinearGradient
            colors={isDarkMode 
              ? ['rgba(124, 94, 244, 0.15)', 'rgba(79, 147, 255, 0.15)']
              : ['rgba(147, 51, 234, 0.1)', 'rgba(59, 130, 246, 0.1)']
            }
            style={[styles.userCard, { borderColor: theme.border }]}
          >
            <View style={styles.userInfo}>
              <View style={styles.userAvatar}>
                <Image 
                  source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' }}
                  style={styles.avatarImage}
                />
              </View>
              <View style={styles.userDetails}>
                <Text style={[styles.username, { color: theme.textPrimary }]}>@mehmet_k</Text>
                <Text style={[styles.userStatus, { color: theme.textSecondary }]}>Premium Üye</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Settings Sections */}
        <View style={styles.settingsContainer}>
          {settingSections.map((section) => (
            <View key={section.title} style={styles.settingSection}>
              <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>{section.title}</Text>
              <View style={styles.sectionItems}>
                {section.items.map(renderSettingItem)}
              </View>
            </View>
          ))}

          {/* Danger Zone */}
          <View style={styles.settingSection}>
            <Text style={[styles.sectionTitle, styles.dangerTitle]}>Tehlikeli Bölge</Text>
            <View style={styles.sectionItems}>
              <TouchableOpacity style={[styles.dangerButton, { 
                backgroundColor: isDarkMode ? 'rgba(255, 87, 87, 0.1)' : '#FEF2F2',
                borderColor: isDarkMode ? 'rgba(255, 87, 87, 0.2)' : '#FECACA'
              }]} activeOpacity={0.7}>
                <Text style={[styles.dangerButtonText, { color: theme.error }]}>Hesabı Dondur</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.dangerButton, styles.deleteButton, { 
                backgroundColor: isDarkMode ? 'rgba(255, 87, 87, 0.15)' : '#FEE2E2',
                borderColor: isDarkMode ? 'rgba(255, 87, 87, 0.3)' : '#FCA5A5'
              }]} activeOpacity={0.7}>
                <Text style={[styles.dangerButtonText, styles.deleteButtonText, { color: theme.error }]}>Hesabı Sil</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* App Version */}
          <View style={styles.versionSection}>
            <Text style={[styles.versionText, { color: theme.textMuted }]}>Sence v1.0.0</Text>
            <Text style={[styles.copyrightText, { color: theme.textMuted }]}>© 2025 Tüm hakları saklıdır</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  hamburgerIcon: {
    width: 20,
    height: 16,
    justifyContent: 'space-between',
  },
  hamburgerLine: {
    width: 20,
    height: 2.5,
    backgroundColor: '#432870',
    borderRadius: 1.25,
  },
  content: {
    flex: 1,
    paddingTop: 16,
  },
  userSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  userCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(147, 51, 234, 0.2)',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#D1D5DB',
    overflow: 'hidden',
    marginRight: 16,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  userDetails: {},
  username: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  userStatus: {
    fontSize: 14,
    color: '#6B7280',
  },
  settingsContainer: {
    paddingHorizontal: 20,
    gap: 32,
  },
  settingSection: {},
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  dangerTitle: {
    color: '#DC2626',
  },
  sectionItems: {
    gap: 12,
  },
  settingCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
  },
  settingContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  selectButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  selectButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  navigateButton: {
    padding: 4,
  },
  dangerButton: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  deleteButton: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5',
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#B91C1C',
    textAlign: 'left',
  },
  deleteButtonText: {
    color: '#991B1B',
  },
  versionSection: {
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 24,
  },
  versionText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  copyrightText: {
    fontSize: 14,
    color: '#6B7280',
  },
});
